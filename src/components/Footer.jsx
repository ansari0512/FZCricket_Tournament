import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer__info">
                <h2>Tournament Information</h2>
                <p>Welcome to the FZ Cricket Tournament. Join us for an exciting season of cricket competitions!</p>
            </div>
            <div className="footer__links">
                <h2>Quick Links</h2>
                <ul>
                    <li><a href="/about">About Us</a></li>
                    <li><a href="/contact">Contact</a></li>
                    <li><a href="/teams">Teams</a></li>
                    <li><a href="/schedule">Schedule</a></li>
                </ul>
            </div>
            <div className="footer__social">
                <h2>Follow Us</h2>
                <a href="https://facebook.com">Facebook</a>
                <a href="https://twitter.com">Twitter</a>
                <a href="https://instagram.com">Instagram</a>
            </div>
            <div className="footer__copyright">
                <p>&copy; 2026 FZ Cricket Tournament. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;