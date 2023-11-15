const MissionRouter = require('./MissionRouter');
const VoteRouter = require('./VoteRouter');
const TopicRouter = require('./TopicRouter');
const PostRouter = require('./PostRouter');

const routes = (app) => {
  app.use('/api/mission', MissionRouter);
  app.use('/api/vote', VoteRouter);
  app.use('/api/topic', TopicRouter);
  app.use('/api/post', PostRouter);
};

module.exports = routes;
