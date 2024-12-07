import React from "react";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import WelcomePage from "./WelcomePage";

function App() {
  return (
    <div className="App">
      {/* Render Welcome Page */}
      <WelcomePage />
    </div>
  );
}

export default App;
