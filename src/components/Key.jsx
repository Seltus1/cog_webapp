import React from 'react';

function Key({ item, isSelected, onSelect }) {
  const handleDragStart = (e) => {
    e.dataTransfer.setData('keyId', item.id);
    onSelect(item.id);
  };

  // Resolve the asset path
  const assetPath = `/src/assets/${item.name}.svg`;

  return (
    <div 
      className={`key ${isSelected ? 'selected' : ''}`} 
      onClick={() => onSelect(item.id)}
      draggable
      onDragStart={handleDragStart}
    >
      <img src={assetPath} alt={item.name} className="key-image" />
    </div>
  );
}

export default Key;
