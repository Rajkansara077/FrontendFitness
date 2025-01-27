import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css'; // Import the CSS file for styling

const LoginWithOTP = ({ setIsLoggedIn }) => {
    const [mobileNo, setMobileNo] = useState('');
    const [otpCode, setOtp] = useState('');
    const [step, setStep] = useState(1);
    const navigate = useNavigate();

    const handleRequestOtp = async () => {
        try {
            const response = await axios.post('http://localhost:5000/request-otp', { mobileNo });
            alert(response.data.message);
            setStep(2);
        } catch (error) {
            console.error(error);
            alert('Failed to send OTP');
        }
    };

    const handleVerifyOtp = async () => {
        try {
            const response = await axios.post('http://localhost:5000/verify-otp', { mobileNo, otpCode });
            alert(response.data.message);
            localStorage.setItem('isLoggedIn', 'true');
            setIsLoggedIn(true);
            navigate('/Dashboard');
        } catch (error) {
            console.error(error);
            alert('Failed to verify OTP');
        }
    };

    return (
        <div >
        <div >
          {/* <Car className="h-12 w-12 text-red-500" /> */}
          {/* <h1 className="text-3xl font-bold text-white">AutoPro Garage</h1> */}
        </div>
        <div >
          {step === 1 ? (
            <div className="card">
              <h2 className="text-white text-center text-2xl font-bold mb-4">Login with OTP</h2>
              <input
                className="input-field"
                type="text"
                placeholder="Enter Mobile Number"
                value={mobileNo}
                onChange={(e) => setMobileNo(e.target.value)}
              />
              <button className="btn" onClick={handleRequestOtp}>Request OTP</button>
            </div>
          ) : (
            <div className="card">
              <h2 className="text-white text-center text-2xl font-bold mb-4">Enter OTP</h2>
              <input
                className="input-field"
                type="text"
                placeholder="Enter OTP"
                value={otpCode}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button className="btn" onClick={handleVerifyOtp}>Verify OTP</button>
            </div>
          )}
        </div>
      </div>
      
    );
};

export default LoginWithOTP;
