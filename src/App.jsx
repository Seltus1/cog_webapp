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
  const [currentHypothesis] = useState(HYPOTHESES.NUMBER_MATCH);

  const [items, setItems] = useState(() => generateAppItems());
  const [keys, setKeys] = useState(items.keys);
  const [doors, setDoors] = useState(items.doors);
  const [genTrials, setGenTrials] = useState(items.genTrials);
  const [currentGenTrialIndex, setCurrentGenTrialIndex] = useState(0);
  
  const [selectedKeyId, setSelectedKeyId] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [genAttempts, setGenAttempts] = useState([]);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [stage, setStage] = useState('welcome'); // Welcome, Instructions, Experiment, Generalization, Results
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [timerActive, setTimerActive] = useState(false);

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
    setGenTrials(newItems.genTrials);
    setCurrentGenTrialIndex(0);
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
    if (phase) {
      const newAttempts = [...genAttempts, newAttempt];
      setGenAttempts(newAttempts);
      return newAttempts;
    } else {
      const newAttempts = [...attempts, newAttempt];
      setAttempts(newAttempts);
      return newAttempts;
    }
  }

  const handleOpenDoor = (doorId, keyId) => {
    const isGenPhase = stage === 'generalization';
    const currentGenTrial = genTrials[currentGenTrialIndex];
    
    const targetDoor = isGenPhase ? currentGenTrial.door : doors.find(d => d.id === doorId);
    const availableKeys = isGenPhase ? currentGenTrial.keys : keys;
    const selectedKey = availableKeys.find(k => k.id === (keyId || selectedKeyId));
    
    if (!selectedKey) return false;

    const isCorrect = oracle.shouldOpen(selectedKey, targetDoor, currentHypothesis);

    const newAttempt = {
      time: Date.now(),
      doorId,
      doorNumber: targetDoor.number,
      doorSymbol: targetDoor.symbol,
      keyId: selectedKey.id,
      keyName: selectedKey.name,
      keyNumber: selectedKey.number,
      keySymbol: selectedKey.symbol,
      correct: isCorrect,
      phase: isGenPhase ? `generalization_${currentGenTrialIndex + 1}` : 'learning'
    };

    const updatedCurrentAttempts = handleAttempts(isGenPhase, newAttempt);
    
    if (isCorrect && !targetDoor.isOpen) {
      if (isGenPhase) {
        // Mark current gen door as open (locally in state if needed, but we mostly just advance)
        if (currentGenTrialIndex < genTrials.length - 1) {
          setTimeout(() => {
            setCurrentGenTrialIndex(prev => prev + 1);
            setSelectedKeyId(null);
          }, 1500);
        } else {
          // Finished all generalization trials
          sendResultsToBackend(attempts, updatedCurrentAttempts, currentHypothesis);
          setTimerActive(false);
          setTimeout(() => setStage('results'), 1500);
        }
      } else {
        const updatedDoors = doors.map(d => d.id === doorId ? { ...d, isOpen: true } : d);
        setDoors(updatedDoors);
        
        if (updatedDoors.every(d => d.isOpen)) {
          setTimeout(() => {
            setStage('generalization');
            setSelectedKeyId(null);
          }, 1500);
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
          title={`Phase 2: Generalization - Trial ${currentGenTrialIndex + 1} of ${genTrials.length}`}
          keys={genTrials[currentGenTrialIndex].keys}
          doors={[genTrials[currentGenTrialIndex].door]}
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
