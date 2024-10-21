import React, { useEffect, useState } from 'react';
import axios from 'axios'; // For API requests
import { db } from '../firebaseConfig'; // Firestore config
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../firebaseConfig';

const MapPage = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [distance, setDistance] = useState(0); // State to store distance
  const [estimatedCost, setEstimatedCost] = useState(0); // State to store estimated cost
  const navigate = useNavigate();
  const location = useLocation();
  const { pickupCity, pickupState, pickupCountry, dropOffCity, dropOffState, dropOffCountry, estimatedWeight, vehicleType } = location.state || {};

  const user = auth.currentUser;
  const HERE_API_KEY = 'U_FSa0mUYnANGMVRfe-FvCfQ7hPN_Tv5e_JYq-tru3M'; // Replace with your HERE Maps API key

  // Function to fetch latitude and longitude using HERE Geocoding API
  const getLatLng = async (city, state, country) => {
    const query = `${city}, ${state || ''}, ${country || ''}`;
    try {
      const response = await axios.get(`https://geocode.search.hereapi.com/v1/geocode`, {
        params: {
          apiKey: HERE_API_KEY,
          q: query,
        },
      });
      if (response.data.items.length > 0) {
        const coordinates = response.data.items[0].position;
        return { lat: coordinates.lat, lng: coordinates.lng }; // Return lat, lng
      }
    } catch (error) {
      console.error('Error fetching location coordinates:', error);
    }
    return null;
  };

  // Function to calculate distance using HERE Routing API
  const calculateDistance = async (pickupCoords, dropCoords) => {
    try {
      const response = await axios.get(`https://router.hereapi.com/v8/routes`, {
        params: {
          apiKey: HERE_API_KEY,
          transportMode: 'car',
          origin: `${pickupCoords.lat},${pickupCoords.lng}`,
          destination: `${dropCoords.lat},${dropCoords.lng}`,
          return: 'summary',
        },
      });
      const distanceInMeters = response.data.routes[0].sections[0].summary.length;
      return distanceInMeters / 1000; // Convert meters to kilometers
    } catch (error) {
      console.error('Error calculating distance:', error);
      return 0;
    }
  };

  // Function to calculate cost based on vehicle type and distance
  const calculateCost = (distance, vehicleType) => {
    const ratePerKm = {
      'Mini Truck': 5,   // Example rate: 10 units per km for cars
      'Medium Truck': 10,   // Example rate: 5 units per km for bikes
      'Heavy Truck': 15, // Example rate: 15 units per km for trucks
    };
    return distance * (ratePerKm[vehicleType] || 10); // Default rate
  };

  useEffect(() => {
    const fetchDriversAndCalculateCost = async () => {
      try {
        const driversCollection = collection(db, 'drivers');
        const driverSnapshot = await getDocs(driversCollection);
        const driverList = driverSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })).filter((driver) => driver.isAvailable && driver.vehicleType === vehicleType);

        // Fetch pickup coordinates
        const pickupCoords = await getLatLng(pickupCity, pickupState, pickupCountry);
        
        if (pickupCoords) {
          // Calculate distance for each driver and sort
          const driversWithDistance = await Promise.all(driverList.map(async (driver) => {
            const driverCoords = { lat: driver.location.lat, lng: driver.location.lng };
            const distanceToPickup = await calculateDistance(driverCoords, pickupCoords);
            return { ...driver, distanceToPickup };
          }));

          // Sort drivers by distance to pickup
          driversWithDistance.sort((a, b) => a.distanceToPickup - b.distanceToPickup);
          setDrivers(driversWithDistance);

          // Calculate the distance from pickup to drop-off
          const dropCoords = await getLatLng(dropOffCity, dropOffState, dropOffCountry);
          if (dropCoords) {
            const calculatedDistance = await calculateDistance(pickupCoords, dropCoords);
            setDistance(calculatedDistance);

            // Calculate cost based on distance and vehicle type
            const cost = calculateCost(calculatedDistance, vehicleType);
            setEstimatedCost(cost);
          }
        }
      } catch (error) {
        console.error('Error fetching drivers or calculating cost:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDriversAndCalculateCost();
  }, [pickupCity, pickupState, pickupCountry, dropOffCity, dropOffState, dropOffCountry, vehicleType]);

  const handleBookDriver = async (driverId) => {
    try {
      if (!user) {
        alert('Please log in to book a driver.');
        return;
      }

      const requestData = {
        driverId,
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        userEmail: user.email || 'Not provided',
        status: 'Pending',
        createdAt: new Date(),
        pickupLocation: { city: pickupCity, state: pickupState || 'Not provided', country: pickupCountry || 'Not provided' },
        dropLocation: { city: dropOffCity, state: dropOffState || 'Not provided', country: dropOffCountry || 'Not provided' },
        parcelWeight: estimatedWeight,
        distance: distance, // Save the calculated distance
        estimatedCost: estimatedCost, // Save the estimated cost
      };

      const requestDocRef = await addDoc(collection(db, 'requests'), requestData);
      alert(`Request to book driver ${driverId} has been created!`);

      navigate('/tracking', { state: { requestId: requestDocRef.id } });
    } catch (error) {
      console.error('Error booking driver:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Available Drivers</h2>
      
      <div className="mb-4">
        <p>Pickup Location: {`${pickupCity}, ${pickupState || 'Not provided'}, ${pickupCountry || 'Not provided'}`}</p>
        <p>Drop-off Location: {`${dropOffCity}, ${dropOffState || 'Not provided'}, ${dropOffCountry || 'Not provided'}`}</p>
        <p>Estimated Distance: {distance ? distance.toFixed(2) : 0} km</p>
        <p>Estimated Cost: ₹{estimatedCost ? estimatedCost.toFixed(2) : 0}</p>
      </div>

      {drivers.length > 0 ? (
        <div className="space-y-4">
          {drivers.map((driver) => (
            <div key={driver.id} className="flex justify-between items-center p-4 border rounded-md shadow-md">
              <div>
                <h3 className="text-lg font-semibold">{driver.name}</h3>
                <p>Vehicle Type: {driver.vehicleType}</p>
                <p>Total Rides Completed: {driver.totalRides || 'No data available'}</p>
                <p>Distance to Pickup: {driver.distanceToPickup ? driver.distanceToPickup.toFixed(2) : 0} km</p>
              </div>
              <button
                onClick={() => handleBookDriver(driver.id)}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-300"
              >
                Book Driver
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No drivers available at the moment.</p>
      )}
    </div>
  );
};

export default MapPage;
