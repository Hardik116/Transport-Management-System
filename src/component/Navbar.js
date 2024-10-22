import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebaseConfig'; 
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isDriver, setIsDriver] = useState(false); 
  const [userName, setUserName] = useState(''); 
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser); 
        
        const userDocRef = doc(db, 'users', currentUser.uid); 
        const userSnapshot = await getDoc(userDocRef);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          setIsDriver(userData.isDriver || false); 
          setUserName(userData.name || ''); 
        }
      } else {
        setUser(null);
        setIsDriver(false); 
        setUserName(''); 
      }
    });

    return () => unsubscribe(); 
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null); 
      setIsDriver(false); 
      setUserName(''); 
      navigate('/'); 
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  const handleHomeClick = () => {
    if (isDriver) {
      navigate('/driverhome'); 
    } else {
      navigate('/'); 
    }
  };
  
  const handleAdmin = () => {
    navigate('/admin'); 
  };

  return (
    <nav className="bg-gray-900 shadow-md p-4 flex justify-between items-center sticky top-0 z-50">
      <div className="flex items-center space-x-6">
        <div
          className="text-white text-2xl font-bold cursor-pointer transition hover:text-gray-300"
          onClick={handleHomeClick} 
        >
          FastMove
        </div>

        {user && !isDriver && (
          <div className="flex space-x-4">
            <button
              onClick={() => navigate('/tracking')}
              className="bg-white text-black px-3 py-2 rounded-md hover:bg-blue-500 transition duration-300"
            >
              Pending Orders
            </button>
            <button
              onClick={() => navigate('/allorder')}
              className="bg-white text-black px-3 py-2 rounded-md hover:bg-green-500 transition duration-300"
            >
              Completed Orders
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-4">
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
        {user?.email === "admin@gmail.com" && (
          <button
            onClick={handleAdmin}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-500 transition duration-300"
          >
            Admin
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
