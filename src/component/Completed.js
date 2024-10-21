import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig'; // Import Firestore instance
import { collection, getDocs } from 'firebase/firestore';
import { auth } from '../firebaseConfig'; // Import auth instance to get current user

function Completed() {
  const [completedRequests, setCompletedRequests] = useState([]); // State to store completed requests
  const [loading, setLoading] = useState(true); // State to manage loading state

  useEffect(() => {
    const fetchCompletedRequests = async () => {
      try {
        const currentUser = auth.currentUser; // Get the current logged-in user
        if (!currentUser) {
          console.error('No user is currently logged in.');
          return; // Exit if no user is logged in
        }

        const requestsCollection = collection(db, 'requests');
        const requestSnapshot = await getDocs(requestsCollection);
        const requestList = requestSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Filter to get only completed requests for the current driver
        const completedList = requestList.filter(request => 
          request.status === 'Completed' && request.driverId === currentUser.uid
        );

        setCompletedRequests(completedList); // Set the completed requests data to state
      } catch (error) {
        console.error('Error fetching completed requests:', error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    fetchCompletedRequests();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Display loading message while fetching data
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Completed Requests</h2>
      {completedRequests.length === 0 ? (
        <div>No completed requests found.</div>
      ) : (
        <div className="space-y-4">
          {completedRequests.map((request) => (
            <div key={request.id} className="flex justify-between items-center p-4 border rounded-md shadow-md">
              <div className="flex-1">
                <p><strong>Driver ID:</strong> {request.driverId}</p>
                <p><strong>Status:</strong> {request.status}</p>
                <p><strong>User Name:</strong> {request.userName || 'N/A'}</p>
                <p><strong>User Email:</strong> {request.userEmail || 'N/A'}</p>
                <p><strong>Pickup Location:</strong> {request.pickupLocation ? `${request.pickupLocation.lat}, ${request.pickupLocation.lng}` : 'N/A'}</p>
                <p><strong>Drop-off Location:</strong> {request.dropLocation ? `${request.dropLocation.lat}, ${request.dropLocation.lng}` : 'N/A'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Completed;
