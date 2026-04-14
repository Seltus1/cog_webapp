/**
 * The Oracle knows when a box should open.
 * ML term for ground truth.
 */
export const oracle = {
  /**
   * Evaluates if a key opens a door based on the current hypothesis.
   * Hypothesis: "Colors match"
   * 
   * @param {Object} key - The key being used.
   * @param {Object} door - The door being tried.
   * @returns {boolean} - True if the door should open.
   */
  shouldOpen: (key, door) => {
    // Current hypothesis: for now colours match
    return key.color === door.color;
  }
};
