class CurrentVoteData {
  constructor(id, checkpoint_id, result) {
    this.id = id;
    this.checkpoint_id = checkpoint_id;
    this.result = result;
  }
}

module.exports = {
  CurrentVoteData,
};
