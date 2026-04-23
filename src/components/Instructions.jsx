import React, { useState } from 'react';
import Key from './Key';
import Door from './Door';

function Instructions({ onStart }) {
  const [demoCompleted, setDemoCompleted] = useState(false);
  const [selectedKeyId, setSelectedKeyId] = useState(null);

  const demoKey = {
    id: 999,
    name: 'red1',
    asset: '/assets/instruction_example/key.svg'
  };

  const demoDoor = {
    id: 888,
    name: 'red_door',
    asset: '/assets/instruction_example/door.svg',
    color: 'red',
    isOpen: false
  };

  const handleDrop = (doorId, keyId) => {
    if (keyId === demoKey.id) {
      setDemoCompleted(true);
      return true;
    }
    return false;
  };

  return (
    <div className="instructions">
      <div className="instruction-details">
          <p><strong>Doors:</strong> Each door has a color and a shape.</p>
          <p><strong>Keys:</strong> Each key has a color, and either a number or a shape.</p>
          <p><strong>Interaction:</strong> To try opening doors, drag a key and drop it onto a door.</p>
      </div>

      <div className="demo-section" style={{ 
        marginTop: '20px', 
        padding: '20px', 
        border: '2px dashed #ccc', 
        borderRadius: '12px',
        background: '#f9f9f9',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <p style={{ marginBottom: '15px' }}><strong>Try it now:</strong> Drag the key to the door to unlock the experiment.</p>
        <div style={{ display: 'flex', gap: '40px', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '80px' }}>
            <Key 
              item={demoKey} 
              isSelected={selectedKeyId === demoKey.id} 
              onSelect={setSelectedKeyId} 
            />
          </div>
          <div style={{ width: '120px' }}>
            <Door 
              door={demoDoor} 
              onDrop={handleDrop} 
              selectedKeyId={selectedKeyId} 
              isGenPhase={false} 
            />
          </div>
        </div>
        {demoCompleted && <p style={{ color: 'green', fontWeight: 'bold', marginTop: '15px' }}>Well done! You are ready.</p>}
      </div>

      {demoCompleted && (
        <button className="start-button" onClick={onStart}>Let's Begin!</button>
      )}
    </div>
  );
}

export default Instructions;
