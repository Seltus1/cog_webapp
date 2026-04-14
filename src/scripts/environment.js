export const colors = ['red', 'blue', 'green', 'yellow', 'purple'];
export const symbols = ['●', '▲', '■', '★', '◆'];
export const numbers = [1, 2, 3, 4, 5];

export function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

export function generateAppItems() {
  // Generate 13 keys
  // Each key has a color and either a symbol or a number
  const keys = [];
  let idCounter = 1;
  
  // We want to cover all 5 colors. 13 keys / 5 colors ~= 2.6 keys per color.
  // Let's distribute them roughly equally.
  const colorDistribution = [3, 3, 3, 2, 2]; // Total 13
  const shuffledColors = shuffle(colors);

  shuffledColors.forEach((color, index) => {
    const count = colorDistribution[index];
    for (let i = 0; i < count; i++) {
      const isSymbol = Math.random() > 0.5;
      keys.push({
        id: idCounter++,
        color: color,
        symbol: isSymbol ? symbols[Math.floor(Math.random() * symbols.length)] : null,
        number: !isSymbol ? numbers[Math.floor(Math.random() * numbers.length)] : null
      });
    }
  });

  // Generate 5 doors
  // For now doors have color, symbol and number
  const doors = shuffle(colors).map((color, i) => ({
    id: i + 1,
    color,
    symbol: symbols[Math.floor(Math.random() * symbols.length)],
    number: numbers[Math.floor(Math.random() * numbers.length)],
    isOpen: false
  }));

  // Generalization door
  const genDoor = {
    id: 99,
    color: colors[Math.floor(Math.random() * colors.length)],
    symbol: symbols[Math.floor(Math.random() * symbols.length)],
    number: numbers[Math.floor(Math.random() * numbers.length)],
    isOpen: false
  };

  return { keys: shuffle(keys), doors, genDoor };
}