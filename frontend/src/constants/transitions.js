// This file defines a constant object that maps status IDs
// to their corresponding names in the container lifecycle management system.
const TRANSITIONS = {
  1: [2],      // Receiving -> Cleaning
  2: [3],      // Cleaning -> Clean Storage
  3: [4],      // Clean Storage -> Production
  4: [2],   // Production -> Cleaning 
  5: [],       // Retired
};

export default TRANSITIONS;