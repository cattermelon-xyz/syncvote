const { supabase } = require('../../configs/supabaseClient');
const {
  VoteMachineController,
} = require('../../models/votemachines/VotingController');
const moment = require('moment');
var CronJob = require('cron').CronJob;
const { createArweave } = require('../../functions');
const { DISCOURSE_ACTION } = require('../../configs/constants');
const { createTopic } = require('../TopicService');
const { handleMovingToNextCheckpoint } = require('./funcs');

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
          const details = mission_vote_details[0];

          const voteMachineController = new VoteMachineController(details);

          // // 3️⃣ check if fallback
          // const { fallback, error: f_error } = voteMachineController.fallBack();

          // if (fallback) {
          //   console.log('FallbackError: ', f_error);
          //   const tallyResult = {
          //     index: details.children.indexOf(details.props.fallback) || 0,
          //   };
          //   const timeDefault = moment(details.startToVote).add(
          //     details.duration,
          //     'seconds'
          //   );

          //   let { next_checkpoint_id } = await handleMovingToNextCheckpoint(
          //     details,
          //     tallyResult,
          //     timeDefault
          //   );

          //   resolve({
          //     status: 'OK',
          //     message: `FALLBACK: Move this checkpoint to ${next_checkpoint_id}`,
          //   });
          //   return;
          // }

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
              current_vote_data_id: details.cvd_id,
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
          let tallyResult = {};
          let msg = '';
          if (submission.action === DISCOURSE_ACTION.CREATE_TOPIC) {
            //create Topic
            const { data, error: error_create_topic } = await createTopic({
              ...submission,
              org_id: details?.org_id,
            });

            if (error_create_topic) {
              resolve({
                status: 'ERR',
                message: error_create_topic,
              });
              return;
            } else {
              // find next checkpoint
              tallyResult = {
                index: details.children.indexOf(details.props.next) || 0,
                submission: {
                  firstPostId: data?.firstPostId,
                  linkDiscourse: data?.linkDiscourse,
                  [submission.variable]: data?.topicId,
                },
              };

              const { error: cvd_err } = await supabase
                .from('current_vote_data')
                .update({
                  who: [identify],
                  tallyResult: tallyResult,
                  endedAt: moment().format(),
                })
                .select('*')
                .eq('id', details.cvd_id);

              if (cvd_err) {
                resolve({
                  status: 'ERR',
                  message: cvd_err,
                });
                return;
              }
            }
            msg = 'Create topic successfully => Move to next checkpoint';
          }
          let timeDefault = moment();

          // Moving to next checkpoint
          await handleMovingToNextCheckpoint(details, tallyResult, timeDefault);

          resolve({
            status: 'OK',
            message: msg,
          });
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
