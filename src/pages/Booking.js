import { useState } from 'react';
import axios from 'axios';

const Booking = () => {
    const [pickup, setPickup] = useState('');
    const [dropoff, setDropoff] = useState('');
    const [vehicleType, setVehicleType] = useState('');
    const [cost, setCost] = useState(null);

    const handleBooking = async (e) => {
        e.preventDefault();
        const { data } = await axios.post('/api/bookings', {
            pickupLocation: pickup,
            dropOffLocation: dropoff,
            vehicleType
        });
        setCost(data.estimatedCost);
    };

    return (
        <form onSubmit={handleBooking}>
            <input type="text" value={pickup} onChange={(e) => setPickup(e.target.value)} placeholder="Pickup Location" required />
            <input type="text" value={dropoff} onChange={(e) => setDropoff(e.target.value)} placeholder="Dropoff Location" required />
            <select value={vehicleType} onChange={(e) => setVehicleType(e.target.value)}>
                <option value="">Select Vehicle Type</option>
                <option value="truck">Truck</option>
                <option value="van">Van</option>
            </select>
            <button type="submit">Book Now</button>
            {cost && <p>Estimated Cost: {cost}</p>}
        </form>
    );
};

export default Booking;
