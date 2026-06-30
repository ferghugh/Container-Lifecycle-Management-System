//src/constants/stages.js

//define the stages of the container lifecycle
const STAGES = [
    {id:1, name: "Received",sequenceOrder: 1},
    {id:2, name: "Cleaning",sequenceOrder: 2},
    {id:3, name: "Clean Storage",sequenceOrder: 3},
    {id:4, name: "Production",sequenceOrder: 4},
    {id:5, name: "Retired",sequenceOrder: 5}
];

module.exports = STAGES;
