import React, { useState } from 'react';
import { symbolMap } from '../scripts/environment';

function Door({ door, onDrop }) {
  const [feedback, setFeedback] = useState(null); // 'correct' or 'incorrect'

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const keyId = e.dataTransfer.getData('keyId');
    const isCorrect = onDrop(door.id, parseInt(keyId));
    
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    setTimeout(() => setFeedback(null), 1000);
  };

  // Create an array of length door.number to render multiple symbols
  const symbolsToRender = Array(door.number).fill(door.symbol);

  return (
    <div 
      className={`door ${door.isOpen ? 'open' : 'closed'} ${feedback ? `feedback-${feedback}` : ''}`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{ 
        border: door.isOpen ? '6px solid #2ecc71' : '3px solid #333',
        backgroundColor: door.color 
      }}
    >
      <div className="door-visual">
        <div className="symbols-grid">
          {symbolsToRender.map((s, idx) => (
            <span key={idx} className="door-symbol">{symbolMap[s] || s}</span>
          ))}
        </div>
        {feedback === 'correct' && <div className="feedback-icon correct">✔️</div>}
        {feedback === 'incorrect' && <div className="feedback-icon incorrect">❌</div>}
      </div>
      <div className="door-label">{door.color.charAt(0).toUpperCase() + door.color.slice(1)} Door</div>
    </div>
  );
}

export default Door;
