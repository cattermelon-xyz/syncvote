const expect = require('chai').expect;
const { supabase } = require('../src/configs/supabaseClient');
const dotenv = require('dotenv');
const axios = require('axios');
const moment = require('moment');
const { insertCheckpoint } = require('../src/services/CheckpointService');

dotenv.config();

describe('Test with 2 Fork and Join Node', function () {
  this.timeout(50000);
  after(async function () {
    // console.log('Delete prepare data');
    // const { error } = await supabase
    //   .from('current_vote_data')
    //   .delete()
    //   .eq('id', 9999);
    // expect(error).to.eq(null);
  });

  it('Test create proposal', async function () {
    this.timeout(10000);
    try {
      let testMissonData = missionData;
      const checkpointIdForkNode = testMissonData.data.checkpoints[1].id;

      // Change the votemachine where have title ForkNode data
      testMissonData.data.checkpoints[1].vote_machine_type = 'ForkNode';
      testMissonData.data.checkpoints[1].id = checkpointIdForkNode + '-start';

      expect(testMissonData.data.checkpoints[1].vote_machine_type).to.eq(
        'ForkNode'
      );
      expect(testMissonData.data.checkpoints[1].id).to.eq(
        checkpointIdForkNode + '-start'
      );

      // Change the votemachine where have title JoinNode data
      testMissonData.data.checkpoints[5].vote_machine_type = 'JoinNode';
      testMissonData.data.checkpoints[5].id = checkpointIdForkNode + '-end';

      expect(testMissonData.data.checkpoints[5].vote_machine_type).to.eq(
        'JoinNode'
      );
      expect(testMissonData.data.checkpoints[5].id).to.eq(
        checkpointIdForkNode + '-end'
      );

      // Change the children of endnode in submission
      testMissonData.data.checkpoints[2].children = null;
      testMissonData.data.checkpoints[4].children = null;

      expect(testMissonData.data.checkpoints[2].children).to.eq(null);
      expect(testMissonData.data.checkpoints[4].children).to.eq(null);

      const { data: newMission, error } = await supabase
        .from('mission')
        .insert(testMissonData)
        .select('*');

      expect(error).to.eq(null);

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
    } catch (error) {
      throw error;
    }
  });

  it('Test move to ForkNode', async function () {
    this.timeout(10000);
    try {
      // const voteData = {
      //   id: 9999,
      //   identify: `chaukhac4@gmail.com`,
      //   option: [0],
      //   voting_power: 1,
      //   mission_id: 9999,
      // };
      // const response = await axios.post(
      //   `${process.env.BACKEND_API}/vote/create`,
      //   voteData
      // );
    } catch (error) {
      throw error;
    }
  });
});

const missionData = {
  id: '9999',
  title: 'Test create proposal',
  status: 'PUBLIC',
  start: 'root',
  data: {
    checkpoints: [
      {
        id: 'root',
        position: {
          x: -260.5,
          y: -49,
        },
        isEnd: false,
        data: {
          options: ['Going to fork'],
          max: 5,
        },
        children: ['node-1701789260746'],
        vote_machine_type: 'SingleChoiceRaceToMax',
        title: 'Checkpoint 0',
        delays: [1],
        delayUnits: ['hour'],
        delayNotes: [''],
        quorum: 10,
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
        duration: 86400,
      },
      {
        title: 'ForkNode',
        id: 'node-1701789260746',
        position: {
          x: 49.48197149331072,
          y: -15.399329877977053,
        },
        isEnd: false,
        children: ['node-1701789509670', 'node-1701789584321'],
        data: {
          options: ['Branch 1', 'Branch 2'],
          space: 'hetagon.eth',
          type: {
            label: 'Approval',
            value: 'approval',
          },
        },
        vote_machine_type: 'Snapshot',
        delays: [0, 0],
        delayUnits: ['minute', 'minute'],
        delayNotes: ['', ''],
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
        duration: 86400,
      },
      {
        title: 'SubMission 1.1',
        id: 'node-1701789509670',
        position: {
          x: 285.6163855955971,
          y: -144.67677248695264,
        },
        isEnd: false,
        children: ['node-1701789990766'],
        data: {
          options: ['OK'],
          max: 6,
        },
        vote_machine_type: 'SingleChoiceRaceToMax',
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
        quorum: 10,
        duration: 172800,
        delays: [0],
        delayUnits: ['minute'],
        delayNotes: [''],
      },
      {
        title: 'SubMission 2.1',
        id: 'node-1701789584321',
        position: {
          x: 288.0226545729197,
          y: 67.69400129575857,
        },
        isEnd: false,
        children: ['node-1701789766864'],
        data: {
          options: ['OK'],
          max: 6,
        },
        vote_machine_type: 'SingleChoiceRaceToMax',
        quorum: 10,
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
        delays: [0],
        delayUnits: ['minute'],
        delayNotes: [''],
        duration: 86400,
      },
      {
        title: 'SubMission 2.2',
        id: 'node-1701789766864',
        position: {
          x: 565.4095233598287,
          y: 96.5477261685659,
        },
        isEnd: false,
        children: ['node-1701789990766'],
        data: {
          options: ['OK'],
        },
        vote_machine_type: 'Snapshot',
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
        delays: [0],
        delayUnits: ['minute'],
        delayNotes: [''],
      },
      {
        title: 'JoinNode',
        id: 'node-1701789990766',
        position: {
          x: 840.4045562147472,
          y: -46.36223588343641,
        },
        isEnd: false,
        data: {
          options: ['OK'],
          max: 5,
        },
        children: ['node-1701790117491'],
        vote_machine_type: 'SingleChoiceRaceToMax',
        delays: [0],
        delayUnits: ['minute'],
        delayNotes: [''],
        quorum: 10,
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
      },
      {
        title: 'EndNode',
        id: 'node-1701790117491',
        position: {
          x: 1143.8100306962456,
          y: -12.440408393044464,
        },
        isEnd: true,
        children: [],
      },
    ],
    cosmetic: {
      defaultLayout: {
        horizontal: 'default',
        vertical: 'default',
      },
      layouts: [
        {
          id: 'default',
          title: 'Default',
          screen: 'Horizontal',
          renderer: '',
          nodes: [
            {
              id: 'root',
              position: {
                x: -260.5,
                y: -49,
              },
            },
            {
              id: 'node-1701789260746',
              position: {
                x: 49.48197149331072,
                y: -15.399329877977053,
              },
            },
            {
              id: 'node-1701789509670',
              position: {
                x: 285.6163855955971,
                y: -144.67677248695264,
              },
            },
            {
              id: 'node-1701789584321',
              position: {
                x: 288.0226545729197,
                y: 67.69400129575857,
              },
            },
            {
              id: 'node-1701789766864',
              position: {
                x: 565.4095233598287,
                y: 96.5477261685659,
              },
            },
            {
              id: 'node-1701789990766',
              position: {
                x: 840.4045562147472,
                y: -46.36223588343641,
              },
            },
            {
              id: 'node-1701790117491',
              position: {
                x: 1143.8100306962456,
                y: -12.440408393044464,
              },
            },
          ],
          edges: [],
          markers: [],
        },
      ],
    },
    docs: [],
    start: 'root',
  },
};
