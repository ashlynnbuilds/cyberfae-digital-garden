const STORAGE_KEY = "cyberfae-garden-v2";
const OLD_STORAGE_KEY = "cyberfae-garden-v1";
const MAX_GROWTH_ACTIONS = 15;
let garden = { tasks: [], completed: 0 };
const PLANTS = ["strawberry", "chili", "eggplant", "beets", "daisy"];
// Coordinates measured relative to the greenhouse image, with the sprite's bottom at y.
// Plant positions relative to greenhouse image.
// X = horizontal position.
// Y = vertical position of the plant's base.

const POSITIONS = [
  { x: 33, y: 92 }, // Strawberry — left bed
  { x: 53, y: 94 }, // Chili — left bed
  { x: 45, y: 96 }, // Eggplant — central bed
  { x: 59, y: 94 }, // Beets — central bed
  { x: 65, y: 89 }  // Daisy — move left
];

function saveGarden() { localStorage.setItem(STORAGE_KEY, JSON.stringify(garden)); }
function loadGarden() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || localStorage.getItem(OLD_STORAGE_KEY));
    if (saved && Array.isArray(saved.tasks)) {
      garden = { tasks: saved.tasks, completed: Number(saved.completed) || 0 };
    }
  } catch (error) { console.warn("Starting a fresh garden:", error); }
}
function addTask() {
  const input = document.getElementById("taskInput");
  const name = input.value.trim();
  if (!name) return;
  garden.tasks.push({ id: Date.now() + Math.random(), name, done: false });
  input.value = "";
  saveGarden(); renderGarden();
}
function completeTask(id) {
  const task = garden.tasks.find(task => task.id === id);
  if (!task || task.done) return;
  task.done = true;
  garden.completed = Math.min(MAX_GROWTH_ACTIONS, garden.completed + 1);
  saveGarden(); renderGarden();
}
function renderGarden() {
  const list = document.getElementById("taskList");
  list.replaceChildren();
  for (const task of garden.tasks) {
    const item = document.createElement("li");
    const label = document.createElement("span");
    label.textContent = task.name;
    const button = document.createElement("button");
    button.textContent = task.done ? "Completed ✓" : "Complete";
    button.disabled = task.done;
    button.addEventListener("click", () => completeTask(task.id));
    item.append(label, button);
    list.appendChild(item);
  }
  document.getElementById("resetGarden").hidden = garden.completed < MAX_GROWTH_ACTIONS;
  const slots = document.getElementById("plantSlots");
  for (let i = 0; i < PLANTS.length; i++) {
    let slot = document.getElementById(`plant-slot-${i}`);
    if (!slot) {
      slot = document.createElement("div");
      slot.className = "plant-slot";
      slot.id = `plant-slot-${i}`;
      slot.style.left = POSITIONS[i].x + "%";
      slot.style.top = POSITIONS[i].y + "%";
      const img = document.createElement("img");
      slot.appendChild(img);
      slots.appendChild(slot);
    }
    // Every three actions mature one plant; next plant starts as a sprout.
    const stage = Math.max(1, Math.min(4, garden.completed - i * 3 + 1));
    const img = slot.querySelector("img");
    const src = `./assets/${PLANTS[i]}/${stage}.png`;
    if (img.getAttribute("src") !== src) {
      img.src = src;
      img.alt = `${PLANTS[i]} growth stage ${stage}`;
      slot.classList.remove("grow");
      void slot.offsetWidth;
      slot.classList.add("grow");
    }
  }
  document.getElementById("progress").textContent = `${garden.completed} actions completed · ${Math.min(5, Math.floor(garden.completed / 3))}/5 mature`;
}
function resetGarden() {
  if (!window.confirm("Start a new garden? This will clear your completed intentions and plant growth. This cannot be undone.")) return;
  garden = { tasks: [], completed: 0 };
  saveGarden();
  renderGarden();
}

document.addEventListener("DOMContentLoaded", () => {
  loadGarden(); renderGarden();
  document.getElementById("resetGarden").addEventListener("click", resetGarden);
  document.getElementById("clearCompleted").addEventListener("click", () => {
    garden.tasks = garden.tasks.filter(task => !task.done);
    saveGarden(); renderGarden();
  });
  document.getElementById("addTask").addEventListener("click", addTask);
  document.getElementById("taskInput").addEventListener("keydown", event => {
    if (event.key === "Enter") addTask();
  });
});
