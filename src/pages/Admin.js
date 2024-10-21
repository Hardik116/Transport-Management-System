import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import UserComponent from '../component/UserComponent'; 
import DriverComponent from '../component/DriverComponent';
import TripComponent from '../component/TripComponent';

const { Header, Content, Footer } = Layout;

const AdminDashboard = () => {
    // Initialize selectedSection to 'users' to show UserComponent by default
    const [selectedSection, setSelectedSection] = useState('users'); 

    // Function to handle menu click
    const handleMenuClick = (e) => {
        setSelectedSection(e.key); // Set the selected section based on the key
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            {/* Navbar Section */}
            <Header>
                <Menu
                    theme="dark"
                    mode="horizontal"
                    selectedKeys={[selectedSection]} // Set selected key based on state
                    onClick={handleMenuClick}
                >
                    <Menu.Item key="users">Users</Menu.Item>
                    <Menu.Item key="drivers">Drivers</Menu.Item>
                    <Menu.Item key="trips">Trips</Menu.Item>
                </Menu>
            </Header>

            {/* Content Section */}
            <Content style={{ padding: '20px' }}>
                <h1>Admin Dashboard</h1>

                {/* Conditionally render components based on selected menu item */}
                {selectedSection === 'users' && <UserComponent />}
                {selectedSection === 'drivers' && <DriverComponent />}
                {selectedSection === 'trips' && <TripComponent />}
            </Content>

            {/* Footer Section */}
            <Footer style={{ textAlign: 'center' }}>Admin Dashboard ©2024</Footer>
        </Layout>
    );
};

export default AdminDashboard;
