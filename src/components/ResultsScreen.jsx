import React from 'react';

function ResultsScreen({ attempts, doors, genAttempts, onRetry }) {
  const totalAttempts = attempts.length + genAttempts.length;
  
  const attemptsPerDoor = attempts.reduce((acc, attempt) => {
    acc[attempt.doorId] = (acc[attempt.doorId] || 0) + 1;
    return acc;
  }, {});

  const totalGenAttempts = genAttempts.length;

  return (
    <div className="results-screen">
      <h2>Experiment Complete</h2>
      
      <div className="boilerplate-text">
        <p>Thank you for participating in this cognitive study. Your responses have been recorded and will contribute to our research on human rule inference and decision-making under uncertainty.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        <p>If you have any questions regarding this study, please contact the lead researcher at: <strong>researcher@institution.com</strong></p>
      </div>

      <div className="results-summary">
        <h3>Summary of Your Session:</h3>
        <p><strong>Total Attempts:</strong> {totalAttempts}</p>

        <h4>Phase 1: Learning</h4>
        <ul>
          {doors.map(door => (
            <li key={door.id}>
              Door {door.id}: <strong>{attemptsPerDoor[door.id] || 0} attempts</strong>
            </li>
          ))}
        </ul>

        <h4>Phase 2: Generalization</h4>
        <p>
          Attempts on the novel door: <strong>{totalGenAttempts} attempts</strong>
        </p>
      </div>

      <div className="retry-container">
        <p>Would you like to try the experiment again?</p>
        <button className="retry-button" onClick={onRetry}>Retry Experiment</button>
      </div>
    </div>
  );
}

export default ResultsScreen;
