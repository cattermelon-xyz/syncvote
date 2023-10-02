const { supabase } = require('../configs/supabaseClient');
const moment = require('moment');
const {
  VoteMachineController,
} = require('../models/votemachines/VotingController');

async function handleVoting(props) {
  return new Promise(async (resolve, reject) => {
    try {
      const { who, option, voting_power, mission_id } = props;

      const { data: mision_vote_details, error: mvd_error } = await supabase
        .from('misson_vote_details')
        .select(`*`)
        .eq('mission_id', mission_id);

      if (mvd_error) {
        resolve({
          status: 'ERR',
          message: mvd_error,
        });
      } else {
        try {
          const voteMachineController = new VoteMachineController({});

          const fallback = voteMachineController.fallBack(
            mision_vote_details[0]
          );

          if (fallback) {
            resolve({
              status: 'FALLBACK',
              message: fallback,
            });
          }

          voteMachineController.recordVote(mision_vote_details[0], {
            who,
            option,
            voting_power,
          });
        } catch (error) {
          console.log(error);
        }

        resolve({
          status: 'OK',
          message: 'SUCCESS',
          data: mision_vote_details,
        });
      }

      // const recorded = voreRecorded(
      //   (vote = { who, option, voting_power }),
      //   checkpoint[0]
      // );

      resolve({
        status: 'OK',
        message: 'SUCCESS',
        data: current_vote_data,
      });
    } catch (e) {
      reject(e);
    }
  });
}

module.exports = {
  handleVoting,
};
