const { supabase } = require('../configs/supabaseClient');
const moment = require('moment');
const { insertVoteRecord } = require('./VoteRecordService');
const {
  VoteMachineController,
} = require('../models/votemachines/VotingController');

async function handleVoting(props) {
  return new Promise(async (resolve, reject) => {
    try {
      const { who, option, voting_power, mission_id } = props;

      const { data: mision_vote_details, error: mvd_error } = await supabase
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
          const voteMachineController = new VoteMachineController({});

          // const { fallback, error: f_error } = voteMachineController.fallBack(
          //   mision_vote_details[0]
          // );

          // if (fallback) {
          //   console.log('Move this mission to fallback checkpoint');
          //   resolve({
          //     status: 'FALLBACK',
          //     message: f_error,
          //   });
          // }

          const { notRecorded, error: r_error } =
            voteMachineController.recordVote(mision_vote_details[0], {
              who,
              option,
              voting_power,
            });

          if (notRecorded) {
            console.log('Reject this vote');
            resolve({
              status: 'Err',
              message: r_error,
            });
          }

          // write this record to vote data record
          const respone = await insertVoteRecord({
            idenity: who,
            option: option,
            voting_power: voting_power,
            current_vote_data_id: mision_vote_details[0].cvd_id,
          });

          resolve(respone);
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
