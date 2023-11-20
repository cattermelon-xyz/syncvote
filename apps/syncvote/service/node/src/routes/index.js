const MissionRouter = require('./MissionRouter');
const VoteRouter = require('./VoteRouter');
const ArweaveRouter = require('./ArweaveRouter');
const TopicRouter = require('./TopicRouter');

const routes = (app) => {
  app.use('/api/mission', MissionRouter);
  app.use('/api/vote', VoteRouter);
  app.use('/api/arweave', ArweaveRouter);
  app.use('/api/topic', TopicRouter);
};

module.exports = routes;
