import React, { useState } from 'react';

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

  const doorAssetPath = `/src/assets/doors/${door.color}_door.svg`;

  return (
    <div 
      className={`door ${door.isOpen ? 'open' : 'closed'} ${feedback ? `feedback-${feedback}` : ''}`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{ 
        border: door.isOpen ? '6px solid #2ecc71' : 'none'
      }}
    >
      <div className="door-visual">
        <img src={doorAssetPath} alt={`${door.color} door`} className="door-image" />
        {feedback === 'correct' && <div className="feedback-icon correct">✔️</div>}
        {feedback === 'incorrect' && <div className="feedback-icon incorrect">❌</div>}
      </div>
      <div className="door-label">{door.color.charAt(0).toUpperCase() + door.color.slice(1)} Door</div>
    </div>
  );
}

export default Door;
