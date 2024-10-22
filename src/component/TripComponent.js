import React, { useEffect, useState } from 'react';
import { Table, Spin } from 'antd';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';
const db = getFirestore();

const TripComponent = () => {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch trip data from Firestore in real-time
    const fetchTrips = () => {
        const unsubscribe = onSnapshot(collection(db, 'requests'), (tripSnapshot) => {
            const tripList = tripSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setTrips(tripList);
            setLoading(false); 
        }, (error) => {
            console.error('Error fetching trip data:', error);
            setLoading(false); 
        });

        return () => unsubscribe();
    };

    useEffect(() => {
        const unsubscribe = fetchTrips();
        return () => unsubscribe(); 
    }, []);

    // Columns for the Ant Design Table
    const columns = [
        {
            title: 'User Name',
            dataIndex: 'userName',
            key: 'userName',
        },
        {
            title: 'User Email',
            dataIndex: 'userEmail',
            key: 'userEmail',
        },
        {
            title: 'Driver ID',
            dataIndex: 'driverId',
            key: 'driverId',
        },
        {
            title: 'Distance (km)',
            dataIndex: 'distance',
            key: 'distance',
        },
        {
            title: 'Estimated Cost',
            dataIndex: 'estimatedCost',
            key: 'estimatedCost',
        },
        {
            title: 'Parcel Weight',
            dataIndex: 'parcelWeight',
            key: 'parcelWeight',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text) => {
                // Check if text is a Firestore Timestamp and convert it to a Date
                if (text && text.toDate) {
                    return text.toDate().toLocaleString(); 
                }
                return 'Invalid date'; 
            },
        },
        {
            title: 'Pickup Location',
            key: 'pickupLocation',
            render: (record) => (
                <span>
                    {record.pickupLocation.city}, {record.pickupLocation.state}, {record.pickupLocation.country}
                </span>
            ),
        },
        {
            title: 'Drop Location',
            key: 'dropLocation',
            render: (record) => (
                <span>
                    {record.dropLocation.city}, {record.dropLocation.state}, {record.dropLocation.country}
                </span>
            ),
        },
    ];

    return (
        <div>
            <h2>Trips List</h2>
            {loading ? (
                <Spin tip="Loading..." />
            ) : (
                <Table
                    columns={columns}
                    dataSource={trips}
                    rowKey="id" 
                />
            )}
        </div>
    );
};

export default TripComponent;
