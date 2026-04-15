import React from 'react';

function Instructions({ onStart }) {
  return (
    <div className="instructions">
      <div className="video-demonstration">
        <p>For each box there is a key that opens it</p>
        <p>This puzzle comes with instructions:</p>
        <blockquote style={{ fontStyle: 'italic', background: '#f8f9fa', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #3498db', margin: '20px 0' }}>
          "I'm going to show you the right way to unlock the doors. To open the doors, you have to use a key that matches the color of the box. So, to open this red box, I'm going to use this red key. Great, now you can open all the doors!"
        </blockquote>
      </div>

      <div className="instruction-details">
        <ul>
          <li><strong>Doors:</strong> Each door has a color and shape.</li>
          <li><strong>Keys:</strong> Each key has a color, and either a number or a shape.</li>
          <li><strong>Interaction:</strong> To try opening doors, drag a key and drop it onto a door.</li>
        </ul>
      </div>

      <button className="start-button" onClick={onStart}>Let's Begin!</button>
    </div>
  );
}

export default Instructions;
