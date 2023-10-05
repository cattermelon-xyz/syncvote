const MissionRouter = require('./MissionRouter');
const VoteRouter = require('./VoteRouter');

const routes = (app) => {
  app.use('/api/mission', MissionRouter);
  app.use('/api/vote', VoteRouter);
};

module.exports = routes;
