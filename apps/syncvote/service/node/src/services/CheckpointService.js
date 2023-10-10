const { supabase } = require('../configs/supabaseClient');

async function insertCheckpoint(props) {
  try {
    const { error } = await supabase
      .from('checkpoint')
      .insert(props)
      .select('*');
<<<<<<< HEAD
=======

>>>>>>> main
    if (error) {
      return error;
    }
  } catch (e) {
    return e;
  }
}

module.exports = {
  insertCheckpoint,
};
