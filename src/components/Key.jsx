import React from 'react';

function Key({ item, isSelected, onSelect }) {
  const handleDragStart = (e) => {
    e.dataTransfer.setData('keyId', item.id);
    onSelect(item.id);
  };

  return (
    <div 
      className={`key ${isSelected ? 'selected' : ''}`} 
      onClick={() => onSelect(item.id)}
      draggable
      onDragStart={handleDragStart}
      style={{ borderColor: item.color }}
    >
      <div className="key-visual" style={{ color: item.color }}>
        {item.symbol && <span className="key-symbol">{item.symbol}</span>}
        {item.number && <span className="key-number">{item.number}</span>}
      </div>
    </div>
  );
}

export default Key;
