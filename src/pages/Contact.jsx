import React from 'react';

const Contact = () => {
    return (
        <div>
            <h1>Contact Us</h1>
            <p>If you have any questions, feel free to reach out!</p>
            <h2>Contact Information</h2>
            <ul>
                <li>Email: contact@fzcricket.com</li>
                <li>Phone Number: +1234567890</li>
                <li>Venue Address: Odajhar, India</li>
            </ul>
            <h2>Contact Form</h2>
            <form>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" name="name" required />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" required />
                </div>
                <div>
                    <label htmlFor="message">Message:</label>
                    <textarea id="message" name="message" required></textarea>
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default Contact;