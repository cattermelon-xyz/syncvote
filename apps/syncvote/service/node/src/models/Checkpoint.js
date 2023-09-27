class Checkpoint {
  constructor(
    id,
    vote_machine_type,
    childrens,
    mission_id,
    duration,
    participation,
    delays,
    delayUnits,
    quorum,
    options
  ) {
    this.id = id;
    this.vote_machine_type = vote_machine_type;
    this.childrens = childrens;
    this.mission_id = mission_id;
    this.duration = duration;
    this.participation = participation;
    this.delays = delays;
    this.delayUnits = delayUnits;
    this.quorum = quorum;
    this.options = options;
  }
}

module.exports = {
  Checkpoint,
};
