const MissionRouter = require('./MissionRouter');
const CheckpointRouter = require('./CheckpointRouter');
const VoteRecordRouter = require('./VoteRecordRouter');

const routes = (app) => {
  app.use('/api/mission', MissionRouter);
  app.use('/api/checkpoint', CheckpointRouter);
  app.use('/api/vote-record', VoteRecordRouter)
};

module.exports = routes;
