import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebaseConfig'; 
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isDriver, setIsDriver] = useState(false); 
  const [menuOpen, setMenuOpen] = useState(false); // State for mobile menu
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
        }
      } else {
        setUser(null);
        setIsDriver(false); 
      }
    });

    return () => unsubscribe(); 
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null); 
      setIsDriver(false); 
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

        {/* Mobile menu button */}
        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? '✖' : '☰'} {/* Hamburger icon */}
        </button>
      </div>

      {/* Navbar Links */}
      <div className={`flex-col md:flex-row md:flex md:space-x-4 ${menuOpen ? 'flex' : 'hidden md:flex'}`}>
        {user && !isDriver && (
          <>
            <Link
              to="/tracking"
              className="text-white px-3 py-2 rounded-md hover:bg-blue-500 transition duration-300"
            >
              Pending Orders
            </Link>
            <Link
              to="/allorder"
              className="text-white px-3 py-2 rounded-md hover:bg-green-500 transition duration-300"
            >
              Completed Orders
            </Link>
          </>
        )}
        {user?.email === "admin@gmail.com" && (
          <Link
            onClick={handleAdmin}
            className="text-white px-3 py-2 rounded-md hover:bg-red-500 transition duration-300"
          >
            Admin
          </Link>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {user ? (
          <Link
            onClick={handleLogout}
            className="text-white px-4 py-2 rounded-md hover:bg-gray-200 transition duration-300"
          >
            Logout
          </Link>
        ) : (
          <Link
            to="/login"
            className="text-white px-4 py-2 rounded-md hover:bg-gray-200 transition duration-300"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
