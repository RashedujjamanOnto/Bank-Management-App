import React, { useState } from "react";
import API from "../services/api";

const OTPForm = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");

  const handleGenerateOtp = async () => {
    try {
      const response = await API.post("/TwoFactorAuth/GenerateOTP", { email });
      setMessage(response.data);
    } catch (error) {
      console.error("Error generating OTP:", error);
      setMessage("Failed to send OTP. Please try again.");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await API.post("/TwoFactorAuth/VerifyOTP", { email, otp });
      setMessage("OTP Verified! Token: " + response.data.token);
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setMessage("Failed to verify OTP. Please try again.");
    }
  };

  return (
    <div>
      <h1>Two-Factor Authentication</h1>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={handleGenerateOtp}>Send OTP</button>
      </div>
      <div>
        <label>OTP:</label>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <button onClick={handleVerifyOtp}>Verify OTP</button>
      </div>
      {message && <p>{message}</p>}
    </div>
  );
};

export default OTPForm;
