require('dotenv').config(); 
const app = require('./app');
const connectMongo = require('./config/db.mongo');
require('./config/db.postgres'); 

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectMongo();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
  });
};

startServer();