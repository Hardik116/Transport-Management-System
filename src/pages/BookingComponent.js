import React, { useState } from 'react';
import axios from 'axios';

const BookingComponent = () => {
    const [pickupLocation, setPickupLocation] = useState('');
    const [dropOffLocation, setDropOffLocation] = useState('');
    const [vehicleType, setVehicleType] = useState('');
    const [bookingResponse, setBookingResponse] = useState(null);

    const handleBooking = async () => {
        try {
            const response = await axios.post('http://localhost:5000/book', {
                userId: '60d21b4667d0d8992e610c85', // Sample user ID
                pickupLocation,
                dropOffLocation,
                vehicleType
            });
            setBookingResponse(response.data);
        } catch (error) {
            console.error('Booking failed', error);
        }
    };

    return (
        <div>
            <h2>Book a Vehicle</h2>
            <input
                type="text"
                placeholder="Pickup Location"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
            />
            <input
                type="text"
                placeholder="Drop Off Location"
                value={dropOffLocation}
                onChange={(e) => setDropOffLocation(e.target.value)}
            />
            <input
                type="text"
                placeholder="Vehicle Type"
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
            />
            <button onClick={handleBooking}>Book Now</button>

            {bookingResponse && (
                <div>
                    <h3>Booking Details</h3>
                    <p>Price: {bookingResponse.booking.price}</p>
                    <p>Status: {bookingResponse.booking.status}</p>
                </div>
            )}
        </div>
    );
};

export default BookingComponent;
