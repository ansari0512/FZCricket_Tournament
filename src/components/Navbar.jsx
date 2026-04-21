import React from 'react';
import './Navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="logo">FZ Cricket Tournament</div>
            <ul className="nav-links">
                <li><a href="#home">Home</a></li>
                <li><a href="#register">Register</a></li>
                <li><a href="#teams">Teams</a></li>
                <li><a href="#schedule">Schedule</a></li>
                <li><a href="#results">Results</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
            <div className="hamburger">
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
            </div>
        </nav>
    );
};

export default Navbar;