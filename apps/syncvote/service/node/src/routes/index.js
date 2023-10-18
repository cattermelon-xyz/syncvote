const MissionRouter = require('./MissionRouter');
const VoteRouter = require('./VoteRouter');
const ArweaveRouter = require('./ArweaveRouter');

const routes = (app) => {
  app.use('/api/mission', MissionRouter);
  app.use('/api/vote', VoteRouter);
  app.use('/api/arweave', ArweaveRouter);
};

module.exports = routes;
