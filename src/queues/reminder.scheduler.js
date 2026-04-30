const reminderQueue = require('./reminder.queue');

const scheduleReminder = async (task) => {
  if (!task.dueDate) return;

  const dueDate = new Date(task.dueDate);
  const now = new Date();
  const reminderTime = new Date(dueDate.getTime() - 60 * 60 * 1000);
  const delay = reminderTime.getTime() - now.getTime();

  // DEBUG — remove after testing
  console.log('scheduleReminder called for:', task.title);
  console.log('Due date:', dueDate.toISOString());
  console.log('Reminder time:', reminderTime.toISOString());
  console.log('Now:', now.toISOString());
  console.log('Delay (ms):', delay);

  if (delay <= 0) {
    console.log(`Reminder skipped for task ${task._id} — due date too soon`);
    return;
  }

  await cancelReminder(task._id.toString());

  await reminderQueue.add(
    'send-reminder',
    {
      taskId: task._id.toString(),
      title: task.title,
      userId: task.userId,
      dueDate: task.dueDate,
    },
    {
      delay,
      jobId: `reminder-${task._id}`,
      removeOnComplete: true,
      removeOnFail: false,
    }
  );

  console.log(`Reminder scheduled for task "${task.title}" at ${reminderTime.toISOString()}`);
};

const cancelReminder = async (taskId) => {
  try {
    const jobId = `reminder-${taskId}`;
    const job = await reminderQueue.getJob(jobId);
    if (job) {
      await job.remove();
      console.log(`Reminder cancelled for task ${taskId}`);
    }
  } catch (err) {
    // Job may not exist — that's fine
  }
};

module.exports = { scheduleReminder, cancelReminder };