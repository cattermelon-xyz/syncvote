const { supabase } = require('../configs/supabaseClient');
const {
  VoteMachineController,
} = require('../models/votemachines/VotingController');
const moment = require('moment');
const { insertCurrentVoteData } = require('./CurrentVoteDataService');

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
          // 1️⃣ check mission is not created or publish
          if (mission_vote_details.length === 0) {
            resolve({
              status: 'ERR',
              message: 'This mission is not created or publish',
            });
            return;
          }

          let voteMachineController = new VoteMachineController({});

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

          // 3. Create new current_vote_data for root checkpoint and start it
          const { data: newCurrentVoteData } = await supabase
            .from('current_vote_data')
            .insert({
              checkpoint_id: rootCheckpoint[0].id,
              result: result,
              who: [],
              startToVote: moment().format(),
              endToVote: moment()
                .add(rootCheckpoint[0].duration, 'seconds')
                .format(),
              tallyResult: [],
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

          // }

          // // Update voteMachineController
          // voteMachineController = new VoteMachineController(
          //   mission_vote_details[0]
          // );

          // // 2️⃣ check if fallback
          // const { fallback, error: f_error } = voteMachineController.fallBack();

          // if (fallback) {
          //   console.log('Move this mission to fallback checkpoint');
          //   resolve({
          //     status: 'FALLBACK',
          //     message: f_error,
          //   });
          //   return;
          // }

          // // 3️⃣ check if recorded
          // const { notRecorded, error: r_error } =
          //   voteMachineController.recordVote({
          //     identify,
          //     option,
          //     voting_power,
          //   });

          // if (notRecorded) {
          //   resolve({
          //     status: 'ERR',
          //     message: r_error,
          //   });
          //   return;
          // }

          // // 4️⃣ write this record to vote data record and change the result
          // const { error: nv_error } = await supabase
          //   .from('vote_record')
          //   .insert({
          //     identify,
          //     option,
          //     voting_power,
          //     current_vote_data_id: mission_vote_details[0].cvd_id,
          //   })
          //   .select('*');

          // if (nv_error) {
          //   resolve({
          //     status: 'ERR',
          //     message: nv_error,
          //   });
          //   return;
          // }

          // // 5️⃣ change the result
          // const { who, result } = voteMachineController.getResult();
          // const { error: cvd_err } = await supabase
          //   .from('current_vote_data')
          //   .update({ who: who, result: result })
          //   .eq('id', mission_vote_details[0].cvd_id);

          // if (cvd_err) {
          //   resolve({
          //     status: 'ERR',
          //     message: cvd_err,
          //   });
          //   return;
          // }

          // // 6️⃣ Check if tally
          // const { shouldTally, error: t_error } =
          //   voteMachineController.shouldTally();

          // // check if tally have error
          // if (t_error) {
          //   console.log('Move this mission to fallback checkpoint');
          //   resolve({
          //     status: 'ERR',
          //     message: t_error,
          //   });
          //   return;
          // }

          // if (shouldTally) {
          //   console.log('Move this checkpoint');
          // }
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

async function handleSubbmission(props) {
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
              message: 'This mission is not created or publish!',
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
          const { who, result, tallyResult, index } =
            voteMachineController.getResult();

          const { error: cvd_err } = await supabase
            .from('current_vote_data')
            .update({ who: who, result: result, tallyResult: tallyResult })
            .eq('id', mission_vote_details[0].cvd_id);

          // 7️⃣ create a new current_vote_data
          const current_vote_data = await insertCurrentVoteData({
            checkpoint_id: `${mission_vote_details[0].m_id}-${mission_vote_details[0].id}`,
            startToVote: moment().add(checkpoint.duration, 'seconds').format(),
            endToVote: moment().add(checkpoint.duration, 'seconds').format(),
          });

          if (cvd_err) {
            resolve({
              status: 'ERR',
              message: cvd_err,
            });
            return;
          }
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
  handleSubbmission,
};
