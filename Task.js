#!/usr/bin/env node

const fs = require('fs');

// Save JSON file
const save = (data = {}, file = "data.json") => {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing to file:', error);
    throw error;
  }
};

// Load JSON file
const load = (file = "data.json") => {
  try {
    const text = fs.readFileSync(file, 'utf8');
    return JSON.parse(text || '[]');
  } catch (error) {
    console.error('Error reading file:', error);
    return [];
  }
};

// Display operations
const displayOperations = () => {
  const operations = Object.keys(func)
    .map(key => `- ${key}`)
    .join('\n');
  console.log(`\nOperations:\n\n${operations}\n`);
};

const func = {
  // List all tasks
  listAll() {
    console.log(load());
  },

  // List done tasks
  listDone() {
    console.log(load().filter(task => task.done));
  },

  // List undone tasks
  listUndone() {
    console.log(load().filter(task => !task.done));
  },

  // Add a new task
  addTask() {
    const [title, assignee, done] = process.argv.slice(3);
    const data = load();
    const id = data.length;
    data.push({ id, title, assignee, done: done === 'true' });
    save(data);
  },

  // Update title by ID
  updateTitleById() {
    const [id, title] = process.argv.slice(3);
    const data = load();
    if (data[id]) {
      data[id].title = title;
      save(data);
    }
  },

  // Remove task by ID
  removeTaskById() {
    const id = parseInt(process.argv[3], 10);
    const data = load().filter(task => task.id !== id);
    save(data);
  },

  // Mark as done by ID
  markAsDoneById() {
    const id = parseInt(process.argv[3], 10);
    const data = load();
    if (data[id]) {
      data[id].done = true;
      save(data);
    }
  },

  // Mark as undone by ID
  markAsUndoneById() {
    const id = parseInt(process.argv[3], 10);
    const data = load();
    if (data[id]) {
      data[id].done = false;
      save(data);
    }
  }
};

// Get command line arguments
const [command] = process.argv.slice(2);
if (func[command]) {
  func[command]();
} else {
  displayOperations();
}
