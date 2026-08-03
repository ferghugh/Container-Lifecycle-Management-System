//src/controllers/ProcessStageController.js

const stages = require("../constants/stages");

// Retrieve all stages
async function getAllProcessStages(req, res) {
   // Sort stages by sequenceOrder before sending the response
    const orderedStages = stages.sort((a, b) => a.sequenceOrder - b.sequenceOrder);
    res.json(orderedStages);
};

module.exports = {
    getAllProcessStages,
};