import React, { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebaseConfig'; 
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, updateDoc } from 'firebase/firestore'; 

const DriverSignup = () => {
  // State for form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [vehicleType, setVehicleType] = useState('Mini Truck');
  const [error, setError] = useState('');
  const [location, setLocation] = useState({ lat: null, lng: null });
  const navigate = useNavigate();

  // Function to get the driver's current location using Geolocation API
  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (err) => {
            reject('Unable to retrieve your location');
          }
        );
      } else {
        reject('Geolocation is not supported by your browser');
      }
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      // Get the driver's current location before proceeding with signup
      const currentLocation = await getCurrentLocation();
      setLocation(currentLocation);

      // Create user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store user info in Firestore with isDriver set to true
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        name,
        email: user.email,
        phone,
        isDriver: true,
        vehicleType, 
        location: currentLocation, 
      });

      // Also store driver's info in a separate 'drivers' collection
      const driverDocRef = doc(db, 'drivers', user.uid);
      await setDoc(driverDocRef, {
        name,
        email: user.email,
        phone,
        vehicleType,
        location: currentLocation, 
        isAvailable: true, 
        createdAt: new Date(),
      });

      // Start updating the driver's location
      startLocationUpdates(user.uid, currentLocation);
      console.log(user.uid)

      // Redirect to driver's home page
      navigate('/driverhome');
    } catch (err) {
      setError(err.message || err);
    }
  };

  const startLocationUpdates = (userId, initialLocation) => {
    const updateLocation = async () => {
      try {
        const currentLocation = await getCurrentLocation();
        const driverDocRef = doc(db, 'drivers', userId);
        await updateDoc(driverDocRef, { location: currentLocation });
      } catch (error) {
        console.error('Error updating location:', error);
      }
    };

    // Update location every 5 minutes (300000 milliseconds)
    const intervalId = setInterval(updateLocation, 1000*60*1);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  };

  useEffect(() => {
    return () => {
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-80">
        <h2 className="text-2xl font-bold text-center mb-4">Driver Signup</h2>
        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* New dropdown for selecting vehicle type */}
          <select
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
            required
            className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Mini Truck">Mini Truck</option>
            <option value="Medium Truck">Medium Truck</option>
            <option value="Heavy Truck">Heavy Truck</option>
          </select>

          <button
            type="submit"
            className="w-full p-2 mb-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
          >
            Sign Up
          </button>
        </form>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      </div>
    </div>
  );
};

export default DriverSignup;
