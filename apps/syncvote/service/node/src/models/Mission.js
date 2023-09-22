class Mission {
  constructor(id, owner_id, status, current_vote_data_id) {
    this.id = id;
    this.owner_id = owner_id;
    this.status = status;
    this.current_vote_data_id = current_vote_data_id;
  }
}

module.exports = {
  Mission,
};
