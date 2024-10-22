import React, { useEffect, useState } from 'react';
import { Table, Spin } from 'antd';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

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

            const filteredUsers = userList.filter(user => !user.isDriver);

            const ordersSnapshot = await getDocs(collection(db, 'requests'));
            const orderCounts = {};

            ordersSnapshot.forEach(doc => {
                const order = doc.data();
                const userId = order.userId; 

                if (orderCounts[userId]) {
                    orderCounts[userId]++;
                } else {
                    orderCounts[userId] = 1;
                }
            });

            // Map filtered users to include total orders
            const usersWithOrderCount = filteredUsers.map(user => ({
                ...user,
                totalOrders: orderCounts[user.id] || 0, 
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
            render: (text) => (text ? text : 'No orders'), 
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
                    rowKey="id" 
                />
            )}
        </div>
    );
};

export default UserComponent;
