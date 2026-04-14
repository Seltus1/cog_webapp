import React, { useRef, useEffect } from 'react';

function Key({ item, isSelected, onSelect }) {
  const dragCanvasRef = useRef(null);

  useEffect(() => {
    const img = new Image();
    img.src = '/src/assets/cursor/key.png';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const size = 110; // Desired drag icon size
      canvas.width = size;
      canvas.height = size;

      // Draw and resize
      ctx.drawImage(img, 0, 0, size, size);

      // Simple "Background Removal" for JPEGs (makes near-white pixels transparent)
      const imageData = ctx.getImageData(0, 0, size, size);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        // If pixel is very bright (near white), set alpha to 0
        if (data[i] > 240 && data[i+1] > 240 && data[i+2] > 240) {
          data[i + 3] = 0;
        }
      }
      ctx.putImageData(imageData, 0, 0);
      dragCanvasRef.current = canvas;
    };
  }, []);

  const handleDragStart = (e) => {
    e.dataTransfer.setData('keyId', item.id);
    
    if (dragCanvasRef.current) {
      // Center the 60px icon on the cursor
      e.dataTransfer.setDragImage(dragCanvasRef.current, 30, 30);
    }
    
    onSelect(item.id);
  };

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
