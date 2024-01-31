const { supabase } = require('../configs/supabaseClient');

async function insertCurrentVoteData(props) {
  const { data: newCurrentVoteData, error } = await supabase
    .from('current_vote_data')
    .insert(props)
    .select('*');

  if (!error) {
    return { ...newCurrentVoteData[0] };
  } else {
    console.log('InsertCurrentVoteDataError: ', error);
  }
}

module.exports = {
  insertCurrentVoteData,
};
