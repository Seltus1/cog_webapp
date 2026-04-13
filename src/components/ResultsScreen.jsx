import React from 'react';

function ResultsScreen({ attempts, doors, genDoor, genAttempts }) {
  const totalAttempts = attempts.length + genAttempts.length;
  
  const attemptsPerDoor = attempts.reduce((acc, attempt) => {
    acc[attempt.doorId] = (acc[attempt.doorId] || 0) + 1;
    return acc;
  }, {});

  const totalGenAttempts = genAttempts.length;

  return (
    <div className="results-screen">
      <h2>Task Complete</h2>

      <div className="results-summary">
        <p><strong>Total Attempts:</strong> {totalAttempts}</p>

        <h3>Attempts per Door (Phase 1):</h3>
        <ul>
          {doors.map(door => (
            <li key={door.id}>
              Door {door.id} (Color: {door.color}, Symbol: {door.symbol}, Number: {door.number}): <strong>{attemptsPerDoor[door.id] || 0} attempts</strong>
            </li>
          ))}
        </ul>

        <h3>Generalization Test (Phase 2):</h3>
        <p>
          Attempts on new door (Color: {genDoor.color}, Symbol: {genDoor.symbol}, Number: {genDoor.number}): <strong>{totalGenAttempts} attempts</strong>
        </p>
      </div>
    </div>
  );
}

export default ResultsScreen;
