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
    mission_id: 5,
  };

  it('1. Vote in time', async function () {
    this.timeout(5000);

    try {
      const response = await axios.post(
        `${process.env.BACKEND_API}/vote/create`,
        voteData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log(response.data);
      expect(response.data.message).to.eq('Vote successfully');
    } catch (e) {
      console.log(e);
      throw e;
    }
  });
});
