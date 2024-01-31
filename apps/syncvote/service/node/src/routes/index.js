const MissionRouter = require('./MissionRouter');
const VoteRouter = require('./VoteRouter');
const ArweaveRouter = require('./ArweaveRouter');
const TopicRouter = require('./TopicRouter');
const TopicDemoRouter = require('./TopicDemoRouter');
const FinalizeRouter = require('./FinalizeRouter');

const routes = (app) => {
  app.use('/api/mission', MissionRouter);
  app.use('/api/vote', VoteRouter);
  app.use('/api/arweave', ArweaveRouter);
  app.use('/api/topic', TopicRouter);
  app.use('/api/demo', TopicDemoRouter);
  app.use('/api/proposal', FinalizeRouter);
};

module.exports = routes;
