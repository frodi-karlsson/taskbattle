// These are the tasks that the user has entered, parsed
let tasks = [];

// These are all the possible battles that can be fought
// A vs B is the same as B vs A
let battles = [];

// This is the battle we're on
let battleIndex = 0;

// Map of task index to score
let taskScores = {};

// Fills the tasks array with the tasks that the user has entered
function populateTasks() {
  tasks = [
    ...new Set(
      taskTextInput.value
        .split(/,|\n/)
        .map((task) => task.trim())
        .filter((task) => task.length)
    ),
  ];
}

// Fisher-Yates shuffle
function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

// Generates task A vs task B battles for every pair of tasks
function generateBattles() {
  battles = [];
  for (let i = 0; i < tasks.length; i++) {
    for (let j = i + 1; j < tasks.length; j++) {
      battles.push([i, j]);
    }
  }
  shuffle(battles);
}

// Adds a message that all battles have been fought and disables the buttons
function finish() {
  taskBattle.classList.add("fadeOut");
  taskBattle.classList.remove("fadeIn");
  taskResult.classList.add("fadeIn");
  taskResult.classList.remove("fadeOut");
  populateResult();
}

// This resets and repopulates according to the text input
function reset() {
  taskInput.classList.remove("fadeOut", "fadeIn");
  [taskBattle, taskResult].forEach((element) => {
    element.classList.add("fadeOut");
    element.classList.remove("fadeIn");
  });
  populateTasks();
  generateBattles();
  taskScores = {};
  battleIndex = 0;
}

// This gets the next battle
function getNextBattle() {
  if (battleIndex >= battles.length) {
    return null;
  }
  const battle = battles[battleIndex];
  battleIndex++;
  return battle;
}

// This updates the UI with the next battle
function updateBattleUI() {
  const battle = getNextBattle();
  if (!battle) {
    taskCompetitorA.removeEventListener("click", aClickListener);
    taskCompetitorB.removeEventListener("click", bClickListener);
    finish();
    return;
  }
  taskCompetitorA.textContent = tasks[battle[0]];
  taskCompetitorB.textContent = tasks[battle[1]];
}

// This sets the score for the given winner
function setScore(winner) {
  taskScores[winner] = taskScores[winner] ? taskScores[winner] + 1 : 1;
}

// This populates the result screen, sorting by score
function populateResult() {
  const sortedTasks = [...tasks]
    .map((_, i) => i)
    // Sort by score in descending order
    .sort((a, b) => (taskScores[b] || 0) - (taskScores[a] || 0));
  taskResultTable.innerHTML = "";
  sortedTasks.forEach((task) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${tasks[task]}</td>
      <td>${taskScores[task] || 0}</td>
      `;
    taskResultTable.appendChild(row);
  });
}

function aClickListener() {
  setScore(battles[battleIndex - 1][0]);
  updateBattleUI();
}

function bClickListener() {
  setScore(battles[battleIndex - 1][1]);
  updateBattleUI();
}

// This is the main function that runs the battle
function runBattle() {
  reset();
  taskInput.classList.add("fadeOut");
  taskInput.classList.remove("fadeIn");
  taskBattle.classList.add("fadeIn");
  taskBattle.classList.remove("fadeOut");
  updateBattleUI();
  taskCompetitorA.addEventListener("click", aClickListener);
  taskCompetitorB.addEventListener("click", bClickListener);
}

// Reset button
const resetButton = document.getElementById("reset");
resetButton.addEventListener("click", reset);

// Task Input
const taskInput = document.getElementById("taskInput");
const taskTextInput = document.getElementById("taskTextInput");
const taskInputButton = document.getElementById("button");

// Task Battle
const taskBattle = document.getElementById("taskBattle");
const taskCompetitorA = document.getElementById("taskCompetitorA");
const taskCompetitorB = document.getElementById("taskCompetitorB");

// Task Result
const taskResult = document.getElementById("taskResult");
const taskResultTable = document.getElementById("taskResultTableBody");

// Set the button to run the battle
taskInputButton.addEventListener("click", runBattle);
