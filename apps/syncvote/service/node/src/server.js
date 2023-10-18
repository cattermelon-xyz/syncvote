const express = require('express');
const dotenv = require('dotenv');
const routes = require('./routes');
const cors = require('cors');
const bodyParser = require('body-parser');
const cron = require('node-cron');
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));
app.use(bodyParser.json());
app.use(cookieParser());

routes(app);

cron.schedule('*/15 * * * * *', function () {
  console.log('---------------------');
  console.log('running a task every 15 seconds');
});

app.listen(port, () => {
  console.log('Server is running in port: ', +port);
});
