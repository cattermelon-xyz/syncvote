const expect = require('chai').expect;
const { supabase } = require('../src/configs/supabaseClient');
const dotenv = require('dotenv');
const axios = require('axios');
const moment = require('moment');
const { addMission, deleteMission, missionData } = require('./initData');
const { response } = require('express');
dotenv.config();

describe('Testing voting function', function () {
  this.timeout(50000);
  const voteData = {
    id: 9999,
    identify: `chaukhac4@gmail.com`,
    option: [0],
    voting_power: 1,
    mission_id: missionData.id,
  };

  beforeEach(async function () {
    await addMission();
  });

  afterEach(async function () {
    await deleteMission();
  });

  it('1. Vote in the 1st leg', async function () {
    this.timeout(5000);
    await axios
      .post(`${process.env.BACKEND_API}/vote/create`, voteData)
      .then((response) => {
        console.log(response.data);
        expect(response.data.message).to.eq('Vote successfully');
      });
  });

  it('2. Vote in the 2nd leg', async function () {
    this.timeout(10000);
    const { data } = await supabase
      .from('current_vote_data')
      .select('*')
      .eq('checkpoint_id', `${missionData.id}-${missionData.start}`);

    await supabase
      .from('current_vote_data')
      .update({
        startToVote: moment()
          .subtract(missionData.data.checkpoints[0].duration, 'seconds')
          .format(),
      })
      .eq('id', data[0].id);

    await axios
      .post(`${process.env.BACKEND_API}/vote/create`, voteData)
      .then((response) => {
        console.log(response.data.message);
        expect(response.data.message).to.eq(
          `FALLBACK: Move this checkpoint to ${voteData.mission_id}-${missionData.data.checkpoints[0].children[0]}`
        );
      });
  });

  it('3. Vote in the 3st leg', async function () {
    this.timeout(10000);

    const { data } = await supabase
      .from('current_vote_data')
      .select('*')
      .eq('checkpoint_id', `${missionData.id}-${missionData.start}`);

    await supabase
      .from('current_vote_data')
      .update({
        startToVote: moment()
          .subtract(missionData.data.checkpoints[0].duration, 'seconds')
          .subtract(
            missionData.data.checkpoints[0].delays[0],
            missionData.data.checkpoints[0].delayUnits[0]
          )
          .format(),
      })
      .eq('id', data[0].id);

    await axios
      .post(`${process.env.BACKEND_API}/vote/create`, voteData)
      .then((response) => {
        expect(response.data.message).to.eq(
          `FALLBACK: Move this checkpoint to ${voteData.mission_id}-${missionData.data.checkpoints[0].children[0]}`
        );
      });

    await axios
      .post(`${process.env.BACKEND_API}/vote/create`, voteData)
      .then((response) => {
        expect(response.data.message).to.eq(`Vote successfully`);
      });
  });

  it('4. Vote in the 4th leg', async function () {
    this.timeout(10000);

    const { data } = await supabase
      .from('current_vote_data')
      .select('*')
      .eq('checkpoint_id', `${missionData.id}-${missionData.start}`);

    let checkpointFallback = missionData.data.checkpoints.find(
      (checkpoint) =>
        checkpoint.id === missionData.data.checkpoints[0].children[0]
    );

    await supabase
      .from('current_vote_data')
      .update({
        startToVote: moment()
          .subtract(missionData.data.checkpoints[0].duration, 'seconds')
          .subtract(
            missionData.data.checkpoints[0].delays[0],
            missionData.data.checkpoints[0].delayUnits[0]
          )
          .subtract(checkpointFallback.duration, 'seconds')
          .format(),
      })
      .eq('id', data[0].id);

    await axios
      .post(`${process.env.BACKEND_API}/vote/create`, voteData)
      .then((response) => {
        expect(response.data.message).to.eq(
          `FALLBACK: Move this checkpoint to ${voteData.mission_id}-${missionData.data.checkpoints[0].children[0]}`
        );
      });

    await axios
      .post(`${process.env.BACKEND_API}/vote/create`, voteData)
      .then((response) => {
        expect(response.data.message).to.eq(
          `FALLBACK: Move this checkpoint to ${voteData.mission_id}-${checkpointFallback.children[0]}`
        );
      });
  });

  it('5. Vote in the 5th leg', async function () {
    this.timeout(15000);

    const { data } = await supabase
      .from('current_vote_data')
      .select('*')
      .eq('checkpoint_id', `${missionData.id}-${missionData.start}`);

    let checkpointFallback = missionData.data.checkpoints.find(
      (checkpoint) =>
        checkpoint.id === missionData.data.checkpoints[0].children[0]
    );

    await supabase
      .from('current_vote_data')
      .update({
        startToVote: moment()
          .subtract(missionData.data.checkpoints[0].duration, 'seconds')
          .subtract(
            missionData.data.checkpoints[0].delays[0],
            missionData.data.checkpoints[0].delayUnits[0]
          )
          .subtract(checkpointFallback.duration, 'seconds')
          .subtract(
            checkpointFallback.delays[0],
            checkpointFallback.delayUnits[0]
          )
          .format(),
      })
      .eq('id', data[0].id);

    await axios
      .post(`${process.env.BACKEND_API}/vote/create`, voteData)
      .then((response) => {
        expect(response.data.message).to.eq(
          `FALLBACK: Move this checkpoint to ${voteData.mission_id}-${missionData.data.checkpoints[0].children[0]}`
        );
      });

    await axios
      .post(`${process.env.BACKEND_API}/vote/create`, voteData)
      .then((response) => {
        expect(response.data.message).to.eq(
          `FALLBACK: Move this checkpoint to ${voteData.mission_id}-${checkpointFallback.children[0]}`
        );
      });

    await axios
      .post(`${process.env.BACKEND_API}/vote/create`, voteData)
      .then((response) => {
        expect(response.data.message).to.eq('Cannot vote in End Node');
      });
  });
});
