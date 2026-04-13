export const colors = ['red', 'blue', 'green', 'yellow', 'purple'];
export const symbols = ['●', '▲', '■', '★', '◆'];
export const numbers = [1, 2, 3, 4, 5];

export function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

export function generateAppItems() {
  const sColorsKeys = shuffle(colors);
  const sSymbolsKeys = shuffle(symbols);
  const sNumbersKeys = shuffle(numbers);
  
  const keys = sColorsKeys.map((color, i) => ({
    id: i + 1,
    color,
    symbol: sSymbolsKeys[i],
    number: sNumbersKeys[i]
  }));

  const sColorsDoors = shuffle(colors);
  const sSymbolsDoors = shuffle(symbols);
  const sNumbersDoors = shuffle(numbers);
  
  const initialDoors = sColorsDoors.map((color, i) => ({
    id: i + 1,
    color,
    symbol: sSymbolsDoors[i],
    number: sNumbersDoors[i]
  }));

  // Random 1:1 mapping of keys to doors without duplicates
  // This can be changed later based on some hypothesis
  const shuffledKeyIds = shuffle(keys.map(k => k.id));
  const doors = initialDoors.map((door, i) => ({
    ...door,
    correctKeyId: shuffledKeyIds[i],
    isOpen: false
  }));

  let genDoor;
  // Generate a random door for now
  while (true) {
    genDoor = {
      id: 9,
      color: colors[Math.floor(Math.random() * colors.length)],
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      number: numbers[Math.floor(Math.random() * numbers.length)],
      correctKeyId: keys[Math.floor(Math.random() * keys.length)].id,
      isOpen: false
    };
    const isDuplicate = doors.some(d => d.color === genDoor.color && d.symbol === genDoor.symbol && d.number === genDoor.number);
    if (!isDuplicate) break;
  }

  return { keys, doors, genDoor };
}