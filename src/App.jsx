import React, { useState, useEffect } from 'react';
import ExperimentBoard from './components/ExperimentBoard';
import ResultsScreen from './components/ResultsScreen';
import Instructions from './components/Instructions';
import WelcomeScreen from './components/WelcomeScreen';
import { generateAppItems } from './scripts/environment.js'
import { sendResultsToBackend } from './scripts/backend.js';
import { oracle, HYPOTHESES } from './scripts/oracle.js';
import './App.css';


function App() {
  // Lock the ground truth to NUMBER_MATCH as per the POMDP model (the "true rule")
  // The instructions will still mislead them with the Color hypothesis.
  const [currentHypothesis] = useState(HYPOTHESES.NUMBER_MATCH);

  const [items, setItems] = useState(() => generateAppItems());
  const [keys, setKeys] = useState(items.keys);
  const [doors, setDoors] = useState(items.doors);
  const [genDoor, setGenDoor] = useState(items.genDoor);
  const [selectedKeyId, setSelectedKeyId] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [genAttempts, setGenAttempts] = useState([]);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [stage, setStage] = useState('welcome'); // Welcome, then Instructions, then Experiment, then generalization then result page
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [timerActive, setTimerActive] = useState(false);

  // Timer logic
  useEffect(() => {
    let interval = null;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(interval);
      sendResultsToBackend(attempts, genAttempts, currentHypothesis);
      setStage('results');
      setTimerActive(false);
    }
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timerActive, timeLeft]); 

  const startExperiment = () => {
    setStage('experiment');
    setTimerActive(true);
  };

  const handleReset = () => {
    const newItems = generateAppItems();
    setItems(newItems);
    setKeys(newItems.keys);
    setDoors(newItems.doors);
    setGenDoor(newItems.genDoor);
    setAttempts([]);
    setGenAttempts([]);
    setStage('welcome');
    setSelectedKeyId(null);
    setFeedbackMessage('');
    setTimeLeft(300);
    setTimerActive(false);
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
        setTimerActive(false); // Stop timer on success
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

  if (keys.length === 0) return <div>Loading...</div>;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="App">
      {timerActive && <div className="timer">Time Remaining: {formatTime(timeLeft)}</div>}
      
      {stage === 'welcome' && (
        <WelcomeScreen onNext={() => setStage('instructions')} />
      )}

      {stage === 'instructions' && (
        <Instructions onStart={startExperiment} />
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
