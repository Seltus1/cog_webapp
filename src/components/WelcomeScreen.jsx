import React from 'react';

function WelcomeScreen({ onNext }) {
  return (
    <div className="welcome-screen">
      <div className="content-box">
        <p>In this study you will play a puzzle game.</p>
        <p>Your goal is to open 5 boxes using 13 keys. Once 5 minutes have passed, the experiment will terminate.</p>
        <p>You do not need special skills to play this game, we are just interested in seeing what you will do.</p>
        <button className="start-button" onClick={onNext}>Continue</button>
      </div>
    </div>
  );
}

export default WelcomeScreen;
