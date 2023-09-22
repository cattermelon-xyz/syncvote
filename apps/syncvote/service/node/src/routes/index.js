const MissionRouter = require('./MissionRouter');

const routes = (app) => {
  app.use('/api/mission', MissionRouter);
};

module.exports = routes;
