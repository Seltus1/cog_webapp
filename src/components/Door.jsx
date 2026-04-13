import React from 'react';

function Door({ door, onOpen }) {
  return (
    <div className={`door ${door.isOpen ? 'open' : 'closed'}`}>
      <div className="door-visual" style={{ backgroundColor: door.isOpen ? '#ddd' : door.color }}>
        <span className="door-symbol">{door.symbol}</span>
        <span className="door-number">{door.number}</span>
      </div>
      <button onClick={onOpen} disabled={door.isOpen}>
        {door.isOpen ? 'Opened' : 'Open'}
      </button>
    </div>
  );
}

export default Door;
