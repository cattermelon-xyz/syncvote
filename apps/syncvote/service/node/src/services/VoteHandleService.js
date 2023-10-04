const { supabase } = require('../configs/supabaseClient');
const {
  VoteMachineController,
} = require('../models/votemachines/VotingController');

async function handleVoting(props) {
  return new Promise(async (resolve, reject) => {
    try {
      const { identify, option, voting_power, mission_id } = props;

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
          let voteMachineController = new VoteMachineController({});

          // 1️⃣ check if it is the first time of vote
          if (mission_vote_details.length === 0) {
            // check if this mission was not created
            const { data: mission } = await supabase
              .from('mission')
              .select('*')
              .eq('id', mission_id);

            if (mission.length === 0) {
              resolve({
                status: 'ERR',
                message: 'This mission was not created',
              });
              return;
            }

            // check if this mission was not going to publish
            if (mission[0].status === 'DRAFT') {
              resolve({
                status: 'ERR',
                message: 'This mission was not publish',
              });
              return;
            }

            // create a new current vote data
            // 1. Get the root checkpoint data
            const { data: rootCheckpoint } = await supabase
              .from('checkpoint')
              .select('*')
              .eq('id', `${mission_id}-root`);

            // 2. Get the data was created by voteMachine
            const {
              initData,
              error: init_error,
              result,
            } = voteMachineController.initDataForCVD({
              vote_machine_type: rootCheckpoint[0].vote_machine_type,
              options: rootCheckpoint[0].options,
            });

            // check if cannot init the data for current_vote_data
            if (!initData) {
              resolve({
                status: 'ERR',
                message: init_error,
              });
              return;
            }

            // 3. Create new current_vote_data for root checkpoint
            const { data: newCurrentVoteData } = await supabase
              .from('current_vote_data')
              .insert({
                checkpoint_id: rootCheckpoint[0].id,
                result: result,
                who: [],
              })
              .select('*');

            // 4. Update the current_vote_data_id for mission
            await supabase
              .from('mission')
              .update({ current_vote_data_id: newCurrentVoteData[0].id })
              .eq('id', mission_id)
              .select('*');

            // 5. Get new mission_vote_details
            mission_vote_details = (
              await supabase
                .from('mission_vote_details')
                .select(`*`)
                .eq('mission_id', mission_id)
            ).data;
          }

          // Update voteMachineController
          voteMachineController = new VoteMachineController(
            mission_vote_details[0]
          );

          // 2️⃣ check if fallback
          const { fallback, error: f_error } = voteMachineController.fallBack();

          if (fallback) {
            console.log('Move this mission to fallback checkpoint');
            resolve({
              status: 'FALLBACK',
              message: f_error,
            });
            return;
          }

          // 3️⃣ check if recorded
          const { notRecorded, error: r_error } =
            voteMachineController.recordVote({
              identify,
              option,
              voting_power,
            });

          if (notRecorded) {
            resolve({
              status: 'ERR',
              message: r_error,
            });
            return;
          }

          // 4️⃣ write this record to vote data record and change the result
          const { error: nv_error } = await supabase
            .from('vote_record')
            .insert({
              identify,
              option,
              voting_power,
              current_vote_data_id: mission_vote_details[0].cvd_id,
            })
            .select('*');

          if (nv_error) {
            resolve({
              status: 'ERR',
              message: nv_error,
            });
          }

          // 5️⃣ change the result
          const { who, result } = voteMachineController.getResult();
          const { error: cvd_err } = await supabase
            .from('current_vote_data')
            .update({ who: who, result: result })
            .eq('id', mission_vote_details[0].cvd_id);

          if (cvd_err) {
            resolve({
              status: 'ERR',
              message: cvd_err,
            });
          }

          // 6️⃣ Check if tally
          const shouldTally = voteMachineController.getResult();
        } catch (error) {
          console.log(error);
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
  handleVoting,
};
