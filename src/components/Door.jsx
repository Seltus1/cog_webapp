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

  return (
    <div 
      className={`door ${door.isOpen ? 'open' : 'closed'} ${feedback ? `feedback-${feedback}` : ''}`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{ border: door.isOpen ? '4px solid green' : '2px solid #333' }}
    >
      <div className="door-visual" style={{ backgroundColor: door.color }}>
        <span className="door-symbol">{door.symbol}</span>
        <span className="door-number">{door.number}</span>
        {feedback === 'correct' && <div className="feedback-icon correct">✔️</div>}
        {feedback === 'incorrect' && <div className="feedback-icon incorrect">❌</div>}
      </div>
    </div>
  );
}

export default Door;
