import React from 'react';
import Razorpay from 'razorpay-react';
import './Register.css';

const Register = () => {
    const [teamName, setTeamName] = React.useState('');
    const [captainName, setCaptainName] = React.useState('');
    const [captainContact, setCaptainContact] = React.useState('');

    const handlePayment = async () => {
        const options = {
            key: 'YOUR_RAZORPAY_KEY', // Replace with your Razorpay key
            amount: 300 * 100, // Amount in paise
            currency: 'INR',
            name: 'FZ Cricket Tournament',
            description: 'Team Registration Fee',
            handler: function (response) {
                alert('Payment Successful: ' + response.razorpay_payment_id);
            },
            prefill: {
                name: captainName,
                contact: captainContact,
                email: '',
            },
            notes: {
                teamName: teamName,
            },
            theme: {
                color: '#F37254'
            }
        };
        const razorpay = new Razorpay(options);
        razorpay.open();
    };

    const handleRegister = (e) => {
        e.preventDefault();
        // Add your registration logic here
        handlePayment();
    };

    return (
        <div className='register-container'>
            <h2>Register Your Team</h2>
            <form onSubmit={handleRegister}>
                <div>
                    <label>Team Name:</label>
                    <input type='text' value={teamName} onChange={(e) => setTeamName(e.target.value)} required />
                </div>
                <div>
                    <label>Captain Name:</label>
                    <input type='text' value={captainName} onChange={(e) => setCaptainName(e.target.value)} required />
                </div>
                <div>
                    <label>Captain Contact:</label>
                    <input type='text' value={captainContact} onChange={(e) => setCaptainContact(e.target.value)} required />
                </div>
                <button type='submit'>Register</button>
            </form>
        </div>
    );
};

export default Register;