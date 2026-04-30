const { Queue } = require('bullmq');

const connection = {
  host: 'localhost',
  port: 6379,
};

const reminderQueue = new Queue('task-reminders', { connection });

// Test connection on startup
reminderQueue.on('error', (err) => {
  console.error('Redis Queue connection error:', err.message);
});

reminderQueue.waitUntilReady().then(() => {
  console.log('Redis Queue connected and ready');
}).catch((err) => {
  console.error('Redis Queue failed to connect:', err.message);
});

module.exports = reminderQueue;