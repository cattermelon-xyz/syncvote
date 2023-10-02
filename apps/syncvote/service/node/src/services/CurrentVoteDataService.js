const { supabase } = require('../configs/supabaseClient');

<<<<<<< HEAD
async function insertCurrentVoteData(props) {
  return new Promise(async (resolve, reject) => {
    try {
      const { checkpoint_id } = props;
=======
async function insertCurrentVoteData(params) {
  return new Promise(async (resolve, reject) => {
    try {
      const { checkpoint_id } = params;
>>>>>>> main
      const { data: newCurrentVoteData, error } = await supabase
        .from('current_vote_data')
        .insert({
          checkpoint_id: checkpoint_id,
          result: [],
        })
        .select('*');

      if (!error) {
        resolve({
          status: 'OK',
          message: 'SUCCESS',
          data: newCurrentVoteData,
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
  insertCurrentVoteData,
};
