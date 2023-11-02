const expect = require('chai').expect;
const { supabase } = require('../src/configs/supabaseClient');

describe('Testing voting function', function () {
  const email = 'chaukhac4@gmail.com';
  const misisonId = 1;
  it('1. The side length of the Cube', async function (done) {
    const { data, error } = await supabase.from('mission').select().csv();

    await fetch(`${process.env.BACKEND_API}/vote/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identify: email,
        option: [1],
        voting_power: 1,
        mission_id: newMission[0].id,
      }),
    });
    done();
  });
});
