class VoteRecord {
  constructor(id, who, option, voting_power, current_vote_data_id) {
    this.id = id;
    this.who = who;
    this.option = option;
    this.voting_power = voting_power;
    this.current_vote_data_id = current_vote_data_id;
  }
}

module.exports = {
  VoteRecord,
};
