// const expect = require('chai').expect;
// const { supabase } = require('../src/configs/supabaseClient');
// const dotenv = require('dotenv');
// const axios = require('axios');
// const moment = require('moment');
// const { addMission, deleteMission, missionData } = require('./initData');
// dotenv.config();

// describe('Testing voting function', function () {
//   this.timeout(50000);
//   const voteData = {
//     id: 9999,
//     identify: `chaukhac4@gmail.com`,
//     option: [0],
//     voting_power: 1,
//     mission_id: 9999,
//   };

//   beforeEach(async function () {
//     await addMission();
//   });

//   afterEach(async function () {
//     await deleteMission();
//   });
//   context('Voting', function () {
//     it('1. Vote in the 1st leg', async function () {
//       this.timeout(5000);
//       const response = await axios.post(
//         `${process.env.BACKEND_API}/vote/create`,
//         voteData
//       );
//       console.log(response.data);
//       expect(response.data.message).to.eq('Vote successfully');
//     });

//     it('2. Vote in the 2nd leg', async function () {
//       this.timeout(10000);
//       await supabase
//         .from('current_vote_data')
//         .update({
//           startToVote: moment()
//             .subtract(missionData.data.checkpoints[0].duration, 'seconds')
//             .format(),
//         })
//         .eq('id', 9999);
//       const response = await axios.post(
//         `${process.env.BACKEND_API}/vote/create`,
//         voteData
//       );
//       console.log(response.data.message);
//       expect(response.data.message).to.eq(
//         `Move to fallback checkpoint ${voteData.mission_id}-${missionData.data.checkpoints[0].children[0]}`
//       );
//     });
    
//     it('3. Vote in the 3st leg', async function () {
//       this.timeout(10000);
//       await supabase
//         .from('current_vote_data')
//         .update({
//           startToVote: moment()
//             .subtract(missionData.data.checkpoints[0].duration, 'seconds')
//             .subtract(
//               missionData.data.checkpoints[0].delays[0],
//               missionData.data.checkpoints[0].delayUnits[0]
//             )
//             .format(),
//         })
//         .eq('id', 9999);
//       const response = await axios.post(
//         `${process.env.BACKEND_API}/vote/create`,
//         voteData
//       );
//       expect(response.data.message).to.eq(
//         `Move to fallback checkpoint ${voteData.mission_id}-${missionData.data.checkpoints[0].children[0]}`
//       );
//       const response_2 = await axios.post(
//         `${process.env.BACKEND_API}/vote/create`,
//         voteData
//       );
//       expect(response_2.data.message).to.eq(`Vote successfully`);
//     });

//     it('4. Vote in the 4th leg', async function () {
//       this.timeout(10000);
//       await supabase
//         .from('current_vote_data')
//         .update({
//           startToVote: moment()
//             .subtract(missionData.data.checkpoints[0].duration, 'seconds')
//             .subtract(
//               missionData.data.checkpoints[0].delays[0],
//               missionData.data.checkpoints[0].delayUnits[0]
//             )
//             .subtract(missionData.data.checkpoints[1].duration, 'seconds')
//             .format(),
//         })
//         .eq('id', 9999);
//       const response = await axios.post(
//         `${process.env.BACKEND_API}/vote/create`,
//         voteData
//       );
//       expect(response.data.message).to.eq(
//         `Move to fallback checkpoint ${voteData.mission_id}-${missionData.data.checkpoints[0].children[0]}`
//       );
//       const response_2 = await axios.post(
//         `${process.env.BACKEND_API}/vote/create`,
//         voteData
//       );
//       expect(response_2.data.message).to.eq(
//         `Move to fallback checkpoint ${voteData.mission_id}-${missionData.data.checkpoints[1].children[0]}`
//       );
//     });

//     it('5. Vote in the 5th leg', async function () {
//       this.timeout(10000);
//       const startToVote = moment().subtract(
//         missionData.data.checkpoints[0].duration,
//         'seconds'
//       );
//       await supabase
//         .from('current_vote_data')
//         .update({
//           startToVote: moment()
//             .subtract(missionData.data.checkpoints[0].duration, 'seconds')
//             .subtract(
//               missionData.data.checkpoints[0].delays[0],
//               missionData.data.checkpoints[0].delayUnits[0]
//             )
//             .subtract(missionData.data.checkpoints[1].duration, 'seconds')
//             .subtract(
//               missionData.data.checkpoints[1].delays[0],
//               missionData.data.checkpoints[1].delayUnits[0]
//             )
//             .format(),
//         })
//         .eq('id', 9999);

//       const response = await axios.post(
//         `${process.env.BACKEND_API}/vote/create`,
//         voteData
//       );

//       expect(response.data.message).to.eq(
//         `Move to fallback checkpoint ${voteData.mission_id}-${missionData.data.checkpoints[0].children[0]}`
//       );

//       const response_2 = await axios.post(
//         `${process.env.BACKEND_API}/vote/create`,
//         voteData
//       );

//       expect(response_2.data.message).to.eq(
//         `Move to fallback checkpoint ${voteData.mission_id}-${missionData.data.checkpoints[1].children[0]}`
//       );

//       const response_3 = await axios.post(
//         `${process.env.BACKEND_API}/vote/create`,
//         voteData
//       );

//       console.log(response.data);
//     });
//   });
// });
