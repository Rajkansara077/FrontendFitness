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
      <div className="login-container"> {/* Main container */}
          <div className="login-content"> {/* Content area */}
              <div className="login-header"> {/* Header for logo/title */}
                  {/* <Car className="h-12 w-12 text-red-500" />  */}
                  <h1 className="login-title">VIP Automated Vehicle Fitness Testing Center</h1> {/* Consistent title */}
              </div>

              <div className="login-card-container"> {/* Container for card */}
                  {step === 1 ? (
                      <div className="login-card"> {/* Card with class */}
                          <h2 className="login-card-title">Login with OTP</h2> {/* Consistent title style */}
                          <input
                              className="login-input" /* Consistent input style */
                              type="text"
                              placeholder="Enter Mobile Number"
                              value={mobileNo}
                              onChange={(e) => setMobileNo(e.target.value)}
                          />
                          <button className="login-button" onClick={handleRequestOtp}> {/* Consistent button style */}
                              Request OTP
                          </button>
                      </div>
                  ) : (
                      <div className="login-card"> {/* Card with class */}
                          <h2 className="login-card-title">Enter OTP</h2> {/* Consistent title style */}
                          <input
                              className="login-input" /* Consistent input style */
                              type="text"
                              placeholder="Enter OTP"
                              value={otpCode}
                              onChange={(e) => setOtp(e.target.value)}
                          />
                          <button className="login-button" onClick={handleVerifyOtp}> {/* Consistent button style */}
                              Verify OTP
                          </button>
                      </div>
                  )}
              </div>
          </div>
      </div>
  );
};

export default LoginWithOTP;
