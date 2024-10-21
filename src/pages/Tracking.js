import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, query, where, onSnapshot } from 'firebase/firestore'; // Import onSnapshot from Firestore
import { auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';

function IncompleteOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      setError('User is not logged in.');
      setLoading(false);
      return;
    }

    const ordersCollection = collection(db, 'requests');
    const ordersQuery = query(
      ordersCollection,
      where('userId', '==', userId),
      where('status', '!=', 'Completed')
    );

    const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      const orderList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(orderList);
      setLoading(false); // Set loading to false after data is fetched
    }, (error) => {
      console.error('Error fetching orders:', error);
      setError('Error fetching orders.');
      setLoading(false); // Ensure loading is set to false in case of error
    });

    // Cleanup function to unsubscribe from the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  const handleTrackOrder = (orderId) => {
    navigate(`/location/${orderId}`); // Navigate to location page with order ID
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (orders.length === 0) {
    return <div>No incomplete orders found.</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Incomplete Orders</h2>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="p-4 border rounded-md shadow-md">
            <p><strong>Order ID:</strong> {order.id}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Requested At:</strong> {order.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleString() : 'N/A'}</p>
            <p><strong>Pickup Location:</strong> {order.pickupLocation?.city || 'N/A'}</p>
            <p><strong>Drop Location:</strong> {order.dropLocation?.city || 'N/A'}</p>
            <p><strong>Parcel Weight:</strong> {order.parcelWeight || 'N/A'}</p>
            <button 
              onClick={() => handleTrackOrder(order.id)} // Pass order ID to track the order
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Track Order
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default IncompleteOrders;
