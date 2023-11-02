const expect = require('chai').expect;
const { supabase } = require('../src/configs/supabaseClient');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

describe('Testing voting function', function () {
  const voteData = {
    identify: `chaukhac4@gmail.com`,
    option: [1],
    voting_power: 1,
    mission_id: 4,
  };
  it('1. The side length of the Cube', async function (done) {
    try {
      const response = await axios.post(`${process.env.BACKEND_API}/vote/create`, voteData);
      console.log(response.data);
    } catch (error) {
      console.log(error);
      throw error;
    }
  });
});
