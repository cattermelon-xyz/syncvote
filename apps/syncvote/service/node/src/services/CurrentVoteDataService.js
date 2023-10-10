const { supabase } = require('../configs/supabaseClient');

async function insertCurrentVoteData(props) {
<<<<<<< HEAD
  const { data: newCurrentVoteData, error } = await supabase
    .from('current_vote_data')
    .insert(props)
    .select('*');
=======
  return new Promise(async (resolve, reject) => {
    try {
      const { checkpoint_id, options } = props;
      
      const optionCounts = {};
      for (const option of options) {
        optionCounts[option] = 0;
      }

      const { data: newCurrentVoteData, error } = await supabase
        .from('current_vote_data')
        .insert({
          checkpoint_id: checkpoint_id,
          // result: { ...optionCounts },
        })
        .select('*');
>>>>>>> main

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
