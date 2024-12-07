import React from "react";
import { SignedIn, SignedOut, SignInButton, SignOutButton } from "@clerk/clerk-react";

const WelcomePage = () => {
  return (
    <div className="welcome-container">
      {/* Header: Sign In or Sign Out Button */}
      <div className="auth-buttons">
        <SignedOut>
          <SignInButton mode="modal">
            <button className="auth-button">Sign In</button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <SignOutButton>
            <button className="auth-button">Sign Out</button>
          </SignOutButton>
        </SignedIn>
      </div>

      {/* Welcome Message and Search Bar */}
      <h1>Welcome to Classify</h1>
      <input 
        type="text" 
        className="search-bar" 
        placeholder="Search for study notes..." 
      />
    </div>
  );
};

export default WelcomePage;
