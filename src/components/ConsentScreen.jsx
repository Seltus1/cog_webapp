import React from 'react';

function ConsentScreen({ onConsent }) {
  return (
    <div className="welcome-screen consent-screen" style={{ textAlign: 'left', maxWidth: '800px' }}>
      <h1>Informed Consent</h1>
      <p>This study is open to any adult with normal or corrected to normal vision and motor control.</p>
      <p>Participation in this study is entirely voluntary. You can withdraw from the study at any time, without giving a reason. If you wish to withdraw, simply close the webpage.</p>
      <p>If you decide to participate, you will play an interactive puzzle game and answer brief demographic questions. Your interactions with the web-page will be recorded (mouse movement and clicks) and analyzed. Your participation will not involve any audio or video recording. This study is conducted online, and can be completed at any time.</p>
      <p>There are no significant risks and no direct benefits beyond compensation for your participation.</p>
      <p>The results of this study may be summarised in published articles, reports and presentations. All data analysis is be anonymized: it does not include any information that could allow anyone to identify you. Your data will be referred to by a unique participant number rather than by name. Your data will only be viewed by the researcher/research team.</p>
      <p>If you have any further questions about the study or encounter technical problem with the webpage, please contact <strong>mkryven@mit.edu</strong>.</p>
      <p>By proceeding with the study, I consent to participate in this research.</p>
      
      <button className="start-button" onClick={onConsent}>
        I Consent, Let's Proceed
      </button>
    </div>
  );
}

export default ConsentScreen;
