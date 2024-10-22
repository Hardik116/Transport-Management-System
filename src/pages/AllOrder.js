import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig'; 
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth } from '../firebaseConfig'; 

function AllOrder() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        setError('User is not logged in.');
        setLoading(false);
        return;
      }


      try {
        const ordersCollection = collection(db, 'requests');
        // Query to get only completed orders for the logged-in user
        const ordersQuery = query(
          ordersCollection,
          where('userId', '==', userId),
          where('status', '==', 'Completed') 
        );
        const orderSnapshot = await getDocs(ordersQuery);
        const orderList = orderSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(orderList);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Error fetching orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (orders.length === 0) {
    return <div>No completed orders found.</div>; 
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Completed Orders</h2>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="p-4 border rounded-md shadow-md">
            <p><strong>Order ID:</strong> {order.id}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Requested At:</strong> {order.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleString() : 'N/A'}</p>
            <p><strong>Pickup Location:</strong> {order.pickupLocation?.city || 'N/A'}</p>
            <p><strong>Drop Location:</strong> {order.dropLocation?.city || 'N/A'}</p>
            <p><strong>Parcel Weight:</strong> {order.parcelWeight || 'N/A'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllOrder;
