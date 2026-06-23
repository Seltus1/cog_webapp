import React, { useState } from 'react';
import { submitAllData } from '../scripts/backend';

// Helper function to generate an 8-character alphanumeric + symbol code
const generateCompletionCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

function ResultsScreen({ attempts, doors, genAttempts, onRetry, hypothesis, sessionId, submitted, setSubmitted }) {
  const [formData, setFormData] = useState({
    ruleGuess: '',
    comments: '',
    age: '',
    gender: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State to hold the generated code so we can display it after submission
  const [completionCode, setCompletionCode] = useState('');

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
    if (!formData.ruleGuess.trim() || !formData.age.trim()) return;

    setIsSubmitting(true);

    // 1. Generate the code
    const generatedCode = generateCompletionCode();
    setCompletionCode(generatedCode);

    // 2. Attach it to the payload
    const fullPayload = {
      session_id: sessionId, 
      completion_code: generatedCode, // Attached for the backend
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
      <h2>Experiment Complete!</h2>
      
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
              <label>Age <span style={{color: '#d32f2f'}}>*</span></label>
              <input 
                type="text" 
                required
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
          
          {/* New block to display the code to the user */}
          <div style={{
            marginTop: '20px', 
            padding: '20px', 
            backgroundColor: '#f8f9fa', 
            border: '2px dashed #007bff', 
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Your Completion Code:</h3>
            <p style={{ margin: '0 0 15px 0', fontSize: '0.9rem', color: '#666' }}>
              Please copy this code and paste it into the survey platform to receive your payment.
            </p>
            <code style={{ 
              fontSize: '2rem', 
              fontWeight: 'bold', 
              color: '#007bff',
              letterSpacing: '3px',
              userSelect: 'all' // Makes it easy for the user to double-click and copy
            }}>
              {completionCode}
            </code>
          </div>
        </div>
      )}

      <hr style={{margin: '30px 0', opacity: 0.2}} />

      <div className="boilerplate-text">
        <p>Thank you! This puzzle is part of a research study on how people infer logical rules.</p>
        <p>If you have any questions, contact: <strong>farzin.ahmadi@dal.ca</strong></p>
      </div>
    </div>
  );
}

export default ResultsScreen;