import React from 'react';

function Key({ item, isSelected, onSelect }) {
  return (
    <div 
      className={`key ${isSelected ? 'selected' : ''}`} 
      onClick={onSelect}
      style={{ borderColor: item.color }}
    >
      <div className="key-visual" style={{ color: item.color }}>
        <span className="key-symbol">{item.symbol}</span>
        <span className="key-number">{item.number}</span>
      </div>
    </div>
  );
}

export default Key;
