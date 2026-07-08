import React, { useState, useEffect } from 'react';
import ExperimentBoard from './components/ExperimentBoard';
import ResultsScreen from './components/ResultsScreen';
import Instructions from './components/Instructions';
import WelcomeScreen from './components/WelcomeScreen';
import ConsentScreen from './components/ConsentScreen';
import { generateAppItems } from './scripts/environment.js'
import { oracle, HYPOTHESES } from './scripts/oracle.js';
import { submitAllData } from './scripts/backend';
import './App.css';

// Simple UUID generator for the session
const generateSessionId = () => {
  return 'xxxx-xxxx-4xxx-yxxx-xxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

function App() {
  const [sessionId] = useState(() => generateSessionId());
  const [appStartTime] = useState(() => Date.now()); // Overall app load time
  const [stageStartTime, setStageStartTime] = useState(() => Date.now()); // When current stage started
  const [lastActionTime, setLastActionTime] = useState(() => Date.now()); // Time of last click/action
  
  const [currentHypothesis] = useState(HYPOTHESES.NUMBER_MATCH_FUZZY);

  const [items, setItems] = useState(() => generateAppItems());
  const [keys, setKeys] = useState(items.keys);
  const [doors, setDoors] = useState(items.doors);
  const [genTrials, setGenTrials] = useState(items.genTrials);
  const [currentGenTrialIndex, setCurrentGenTrialIndex] = useState(0);
  
  const [selectedKeyId, setSelectedKeyId] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [genAttempts, setGenAttempts] = useState([]);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [stage, setStage] = useState('consent'); // consent, Welcome, Instructions, Experiment, Transition, Generalization, Results
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [timerActive, setTimerActive] = useState(false);
  const [submitted, setSubmitted] = useState(false); // New state to track final submission

  // Handle the "Final Breath" save when the window closes
  useEffect(() => {
    // If they already clicked the final submit button, DON'T send an emergency update
    if (submitted) return;

    const handleBeforeUnload = () => {
      const emergencyPayload = {
        session_id: sessionId,
        hypothesis: currentHypothesis,
        attempts: attempts,
        genAttempts: genAttempts,
        rule_guess: "CLOSED_TAB",
        comments: "Automatic save from browser exit"
      };
      
      const blob = new Blob([JSON.stringify(emergencyPayload)], { type: 'application/json' });
      navigator.sendBeacon('/api/submit', blob);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [attempts, genAttempts, currentHypothesis, sessionId, submitted]);

  useEffect(() => {
    let interval = null;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(interval);
      setTimeout(() => {
        setStage('results');
        setTimerActive(false);
      }, 0);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]); 

  const startExperiment = () => {
    const now = Date.now();
    setStage('experiment');
    setTimerActive(true);
    setStageStartTime(now);
    setLastActionTime(now);
  };

  const handleReset = () => {
    const now = Date.now();
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
    setStageStartTime(now);
    setLastActionTime(now);
  };

  const handleSelectKey = (keyId) => {
    setSelectedKeyId(keyId);
    setFeedbackMessage('');
  };

  const [isTransitioning, setIsTransitioning] = useState(false); // Guard for trial transitions

  const handleOpenDoor = (doorId, keyId) => {
    if (isTransitioning) return false; // Prevent double-clicks during timeouts

    const isGenPhase = stage === 'generalization';
    const currentGenTrial = genTrials[currentGenTrialIndex];
    
    const targetDoor = isGenPhase ? currentGenTrial.door : doors.find(d => d.id === doorId);
    const availableKeys = isGenPhase ? currentGenTrial.keys : keys;
    const selectedKey = availableKeys.find(k => k.id === (keyId || selectedKeyId));
    
    if (!selectedKey) return false;

    const now = Date.now();
    const isCorrect = oracle.shouldOpen(selectedKey, targetDoor, currentHypothesis);
    const isCorrectTrueRule = oracle.shouldOpen(selectedKey, targetDoor, HYPOTHESES.NUMBER_MATCH);

    const newAttempt = {
      time: now,
      time_since_app_start: now - appStartTime,
      time_since_stage_start: now - stageStartTime,
      time_since_last_action: now - lastActionTime,
      doorId,
      doorName: targetDoor.name,
      doorNumber: targetDoor.number,
      doorSymbol: targetDoor.symbol,
      keyId: selectedKey.id,
      keyName: selectedKey.name,
      keyNumber: selectedKey.number,
      keySymbol: selectedKey.symbol,
      correct: isCorrect,
      correct_num: isCorrectTrueRule,
      phase: isGenPhase ? `generalization_${currentGenTrialIndex + 1}` : 'learning'
    };

    setLastActionTime(now); // Reset for the next action

    // Update attempts state locally
    if (isGenPhase) {
      setGenAttempts(prev => [...prev, newAttempt]);
    } else {
      setAttempts(prev => [...prev, newAttempt]);
    }

    // PARTIAL SAVE
    if (!submitted) {
        const partialPayload = {
            session_id: sessionId,
            hypothesis: currentHypothesis,
            attempts: isGenPhase ? attempts : [...attempts, newAttempt],
            genAttempts: isGenPhase ? [...genAttempts, newAttempt] : genAttempts,
            rule_guess: "PARTIAL_INCOMPLETE"
        };
        submitAllData(partialPayload);
    }
    
    if (isGenPhase) {
      // In Generalization, we move forward REGARDLESS of correctness after 1 attempt
      setIsTransitioning(true);
      if (currentGenTrialIndex < genTrials.length - 1) {
        setTimeout(() => {
          const transitionNow = Date.now();
          setCurrentGenTrialIndex(prev => prev + 1);
          setSelectedKeyId(null);
          setIsTransitioning(false);
          setStageStartTime(transitionNow); 
          setLastActionTime(transitionNow);
        }, 1500);
      } else {
        setTimerActive(false);
        setTimeout(() => {
          setStage('results');
          setIsTransitioning(false);
        }, 1500);
      }
    } else if (isCorrect && !targetDoor.isOpen) {
      // Phase 1: Only advance/open if correct
      const updatedDoors = doors.map(d => d.id === doorId ? { ...d, isOpen: true } : d);
      setDoors(updatedDoors);
      
      if (updatedDoors.every(d => d.isOpen)) {
        setTimerActive(false);
        setIsTransitioning(true);
        setTimeout(() => {
          const transitionNow = Date.now();
          setStage('transition');
          setSelectedKeyId(null);
          setIsTransitioning(false);
          setStageStartTime(transitionNow);
          setLastActionTime(transitionNow);
        }, 1500);
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
      {timerActive && stage === 'experiment' && <div className="timer">Time Remaining: {formatTime(timeLeft)}</div>}
      
      {stage === 'consent' && (
        <ConsentScreen onConsent={() => setStage('welcome')} />
      )}

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

      {stage === 'transition' && (
        <div className="welcome-screen">
          <h2>Great, you are done!</h2>
          <p>Next we will show you four new doors, along with a new set of keys. This time there will be no feedback but the answer is revealed at the end of the study! Please select the key that you think is most likely to open the door.</p>
          <button className="start-button" onClick={() => {
            const now = Date.now();
            setStage('generalization');
            setStageStartTime(now);
            setLastActionTime(now);
          }}>
            Continue to Phase 2
          </button>
        </div>
      )}

      {stage === 'generalization' && (
        <ExperimentBoard 
          title={`Guess which key opens this new door? Door ${currentGenTrialIndex + 1} of ${genTrials.length}`}
          keys={genTrials[currentGenTrialIndex].keys}
          doors={[genTrials[currentGenTrialIndex].door]}
          selectedKeyId={selectedKeyId}
          onSelectKey={handleSelectKey}
          onOpenDoor={handleOpenDoor}
          feedbackMessage={feedbackMessage}
          isGenPhase={true}
        />
      )}

      {stage === 'results' && (
        <ResultsScreen 
          attempts={attempts} 
          doors={doors} 
          genAttempts={genAttempts} 
          onRetry={handleReset}
          hypothesis={currentHypothesis}
          sessionId={sessionId}
          submitted={submitted}
          setSubmitted={setSubmitted}
        />
      )}
    </div>
  );
}

export default App;
