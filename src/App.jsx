import React, { useState, useEffect } from 'react';
import ExperimentBoard from './components/ExperimentBoard';
import ResultsScreen from './components/ResultsScreen';
import { generateAppItems } from './scripts/environment.js'
import { sendResultsToBackend } from './scripts/backend.js';
import './App.css';


function App() {
  const [keys, setKeys] = useState([]);
  const [doors, setDoors] = useState([]);
  const [genDoor, setGenDoor] = useState(null);
  const [selectedKeyId, setSelectedKeyId] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [genAttempts, setGenAttempts] = useState([]);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [stage, setStage] = useState('experiment'); // Experiment, then generalization then result page

  // useEffect for sticking info on components without re-rendering
  useEffect(() => {
    const { keys: initialKeys, doors: initialDoors, genDoor: initialGenDoor } = generateAppItems();
    setKeys(initialKeys);
    setDoors(initialDoors);
    setGenDoor(initialGenDoor);
    
    console.log("Internal Mapping");
    initialDoors.forEach(d => {
      const key = initialKeys.find(k => k.id === d.correctKeyId);

      console.log({
        doorId: d.id,
        doorDisplay: {
          color: d.color,
          symbol: d.symbol,
          number: d.number
        },
        correctKeyId: d.correctKeyId,
        keyDisplay: {
          color: key.color,
          symbol: key.symbol,
          number: key.number
        }
      });
    });
  }, []);


  const handleSelectKey = (keyId) => {
    setSelectedKeyId(keyId);
    setFeedbackMessage('');
  };

  const handleAttempts = (phase, newAttempt) => {
    // Phase being gen or experiment
    if (phase) {
      const newAttempts = [...genAttempts, newAttempt]
      setGenAttempts(newAttempts)
      console.log(JSON.stringify({ genAttempts: newAttempts }, null, 2));
      return newAttempts;
    } else {
      const newAttempts = [...attempts, newAttempt]
      setAttempts(newAttempts)
      console.log(JSON.stringify({ attempts: newAttempts }, null, 2));
      return newAttempts;
    }
  }

  const handleOpenDoor = (doorId) => {
    if (selectedKeyId === null) {
      setFeedbackMessage('Please select a key first.');
      return;
    }

    const isGenPhase = stage === 'generalization';
    const targetDoor = isGenPhase ? genDoor : doors.find(d => d.id === doorId);
    const selectedKey = keys.find(k => k.id === selectedKeyId);
    
    if (targetDoor.isOpen) return;

    const isCorrect = targetDoor.correctKeyId === selectedKeyId;

    const newAttempt = {
      time: Date.now(),
      doorId,
      doorNumber: targetDoor.number,
      doorSymbol: targetDoor.symbol,
      keyId: selectedKeyId,
      keyNumber: selectedKey.number,
      keySymbol: selectedKey.symbol,
      correct: isCorrect
    };

    const updatedCurrentAttempts = handleAttempts(isGenPhase, newAttempt)
    // TODO: make this more neat
    if (isCorrect) {
      setFeedbackMessage('Correct key!');

      if (isGenPhase) {
        setGenDoor({ ...genDoor, isOpen: true });
        sendResultsToBackend(attempts, updatedCurrentAttempts);
        setTimeout(() => setStage('results'), 1000);

        // Still doors left to be opened
      } else {
        const updatedDoors = doors.map(d => d.id === doorId ? { ...d, isOpen: true } : d);
        setDoors(updatedDoors);
        
        // Completion Condition Check
        if (updatedDoors.every(d => d.isOpen)) {
          setTimeout(() => setStage('generalization'), 1000);
        }
      }
    } else {
      setFeedbackMessage('Incorrect key');
    }
  };

  if (keys.length === 0) return <div>Loading experiment...</div>;

  return (
    <div className="App">
      <h1>Cognitive Experiment</h1>
      
      {stage === 'experiment' && (
        <ExperimentBoard 
          title="Phase 1: Unlock all 5 doors"
          keys={keys}
          doors={doors}
          selectedKeyId={selectedKeyId}
          onSelectKey={handleSelectKey}
          onOpenDoor={handleOpenDoor}
          feedbackMessage={feedbackMessage}
        />
      )}

      {stage === 'generalization' && (
        <ExperimentBoard 
          title="Phase 2: Generalization Test - Unlock the new door"
          keys={keys}
          doors={[genDoor]}
          selectedKeyId={selectedKeyId}
          onSelectKey={handleSelectKey}
          onOpenDoor={handleOpenDoor}
          feedbackMessage={feedbackMessage}
        />
      )}

      {stage === 'results' && (
        <ResultsScreen attempts={attempts} doors={doors} genDoor={genDoor} genAttempts={genAttempts} />
      )}
    </div>
  );
}

export default App;
