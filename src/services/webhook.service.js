const axios = require('axios');

const WEBHOOK_URL = process.env.WEBHOOK_URL;
const MAX_RETRIES = 3;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const sendWebhook = async (payload, attempt = 1) => {
  if (!WEBHOOK_URL) {
    console.log('No WEBHOOK_URL configured — skipping webhook');
    return;
  }

  try {
    await axios.post(WEBHOOK_URL, payload, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 5000, 
    });
    console.log(`Webhook sent successfully on attempt ${attempt}`);
  } catch (err) {
    console.error(`Webhook attempt ${attempt} failed:`, err.message);

    if (attempt < MAX_RETRIES) {
      const delay = Math.pow(2, attempt - 1) * 1000; 
      console.log(`Retrying webhook in ${delay}ms...`);
      await wait(delay);
      return sendWebhook(payload, attempt + 1);
    }

    console.error(`Webhook failed after ${MAX_RETRIES} attempts. Giving up.`);
  }
};

const sendTaskCompletedWebhook = async (task) => {
  const payload = {
    event: 'TASK_COMPLETED',
    taskId: task._id.toString(),
    title: task.title,
    userId: task.userId,
    completedAt: new Date().toISOString(),
  };

  console.log('Sending task completed webhook...');

  sendWebhook(payload).catch((err) => {
    console.error('Webhook error:', err.message);
  });
};

module.exports = { sendTaskCompletedWebhook };