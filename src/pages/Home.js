import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { auth } from '../firebaseConfig';
import Navbar from '../component/Navbar';

const Home = () => {
  const [countries, setCountries] = useState([]);
  const [pickupStates, setPickupStates] = useState([]);
  const [dropOffStates, setDropOffStates] = useState([]); 
  const [pickupCities, setPickupCities] = useState([]); 
  const [dropOffCities, setDropOffCities] = useState([]); 
  const [pickupCountry, setPickupCountry] = useState('');
  const [pickupState, setPickupState] = useState('');
  const [pickupCity, setPickupCity] = useState('');
  const [dropOffCountry, setDropOffCountry] = useState('');
  const [dropOffState, setDropOffState] = useState('');
  const [dropOffCity, setDropOffCity] = useState('');
  const [estimatedWeight, setEstimatedWeight] = useState('');
  const [vehicleType, setVehicleType] = useState('Mini Truck');
  const [authToken, setAuthToken] = useState('');
  const navigate = useNavigate();
  const apiToken = process.env.REACT_APP_API_KEY;
  const userEmail = "hardikr840@gmail.com";

  useEffect(() => {
    const fetchAuthToken = async () => {
      try {
        const response = await axios.get('https://www.universal-tutorial.com/api/getaccesstoken', {
          headers: {
            "Accept": "application/json",
            "api-token": apiToken,
            "user-email": userEmail,
          }
        });
        const token = response.data.auth_token;
        setAuthToken(token);
        fetchCountries(token);
      } catch (error) {
        console.error('Error fetching auth token:', error);
      }
    };

    const fetchCountries = async (token) => {
      try {
        const response = await axios.get('https://www.universal-tutorial.com/api/countries', {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json"
          }
        });
        setCountries(response.data);
      } catch (error) {
        console.error('Error fetching countries:', error.response ? error.response.data : error.message);
      }
    };

    fetchAuthToken();
  }, []);

  const handlePickupCountryChange = async (countryName) => {
    setPickupCountry(countryName);
    setPickupState('');
    setPickupCity('');
    setPickupStates([]); 
    setPickupCities([]); 

    if (countryName) {
      try {
        const stateResponse = await axios.get(`https://www.universal-tutorial.com/api/states/${countryName}`, {
          headers: {
            "Authorization": `Bearer ${authToken}`,
            "Accept": "application/json"
          }
        });
        setPickupStates(stateResponse.data);
      } catch (error) {
        console.error('Error fetching pickup states:', error);
      }
    }
  };

  const handlePickupStateChange = async (stateName) => {
    setPickupState(stateName);
    setPickupCity('');
    setPickupCities([]); 

    if (stateName) {
      try {
        const cityResponse = await axios.get(`https://www.universal-tutorial.com/api/cities/${stateName}`, {
          headers: {
            "Authorization": `Bearer ${authToken}`,
            "Accept": "application/json"
          }
        });
        setPickupCities(cityResponse.data);
      } catch (error) {
        console.error('Error fetching pickup cities:', error);
      }
    }
  };

  const handleDropOffCountryChange = async (countryName) => {
    setDropOffCountry(countryName);
    setDropOffState('');
    setDropOffCity('');
    setDropOffStates([]); 
    setDropOffCities([]); 

    if (countryName) {
      try {
        const stateResponse = await axios.get(`https://www.universal-tutorial.com/api/states/${countryName}`, {
          headers: {
            "Authorization": `Bearer ${authToken}`,
            "Accept": "application/json"
          }
        });
        setDropOffStates(stateResponse.data);
      } catch (error) {
        console.error('Error fetching drop-off states:', error);
      }
    }
  };

  const handleDropOffStateChange = async (stateName) => {
    setDropOffState(stateName);
    setDropOffCity('');
    setDropOffCities([]); 

    if (stateName) {
      try {
        const cityResponse = await axios.get(`https://www.universal-tutorial.com/api/cities/${stateName}`, {
          headers: {
            "Authorization": `Bearer ${authToken}`,
            "Accept": "application/json"
          }
        });
        setDropOffCities(cityResponse.data);
      } catch (error) {
        console.error('Error fetching drop-off cities:', error);
      }
    }
  };

  const handleNext = () => {
    if (!auth.currentUser) {
      navigate('/login');
    } else if (pickupCity && dropOffCity && estimatedWeight) {
      navigate('/map', {
        state: {
          pickupCity,
          pickupState,
          pickupCountry,
          dropOffCity,
          dropOffState,
          dropOffCountry,
          estimatedWeight,
          vehicleType,
        },
      });
    } else {
      alert('Please select both pickup and drop-off locations, enter the estimated weight, and select a vehicle type.');
    }
  };
  
  

  return (
    <>
    <div className="flex flex-col p-4 items-center justify-center bg-red-500">
     

      <div className="text-center mb-8 p-6 bg-red-500 rounded-lg w-4/5">
        <h1 className="text-5xl font-bold mb-4 text-white">Welcome to FastMove</h1>
        <p className="text-2xl text-white">
          Your reliable on-demand logistics platform for transporting goods. Book a vehicle easily,
          track your delivery in real time, and enjoy the convenience of moving goods with ease.
        </p>
      </div>

      <div className="flex flex-col items-center p-8 rounded-lg bg-red-500">
        <h2 className="text-3xl font-semibold mb-6 text-white">Book Your Delivery</h2>
        <div className="flex items-center justify-center w-full space-x-4">
          <select
            value={pickupCountry}
            onChange={(e) => handlePickupCountryChange(e.target.value)}
            className="w-1/3 p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
            <option value="">Select Country</option>
            {countries.map((country) => (
              <option key={country.country_short_name} value={country.country_name}>{country.country_name}</option>
            ))}
          </select>

          <select
            value={pickupState}
            onChange={(e) => handlePickupStateChange(e.target.value)}
            className="w-1/3 p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
            <option value="">Select State</option>
            {pickupStates.map((state) => (
              <option key={state.state_name} value={state.state_name}>{state.state_name}</option>
            ))}
          </select>

          <select
            value={pickupCity}
            onChange={(e) => setPickupCity(e.target.value)}
            className="w-1/3 p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select City</option>
            {pickupCities.map((city) => (
              <option key={city.city_name} value={city.city_name}>{city.city_name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-center w-full space-x-4">
          <select
            value={dropOffCountry}
            onChange={(e) => handleDropOffCountryChange(e.target.value)}
            className="w-1/3 p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Country</option>
            {countries.map((country) => (
              <option key={country.country_short_name} value={country.country_name}>{country.country_name}</option>
            ))}
          </select>

          <select
            value={dropOffState}
            onChange={(e) => handleDropOffStateChange(e.target.value)}
            className="w-1/3 p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
            <option value="">Select State</option>
            {dropOffStates.map((state) => (
              <option key={state.state_name} value={state.state_name}>{state.state_name}</option>
            ))}
          </select>

          <select
            value={dropOffCity}
            onChange={(e) => setDropOffCity(e.target.value)}
            className="w-1/3 p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
            <option value="">Select City</option>
            {dropOffCities.map((city) => (
              <option key={city.city_name} value={city.city_name}>{city.city_name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-center w-full space-x-4">
          <input
            type="number"
            value={estimatedWeight}
            onChange={(e) => setEstimatedWeight(e.target.value)}
            placeholder="Estimated Weight (kg)"
            className="w-1/3 p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          <select
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
            className="w-1/3 p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
            <option value="Mini Truck">Mini Truck</option>
            <option value="Medium Truck">Medium Truck</option>
            <option value="Heavy Truck">Heavy Truck</option>
          </select>
        </div>

        <button
          onClick={handleNext}
          className="bg-black text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
          >
          Next
        </button>
      </div>
    </div>
            </>
  );
};

export default Home;
