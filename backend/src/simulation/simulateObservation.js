// src/simulation/simulateObservation.js

const observationService = require("../services/observationService");

// ------------------------------------------------
// Simulation User
// ------------------------------------------------
const simulationUser = {
  id: 4,
  username: "simulation",
  role: "USER"
};

// ------------------------------------------------
// Observation Definitions
// ------------------------------------------------
const observations = [

  {
    description: "Residue",
    is_breach: true,
    weight: 40
  },

  {
    description: "Swab Required",
    is_breach: false,
    weight: 30
  },

  {
    description: "Cosmetic",
    is_breach: false,
    weight: 20
  },

  {
    description: "Label Missing",
    is_breach: false,
    weight: 8
  },

  {
    description: "Damage",
    is_breach: true,
    weight: 2
  }

];
// ------------------------------------------------
// Select a weighted observation
// ------------------------------------------------
function getRandomObservation() {

  const totalWeight =
    observations.reduce(
      (total, observation) => total + observation.weight,
      0
    );

  let random =
    Math.random() * totalWeight;

  for (const observation of observations) {

    random -= observation.weight;

    if (random <= 0) {
      return observation;
    }

  }

  return observations[0];

}

// ------------------------------------------------
// Simulate Observation
// ------------------------------------------------
async function simulateObservation(container) {

  // 5% chance of an observation
  const chance = Math.random();

  if (chance > 0.5) {

    return null;

  }

  // Pick a random observation
  const observation = getRandomObservation();

  // Create observation using the existing service
  const observationId =
    await observationService.createObservation(
      {
        container_id: container.id,
        description: observation.description,
        is_breach: observation.is_breach
      },
      simulationUser
    );

  return {

    message: "Observation created.",

    observationId,

    container: container.container_code,

    description: observation.description,

    breach: observation.is_breach

  };

}


module.exports = {
  simulateObservation
};