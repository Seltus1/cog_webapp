import React, { useState } from 'react';

function Door({ door, onDrop, selectedKeyId, isGenPhase }) {
  const [feedback, setFeedback] = useState(null);

  // Handle traditional Drag and Drop (PC)
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDropEvent = (e) => {
    e.preventDefault();
    const keyId = e.dataTransfer.getData('keyId');
    if (!keyId) return;
    
    const isCorrect = onDrop(door.id, parseInt(keyId));
    setFeedback(isGenPhase ? 'neutral' : (isCorrect ? 'correct' : 'incorrect'));
    setTimeout(() => setFeedback(null), 1000);
  };

  // Handle Click-to-Select (Mobile)
  const handleClick = (e) => {
    if (!selectedKeyId) return;
    
    const isCorrect = onDrop(door.id, selectedKeyId);
    setFeedback(isGenPhase ? 'neutral' : (isCorrect ? 'correct' : 'incorrect'));
    setTimeout(() => setFeedback(null), 1000);
  };

  const doorAssetPath = door.asset;

  return (
    <div 
      className={`door ${door.isOpen ? 'open' : 'closed'} ${feedback ? `feedback-${feedback}` : ''} ${selectedKeyId ? 'can-interact' : ''}`}
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDrop={handleDropEvent}
      style={{ 
        border: (door.isOpen && !isGenPhase) ? '6px solid #2ecc71' : 'none'
      }}
    >
      <div className="door-visual">
        <img src={doorAssetPath} alt={`${door.color} door`} className="door-image" />
        {feedback === 'correct' && <div className="feedback-icon correct">✔️</div>}
        {feedback === 'incorrect' && <div className="feedback-icon incorrect">❌</div>}
        {feedback === 'neutral' && <div className="feedback-icon neutral">👍</div>}
      </div>
    </div>
  );
}

export default Door;
