const DISCOURSE_ACTION = {
  CREATE_TOPIC: 'create-topic', //Create topic
  CREATE_POST: 'create-post', //Create post into topic
  UPDATE_TOPIC: 'update-topic', //Update first post of topic
  MOVE_TOPIC: 'move-topic', //Move Topic
};

const SNAPSHOT_ACTION = {
  CREATE_PROPOSAL: 'create-proposal', //Create topic
  SYNC_PROPOSAL: 'sync-proposal', //Create post into topic
};

function isValidAction(type_action, action) {
  return Object.values(type_action).includes(action);
}

module.exports = { DISCOURSE_ACTION, SNAPSHOT_ACTION, isValidAction };
