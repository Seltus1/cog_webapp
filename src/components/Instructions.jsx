import React from 'react';

function Instructions({ onStart }) {
  return (
    <div className="instructions">
      <h1>Participant Instructions</h1>
      
      <div className="instruction-section">
        <p>Welcome to this cognitive research study. Your task involves a series of problem-solving trials focused on rule inference. You will be presented with a sequence of <strong>five secured doors</strong> and a collection of <strong>thirteen distinct keys</strong>.</p>
        <p>The primary objective of this session is to identify the specific logic governing the relationship between the keys and the doors to successfully unlock all five targets.</p>
      </div>

      <div className="video-demonstration">
        <h3>Standardized Orientation:</h3>
        <p>Please review the following transcript from the orientation video provided to all participants:</p>
        <blockquote style={{ fontStyle: 'italic', background: '#f8f9fa', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #3498db', margin: '20px 0' }}>
          "I'm going to show you the right way to unlock the doors. To open the doors, you have to use a key that matches the color of the box. So, to open this red box, I'm going to use this red key. Great, now you can open all the doors!"
        </blockquote>
      </div>

      <div className="instruction-details">
        <h3>Experimental Setup:</h3>
        <ul>
          <li><strong>Doors:</strong> Each door is uniquely identified by color and a specific configuration of geometric symbols.</li>
          <li><strong>Keys:</strong> Each key possesses a unique combination of color, numerical values, or symbolic markers.</li>
          <li><strong>Interaction:</strong> To attempt an unlock, drag a key and drop it onto the desired door. Feedback will be provided via visual indicators (✔️/❌).</li>
        </ul>
        <p>Upon successfully unlocking all five doors in Phase 1, you will proceed to the Generalization Phase. Please work as efficiently as possible.</p>
      </div>

      <button className="start-button" onClick={onStart}>Begin Experiment</button>
    </div>
  );
}

export default Instructions;
