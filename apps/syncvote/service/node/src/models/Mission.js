class Mission {
  constructor(
    id,
    title,
    desc,
    icon_url,
    creator_id,
    status,
    workflow_version_id,
    current_vote_data_id
  ) {
    this.id = id;
    this.title = title;
    this.desc = desc;
    this.icon_url = icon_url;
    this.data = data;
    this.creator_id = creator_id;
    this.status = status;
    this.workflow_version_id = workflow_version_id;
    this.current_vote_data_id = current_vote_data_id;
  }
}

module.exports = {
  Mission,
};
