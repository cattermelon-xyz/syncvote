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
              vr.voting_power,
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

async function insertVoteRecord(props) {
  return new Promise(async (resolve, reject) => {
    try {
      const { data: newVoteRecord, error } = await supabase
        .from('vote_record')
        .insert(props)
        .select('*');

      if (!error) {
        resolve({
          status: 'OK',
          message: 'SUCCESS',
          data: newVoteRecord,
        });
      } else {
        resolve({
          status: 'ERR',
          message: error,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
}

module.exports = {
  getAllVoteRecord,
  insertVoteRecord,
};
