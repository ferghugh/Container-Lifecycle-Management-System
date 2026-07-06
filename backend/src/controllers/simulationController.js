// src/controllers/simulationController.js

const simulationService = require("../services/SimulationService");

async function runSimulation(req, res) {

  try {

    const result = await simulationService.runSimulation();

    res.json(result);

  } catch (err) {

    res.status(400).json({
      message: err.message
    });

  }

}
async function runSimulationCycles(req, res) {

  try {
console.log(req.body);
const cycles =
  req.body && req.body.cycles
    ? Number(req.body.cycles)
    : 10;

    const result =
      await simulationService.runSimulationCycles(cycles);

    res.json(result);

  } catch (err) {

    res.status(400).json({
      message: err.message
    });

  }

}

module.exports = {
  runSimulation,
    runSimulationCycles,
};