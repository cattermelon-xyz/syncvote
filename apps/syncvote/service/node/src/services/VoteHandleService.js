const { supabase } = require('../configs/supabaseClient');
const moment = require('moment');

async function handleVoting(props) {
  return new Promise(async (resolve, reject) => {
    try {
      const { who, option, voting_power, mission_id } = props;

      const { data: mission, error: m_error } = await supabase
        .from('mission')
        .select(`*`)
        .eq('id', mission_id);

      const checkpointId = mission[0]?.current_checkpoint_id;

      if (m_error) {
        resolve({
          status: 'Error',
          message: m_error,
        });
      } else if (!checkpointId) {
        resolve({
          status: 'Error',
          message: 'This mission is not ready',
        });
      }

      const { data: checkpoint, error: c_error } = await supabase
        .from('checkpoint')
        .select(`*`)
        .eq('id', checkpointId);

      if (c_error) {
        resolve({
          status: 'Error',
          message: c_error,
        });
      }

      console.log(checkpointId);

      const { data: current_vote_data, error: cvd_error } = await supabase
        .from('current_vote_data')
        .select(`*`)
        .eq('checkpoint_id', checkpointId);

      if (cvd_error) {
        resolve({
          status: 'Error',
          message: c_error,
        });
      }

      const recorded = voreRecorded(
        (vote = { who, option, voting_power }),
        checkpoint[0]
      );

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

function voreRecorded(vote, checkpoint) {
  const createdAtMoment = moment(checkpoint.created_at);

  // const now = moment();
  // const differenceInMilliseconds = now.diff(createdAtMoment);
  // if (differenceInMilliseconds >= duration) {
  //   console.log('Cannot vote');
  // } else {
  //   console.log('Can vote');
  // }

  return false;

  // who: 'Chau Khac', option: [ '1' ], voting_power: 100 } [
  //   {
  //     created_at: '2023-09-25T22:18:02.37222+00:00',
  //     children: [],
  //     delays: null,
  //     delayUnits: null,
  //     duration: null,
  //     mission_id: 36,
  //     options: null,
  //     participation: null,
  //     quorum: 60,
  //     vote_machine_type: null,
  //     id: '36-node-1694591946637'
  //   }
  // ]
}

module.exports = {
  handleVoting,
};
