const { supabase } = require('../configs/supabaseClient');
const { insertCheckpoint } = require('./CheckpointService');
const { insertCurrentVoteData } = require('./CurrentVoteDataService');
const { SingleVote } = require('../models/votemachines/SingleVote');
const { DocInput } = require('../models/votemachines/DocInput');
const { Veto } = require('../models/votemachines/Veto');
const { UpVote } = require('../models/votemachines/UpVote');
const TopicService = require('./TopicService');
const PostService = require('./PostService');

const moment = require('moment');

const VoteMachineValidate = {
  SingleChoiceRaceToMax: new SingleVote({}),
  DocInput: new DocInput({}),
  Veto: new Veto({}),
  UpVote: new UpVote({}),
};

async function insertMission(props) {
  return new Promise(async (resolve, reject) => {
    try {
      const { data: newMission, error } = await supabase
        .from('mission')
        .insert(props)
        .select('*');

      if (!error) {
        if (newMission[0].status === 'PUBLIC') {
          newMission[0].data.checkpoints.map(async (checkpoint) => {
            if (!checkpoint.isEnd) {
              const { duration, participation, title, quorum } = checkpoint;
              const { isValid } =
                VoteMachineValidate[checkpoint.vote_machine_type].validate(
                  checkpoint
                );

              if (duration && participation && title && isValid) {
                if (checkpoint.vote_machine_type !== 'DocInput') {
                  if (!quorum) {
                    resolve({
                      status: 'ERR',
                      message:
                        'Checkpoint of this proposal is missing attributes',
                    });
                    return;
                  }
                }
              } else {
                resolve({
                  status: 'ERR',
                  message: 'Checkpoint of this proposal is missing attributes',
                });
                return;
              }
            }

            const checkpointData = {
              id: `${newMission[0].id}-${checkpoint.id}`,
              vote_machine_type: checkpoint.vote_machine_type,
              mission_id: newMission[0].id,
              title: checkpoint.title,
              participation: checkpoint?.participation,
              quorum: checkpoint?.quorum,
              options: checkpoint.data?.options,
              thresholds: checkpoint.data?.max,
              delays: checkpoint?.delays,
              delayUnits: checkpoint?.delayUnits,
              duration: checkpoint?.duration,
              children: checkpoint?.children,
              isEnd: checkpoint?.isEnd,
              includedAbstain: checkpoint?.includedAbstain,
            };

            const error = await insertCheckpoint(checkpointData);
            if (error) {
              resolve({
                status: 'ERR',
                message: error,
              });
              return;
            }

            if (checkpoint.id === newMission[0].start) {
              // create current_vote_data
              const current_vote_data = await insertCurrentVoteData({
                checkpoint_id: `${newMission[0].id}-${checkpoint.id}`,
                startToVote: moment().format(),
              });

              const { data: missionViewData, error: errorMissionViewData } =
                await supabase
                  .from('mission_view')
                  .select('*')
                  .eq('id', newMission[0].id);

              console.log('missionViewData', missionViewData);

              const { data: web2KeyData, error: errorWeb2KeyData } =
                await supabase
                  .from('web2_key')
                  .select('*')
                  .eq('org_id', missionViewData[0].org_id);

              if (errorWeb2KeyData || errorMissionViewData) {
                resolve({
                  status: 'ERR',
                  message: 'error to create mission',
                });
                return;
              }

              let topicId;
              if (web2KeyData.length > 0) {
                const filteredDiscourse = web2KeyData.filter(
                  (integration) => integration.provider === 'discourse'
                );

                if (filteredDiscourse.length === 1) {
                  const discourseConfig = filteredDiscourse[0];

                  const topicData = {
                    title: `Proposal: ${missionViewData[0].title} has been created`,
                    raw: `New proposal ${missionViewData[0].title} has been created from ${missionViewData[0].workflow_title}`,
                    org_id: missionViewData[0].org_id,
                    discourseConfig,
                  };

                  const { data: createTopicData, error: errorCreateTopicData } =
                    await TopicService.createTopic(topicData);
                  topicId = createTopicData.topic_id;

                  if (errorCreateTopicData) {
                    resolve({
                      status: 'ERR',
                      message: 'error to create mission',
                    });
                    return;
                  }

                  const postData = {
                    topic_id: topicId,
                    raw: `Checkpoint ${checkpointData.title} has been started`,
                    org_id: missionViewData[0].org_id,
                    discourseConfig,
                  };

                  const { error: errorCreatePostData } =
                    await PostService.createPost(postData);

                  if (errorCreatePostData) {
                    resolve({
                      status: 'ERR',
                      message: 'error to create mission',
                    });
                    return;
                  }
                }
              }

              const { u_error } = await supabase
                .from('mission')
                .update({
                  current_vote_data_id: current_vote_data.id,
                  topic_id: topicId ? topicId : null,
                })
                .eq('id', newMission[0].id)
                .select('*');

              if (u_error) {
                resolve({
                  status: 'ERR',
                  message: u_error,
                });
                return;
              }
            }
          });
        }
        resolve({
          status: 'OK',
          message: 'SUCCESS',
          data: newMission,
        });
      } else {
        resolve({
          status: 'ERR',
          message: error,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
}

async function updateMission(props) {
  return new Promise(async (resolve, reject) => {
    try {
      const { params, missionId } = props;

      const { data: updateMission, error } = await supabase
        .from('mission')
        .update(params)
        .eq('id', missionId)
        .select('*');

      if (!error) {
        if (updateMission[0].status === 'PUBLIC') {
          updateMission[0].data.checkpoints.map(async (checkpoint) => {
            const checkpointData = {
              id: `${updateMission[0].id}-${checkpoint.id}`,
              vote_machine_type: checkpoint.vote_machine_type,
              mission_id: updateMission[0].id,
              title: checkpoint.title,
              participation: checkpoint?.participation,
              quorum: checkpoint?.quorum,
              options: checkpoint.data?.options,
              thresholds: checkpoint.data?.max,
              delays: checkpoint?.delays,
              delayUnits: checkpoint?.delayUnits,
              duration: checkpoint?.duration,
              children: checkpoint?.children,
              isEnd: checkpoint?.isEnd,
              includedAbstain: checkpoint?.includedAbstain,
            };

            const error = await insertCheckpoint(checkpointData);
            if (error) {
              resolve({
                status: 'ERR',
                message: error,
              });
              return;
            }

            if (checkpoint.id === updateMission[0].start) {
              // create current_vote_data
              const current_vote_data = await insertCurrentVoteData({
                checkpoint_id: `${updateMission[0].id}-${checkpoint.id}`,
                startToVote: moment().format(),
              });

              const { u_error } = await supabase
                .from('mission')
                .update({
                  current_vote_data_id: current_vote_data.id,
                })
                .eq('id', updateMission[0].id)
                .select('*');

              if (u_error) {
                resolve({
                  status: 'ERR',
                  message: u_error,
                });
                return;
              }
            }
          });
        }

        resolve({
          status: 'OK',
          message: 'SUCCESS',
          data: updateMission,
        });
      } else {
        resolve({
          status: 'ERR',
          message: error,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
}

module.exports = {
  insertMission,
  updateMission,
};
