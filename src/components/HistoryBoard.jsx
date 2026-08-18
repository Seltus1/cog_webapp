import React, { useEffect, useRef } from 'react';

function HistoryBoard({ attempts, keys, doors }) {
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [attempts]);

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
        <span className="history-board-count">{attempts.length}</span>
      </div>
      <div className="history-board-list" ref={listRef}>
        {attempts.length === 0 && (
          <div className="history-board-empty">No attempts yet</div>
        )}
        {attempts.map((a, idx) => {
          const keyAsset = keyAssetById(a.keyId);
          const doorAsset = doorAssetById(a.doorId);
          const opened = a.correct;
          return (
            <div
              key={idx}
              className={`history-row ${opened ? 'is-correct' : 'is-incorrect'}`}
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
              <span className={`history-row-result ${opened ? 'ok' : 'no'}`}>
                {opened ? '✔️' : '❌'}
              </span>
            </div>
          );
        })}
      </div>
    </aside>
  );
}

export default HistoryBoard;
