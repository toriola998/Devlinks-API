require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();
const connectDB = require('./db/connect');

// packages
const cors = require('cors');
const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');


app.set('trust proxy', 1);
app.use(
   rateLimiter({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
   }),
);
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(xss());

const port = process.env.PORT || 5000;
const start = async () => {
   try {
      await connectDB(process.env.MONGO_URI);
      app.listen(port, () => console.log(`Server is listening on port ${port}...`));
   } catch (error) {
      console.log(error);
   }
};

start();