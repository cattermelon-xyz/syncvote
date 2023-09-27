const { supabase } = require('../configs/supabaseClient');
const { Checkpoint } = require('../models/Checkpoint');

async function getAllCheckpoint() {
  return new Promise(async (resolve, reject) => {
    try {
      const { data, error } = await supabase.from('checkpoint').select('*');

      if (!error) {
        let checkpoints = [];
        data.map((cp) => {
          checkpoints.push(
            new Checkpoint(
              cp.id,
              cp.vote_machine_type,
              cp.childrens,
              cp.mission_id,
              cp.duration,
              cp.participation,
              cp.delays,
              cp.delayUnits,
              cp.quorum,
              cp.options
            )
          );
        });
        resolve({
          status: 'OK',
          message: 'SUCCESS',
          data: checkpoints,
        });
      } else {
        resolve({
          status: 'ERR',
          massage: 'Cannot get all checkpoints',
        });
      }
    } catch (e) {
      reject(e);
    }
  });
}

async function insertCheckpoint(props) {
  return new Promise(async (resolve, reject) => {
    try {
      const { data: newCheckpoint, error } = await supabase
        .from('checkpoint')
        .insert(props)
        .select('*');

      if (!error) {
        resolve({
          status: 'OK',
          message: 'SUCCESS',
          data: newCheckpoint,
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
  getAllCheckpoint,
  insertCheckpoint,
};
