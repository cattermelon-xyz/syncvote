const { supabase } = require('../configs/supabaseClient');
const {
  VoteMachineController,
} = require('../models/votemachines/VotingController');
<<<<<<< HEAD
const moment = require('moment');
const { insertCurrentVoteData } = require('./CurrentVoteDataService');
=======
>>>>>>> main

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
<<<<<<< HEAD
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

          let voteMachineController = new VoteMachineController(
            mission_vote_details[0]
          );

          // 3️⃣ check if the fisrt time of voting
          if (!mission_vote_details[0].result) {
            // update data of current vote data

            // 1. Get the data was created by voteMachine
=======
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
>>>>>>> main
            const {
              initData,
              error: init_error,
              result,
<<<<<<< HEAD
            } = voteMachineController.initDataForCVD();
=======
            } = voteMachineController.initDataForCVD({
              vote_machine_type: rootCheckpoint[0].vote_machine_type,
              options: rootCheckpoint[0].options,
            });
>>>>>>> main

            // check if cannot init the data for current_vote_data
            if (!initData) {
              resolve({
                status: 'ERR',
                message: init_error,
              });
              return;
            }

<<<<<<< HEAD
            // 2. Update result current_vote_data for checkpoint
            await supabase
              .from('current_vote_data')
              .update({
                result: result,
              })
              .eq('id', mission_vote_details[0].cvd_id);

            // 3. Update the result of mission_vote_details
            mission_vote_details[0].result = result;

            // 4. Update voteController
            voteMachineController = new VoteMachineController(
              mission_vote_details[0]
            );
          }

          // 4️⃣ check if fallback
          const { fallback, error: f_error } = voteMachineController.fallBack();
=======
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

>>>>>>> main
          if (fallback) {
            console.log('Move this mission to fallback checkpoint');
            resolve({
              status: 'FALLBACK',
              message: f_error,
            });
            return;
          }

<<<<<<< HEAD
          // 5️⃣ check if recorded
=======
          // 3️⃣ check if recorded
>>>>>>> main
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

<<<<<<< HEAD
          // 6️⃣ write this record to vote data record and change the result
=======
          // 4️⃣ write this record to vote data record and change the result
>>>>>>> main
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
<<<<<<< HEAD
            return;
          }

          // 7️⃣ change the result
=======
          }

          // 5️⃣ change the result
>>>>>>> main
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
<<<<<<< HEAD
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

          if (shouldTally) {
            // change endedAt of current vote data to moment for this checkpoint
            await supabase
              .from('current_vote_data')
              .update({ endedAt: moment().format(), tallyResult: tallyResult })
              .eq('id', mission_vote_details[0].cvd_id);

            let startToVote = moment().format();
            const index = tallyResult.index;

            // check if delays
            if (mission_vote_details[0].delays[index]) {
              let delayUnits = `${mission_vote_details[0].delayUnits[index]}s`;

              startToVote = moment().add(
                mission_vote_details[0].delays[index],
                delayUnits
              );
            }

            // check if next checkpoint is end checkpoint
            const next_checkpoint_id = `${mission_id}-${
              mission_vote_details[0].children[tallyResult.index]
            }`;

            // get data of next checkpoint
            const { data: next_checkpoint } = await supabase
              .from('checkpoint')
              .select('isEnd')
              .eq('id', next_checkpoint_id);

            let endedAt = null;
            let mission_status = 'PUBLIC';

            if (next_checkpoint[0].isEnd) {
              endedAt = startToVote;
              mission_status = 'STOPPED';
            }

            // create current vote data for next checkpoint
            const { data: new_current_vote_data } = await supabase
              .from('current_vote_data')
              .insert({
                checkpoint_id: next_checkpoint_id,
                initData: tallyResult,
                startToVote: startToVote,
                endedAt: endedAt,
              })
              .select('*');

            // update the current_vote_data for mission and change the progress
            const progress = mission_vote_details[0].progress.concat(
              new_current_vote_data[0].checkpoint_id
            );

            await supabase
              .from('mission')
              .update({
                current_vote_data_id: new_current_vote_data[0].id,
                progress: progress,
                status: mission_status,
              })
              .eq('id', mission_id);

            resolve({
              status: 'OK',
              message: 'Vote successfully => Move to next checkpoint',
            });
          }

          resolve({
            status: 'OK',
            message: 'Vote successfully',
          });
=======
          }

          // 6️⃣ Check if tally
          const shouldTally = voteMachineController.getResult();
>>>>>>> main
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

<<<<<<< HEAD
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
            startToVote: moment()
              .add(mission_vote_details[0].delays[index], 'days')
              .format(),
            // endToVote: moment().add(checkpoint.duration, 'seconds').format(),
          });

          // 8️⃣ change the current vote data
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

      // resolve({
      //   status: 'OK',
      //   message: 'SUCCESS',
      //   data: '',
      // });
    } catch (e) {
      reject(e);
    }
  });
}

module.exports = {
  handleVoting,
  handleSubbmission,
=======
module.exports = {
  handleVoting,
>>>>>>> main
};
