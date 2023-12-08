const { supabase } = require('../src/configs/supabaseClient');
const { insertCheckpoint } = require('../src/services/CheckpointService');
const moment = require('moment');
const missionData = process.env.MISSION_DATA;

const addMission = async () => {
  try {
    console.log('---Init data for testing---');
    const { data: newMission, error } = await supabase
      .from('mission')
      .insert(missionData)
      .select('*');

    if (!error) {
      if (newMission[0].status === 'PUBLIC') {
        for (const checkpoint of newMission[0].data.checkpoints) {
          const checkpointData = {
            id: `${newMission[0].id}-${checkpoint.id}`,
            vote_machine_type: checkpoint.vote_machine_type,
            mission_id: newMission[0].id,
            title: checkpoint.title,
            participation: checkpoint?.participation,
            quorum: checkpoint?.quorum,
            options: checkpoint.data?.options,
            thresholds: checkpoint.data?.max,
            delays: checkpoint?.delays,
            delayUnits: checkpoint?.delayUnits,
            duration: checkpoint?.duration,
            children: checkpoint?.children,
            isEnd: checkpoint?.isEnd,
            includedAbstain: checkpoint?.includedAbstain,
          };

          // Wait for each insertCheckpoint to finish before continuing
          await insertCheckpoint(checkpointData);

          // Additional logic for checkpoints
          if (checkpoint.id === newMission[0].start) {
            // Insert into current_vote_data and wait for it to finish
            await supabase
              .from('current_vote_data')
              .insert({
                id: 9999,
                checkpoint_id: `${newMission[0].id}-${checkpoint.id}`,
                startToVote: moment().format(),
              })
              .select('*');

            // Update mission and wait for it to finish
            await supabase
              .from('mission')
              .update({
                current_vote_data_id: 9999,
              })
              .eq('id', newMission[0].id)
              .select('*');
          }
        }
      }
    } else {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
};

const deleteMission = async () => {
  console.log('---Clear data for testing---');
  await supabase.from('current_vote_data').delete();
};

module.exports = {
  addMission,
  deleteMission,
  missionData,
};
