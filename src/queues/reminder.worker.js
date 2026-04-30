const { Worker } = require('bullmq');
const axios = require('axios');

const connection = {
  host: 'localhost',
  port: 6379,
};

const WEBHOOK_URL = process.env.WEBHOOK_URL || null;

const worker = new Worker(
  'task-reminders',
  async (job) => {
    const { taskId, title, userId, dueDate } = job.data;

   
    console.log('----------------------------------');
    console.log('REMINDER: Task due soon!');
    console.log(`Task ID  : ${taskId}`);
    console.log(`Title    : ${title}`);
    console.log(`User ID  : ${userId}`);
    console.log(`Due Date : ${dueDate}`);
    console.log('----------------------------------');

    // Optionally send to a webhook
    if (WEBHOOK_URL) {
      try {
        await axios.post(WEBHOOK_URL, {
          type: 'TASK_REMINDER',
          taskId,
          title,
          userId,
          dueDate,
          triggeredAt: new Date().toISOString(),
        });
        console.log('Reminder webhook sent successfully');
      } catch (err) {
        console.error('Reminder webhook failed:', err.message);
      }
    }
  },
  { connection }
);

worker.on('completed', (job) => {
  console.log(`Reminder job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  console.error(`Reminder job ${job.id} failed:`, err.message);
});

module.exports = worker;