const { supabase } = require('../configs/supabaseClient');
const moment = require('moment');
const {
  handleMovingToNextCheckpoint,
  checkMinDurationTally,
} = require('./VoteHandle/funcs');
const {
  VoteMachineController,
} = require('../models/votemachines/VotingController');

const finalize = async (props) => {
  return new Promise(async (resolve, reject) => {
    const { mission_id } = props;
    console.log('Check finalize at mission: ', mission_id);
    let { data: mission_vote_details, error: mvd_error } = await supabase
      .from('mission_vote_details')
      .select(`*`)
      .eq('mission_id', mission_id);
    if (mvd_error) {
      resolve({
        status: 'ERR',
        message: mvd_error,
        finalize: false,
      });
      return;
    } else {
      if (mission_vote_details.length === 0) {
        resolve({
          status: 'ERR',
          message: 'This mission is not created or publish',
          finalize: false,
        });
        return;
      }

      const details = mission_vote_details[0];
      // 2️⃣ check mission is stopped
      if (details.status === 'STOPPED') {
        resolve({
          status: 'ERR',
          message: 'This mission is stopped!',
          finalize: false,
        });
        return;
      }

      // check if this is ended checkpoint
      if (!details?.vote_machine_type && details?.isEnd) {
        resolve({
          status: 'ERR',
          message: 'Cannot finalize in End Node',
          finalize: false,
        });
        return;
      } else if (details.vote_machine_type === 'forkNode') {
        resolve({
          status: 'ERR',
          message: 'Cannot finalize in forkNode',
          finalize: false,
        });
        return;
      } else {
        const voteMachineController = new VoteMachineController(details);

        // 4️⃣ check if fallback
        const { fallback, error: f_error } = voteMachineController.fallBack();

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
            finalize: true,
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
          console.log('FallbackError: ', t_error);
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
            finalize: true,
          });
          return;
        }

        if (shouldTally && tallyResult && checkMinDurationTally(details)) {
          let timeDefault = moment();

          const { next_checkpoint_id } = await handleMovingToNextCheckpoint(
            details,
            tallyResult,
            timeDefault
          );

          resolve({
            status: 'OK',
            message: `Finalize successfully => Move to next checkpoint ${next_checkpoint_id}`,
            finalize: true,
          });
          return;
        }

        resolve({
          status: 'OK',
          message: 'Cannot Finalize',
          finalize: false,
        });
      }
    }
  });
};

module.exports = {
  finalize,
};
