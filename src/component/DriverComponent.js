import React, { useEffect, useState } from 'react';
import { Table, Spin } from 'antd';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';

// Firestore initialization (Firebase already configured)
const db = getFirestore();

const DriverComponent = () => {
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch driver data from Firestore in real-time
    const fetchDrivers = () => {
        const unsubscribe = onSnapshot(collection(db, 'drivers'), (driverSnapshot) => {
            const driverList = driverSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setDrivers(driverList);
            setLoading(false);
        }, (error) => {
            console.error('Error fetching driver data:', error);
            setLoading(false); 
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    };

    useEffect(() => {
        const unsubscribe = fetchDrivers();
        return () => unsubscribe();
    }, []);

    // Columns for the Ant Design Table
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Total Rides',
            dataIndex: 'totalRides',
            key: 'totalRides',
            render: (text) => (text ? text : 'No rides'),
        },
        {
            title: 'Vehicle Type',
            dataIndex: 'vehicleType',
            key: 'vehicleType',
        },
        {
            title: 'Availability',
            dataIndex: 'isAvailable',
            key: 'isAvailable',
            render: (text) => (text ? 'Available' : 'Not Available'),
        },
        {
            title: 'Current Location',
            key: 'location',
            render: (record) => (
                <span>
                    Latitude: {record.location.lat}, Longitude: {record.location.lng}
                </span>
            ),
        },
    ];

    return (
        <div>
            <h2>Drivers List</h2>
            {loading ? (
                <Spin tip="Loading..." />
            ) : (
                <Table
                    columns={columns}
                    dataSource={drivers}
                    rowKey="id" 
                />
            )}
        </div>
    );
};

export default DriverComponent;
