  export const submitAllData = async (payload) => {
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      console.log('Submission success:', data);
      return data;
    } catch (error) {
      console.error('Submission error:', error);
      return null;
    }
  };