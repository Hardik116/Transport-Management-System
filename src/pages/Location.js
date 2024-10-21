import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';

function DriverMap() {
  const { orderId } = useParams();
  const [driverLocation, setDriverLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [map, setMap] = useState(null); // State to hold map instance

  useEffect(() => {
    const fetchOrderData = async (retries = 3) => {
      while (retries) {
        try {
          const orderRef = doc(db, 'requests', orderId);
          const orderSnap = await getDoc(orderRef);

          if (orderSnap.exists()) {
            const orderData = orderSnap.data();
            const driverId = orderData.driverId;

            const driverRef = doc(db, 'drivers', driverId);
            const driverSnap = await getDoc(driverRef);

            if (driverSnap.exists()) {
              const driverData = driverSnap.data();
              const { lat, lng } = driverData.location;

              setDriverLocation({
                lat: lat,
                lng: lng,
                name: driverData.name,
                vehicleType: driverData.vehicleType,
              });
            } else {
              setError('Driver location not found.');
            }
          } else {
            setError('Order not found.');
          }
          break; // Exit loop if successful
        } catch (err) {
          console.error('Error fetching order/driver data:', err);
          setError('Failed to fetch order/driver data.');
          retries -= 1; // Decrement retry count
          if (!retries) {
            setLoading(false); // Set loading to false if all retries fail
          }
        }
      }
      setLoading(false); // Ensure loading is set to false when done
    };

    fetchOrderData();
  }, [orderId]);

  useEffect(() => {
    if (driverLocation) {
      // Initialize HERE Maps
      const platform = new window.H.service.Platform({
        apikey: process.env.HERE_MAP_API,
      });

      const defaultLayers = platform.createDefaultLayers();
      const mapContainer = document.getElementById('mapContainer');

      const newMap = new window.H.Map(
        mapContainer,
        defaultLayers.vector.normal.map,
        {
          zoom: 13,
          center: { lat: driverLocation.lat, lng: driverLocation.lng },
        }
      );

      // Create a marker for the driver's location
      const marker = new window.H.map.Marker({ lat: driverLocation.lat, lng: driverLocation.lng });
      newMap.addObject(marker);

      // Optional: Add a UI component for pan/zoom controls
      window.H.ui.UI.createDefault(newMap, defaultLayers);

      // Set the map instance in state
      setMap(newMap);

      // Optional: Make the map responsive
      window.addEventListener('resize', () => {
        if (newMap) {
          newMap.setSize();
        }
      });
    }
  }, [driverLocation]);

  const zoomIn = () => {
    if (map) {
      map.setZoom(map.getZoom() + 1);
    }
  };

  const zoomOut = () => {
    if (map) {
      map.setZoom(map.getZoom() - 1);
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div>
      <h2 className="text-center">Driver Location</h2>
      {driverLocation ? (
        <div>
          <p><strong>Driver Name:</strong> {driverLocation.name}</p>
          <p><strong>Vehicle Type:</strong> {driverLocation.vehicleType}</p>
          <p><strong>Latitude:</strong> {driverLocation.lat}</p>
          <p><strong>Longitude:</strong> {driverLocation.lng}</p>
          
          {/* HERE Map Container */}
          <div id="mapContainer" style={{ height: '400px', width: '100%' }} />
          
          {/* Zoom Controls */}
          <div className="text-center mt-4">
            <button onClick={zoomIn} className="bg-blue-500 text-white px-4 py-2 rounded">Zoom In</button>
            <button onClick={zoomOut} className="bg-blue-500 text-white px-4 py-2 rounded ml-2">Zoom Out</button>
          </div>
        </div>
      ) : (
        <p>Driver location is not available.</p>
      )}
    </div>
  );
}

export default DriverMap;
