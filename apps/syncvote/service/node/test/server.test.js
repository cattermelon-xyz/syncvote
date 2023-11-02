const expect = require('chai').expect;
const { supabase } = require('../src/configs/supabaseClient');

describe('Testing voting function', function () {
  it('1. The side length of the Cube', async function (done) {
    const { data, error } = await supabase.from('mission').select().csv();
    done();
  });
});
