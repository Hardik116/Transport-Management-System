import React from 'react';
import { useNavigate } from 'react-router-dom';

function DriverHome() {
  const navigate = useNavigate();

  const handleViewRequests = () => {
    navigate('/request');
  };

  const handleViewCompletedRequests = () => {
    navigate('/completed'); 
  };

  return (
    <div className="flex flex-col items-center justify-center h-[87.3vh] bg-blue-500 text-white p-4">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome, Driver!</h1>
      <p className="text-base md:text-lg mb-6">Your journey starts here. Manage your rides effectively.</p>
      {/* Flex container for buttons */}
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4"> 
        <button
          onClick={handleViewRequests}
          className="bg-white text-blue-500 px-4 py-2 rounded-md hover:bg-blue-200 transition duration-300 w-full md:w-auto"
        >
          View Requests
        </button>
        <button
          onClick={handleViewCompletedRequests}
          className="bg-white text-blue-500 px-4 py-2 rounded-md hover:bg-blue-200 transition duration-300 w-full md:w-auto"
        >
          View Completed Requests
        </button>
      </div>
    </div>
  );
}

export default DriverHome;
