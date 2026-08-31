import React, { useEffect, useRef } from 'react';

function HistoryBoard({ attempts, keys, doors }) {
  const listRef = useRef(null);
  const correctAttempts = attempts.filter((a) => a.correct);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [correctAttempts]); 

  const keyAssetById = (id) => {
    const k = keys.find((x) => x.id === id);
    return k ? k.asset : null;
  };
  
  const doorAssetById = (id) => {
    const d = doors.find((x) => x.id === id);
    return d ? d.asset : null;
  };

  return (
    <aside className="history-board" aria-label="Attempt history">
      <div className="history-board-header">
        <h3>History</h3>
        <span className="history-board-count">{correctAttempts.length}</span>
      </div>
      <div className="history-board-list" ref={listRef}>
        {correctAttempts.length === 0 && (
          <div className="history-board-empty">No correct attempts yet</div>
        )}
        
        {correctAttempts.map((a, idx) => {
          const keyAsset = keyAssetById(a.keyId);
          const doorAsset = doorAssetById(a.doorId);
          
          return (
            <div
              key={idx}
              className="history-row is-correct"
            >
              <span className="history-row-num">{idx + 1}</span>
              <span className="history-row-icon">
                {keyAsset ? (
                  <img src={keyAsset} alt={a.keyName} className="history-icon" />
                ) : (
                  <span className="history-icon-fallback">{a.keyName}</span>
                )}
              </span>
              <span className="history-row-arrow">→</span>
              <span className="history-row-icon">
                {doorAsset ? (
                  <img src={doorAsset} alt={a.doorName} className="history-icon" />
                ) : (
                  <span className="history-icon-fallback">{a.doorName}</span>
                )}
              </span>
              <span className="history-row-result ok">
                ✔️
              </span>
            </div>
          );
        })}
      </div>
    </aside>
  );
}

export default HistoryBoard;