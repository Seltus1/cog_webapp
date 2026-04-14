import React, { useState } from 'react';
import DoorIcon from './DoorIcon';

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

  // Create an array to render multiple symbols
  const symbolsToRender = Array(door.number).fill(door.symbol);

  // Determine icon color based on door color for contrast
  const iconColor = door.color === 'cream' ? '#333' : 'white';

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
            <div key={idx} className="door-symbol-container">
              <DoorIcon type={s} size={45} color={iconColor} />
              <span className="door-symbol-number" style={{ color: iconColor }}>{idx + 1}</span>
            </div>
          ))}
        </div>
        {feedback === 'correct' && <div className="feedback-icon correct">✔️</div>}
        {feedback === 'incorrect' && <div className="feedback-icon incorrect">❌</div>}
      </div>
      <div className="door-label" style={{ color: iconColor }}>{door.color.charAt(0).toUpperCase() + door.color.slice(1)} Door</div>
    </div>
  );
}

export default Door;
