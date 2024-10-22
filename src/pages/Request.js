import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig'; 
import { collection, onSnapshot, updateDoc, doc, deleteDoc, getDoc } from 'firebase/firestore'; 
import { auth } from '../firebaseConfig'; 

const ViewRequests = () => {
  const [requests, setRequests] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [driverId, setDriverId] = useState(null);
  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setDriverId(currentUser.uid);
    }

    const unsubscribe = onSnapshot(collection(db, 'requests'), (snapshot) => {
      const requestList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRequests(requestList);
      setLoading(false); 
    }, (error) => {
      console.error('Error fetching requests:', error);
      setLoading(false);
    });

    // Cleanup function to unsubscribe from the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  // Function to handle request acceptance
  const handleAccept = async (requestId) => {
    try {
      const requestDoc = doc(db, 'requests', requestId);
      // Update request status to accepted
      await updateDoc(requestDoc, { status: 'Accepted' });
      
      // Update driver's document to set isAvailable to false
      const driverDoc = doc(db, 'drivers', driverId);
      await updateDoc(driverDoc, { isAvailable: false });

      alert(`Request ${requestId} has been accepted!`);
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  };

  // Function to handle marking order as picked up
  const handlePickedUp = async (requestId) => {
    try {
      const requestDoc = doc(db, 'requests', requestId);
      // Update request status to picked up
      await updateDoc(requestDoc, { status: 'Picked Up' });

      alert(`Order for request ${requestId} has been picked up!`);
    } catch (error) {
      console.error('Error picking up order:', error);
    }
  };

  // Function to handle completing the order
  const handleCompleteOrder = async (requestId) => {
    try {
      const requestDoc = doc(db, 'requests', requestId);
      await updateDoc(requestDoc, { status: 'Completed', isAvailable: true });

      const driverDoc = doc(db, 'drivers', driverId);
      const driverSnapshot = await getDoc(driverDoc);

      if (driverSnapshot.exists()) {
        const totalRides = driverSnapshot.data().totalRides || 0;
        await updateDoc(driverDoc, {  
          totalRides: totalRides + 1, 
          isAvailable: true
        });
      } else {
        console.error('Driver document does not exist');
      }

      alert(`Order for request ${requestId} is completed!`);
    } catch (error) {
      console.error('Error completing order:', error);
    }
  };

  const handleReject = async (requestId) => {
    try {
      const requestDoc = doc(db, 'requests', requestId);
      // Delete the request document from Firestore
      await deleteDoc(requestDoc);
      alert(`Request ${requestId} has been rejected and deleted!`);
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>; 
  }

  // Filter requests to show only those associated with the logged-in driver and not completed
  const filteredRequests = requests.filter(request => 
    request.driverId === driverId && request.status !== 'Completed'
  );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Booking Requests</h2>
      <div className="space-y-4">
        {filteredRequests.length > 0 ? (
          filteredRequests.map((request) => (
            <div key={request.id} className="flex justify-between items-center p-4 border rounded-md shadow-md">
              <div className="flex-1">
                <p><strong>Status:</strong> {request.status}</p>
                <p><strong>User Name:</strong> {request.userName || 'N/A'}</p>
                <p><strong>User Email:</strong> {request.userEmail || 'N/A'}</p>
                <p><strong>Pickup Location:</strong> 
                  {request.pickupLocation ? `${request.pickupLocation.city}, ${request.pickupLocation.state}, ${request.pickupLocation.country}` : 'N/A'}
                </p>
                <p><strong>Drop-off Location:</strong> 
                  {request.dropLocation ? `${request.dropLocation.city}, ${request.dropLocation.state}, ${request.dropLocation.country}` : 'N/A'}
                </p>
                <p><strong>Parcel Weight:</strong> {request.parcelWeight || 'N/A'}</p>
              </div>
              <div>
                {request.status === 'Pending' && (
                  <>
                    <button
                      onClick={() => handleAccept(request.id)}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-300 mr-2"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleReject(request.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-300"
                    >
                      Reject
                    </button>
                  </>
                )}
                {request.status === 'Accepted' && (
                  <button
                    onClick={() => handlePickedUp(request.id)} 
                    className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition duration-300"
                  >
                    Order Picked Up
                  </button>
                )}
                {request.status === 'Picked Up' && (
                  <button
                    onClick={() => handleCompleteOrder(request.id)} 
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
                  >
                    Complete Order
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No requests available for you.</p>
        )}
      </div>
    </div>
  );
};

export default ViewRequests;
