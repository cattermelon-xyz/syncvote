class Mission {
  constructor(
    id,
    title,
    desc,
    icon_url,
    owner_id,
    status,
    current_vote_data_id
  ) {
    this.id = id;
    this.title = title;
    this.desc = desc;
    this.icon_url = icon_url;
    this.data = data;
    this.owner_id = owner_id;
    this.status = status;
    this.current_vote_data_id = current_vote_data_id;
  }
}

module.exports = {
  Mission,
};
