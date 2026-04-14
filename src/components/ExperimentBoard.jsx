import React from 'react';
import Door from './Door';
import Key from './Key';

function ExperimentBoard({ title, keys, doors, selectedKeyId, onSelectKey, onOpenDoor, feedbackMessage }) {
  return (
    <div className="experiment-board">
      <h2>{title}</h2>
      
      <div className="doors-container">
        {doors.map(door => (
          <Door 
            key={door.id} 
            door={door} 
            onDrop={onOpenDoor} 
          />
        ))}
      </div>

      <div className="feedback-message">
        {feedbackMessage && <p>{feedbackMessage}</p>}
      </div>

      <div className="keys-container">
        {keys.map(k => (
          <Key 
            key={k.id} 
            item={k} 
            isSelected={selectedKeyId === k.id}
            onSelect={onSelectKey} 
          />
        ))}
      </div>
    </div>
  );
}

export default ExperimentBoard;
