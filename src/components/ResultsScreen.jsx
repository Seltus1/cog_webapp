import React, { useState } from 'react';
import { submitAllData } from '../scripts/backend';

function ResultsScreen({ attempts, doors, genAttempts, onRetry, hypothesis }) {
  const [formData, setFormData] = useState({
    ruleGuess: '',
    comments: '',
    age: '',
    gender: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalAttempts = attempts.length + genAttempts.length;
  
  const attemptsPerDoor = attempts.reduce((acc, attempt) => {
    acc[attempt.doorId] = (acc[attempt.doorId] || 0) + 1;
    return acc;
  }, {});

  const sanitize = (str) => {
    if (!str) return '';
    return str
      .replace(/[<>]/g, '')
      .trim();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.ruleGuess.trim()) return;

    setIsSubmitting(true);

    const fullPayload = {
      rule_guess: sanitize(formData.ruleGuess),
      comments: sanitize(formData.comments),
      age: sanitize(formData.age),
      gender: formData.gender,
      hypothesis: hypothesis,
      attempts: attempts,
      genAttempts: genAttempts
    };

    const result = await submitAllData(fullPayload);
    if (result) {
      setSubmitted(true);
    } else {
      alert("There was an error submitting your results. Please try again.");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="results-screen">
      <h2>Experiment Complete</h2>
      
      {!submitted ? (
        <form className="feedback-form" onSubmit={handleSubmit}>
          <h3>Post-Experiment Feedback</h3>
          <p style={{fontSize: '0.9rem', color: '#d32f2f', fontWeight: 'bold', marginBottom: '20px'}}>
            * Please complete the mandatory field below to finalise and submit your results.
          </p>
          
          <div className="form-group">
            <label style={{fontWeight: 'bold'}}>
              What do you think was the rule by which the doors open? <span style={{color: '#d32f2f'}}>*</span>
            </label>
            <textarea 
              required
              value={formData.ruleGuess}
              onChange={(e) => setFormData({...formData, ruleGuess: e.target.value})}
              placeholder="Enter your guess here..."
              style={{border: '2px solid #ccc', borderRadius: '4px', padding: '10px'}}
            />
          </div>

          <div className="form-group">
            <label>We value feedback, please share any comments you have about the experiment:</label>
            <textarea 
              value={formData.comments}
              onChange={(e) => setFormData({...formData, comments: e.target.value})}
              placeholder="Additional comments..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Age (Optional):</label>
              <input 
                type="text" 
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: e.target.value})}
                placeholder="e.g. 25"
              />
            </div>

            <div className="form-group">
              <label>Gender (Optional):</label>
              <select 
                value={formData.gender}
                onChange={(e) => setFormData({...formData, gender: e.target.value})}
              >
                <option value="">Select...</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <button type="submit" className="start-button" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit All Results"}
          </button>
        </form>
      ) : (
        <div className="submission-success">
          <p>✔️ Thank you! All data and feedback have been successfully submitted.</p>
          <div className="retry-container">
            <button className="retry-button" onClick={onRetry}>Retry Experiment</button>
          </div>
        </div>
      )}

      <hr style={{margin: '30px 0', opacity: 0.2}} />

      <div className="boilerplate-text">
        <p>Thank you for participating. Your responses have been recorded for research on human rule inference.</p>
        <p>If you have any questions, contact: <strong>researcher@institution.com</strong></p>
      </div>

      <div className="results-summary">
        <h3>Performance Summary:</h3>
        <p><strong>Total Attempts:</strong> {totalAttempts}</p>
        <ul>
          {doors.map(door => (
            <li key={door.id}>
              Door {door.id}: {attemptsPerDoor[door.id] || 0} attempts
            </li>
          ))}
        </ul>
        <p>Generalization trials: {genAttempts.length} total attempts</p>
      </div>
    </div>
  );
}

export default ResultsScreen;
