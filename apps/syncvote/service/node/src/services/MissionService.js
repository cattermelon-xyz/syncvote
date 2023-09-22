const { supabase } = require('../configs/supabaseClient');
const { Mission } = require('../models/Mission');

async function getAllMission() {
  return new Promise(async (resolve, reject) => {
    try {
      const { data, error } = await supabase.from('mission').select('*');

      if (!error) {
        let missions = [];
        data.map((m) => {
          missions.push(
            new Mission(m.id, m.owner_id, m.status, m.current_vote_data_id)
          );
        });
        resolve({
          status: 'OK',
          message: 'SUCCESS',
          data: missions,
        });
      } else {
        resolve({
          status: 'ERR',
          massage: 'Cannot get all mission',
        });
      }
    } catch (e) {
      reject(e);
    }
  });
}

async function insertMisson(params) {
  return new Promise(async (resolve, reject) => {
    const { owner_id, status, current_vote_data_id } = params;
    try {
      const { data: newMission, error } = await supabase
        .from('mission')
        .insert({ owner_id, status, current_vote_data_id })
        .select('*');

      if (!error) {
        resolve({
          status: 'OK',
          message: 'SUCCESS',
          data: newMission,
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
  getAllMission,
  insertMisson,
};
