import React from 'react';

const DoorIcon = ({ type, size = 40, color = "white" }) => {
  const getIconContent = () => {
    switch (type) {
      case 'moon':
        return <path d="M40 20 A22 22 0 1 0 62 42 A17 17 0 1 1 40 20 Z" />;
      case 'cloud':
        return <path d="M22 50 Q22 44 28 44 Q27 38 33 37 Q34 30 41 30 Q48 30 50 36 Q56 36 56 43 Q60 43 60 48 Q60 53 55 53 L26 53 Q22 53 22 50 Z" />;
      case 'diamond':
        return <polygon points="40,16 64,40 40,64 16,40" />;
      case 'heart':
        return <path d="M40 57 C40 57 20 44 20 32 C20 25 25 20 32 22 C35.5 23 38 26 40 29 C42 26 44.5 23 48 22 C55 20 60 25 60 32 C60 44 40 57 40 57 Z" />;
      case 'triangle':
        return <polygon points="40,18 64,62 16,62" />;
      case 'star':
        return <polygon points="40,18 45.9,34.8 63.5,34.8 49.8,44.7 55.7,61.5 40,51.6 24.3,61.5 30.2,44.7 16.5,34.8 34.1,34.8" />;
      case 'arrow':
        return <polygon points="20,32 48,32 48,22 62,40 48,58 48,48 20,48" />;
      default:
        return null;
    }
  };

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 80 80" 
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      {getIconContent()}
    </svg>
  );
};

export default DoorIcon;
