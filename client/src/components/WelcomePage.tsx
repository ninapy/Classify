import React from "react";
import { useClerk } from "@clerk/clerk-react";
import FileUpload from "./FileUpload";

const WelcomePage = () => {
  const { openSignUp } = useClerk();

  return (
    <div className="welcome-container">
      {/* Authentication Button */}
      <button className="signup-button" onClick={() => openSignUp()}>
        Sign Up
      </button>

      {/* Welcome Message */}
      <h1>Welcome to Classify</h1>

      {/* Search Bar */}
      <input
        type="text"
        className="search-bar"
        placeholder="Search for study notes..."
      />

      {/* File Upload Section */}
      <div className="or-text">or</div>
      <FileUpload />
    </div>
  );
};

export default WelcomePage;
