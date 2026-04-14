import React, { useState } from 'react';
import ExperimentBoard from './components/ExperimentBoard';
import ResultsScreen from './components/ResultsScreen';
import Instructions from './components/Instructions';
import { generateAppItems } from './scripts/environment.js'
import { sendResultsToBackend } from './scripts/backend.js';
import { oracle, HYPOTHESES } from './scripts/oracle.js';
import './App.css';


function App() {
  // 1. Determine hypothesis first
  const [currentHypothesis] = useState(() => {
    const keys = Object.values(HYPOTHESES);
    return keys[Math.floor(Math.random() * keys.length)];
  });

  // 2. Generate items based on that hypothesis
  const [items, setItems] = useState(() => generateAppItems());

  const [keys, setKeys] = useState(items.keys);
  const [doors, setDoors] = useState(items.doors);
  const [genDoor, setGenDoor] = useState(items.genDoor);
  const [selectedKeyId, setSelectedKeyId] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [genAttempts, setGenAttempts] = useState([]);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [stage, setStage] = useState('instructions'); // Instructions, then Experiment, then generalization then result page

  const handleReset = () => {
    const newItems = generateAppItems();
    setItems(newItems);
    setKeys(newItems.keys);
    setDoors(newItems.doors);
    setGenDoor(newItems.genDoor);
    setAttempts([]);
    setGenAttempts([]);
    setStage('instructions');
    setSelectedKeyId(null);
    setFeedbackMessage('');
  };

  const handleSelectKey = (keyId) => {
    setSelectedKeyId(keyId);
    setFeedbackMessage('');
  };

  const handleAttempts = (phase, newAttempt) => {
    // Phase being gen or experiment
    if (phase) {
      const newAttempts = [...genAttempts, newAttempt]
      setGenAttempts(newAttempts)
      return newAttempts;
    } else {
      const newAttempts = [...attempts, newAttempt]
      setAttempts(newAttempts)
      return newAttempts;
    }
  }

  const handleOpenDoor = (doorId, keyId) => {
    const isGenPhase = stage === 'generalization';
    const targetDoor = isGenPhase ? genDoor : doors.find(d => d.id === doorId);
    const selectedKey = keys.find(k => k.id === (keyId || selectedKeyId));
    
    if (!selectedKey) return false;

    // Use the assigned hypothesis
    const isCorrect = oracle.shouldOpen(selectedKey, targetDoor, currentHypothesis);

    const newAttempt = {
      time: Date.now(),
      doorId,
      doorNumber: targetDoor.number,
      doorSymbol: targetDoor.symbol,
      keyId: selectedKey.id,
      keyNumber: selectedKey.number,
      keySymbol: selectedKey.symbol,
      correct: isCorrect
    };

    const updatedCurrentAttempts = handleAttempts(isGenPhase, newAttempt)
    
    if (isCorrect && !targetDoor.isOpen) {
      if (isGenPhase) {
        setGenDoor({ ...genDoor, isOpen: true });
        sendResultsToBackend(attempts, updatedCurrentAttempts, currentHypothesis);
        setTimeout(() => setStage('results'), 1500);
      } else {
        const updatedDoors = doors.map(d => d.id === doorId ? { ...d, isOpen: true } : d);
        setDoors(updatedDoors);
        
        // Completion Condition Check
        if (updatedDoors.every(d => d.isOpen)) {
          setTimeout(() => setStage('generalization'), 1500);
        }
      }
    }

    return isCorrect;
  };

  if (keys.length === 0) return <div>Loading experiment...</div>;

  return (
    <div className="App">
      <h1>Cognitive Experiment</h1>
      
      {stage === 'instructions' && (
        <Instructions onStart={() => setStage('experiment')} />
      )}

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
        <ResultsScreen 
          attempts={attempts} 
          doors={doors} 
          genAttempts={genAttempts} 
          onRetry={handleReset}
        />
      )}
    </div>
  );
}

export default App;
