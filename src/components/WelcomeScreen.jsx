import React from 'react';

function WelcomeScreen({ onNext }) {
  return (
    <div className="welcome-screen">
      <div className="content-box">
        <p style={{ color: '#d32f2f', fontWeight: 'bold', marginBottom: '20px' }}>
         Important!  This study will not run on a phone. Please use a laptop or a desktop computer.
        </p>
        <p>In this study you will play a puzzle game.</p>
        <p>Your goal is to open 5 boxes using 13 keys in 5 minutes. For each box there is a key that opens it.  The game will terminate when either 5 minutes have passed, or all doors are open.</p>
        <p>You do not need special skills to play this game, we are just interested in seeing what you will do.</p>
        <button className="start-button" onClick={onNext}>Continue</button>
      </div>
    </div>
  );
}

export default WelcomeScreen;
