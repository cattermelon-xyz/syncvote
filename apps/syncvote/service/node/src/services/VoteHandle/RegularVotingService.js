const { supabase } = require('../../configs/supabaseClient');
const moment = require('moment');
const { handleMovingToNextCheckpoint } = require('./funcs');
const {
  VoteMachineController,
} = require('../../models/votemachines/VotingController');

async function handleSubmission(props) {
  return new Promise(async (resolve, reject) => {
    try {
      const { identify, mission_id } = props;

      let { data: mission_vote_details, error: mvd_error } = await supabase
        .from('mission_vote_details')
        .select(`*`)
        .eq('mission_id', mission_id);

      if (mvd_error) {
        resolve({
          status: 'ERR',
          message: mvd_error,
        });
        return;
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

          const details = mission_vote_details[0];

          // 2️⃣ check mission is stopped
          if (details.status === 'STOPPED') {
            resolve({
              status: 'ERR',
              message: 'This mission is stopped!',
            });
            return;
          }

          // check if this is ended checkpoint
          if (!details?.vote_machine_type && details?.isEnd) {
            resolve({
              status: 'ERR',
              message: 'Cannot vote in End Node',
            });
            return;
          } else if (details.vote_machine_type === 'forkNode') {
            resolve({
              status: 'ERR',
              message: 'Cannot vote in forkNode',
            });
            return;
          } else {
            const voteMachineController = new VoteMachineController(details);

            // 4️⃣ check if fallback
            const { fallback, error: f_error } =
              voteMachineController.fallBack();

            if (fallback) {
              console.log('FallbackError: ', f_error);
              const tallyResult = {
                index: details?.props?.fallback
                  ? details.children.indexOf(details?.props?.fallback)
                  : 0,
              };

              const timeDefault = moment(details.startToVote).add(
                details.duration,
                'seconds'
              );

              let { next_checkpoint_id } = await handleMovingToNextCheckpoint(
                details,
                tallyResult,
                timeDefault
              );

              resolve({
                status: 'OK',
                message: `FALLBACK: Move this checkpoint to ${next_checkpoint_id}`,
              });
              return;
            }

            // 5️⃣ check if recorded
            const { notRecorded, error: r_error } =
              await voteMachineController.recordVote(props);

            if (notRecorded) {
              resolve({
                status: 'ERR',
                message: r_error,
              });
              return;
            }

            // 6️⃣ write this record to vote data record and change the result
            const { error: nv_error } = await supabase
              .from('vote_record')
              .insert({
                identify,
                option: [props.option] || [props.submission],
                current_vote_data_id: details.cvd_id,
              })
              .select('*');

            if (nv_error) {
              resolve({
                status: 'ERR',
                message: 'VoteRecordError: ' + String(nv_error),
              });
              return;
            }

            // 7️⃣ change the result
            const { who, result } = voteMachineController.getResult();
            const { error: cvd_err } = await supabase
              .from('current_vote_data')
              .update({ who: who, result: result })
              .eq('id', details.cvd_id);

            if (cvd_err) {
              resolve({
                status: 'ERR',
                message: cvd_err,
              });
              return;
            }

            // 8️⃣ Check if tally
            const {
              shouldTally,
              error: t_error,
              tallyResult,
            } = voteMachineController.shouldTally();

            // check if tally have error
            if (t_error) {
              console.log('Move this mission to fallback checkpoint');
              resolve({
                status: 'ERR',
                message: t_error,
              });
              return;
            }

            if (shouldTally && tallyResult) {
              let timeDefault = moment();

              const { next_checkpoint_id } = await handleMovingToNextCheckpoint(
                details,
                tallyResult,
                timeDefault
              );

              resolve({
                status: 'OK',
                message: `Vote successfully => Move to next checkpoint ${next_checkpoint_id}`,
              });
              return;
            }

            resolve({
              status: 'OK',
              message: 'Vote successfully',
            });
          }
        } catch (error) {
          console.log('HandleVotingError: ', error);
          resolve({
            status: 'ERR',
            message: error,
          });
          return;
        }
      }

      resolve({
        status: 'OK',
        message: 'SUCCESS',
        data: '',
      });
    } catch (e) {
      reject(e);
    }
  });
}

module.exports = {
  handleSubmission,
};
