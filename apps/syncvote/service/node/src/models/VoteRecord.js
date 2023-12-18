class VoteRecord {
  constructor(id, identify, option, current_vote_data_id) {
    this.id = id;
    this.identify = identify;
    this.option = option;
    this.current_vote_data_id = current_vote_data_id;
  }
}

module.exports = {
  VoteRecord,
};
