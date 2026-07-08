import React, { useState } from 'react';
import Key from './Key';
import Door from './Door';
import { colors } from '../scripts/environment';

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
      {/* <div className="instruction-panel">
        <img 
          src={gemini}
          alt="Instruction Panel" 
          style={{ width: '100%', maxWidth: '680px', borderRadius: '12px', display: 'block' }}
        />
      </div> */}
            <img 
        src="assets/instruction_example/instructions.svg"
        alt="Instruction Panel"
        style={{ 
          width: '100%',
          height: 'auto',
          maxWidth: '680px',
          borderRadius: '12px',
          display: 'block'
        }}
      />


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
          <div>
            
          </div>
        </div>
        {demoCompleted && <p style={{ color: 'green', fontWeight: 'bold', marginTop: '15px' }}>Well done! You are ready.</p>}
      </div>
      <p style={{ marginBottom: '15px'}}><strong style={{ color: 'red'}}>IMPORTANT: </strong> When you attempt to open the door, the game will use a physical game engine to simulate door opening. <strong style={{color: 'black'}}>This means that the correct key might sometimes jam, and fail,</strong> Since doors and keys are physical objects.</p>

      {demoCompleted && (
        <button className="start-button" onClick={onStart}>Let's Begin!</button>
      )}
    </div>
  );
}

export default Instructions;
