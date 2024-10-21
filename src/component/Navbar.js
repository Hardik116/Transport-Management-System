import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebaseConfig'; // Ensure db is imported for Firestore
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore'; // Firestore to get user data

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isDriver, setIsDriver] = useState(false); // New state to track if the user is a driver
  const [userName, setUserName] = useState(''); // State for storing the user's name
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser); // Set the logged-in user
        
        // Fetch the user's role from Firestore (assuming user roles are stored in Firestore)
        const userDocRef = doc(db, 'users', currentUser.uid); // Replace 'users' with your collection name
        const userSnapshot = await getDoc(userDocRef);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          setIsDriver(userData.isDriver || false); // Set isDriver based on Firestore data
          setUserName(userData.name || ''); // Assume 'name' field holds the user's name
        }
      } else {
        setUser(null);
        setIsDriver(false); // Reset driver state if no user is logged in
        setUserName(''); // Reset userName if no user is logged in
      }
    });

    return () => unsubscribe(); // Cleanup the subscription when the component unmounts
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null); // Reset the user state to null after logging out
      setIsDriver(false); // Reset isDriver state
      setUserName(''); // Reset userName state
      navigate('/'); // Redirect to the login page after logging out
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  // Function to handle navigation based on user role
  const handleHomeClick = () => {
    if (isDriver) {
      navigate('/driverhome'); // Redirect to driver home if the user is a driver
    } else {
      navigate('/'); // Redirect to regular home if the user is not a driver
    }
  };
  const handleAdmin = () => {
      navigate('/admin'); 
  };

  return (
    <nav className="bg-black p-4 flex justify-between items-center">
      {/* Title link with conditional navigation */}
      <div  className=" flex justify-between items-center">

      <div
        className="text-white text-2xl font-bold cursor-pointer"
        onClick={handleHomeClick} // Call handleHomeClick to redirect based on user role
        >
        FastMove
      </div>{user &&!isDriver && (
        <>
           <div className="flex space-x-4">
        <button onClick={() => navigate('/tracking')} className="bg-black text-white px-2 py-2 rounded-md hover:bg-blue-700 transition duration-300">
          Pending Orders
        </button>
        <button onClick={() => navigate('/allorder')} className="bg-black text-white px-2 py-2 rounded-md hover:bg-green-700 transition duration-300">
          Completed Orders
        </button>
      </div></>
        )}
        </div>
      
      <div className="flex items-center">
        {/* Greeting message for the logged-in user */}
        
        {user && (
          <span className="text-white mr-4">
            Hi, {userName || user.email}
          </span>
        )}
        {user ? (
          <button
            onClick={handleLogout}
            className="bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200 transition duration-300"
          >
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            className="bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200 transition duration-300"
          >
            Login
          </Link>
        )}
        {
          user?.email === "abc@gmail.cpm" && 
          <button
          onClick={handleAdmin}
          className="bg-white mx-3 text-black px-4 py-2 rounded-md hover:bg-gray-200 transition duration-300"
          >
            Admin
          </button>
          }
      </div>
    </nav>
  );
};

export default Navbar;
