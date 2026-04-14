  export const sendResultsToBackend = async (phase1Attempts, phase2Attempts, hypothesis) => {
    try {
      const response = await fetch('http://localhost:8000/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hypothesis: hypothesis,
          attempts: phase1Attempts,
          genAttempts: phase2Attempts,
        }),
      });
      const data = await response.json();
      console.log('Backend response:', data);
    } catch (error) {
      console.error('Error sending results to backend:', error);
    }
  };