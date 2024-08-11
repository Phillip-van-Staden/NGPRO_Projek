import React from 'react';
import './Styles/Dashboard.css'; // Import styling for the dashboard

const Dashboard = () => {
    return (
      <div className="dashboard-container">
        <div className="header">
          <h1>Dashboard</h1>
          <button className="logout-button">Teken uit</button>
        </div>
        <div className="dashboard-cards">
          <div className="dashboard-card">
            <h2>Gebruikersverifikasie</h2>
            <button className="dashboard-button">Bestuur Gebruikers</button>
          </div>
          <div className="dashboard-card">
            <h2>Projekbestuur</h2>
            <button className="dashboard-button">Bestuur Projekte</button>
          </div>
          <div className="dashboard-card">
            <h2>Taakbestuur</h2>
            <button className="dashboard-button">Bestuur Take</button>
          </div>
          <div className="dashboard-card">
            <h2>Samewerking</h2>
            <button className="dashboard-button">Span Kommunikasie</button>
          </div>
          <div className="dashboard-card">
            <h2>Vordering Volg</h2>
            <button className="dashboard-button">Volg Vordering</button>
          </div>
          <div className="dashboard-card">
            <h2>Kalender Integrasie</h2>
            <button className="dashboard-button">Kalender Uitsig</button>
          </div>
          <div className="dashboard-card">
            <h2>Lêer Oplaai</h2>
            <button className="dashboard-button">Lêer Oplaai</button>
          </div>
        </div>
      </div>
    );
  };
  
  export default Dashboard;
  