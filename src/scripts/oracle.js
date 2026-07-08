export const HYPOTHESES = {
  COLOR_MATCH: 'color_match',    // The misleading instruction: match box and key tag by color
  SHAPE_MATCH: 'shape_match',    // Match the shape on the box to the shape on the key tag
  NUMBER_MATCH: 'number_match',
  NUMBER_MATCH_FUZZY: 'fuzzy_num_70'   // The true rule (PDF): match number of shapes to the key tag number
};

export const oracle = {
  /**
   * Evaluates if a key opens a door based on a specific hypothesis.
   * 
   * @param {Object} key - The key being used.
   * @param {Object} door - The door being tried.
   * @param {string} hypothesis - The hypothesis to use for evaluation.
   * @returns {boolean} - True if the door should open.
   */
  shouldOpen: (key, door, hypothesis) => {
    switch (hypothesis) {
      case HYPOTHESES.COLOR_MATCH:
        // Match boxes and key-tags by colour
        return key.color === door.color;
      
      case HYPOTHESES.SHAPE_MATCH:
        // Match box symbol and key symbol
        return !!key.symbol && key.symbol === door.symbol;
      
      case HYPOTHESES.NUMBER_MATCH:
        // The true rule is to match the number on the key-tag to the box number
        return !!key.number && key.number === door.number;
      
      case HYPOTHESES.NUMBER_MATCH_FUZZY:
        return (!!key.number && key.number === door.number) && (Math.random() < 0.7);
      default:
        console.warn(`Unknown hypothesis: ${hypothesis}. Defaulting to false.`);
        return false;
    }
  }
};
