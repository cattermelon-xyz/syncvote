const { supabase } = require('../../configs/supabaseClient');
const {
  VoteMachineController,
} = require('../../models/votemachines/VotingController');
const moment = require('moment');
var CronJob = require('cron').CronJob;
const { createArweave } = require('../../functions');
const { DISCOURSE_ACTION } = require('../../configs/constants');
const { createTopic } = require('../TopicService');

async function handleVoteDiscourse(props) {
  return new Promise(async (resolve, reject) => {
    try {
      const { identify, option, submission, mission_id } = props;

      let { data: mission_vote_details, error: mvd_error } = await supabase
        .from('mission_vote_details')
        .select(`*`)
        .eq('mission_id', mission_id);

      if (mvd_error) {
        resolve({
          status: 'ERR',
          message: mvd_error,
        });
      } else {
        try {
          // 1️⃣ check mission is not created or publish
          if (mission_vote_details.length === 0) {
            resolve({
              status: 'ERR',
              message: 'This mission is not created or publish',
            });
            return;
          }

          // 2️⃣ check mission is stopped
          if (mission_vote_details[0].status === 'STOPPED') {
            resolve({
              status: 'ERR',
              message: 'This mission is stopped!',
            });
            return;
          }

          const voteMachineController = new VoteMachineController(
            mission_vote_details[0]
          );

          // 3️⃣ check if fallback
          const { fallback, error: f_error } = voteMachineController.fallBack();

          if (fallback) {
            console.log('Move this mission to fallback checkpoint');
            resolve({
              status: 'FALLBACK',
              message: f_error,
            });
            return;
          }

          // 4️⃣ check if recorded
          const { notRecorded, error: r_error } =
            voteMachineController.recordVote({
              identify,
              option,
              submission,
            });

          if (notRecorded) {
            resolve({
              status: 'ERR',
              message: r_error,
            });
            return;
          }

          // 5️⃣ write this record to vote data record
          const { error: nv_error } = await supabase
            .from('vote_record')
            .insert({
              identify,
              option,
              voting_power: 1,
              current_vote_data_id: mission_vote_details[0].cvd_id,
            })
            .select('*');

          if (nv_error) {
            resolve({
              status: 'ERR',
              message: nv_error,
            });
            return;
          }

          // 6️⃣ change the result
          if (submission.action === DISCOURSE_ACTION.CREATE_TOPIC) {
            //create Topic
            const { data, error: error_create_topic } = await createTopic(
              submission
            );

            if (error_create_topic) {
              resolve({
                status: 'ERR',
                message: error_create_topic,
              });
              return;
            } else {
              const tallyResult = {
                index: option[0],
                submission: {
                  firstPostId: data?.firstPostId,
                  linkDiscourse: data?.linkDiscourse,
                  [submission.variables]: data?.topicId,
                },
              };

              const { error: cvd_err } = await supabase
                .from('current_vote_data')
                .update({
                  who: [identify],
                  result: [],
                  tallyResult: tallyResult,
                  endedAt: moment().format(),
                })
                .select('*')
                .eq('id', mission_vote_details[0].cvd_id);

              if (cvd_err) {
                resolve({
                  status: 'ERR',
                  message: cvd_err,
                });
                return;
              }
            }
            let startToVote = moment().format();
            const index = tallyResult.index;
            // check if delays
            if (mission_vote_details[0].delays) {
              if (mission_vote_details[0].delays[index]) {
                let delayUnits = `${mission_vote_details[0].delayUnits[index]}s`;

                startToVote = moment().add(
                  mission_vote_details[0].delays[index],
                  delayUnits
                );
              }
            }
            // check if next checkpoint is end checkpoint
            const next_checkpoint_id = `${mission_id}-${
              mission_vote_details[0].children[tallyResult.index]
            }`;
            console.log(next_checkpoint_id);

            // create current vote data for next checkpoint
            const { data: new_current_vote_data } = await supabase
              .from('current_vote_data')
              .insert({
                checkpoint_id: next_checkpoint_id,
                initData: tallyResult,
                startToVote: startToVote,
              })
              .select('*');

            await supabase
              .from('mission')
              .update({
                current_vote_data_id: new_current_vote_data[0].id,
              })
              .eq('id', mission_id);
            resolve({
              status: 'OK',
              message: 'Create topic successfully => Move to next checkpoint',
            });
          }
        } catch (error) {
          console.log(error);
        }
      }
    } catch (e) {
      reject(e);
    }
  });
}

module.exports = {
  handleVoteDiscourse,
};
