import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import IncompleteOrders from './pages/Tracking';
import Mappage from './pages/MapPage';
import Login from './component/Login';
import Signup from './component/Signup';
import Navbar from './component/Navbar';
import DriverSignup from './component/DriverSignup';
import DriverHome from './pages/DriverHome';
import Request from './pages/Request';
import AllOrder from './pages/AllOrder';
import DriverLogin from './component/DriverLogin';
import Completed from './component/Completed';
import DriverMap from './pages/Location';
import Admin from './pages/Admin';
import AdminDashboard from './pages/Admin';

function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/allorder" element={<AllOrder />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/completed" element={<Completed />} />
        <Route path="/driverlogin" element={<DriverLogin />} />
        <Route path="/request" element={<Request />} />
        <Route path="/driverhome" element={<DriverHome />} />
        <Route path="/driver-signup" element={<DriverSignup />} />
        <Route path="/location/:orderId" element={<DriverMap />} /> 
        <Route path="/tracking" element={<IncompleteOrders />} />
        <Route path="/map" element={<Mappage />} />

      </Routes>
    </Router>
  );
}

export default App;
