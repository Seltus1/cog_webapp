export const colors = ['red', 'pink', 'cream', 'purple', 'teal', 'grey', 'orange', 'green', 'blue', 'yellow', 'white'];

// Map symbols to readable characters or emojis
export const symbolMap = {
  moon: '🌙',
  cloud: '☁️',
  diamond: '💎',
  heart: '❤️',
  triangle: '▲',
  star: '⭐',
  arrow: '🏹',
  none: ''
};

export function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

export function generateAppItems() {
  // Hardcoded Boxes per PI Prompt & PDF
  const doors = [
    { id: 1, color: 'red', symbol: 'moon', number: 1, isOpen: false },
    { id: 2, color: 'pink', symbol: 'cloud', number: 2, isOpen: false },
    { id: 3, color: 'cream', symbol: 'diamond', number: 4, isOpen: false },
    { id: 4, color: 'purple', symbol: 'heart', number: 3, isOpen: false },
    { id: 5, color: 'teal', symbol: 'triangle', number: 5, isOpen: false }
  ];

  // Hardcoded 13 Keys per PI Prompt
  const keys = [
    { id: 101, name: 'red1', color: 'red', number: 1, symbol: null },
    { id: 102, name: 'pink6', color: 'pink', number: 6, symbol: null },
    { id: 103, name: 'grey2', color: 'grey', number: 2, symbol: null },
    { id: 104, name: 'greycloud', color: 'grey', number: null, symbol: 'cloud' },
    { id: 105, name: 'orange4', color: 'orange', number: 4, symbol: null },
    { id: 106, name: 'green3', color: 'green', number: 3, symbol: null },
    { id: 107, name: 'bluestar', color: 'blue', number: null, symbol: 'star' },
    { id: 108, name: 'yellow5', color: 'yellow', number: 5, symbol: null },
    { id: 109, name: 'greenheart', color: 'green', number: null, symbol: 'heart' },
    { id: 110, name: 'white7', color: 'white', number: 7, symbol: null },
    { id: 111, name: 'triangleyellow', color: 'yellow', number: null, symbol: 'triangle' },
    { id: 112, name: 'diamondorange', color: 'orange', number: null, symbol: 'diamond' },
    { id: 113, name: 'purplearrow', color: 'purple', number: null, symbol: 'arrow' }
  ];

  // Generalization door - random but following specs
  const genDoor = {
    id: 99,
    color: 'orange', // New color not in main 5
    symbol: 'star',
    number: 3,
    isOpen: false
  };

  return { 
    keys: shuffle(keys), 
    doors, // Keep order same as specified
    genDoor 
  };
}
