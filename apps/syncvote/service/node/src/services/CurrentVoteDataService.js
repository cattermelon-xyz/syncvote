const { supabase } = require('../configs/supabaseClient');

async function insertCurrentVoteData(props) {
  const { data: newCurrentVoteData, error } = await supabase
    .from('current_vote_data')
    .insert(props)
    .select('*');
  console.log(error);
  if (!error) {
    return { ...newCurrentVoteData[0] };
  } else {
    return {
      status: 'ERR',
      message: error,
    };
  }
}

module.exports = {
  insertCurrentVoteData,
};
