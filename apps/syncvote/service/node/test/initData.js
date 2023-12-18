const { supabase } = require('../src/configs/supabaseClient');
const { insertCheckpoint } = require('../src/services/CheckpointService');
const moment = require('moment');
const { insertMission } = require('../src/services/MissionService');

const missionData = {
  id: 9999,
  title: 'Test something',
  status: 'PUBLIC',
  start: 'root',
  data: {
    checkpoints: [
      {
        id: 'root',
        position: {
          x: -230,
          y: -82.18629219455424,
        },
        isEnd: false,
        title: 'Submit CV',
        children: ['node-1698650216102', 'node-1690073207997'],
        data: {
          options: ['OK', 'Unqualitfied'],
          max: 1,
        },
        vote_machine_type: 'SingleChoiceRaceToMax',
        delays: [5, 1],
        delayUnits: ['minute', 'day'],
        delayNotes: ['', ''],
        duration: 86400,
        participation: {
          type: 'identity',
          data: [
            'chaukhac4@gmail.com',
            'chaukhac5@gmail.com',
            'chaukhac6@gmail.com',
            'chaukhac7@gmail.com',
            'chaukhac8@gmail.com',
            'chaukhac9@gmail.com',
            'chaukhac10@gmail.com',
            'chaukhac11@gmail.com',
            'chaukhac12@gmail.com',
            'chaukhac13@gmail.com',
            'chaukhac14@gmail.com',
          ],
        },
        quorum: 3,
      },
      {
        id: 'node-1690073207997',
        position: {
          x: -15.569220599218006,
          y: -225.44146420233187,
        },
        title: 'CV scanning',
        children: ['node-1702611559476'],
        data: {
          options: ['OK'],
          space: 'hectagon.eth',
          type: {
            label: 'Single Choice',
            value: 'single-choice',
          },
          next: 'node-1702876588029',
          fallback: 'node-1702876588029',
          action: 'create-proposal',
        },
        vote_machine_type: 'Snapshot',
        participation: {
          type: 'identity',
          data: ['proposer'],
        },
        duration: 86400,
        delays: [0],
        delayUnits: ['minute'],
        delayNotes: [''],
      },
      {
        id: 'node-1690073235655',
        position: {
          x: 264.3512359562162,
          y: 97.14467422956034,
        },
        isEnd: true,
        title: 'Drop',
        children: [],
      },
      {
        title: 'Resubmit',
        id: 'node-1698650216102',
        position: {
          x: -18.310343491656198,
          y: 84.96895955706304,
        },
        isEnd: false,
        children: ['node-1690073235655'],
        data: {
          options: ['Fail'],
          max: 1,
        },
        vote_machine_type: 'SingleChoiceRaceToMax',
        duration: 18000,
        delays: [1],
        delayUnits: ['day'],
        delayNotes: [''],
        participation: {
          type: 'identity',
          data: [
            'chaukhac4@gmail.com',
            'chaukhac5@gmail.com',
            'chaukhac6@gmail.com',
            'chaukhac7@gmail.com',
            'chaukhac8@gmail.com',
            'chaukhac9@gmail.com',
            'chaukhac10@gmail.com',
            'chaukhac11@gmail.com',
            'chaukhac12@gmail.com',
            'chaukhac13@gmail.com',
            'chaukhac14@gmail.com',
          ],
        },
        quorum: 3,
      },
      {
        title: 'EndNode 2',
        id: 'node-1702611559476',
        position: {
          x: 196.92352788307966,
          y: -211.36020462876706,
        },
        isEnd: true,
        children: [],
      },
    ],
    start: 'root',
  },
};

const addMission = async () => {
  try {
    console.log('---Init data for testing---');
    await insertMission(missionData);
  } catch (error) {
    console.log(error);
  }
};

const deleteMission = async () => {
  console.log('---Clear data for testing---');
  await supabase.from('mission').delete().eq('id', 9999);
};

module.exports = {
  addMission,
  deleteMission,
  missionData,
};
