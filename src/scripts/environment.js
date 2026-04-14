export const colors = ['red', 'pink', 'cream', 'purple', 'teal', 'grey', 'orange', 'green', 'blue', 'yellow', 'white'];

export const symbolMap = {
  moon: '🌙',
  cloud: '☁️',
  diamond: '💎',
  heart: '❤️',
  triangle: '▲',
  star: '⭐',
  arrow: '🏹',
  square: '■',
  circle: '●',
  none: ''
};

export function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

export function generateAppItems() {
  // Phase 1 Doors
  const doors = [
    { id: 1, color: 'red', symbol: 'moon', number: 1, isOpen: false, asset: '/src/assets/doors/red_door.svg' },
    { id: 2, color: 'pink', symbol: 'cloud', number: 2, isOpen: false, asset: '/src/assets/doors/pink_door.svg' },
    { id: 3, color: 'cream', symbol: 'diamond', number: 4, isOpen: false, asset: '/src/assets/doors/cream_door.svg' },
    { id: 4, color: 'purple', symbol: 'heart', number: 3, isOpen: false, asset: '/src/assets/doors/purple_door.svg' },
    { id: 5, color: 'teal', symbol: 'triangle', number: 5, isOpen: false, asset: '/src/assets/doors/teal_door.svg' }
  ];

  // Phase 1 Keys
  const keys = [
    { id: 101, name: 'red1', color: 'red', number: 1, symbol: null, asset: '/src/assets/red1.svg' },
    { id: 102, name: 'pink6', color: 'pink', number: 6, symbol: null, asset: '/src/assets/pink6.svg' },
    { id: 103, name: 'grey2', color: 'grey', number: 2, symbol: null, asset: '/src/assets/grey2.svg' },
    { id: 104, name: 'greycloud', color: 'grey', number: null, symbol: 'cloud', asset: '/src/assets/greycloud.svg' },
    { id: 105, name: 'orange4', color: 'orange', number: 4, symbol: null, asset: '/src/assets/orange4.svg' },
    { id: 106, name: 'green3', color: 'green', number: 3, symbol: null, asset: '/src/assets/green3.svg' },
    { id: 107, name: 'bluestar', color: 'blue', number: null, symbol: 'star', asset: '/src/assets/bluestar.svg' },
    { id: 108, name: 'yellow5', color: 'yellow', number: 5, symbol: null, asset: '/src/assets/yellow5.svg' },
    { id: 109, name: 'greenheart', color: 'green', number: null, symbol: 'heart', asset: '/src/assets/greenheart.svg' },
    { id: 110, name: 'white7', color: 'white', number: 7, symbol: null, asset: '/src/assets/white7.svg' },
    { id: 111, name: 'triangleyellow', color: 'yellow', number: null, symbol: 'triangle', asset: '/src/assets/triangleyellow.svg' },
    { id: 112, name: 'diamondorange', color: 'orange', number: null, symbol: 'diamond', asset: '/src/assets/diamondorange.svg' },
    { id: 113, name: 'purplearrow', color: 'purple', number: null, symbol: 'arrow', asset: '/src/assets/purplearrow.svg' }
  ];

  // Generalization Trials
  // Asset names for keys in generalization are sometimes prefixed or in different folder
  const genTrials = [
    {
      door: { id: 201, color: 'blue', symbol: 'square', number: 2, isOpen: false, asset: '/src/assets/generalization/blue_door.svg' },
      keys: [
        { id: 2011, name: 'bluestar', color: 'blue', number: null, symbol: 'star', asset: '/src/assets/bluestar.svg' }, // Color match
        { id: 2012, name: 'lilacsquare', color: 'lilac', number: null, symbol: 'square', asset: '/src/assets/generalization/lilacsquare.svg' }, // Shape match
        { id: 2013, name: 'grey2', color: 'grey', number: 2, symbol: null, asset: '/src/assets/grey2.svg' }, // True rule match
        { id: 2014, name: 'red1', color: 'red', number: 1, symbol: null, asset: '/src/assets/red1.svg' } // Distractor
      ]
    },
    {
      door: { id: 202, color: 'brown', symbol: 'star', number: 3, isOpen: false, asset: '/src/assets/generalization/brown_door.svg' },
      keys: [
        { id: 2021, name: 'brown6', color: 'brown', number: 6, symbol: null, asset: '/src/assets/generalization/brown6.svg' }, // Color match
        { id: 2022, name: 'bluestar', color: 'blue', number: null, symbol: 'star', asset: '/src/assets/bluestar.svg' }, // Shape match
        { id: 2023, name: 'green3', color: 'green', number: 3, symbol: null, asset: '/src/assets/green3.svg' }, // True rule match
        { id: 2024, name: 'yellow5', color: 'yellow', number: 5, symbol: null, asset: '/src/assets/yellow5.svg' } // Distractor
      ]
    },
    {
      door: { id: 203, color: 'green', symbol: 'circle', number: 6, isOpen: false, asset: '/src/assets/generalization/green_door.svg' },
      keys: [
        { id: 2031, name: 'greenheart', color: 'green', number: null, symbol: 'heart', asset: '/src/assets/greenheart.svg' }, // Color match
        { id: 2032, name: 'yellowcircle', color: 'yellow', number: null, symbol: 'circle', asset: '/src/assets/generalization/yellowcircle.svg' }, // Shape match
        { id: 2033, name: 'brown6', color: 'brown', number: 6, symbol: null, asset: '/src/assets/generalization/brown6.svg' }, // True rule match
        { id: 2034, name: 'orange4', color: 'orange', number: 4, symbol: null, asset: '/src/assets/orange4.svg' } // Distractor
      ]
    },
    {
      door: { id: 204, color: 'yellow', symbol: 'diamond', number: 3, isOpen: false, asset: '/src/assets/generalization/yellow_door.svg' },
      keys: [
        { id: 2041, name: 'yellow5', color: 'yellow', number: 5, symbol: null, asset: '/src/assets/yellow5.svg' }, // Color match
        { id: 2042, name: 'diamondorange', color: 'orange', number: null, symbol: 'diamond', asset: '/src/assets/diamondorange.svg' }, // Shape match
        { id: 2043, name: 'green3', color: 'green', number: 3, symbol: null, asset: '/src/assets/green3.svg' }, // True rule match
        { id: 2044, name: 'grey2', color: 'grey', number: 2, symbol: null, asset: '/src/assets/grey2.svg' } // Distractor
      ]
    }
  ];

  return { 
    keys: shuffle(keys), 
    doors, 
    genTrials 
  };
}
