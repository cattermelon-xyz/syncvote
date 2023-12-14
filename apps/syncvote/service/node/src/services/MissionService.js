const { supabase } = require('../configs/supabaseClient');
const { insertCheckpoint } = require('./CheckpointService');
const { insertCurrentVoteData } = require('./CurrentVoteDataService');
const { SingleVote } = require('../models/votemachines/SingleVote');
const { DocInput } = require('../models/votemachines/DocInput');
const { Veto } = require('../models/votemachines/Veto');
const { UpVote } = require('../models/votemachines/Upvote');

const moment = require('moment');
const { createArweave } = require('../functions');
const { start } = require('./VoteHandle/funcs');
const { Snapshot } = require('../models/votemachines/Snapshot');

const VoteMachineValidate = {
  SingleChoiceRaceToMax: new SingleVote({}),
  DocInput: new DocInput({}),
  Veto: new Veto({}),
  UpVote: new UpVote({}),
  Snapshot: new Snapshot({}),
};

async function insertMission(props) {
  return new Promise(async (resolve, reject) => {
    try {
      if (props) {
        if (props.refId && props.parent) {
          console.log('Create Mission: ', props.refId);
        } else {
          console.log('Create Mission');
        }
      }
      const { arweave_id, error: arweave_err } = await createArweave(props);

      if (arweave_err) {
        resolve({
          status: 'ERR',
          message: 'Cannot save this proposal to arweave',
        });
        return;
      }

      const { data: newMission, error } = await supabase
        .from('mission')
        .insert({ ...props, arweave_id: arweave_id })
        .select('*');

      if (!error) {
        if (newMission[0].status === 'PUBLIC') {
          for (const checkpoint of newMission[0].data.checkpoints) {
            if (
              !checkpoint.isEnd &&
              checkpoint?.vote_machine_type !== 'Discourse' &&
              checkpoint?.vote_machine_type !== 'forkNode' &&
              checkpoint?.vote_machine_type !== 'joinNode'
            ) {
              const { duration, participation, title } = checkpoint;
              const { isValid } =
                VoteMachineValidate[checkpoint.vote_machine_type].validate(
                  checkpoint
                );

              if (!duration || !participation || !title || !isValid) {
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
              props: checkpoint?.data,
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

              const { u_error } = await supabase
                .from('mission')
                .update({
                  current_vote_data_id: current_vote_data.id,
                })
                .eq('id', newMission[0].id)
                .select('*');

              let { data: details } = await supabase
                .from('mission_vote_details')
                .select(`*`)
                .eq('mission_id', newMission[0].id);

              await start(details[0]);

              if (u_error) {
                resolve({
                  status: 'ERR',
                  message: u_error,
                });
                return;
              }
            }
          }
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
        console.log('MissionCreateError: ', error);
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
