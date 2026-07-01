// 1. FIXED: Imported useEffect here!
import React, { useState, useEffect } from 'react';
import { submitAllData } from '../scripts/backend';

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
  const [completionCode, setCompletionCode] = useState('');
  const [userIp, setUserIp] = useState('unknown');

  useEffect(() => {
    const fetchIp = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        setUserIp(data.ip);
      } catch (error) {
        console.error("Could not fetch IP address:", error);
        setUserIp('fetch_failed'); 
      }
    };
    
    fetchIp();
  }, []);

  const totalAttempts = attempts.length + genAttempts.length;
  
  const attemptsPerDoor = attempts.reduce((acc, attempt) => {
    acc[attempt.doorId] = (acc[attempt.doorId] || 0) + 1;
    return acc;
  }, {});

  const sanitize = (str) => {
    if (!str) return '';
    return str.replace(/[<>]/g, '').trim();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.ruleGuess.trim() || !formData.age) return;

    // 2. FIXED: Age minimum validation
    const ageNumber = parseInt(formData.age, 10);
    if (ageNumber < 12) {
      alert("You must be at least 12 years old to participate.");
      return; 
    }

    setIsSubmitting(true);

    const generatedCode = generateCompletionCode();
    setCompletionCode(generatedCode);

    const fullPayload = {
      session_id: sessionId, 
      ip_address: userIp,
      completion_code: generatedCode, 
      rule_guess: sanitize(formData.ruleGuess),
      comments: sanitize(formData.comments),
      age: ageNumber, // Send as a number, not text
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
              {/* 3. FIXED: Age input changed to strictly allow numbers up to 90 */}
              <input 
                type="number" 
                min="12"
                max="90"
                required
                value={formData.age}
                onChange={(e) => {
                  let val = e.target.value;
                  if (val === '') {
                    setFormData({...formData, age: ''});
                    return;
                  }
                  if (!/^\d+$/.test(val)) return;
                  if (parseInt(val, 10) > 90) val = '90';
                  setFormData({...formData, age: val});
                }}
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
              userSelect: 'all' 
            }}>
              {completionCode}
            </code>
          </div>
        </div>
      )}

      <hr style={{margin: '30px 0', opacity: 0.2}} />

      <div className="boilerplate-text">
        <p>Thank you! This puzzle is part of a research study on how people infer logical rules.</p>
        <p>In this study we tested your ability to recover from misleading instructions.</p>
        <p><strong>The correct answer to the puzzle: </strong>The doors open when the number on the key matches the number of shapes on the door</p>
        <p>If you have any questions, contact: <strong>farzin.ahmadi@dal.ca</strong></p>
      </div>
    </div>
  );
}

export default ResultsScreen;