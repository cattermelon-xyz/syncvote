const express = require('express');
const dotenv = require('dotenv');
const routes = require('./routes');
const cors = require('cors');
const bodyParser = require('body-parser');
var CronJob = require('cron').CronJob;
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

// console.log('Before job instantiation');
// const job = new CronJob('*/15 * * * * *', function () {
//   const d = new Date();
//   console.log('Time:', d);
// });

// console.log('After job instantiation');
// console.log(job);
// job.start();

app.listen(port, () => {
  console.log('Server is running in port: ', +port);
});
