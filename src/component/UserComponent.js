import React, { useEffect, useState } from 'react';
import { Table, Spin } from 'antd';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

// Firestore initialization (Firebase already configured)
const db = getFirestore();

const UserComponent = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch user data from Firestore
    const fetchUsers = async () => {
        try {
            const userSnapshot = await getDocs(collection(db, 'users'));
            const userList = userSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            // Filter users where isDriver is false
            const filteredUsers = userList.filter(user => !user.isDriver);

            // Fetch orders and count total orders for each user
            const ordersSnapshot = await getDocs(collection(db, 'requests'));
            const orderCounts = {};

            // Count total orders per user
            ordersSnapshot.forEach(doc => {
                const order = doc.data();
                const userId = order.userId; // Assuming userId is stored in each order

                if (orderCounts[userId]) {
                    orderCounts[userId]++;
                } else {
                    orderCounts[userId] = 1;
                }
            });

            // Map filtered users to include total orders
            const usersWithOrderCount = filteredUsers.map(user => ({
                ...user,
                totalOrders: orderCounts[user.id] || 0, // Default to 0 if no orders
            }));

            setUsers(usersWithOrderCount);
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Columns for the Ant Design Table
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Total Orders',
            dataIndex: 'totalOrders',
            key: 'totalOrders',
            render: (text) => (text ? text : 'No orders'), // Handle cases with no orders
        },
    ];

    return (
        <div>
            <h2>Users List</h2>
            {loading ? (
                <Spin tip="Loading..." />
            ) : (
                <Table
                    columns={columns}
                    dataSource={users}
                    rowKey="id" // Set unique key for each row
                />
            )}
        </div>
    );
};

export default UserComponent;
