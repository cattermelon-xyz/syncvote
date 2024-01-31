const { supabase } = require('../configs/supabaseClient');
const { VoteRecord } = require('../models/VoteRecord');

async function getAllVoteRecord() {
  return new Promise(async (resolve, reject) => {
    try {
      const { data, error } = await supabase.from('mission').select('*');

      if (!error) {
        let voteRecords = [];
        data.map((vr) => {
          voteRecords.push(
            new VoteRecord(
              vr.id,
              vr.who,
              vr.option,
              vr.current_vote_data_id
            )
          );
        });
        resolve({
          status: 'OK',
          message: 'SUCCESS',
          data: voteRecords,
        });
      } else {
        resolve({
          status: 'ERR',
          massage: 'Cannot get all vote records',
        });
      }
    } catch (e) {
      reject(e);
    }
  });
}

module.exports = {
  getAllVoteRecord,
};
