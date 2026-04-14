import React from 'react';

function Instructions({ onStart }) {
  return (
    <div className="instructions">
      <h1>Experiment Instructions</h1>
      
      <div className="instruction-section">
        <p>In this experiment, you are helping to unlock a set of boxes. For each box there is a key that opens it, so the goal of the game is to find the right key for each box.</p>
      </div>

      <div className="video-demonstration">
        <h3>Teacher's Demonstration:</h3>
        <p>You have a demonstration video from a teacher telling you how to open all boxes. In the video, the teacher says:</p>
        <blockquote style={{ fontStyle: 'italic', background: '#f0f0f0', padding: '15px', borderRadius: '8px' }}>
          "I'm going to show you the right way to unlock the doors. To open the doors, you have to use a key that matches the color of the box. So, to open this red box, I'm going to use this red key. Great, now you can open all the doors!"
        </blockquote>
      </div>

      <div className="instruction-details">
        <h3>Setup Information:</h3>
        <ul>
          <li><strong>Boxes:</strong> Lined up in a specific order with different colors and shapes (Moon, Clouds, Diamonds, Hearts, Triangles).</li>
          <li><strong>Keys:</strong> 13 keys with different colored tags, numbers, or shapes.</li>
        </ul>
        <p>Try to open all 5 boxes to complete Phase 1.</p>
      </div>

      <button className="start-button" onClick={onStart}>Start Experiment</button>
    </div>
  );
}

export default Instructions;
