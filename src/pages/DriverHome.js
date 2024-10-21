import React from 'react';
import { useNavigate } from 'react-router-dom';

function DriverHome() {
  const navigate = useNavigate();

  const handleViewRequests = () => {
    navigate('/request'); // Change to the actual path for the requests page
  };

  const handleViewCompletedRequests = () => {
    navigate('/completed'); // Change to the actual path for the completed requests page
  };

  return (
    <div className="flex flex-col items-center justify-center h-[87.3vh] bg-blue-500 text-white">
      <h1 className="text-4xl font-bold mb-2">Welcome, Driver!</h1>
      <p className="text-lg mb-6">Your journey starts here. Manage your rides effectively.</p>
      {/* Flex container for buttons */}
      <div className="flex space-x-4"> {/* Adds space between buttons */}
        <button
          onClick={handleViewRequests}
          className="bg-white text-blue-500 px-6 py-2 rounded-md hover:bg-blue-200 transition duration-300"
        >
          View Requests
        </button>
        <button
          onClick={handleViewCompletedRequests}
          className="bg-white text-blue-500 px-6 py-2 rounded-md hover:bg-blue-200 transition duration-300"
        >
          View Completed Requests
        </button>
      </div>
    </div>
  );
}

export default DriverHome;
