import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig'; 
import { collection, getDocs } from 'firebase/firestore';
import { auth } from '../firebaseConfig';

function Completed() {
  const [completedRequests, setCompletedRequests] = useState([]);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchCompletedRequests = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          console.error('No user is currently logged in.');
          return; 
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

        setCompletedRequests(completedList);
      } catch (error) {
        console.error('Error fetching completed requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedRequests();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
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
