const mongoose = require('mongoose');
const dotenv =require('dotenv');

// IMPORTANT: Make sure you have these models created and exported.
// The paths below are assumed. Adjust them if your structure is different.
import { User } from './models/User.js';
import { Project } from './models/Project.js';
import { Task } from './models/Task.js';


// Load environment variables from .env file
dotenv.config({ path: __dirname + '/../.env' });

const seedDatabase = async () => {
  try {
    // --- 1. CONNECT TO DATABASE ---
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    // --- 2. CLEAR EXISTING DATA ---
    // Order matters here to avoid reference errors if you have them.
    await Task.deleteMany({});
    await Project.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing data.');

    // --- 3. CREATE SAMPLE USERS ---
    // In a real app, passwords should be hashed!
    const users = await User.insertMany([
      { name: 'Alice', email: 'alice@example.com', passwordHash: 'password123' },
      { name: 'Bob', email: 'bob@example.com', passwordHash: 'password123' },
    ]);
    console.log(`${users.length} users created.`);

    const [alice, bob] = users;

    // --- 4. CREATE SAMPLE PROJECTS ---
    const projects = await Project.insertMany([
      {
        title: 'Frontend Redesign',
        description: 'Complete overhaul of the user interface.',
        owner: alice._id,
      },
      {
        title: 'Backend API Optimization',
        description: 'Improve performance and scalability of the API.',
        owner: bob._id,
      },
    ]);
    console.log(`${projects.length} projects created.`);

    const [frontendProject, backendProject] = projects;

    // --- 5. CREATE SAMPLE TASKS ---
    const tasks = await Task.insertMany([
      // Tasks for Frontend Redesign
      { title: 'Design new wireframes', project: frontendProject._id, assignee: alice._id, status: 'done' },
      { title: 'Develop component library', project: frontendProject._id, assignee: alice._id, status: 'in_progress' },
      { title: 'Implement new homepage layout', project: frontendProject._id, assignee: alice._id, status: 'todo' },

      // Tasks for Backend API Optimization
      { title: 'Analyze current performance bottlenecks', project: backendProject._id, assignee: bob._id, status: 'done' },
      { title: 'Implement caching for frequent queries', project: backendProject._id, assignee: bob._id, status: 'in_progress' },
      { title: 'Refactor authentication service', project: backendProject._id, status: 'todo' }, // Unassigned task
    ]);
    console.log(`${tasks.length} tasks created.`);

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1); // Exit with failure
  } finally {
    // --- 6. DISCONNECT ---
    await mongoose.disconnect();
    console.log('MongoDB disconnected.');
  }
};

// This allows running the script directly from the command line
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;