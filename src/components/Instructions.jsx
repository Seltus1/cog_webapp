import React from 'react';

function Instructions({ onStart }) {
  return (
    <div className="instructions">
      <h1>Instructions</h1>
      <p>In this experiment, you need to find the correct keys to unlock the boxes.</p>
      <p><strong>Rule:</strong> For now, the colors match. A key will open a box if its tag color matches the box color.</p>
      <p>Drag a key and drop it on a box to try and open it.</p>
      <p>A green check mark means the key worked, and a red cross means it didn't.</p>
      <p>Once a box is open, it will have a green outline.</p>
      <button className="start-button" onClick={onStart}>Start Experiment</button>
    </div>
  );
}

export default Instructions;
