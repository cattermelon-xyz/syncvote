const { supabase } = require('../../configs/supabaseClient');
const moment = require('moment');
var CronJob = require('cron').CronJob;
const { convertToCron } = require('../../functions');
const {
  checkIfFirstTimeOfVoting,
  handleMovingToNextCheckpoint,
} = require('./funcs');

async function handleSubmission(props) {
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
          if (!details.vote_machine_type) {
            // update mission
            await supabase
              .from('mission')
              .eq('id', mission_id)
              .update('STOPPED');

            // update current_vote_data
            await supabase
              .from('current_vote_data')
              .eq('id', details.cvd_id)
              .update({
                endedAt: moment().format(),
              });

            resolve({
              status: 'OK',
              message: 'Stopped this mission',
            });
          } else {
            let { firstTimeToVote, voteMachineController } =
              await checkIfFirstTimeOfVoting(details);

            // 4️⃣ check if fallback
            const { fallback, error: f_error } =
              voteMachineController.fallBack();

            if (fallback) {
              const tallyResult = { index: 0 };

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

            if (firstTimeToVote) {
              // create a job to stop this checkpoint
              const stopTime = moment(details.startToVote).add(
                details.duration,
                'seconds'
              );

              const cronSyntax = convertToCron(stopTime);
              const job = new CronJob(cronSyntax, async function () {
                await fetch(`${process.env.BACKEND_API}/vote/create`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    identify: `cronjob-${checkpointData.id}`,
                    option: ['fake option'],
                    voting_power: 9999,
                    mission_id: details.id,
                  }),
                });
              });
              job.start();
            }

            // 5️⃣ check if recorded
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

            // 6️⃣ write this record to vote data record and change the result
            const { error: nv_error } = await supabase
              .from('vote_record')
              .insert({
                identify,
                option,
                voting_power,
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

// //create post forum
// if (details.topic_id !== null) {
//   const { data: web2KeyData, error: errorWeb2KeyData } =
//     await supabase
//       .from('web2_key')
//       .select('*')
//       .eq('org_id', details.org_id);

//   if (web2KeyData.length > 0) {
//     const filteredDiscourse = web2KeyData.filter(
//       (integration) => integration.provider === 'discourse'
//     );

//     if (filteredDiscourse.length === 1) {
//       const discourseConfig = filteredDiscourse[0];

//       // create post result of previous checkpoint
//       const currentCheckpointId = extractCurrentCheckpointId(
//         current_vote_data[0]?.checkpoint_id
//       );
//       const checkpointData = details?.data?.checkpoints.filter(
//         (checkpoint) => checkpoint.id === currentCheckpointId
//       );
//       let checkpointDataAfterHandle = checkpointData[0];
//       switch (checkpointData[0]?.vote_machine_type) {
//         case 'SingleChoiceRaceToMax':
//           if (checkpointData[0]?.includedAbstain === true) {
//             checkpointDataAfterHandle.data.options.push(
//               'Abstain'
//             );
//           }
//           break;
//         case 'UpVote':
//           checkpointDataAfterHandle.data.options = [];
//           checkpointDataAfterHandle.data.options.push('Upvote');
//           if (checkpointData[0]?.includedAbstain === true) {
//             checkpointDataAfterHandle.data.options.push(
//               'Abstain'
//             );
//           }
//           break;
//         case 'Veto':
//           checkpointDataAfterHandle.data.options = [];
//           checkpointDataAfterHandle.data.options.push('Upvote');
//           if (checkpointData[0]?.includedAbstain === true) {
//             checkpointDataAfterHandle.data.options.push(
//               'Abstain'
//             );
//           }
//           break;
//         default:
//           break;
//       }

//       console.log(
//         'checkpointDataAfterHandle',
//         checkpointDataAfterHandle?.data?.options
//       );
//       console.log(
//         'current_vote_data result',
//         current_vote_data[0]?.result
//       );

//       const votingResult =
//         checkpointDataAfterHandle?.data?.options.map(
//           (option, index) => {
//             if (option === 'Abstain') {
//               return {
//                 [option]: current_vote_data[0]?.result[-1]?.count,
//               };
//             } else {
//               return {
//                 [option]:
//                   current_vote_data[0]?.result[index]?.count,
//               };
//             }
//           }
//         );

//       const formattedVotingResult = votingResult
//         .map((result) => {
//           const [key, value] = Object.entries(result)[0];
//           return `${key}: ${value}`;
//         })
//         .join(', ');

//       const postDataResult = {
//         topic_id: details.topic_id,
//         raw: `<p>Checkpoint ${details.title} has been ended</p>
//               <p>Result voting: ${formattedVotingResult} </p>`,
//         org_id: details.org_id,
//         discourseConfig,
//       };

//       PostService.createPost(postDataResult);

//       // create cronjob for create post when checkpoint start
//       let startCronjob = startToVote;
//       if (details.delays[index] === '0') {
//         startCronjob = moment().add(60, 'seconds').format();
//       }

//       const cronSyntax = convertToCron(moment(startCronjob));

//       const job = new CronJob(cronSyntax, async function () {
//         console.log('Running cronjob');

//         const postData = {
//           topic_id: details.topic_id,
//           raw: `<p>Checkpoint ${next_checkpoint[0].title} has been started</p>
//                 <p>Checkpoint description: ${next_checkpoint[0].desc} </p>`,
//           org_id: details.org_id,
//           discourseConfig,
//         };

//         PostService.createPost(postData);
//       });

//       job.start();
//       console.log(`create job to start ${job}`);
//     }
//   }
// }
