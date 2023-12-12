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
    console.log('Delete prepare data');
    const { error } = await supabase.from('mission').delete().eq('id', 9999);
    expect(error).to.eq(null);
  });

  it('Test create proposal', async function () {
    this.timeout(5000);
    try {
      let testMissonData = missionData;

      await axios
        .post(`${process.env.BACKEND_API}/mission/create`, testMissonData)
        .then((response) => {
          expect(response.data.status).to.eq('OK');
        });
    } catch (error) {
      throw error;
    }
  });

  // it('Move to ForkNode', async function () {});
});

const data = {
  checkpoints: [
    {
      id: 'root',
      position: {
        x: -540.7606924068922,
        y: -24.195862579913936,
      },
      data: {
        options: ['Edge 1'],
        max: 3,
      },
      children: ['node-1702354836571'],
      vote_machine_type: 'SingleChoiceRaceToMax',
      delays: [0],
      delayUnits: ['minute'],
      delayNotes: [''],
      quorum: 5,
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
      title: 'Checkpoint 1',
    },
    {
      title: 'ForkNode',
      id: 'node-1702354836571',
      position: {
        x: -260.5,
        y: 12.25,
      },
      children: ['node-1702355024351', 'node-1702355656184'],
      vote_machine_type: 'forkNode',
      data: {
        joinNode: 'node-1702354958184',
        start: ['subWorkflow1', 'subWorkflow2'],
        end: ['subWorkflow1'],
      },
    },
    {
      title: 'JoinNode',
      id: 'node-1702354958184',
      position: {
        x: 376.6683440962248,
        y: 13.170839422419547,
      },
      children: [],
      vote_machine_type: 'joinNode',
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
              x: -540.7606924068922,
              y: -24.195862579913936,
            },
          },
          {
            id: 'node-1702354836571',
            position: {
              x: -260.5,
              y: 12.25,
            },
          },
          {
            id: 'node-1702354958184',
            position: {
              x: 376.6683440962248,
              y: 13.170839422419547,
            },
            style: {
              title: {
                backgroundColor: '#9CEAB3',
                color: '#252422',
              },
              content: {
                backgroundColor: '#A2F4BA',
                color: '#252422',
              },
            },
          },
          {
            id: 'node-1702355024351',
            position: {
              x: -139.37623435811747,
              y: -66.43719332613011,
            },
          },
          {
            id: 'node-1702355127135',
            position: {
              x: 42.22491030969991,
              y: -69.25730289443985,
            },
          },
          {
            id: 'node-1702355656184',
            position: {
              x: -141.18115557867708,
              y: 107.2061991058333,
            },
          },
          {
            id: 'node-1702355770112',
            position: {
              x: 227.46043706303044,
              y: -66.22647619787149,
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
  subWorkflows: [
    {
      refId: 'subWorkflow1',
      start: 'node-1702355024351',
      checkpoints: [
        {
          title: '1.1',
          id: 'node-1702355024351',
          position: {
            x: -139.37623435811747,
            y: -66.43719332613011,
          },
          data: {
            options: ['Edge 2'],
            max: 3,
          },
          children: ['node-1702355127135'],
          quorum: 5,
          vote_machine_type: 'SingleChoiceRaceToMax',
          delays: [0],
          delayUnits: ['minute'],
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
          duration: 86400,
        },
        {
          title: 'EndNode',
          id: 'node-1702355770112',
          position: {
            x: 227.46043706303044,
            y: -66.22647619787149,
          },
          isEnd: true,
          children: [],
        },
        {
          title: '1.2',
          id: 'node-1702355127135',
          position: {
            x: 42.22491030969991,
            y: -69.25730289443985,
          },
          children: ['node-1702355770112'],
          data: {
            options: ['Edge 3'],
            space: 'hectagon.eth',
            type: {
              label: 'Single Choice',
              value: 'single-choice',
            },
          },
          vote_machine_type: 'Snapshot',
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
          delays: [0],
          delayUnits: ['minute'],
          delayNotes: [''],
        },
        {
          title: '1.2',
          id: 'node-1702355127135',
          position: {
            x: 42.22491030969991,
            y: -69.25730289443985,
          },
          children: ['node-1702355770112'],
          data: {
            options: ['Edge 3'],
            space: 'hectagon.eth',
            type: {
              label: 'Single Choice',
              value: 'single-choice',
            },
          },
          vote_machine_type: 'Snapshot',
          duration: 86400,
          participation: {
            type: 'identity',
            data: ['chaukhac4@gmail.com'],
          },
          delays: [0],
          delayUnits: ['minute'],
          delayNotes: [''],
        },
        {
          title: '1.2',
          id: 'node-1702355127135',
          position: {
            x: 42.22491030969991,
            y: -69.25730289443985,
          },
          children: ['node-1702355770112'],
          data: {
            options: ['Edge 3'],
            space: 'hectagon.eth',
            type: {
              label: 'Single Choice',
              value: 'single-choice',
            },
          },
          vote_machine_type: 'Snapshot',
          duration: 86400,
          participation: {
            type: 'identity',
            data: ['chaukhac4@gmail.com'],
          },
          delays: [0],
          delayUnits: ['minute'],
          delayNotes: [''],
        },
        {
          title: '1.2',
          id: 'node-1702355127135',
          position: {
            x: 42.22491030969991,
            y: -69.25730289443985,
          },
          children: ['node-1702355770112'],
          data: {
            options: ['Edge 3'],
            space: 'hectagon.eth',
            type: {
              label: 'Single Choice',
              value: 'single-choice',
            },
          },
          vote_machine_type: 'Snapshot',
          duration: 86400,
          participation: {
            type: 'identity',
            data: ['chaukhac4@gmail.com'],
          },
          delays: [0],
          delayUnits: ['minute'],
          delayNotes: [''],
        },
        {
          title: '1.2',
          id: 'node-1702355127135',
          position: {
            x: 42.22491030969991,
            y: -69.25730289443985,
          },
          children: ['node-1702355770112'],
          data: {
            options: ['Edge 3'],
            space: 'hectagon.eth',
            type: {
              label: 'Single Choice',
              value: 'single-choice',
            },
          },
          vote_machine_type: 'Snapshot',
          duration: 86400,
          participation: {
            type: 'identity',
            data: ['chaukhac4@gmail.com'],
          },
          delays: [0],
          delayUnits: ['minute'],
          delayNotes: [''],
        },
        {
          title: '1.2',
          id: 'node-1702355127135',
          position: {
            x: 42.22491030969991,
            y: -69.25730289443985,
          },
          children: ['node-1702355770112'],
          data: {
            options: ['Edge 3'],
            space: 'hectagon.eth',
            type: {
              label: 'Single Choice',
              value: 'single-choice',
            },
          },
          vote_machine_type: 'Snapshot',
          duration: 86400,
          participation: {
            type: 'identity',
            data: ['chaukhac4@gmail.com'],
          },
          delays: [0],
          delayUnits: ['minute'],
          delayNotes: [''],
        },
        {
          title: '1.2',
          id: 'node-1702355127135',
          position: {
            x: 42.22491030969991,
            y: -69.25730289443985,
          },
          children: ['node-1702355770112'],
          data: {
            options: ['Edge 3'],
            space: 'hectagon.eth',
            type: {
              label: 'Single Choice',
              value: 'single-choice',
            },
          },
          vote_machine_type: 'Snapshot',
          duration: 86400,
          participation: {
            type: 'identity',
            data: ['chaukhac4@gmail.com'],
          },
          delays: [0],
          delayUnits: ['minute'],
          delayNotes: [''],
        },
        {
          title: '1.2',
          id: 'node-1702355127135',
          position: {
            x: 42.22491030969991,
            y: -69.25730289443985,
          },
          children: ['node-1702355770112'],
          data: {
            options: ['Edge 3'],
            space: 'hectagon.eth',
            type: {
              label: 'Single Choice',
              value: 'single-choice',
            },
          },
          vote_machine_type: 'Snapshot',
          duration: 86400,
          participation: {
            type: 'identity',
            data: ['chaukhac4@gmail.com'],
          },
          delays: [0],
          delayUnits: ['minute'],
          delayNotes: [''],
        },
        {
          title: '1.2',
          id: 'node-1702355127135',
          position: {
            x: 42.22491030969991,
            y: -69.25730289443985,
          },
          children: ['node-1702355770112'],
          data: {
            options: ['Edge 3'],
            space: 'hectagon.eth',
            type: {
              label: 'Single Choice',
              value: 'single-choice',
            },
          },
          vote_machine_type: 'Snapshot',
          duration: 86400,
          participation: {
            type: 'identity',
            data: ['chaukhac4@gmail.com'],
          },
          delays: [0],
          delayUnits: ['minute'],
          delayNotes: [''],
        },
        {
          title: '1.2',
          id: 'node-1702355127135',
          position: {
            x: 42.22491030969991,
            y: -69.25730289443985,
          },
          children: ['node-1702355770112'],
          data: {
            options: ['Edge 3'],
            space: 'hectagon.eth',
            type: {
              label: 'Single Choice',
              value: 'single-choice',
            },
          },
          vote_machine_type: 'Snapshot',
          duration: 86400,
          participation: {
            type: 'identity',
            data: ['chaukhac4@gmail.com'],
          },
          delays: [0],
          delayUnits: ['minute'],
          delayNotes: [''],
        },
        {
          title: '1.2',
          id: 'node-1702355127135',
          position: {
            x: 42.22491030969991,
            y: -69.25730289443985,
          },
          children: ['node-1702355770112'],
          data: {
            options: ['Edge 3'],
            space: 'hectagon.eth',
            type: {
              label: 'Single Choice',
              value: 'single-choice',
            },
          },
          vote_machine_type: 'Snapshot',
          duration: 86400,
          participation: {
            type: 'identity',
            data: ['chaukhac4@gmail.com'],
          },
          delays: [0],
          delayUnits: ['minute'],
          delayNotes: [''],
        },
        {
          title: '1.2',
          id: 'node-1702355127135',
          position: {
            x: 42.22491030969991,
            y: -69.25730289443985,
          },
          children: ['node-1702355770112'],
          data: {
            options: ['Edge 3'],
            space: 'hectagon.eth',
            type: {
              label: 'Single Choice',
              value: 'single-choice',
            },
          },
          vote_machine_type: 'Snapshot',
          duration: 86400,
          participation: {
            type: 'identity',
            data: ['chaukhac4@gmail.com'],
          },
          delays: [0],
          delayUnits: ['minute'],
          delayNotes: [''],
        },
        {
          title: '1.2',
          id: 'node-1702355127135',
          position: {
            x: 42.22491030969991,
            y: -69.25730289443985,
          },
          children: ['node-1702355770112'],
          data: {
            options: ['Edge 3'],
            space: 'hectagon.eth',
            type: {
              label: 'Single Choice',
              value: 'single-choice',
            },
          },
          vote_machine_type: 'Snapshot',
          duration: 86400,
          participation: {
            type: 'identity',
            data: ['chaukhac4@gmail.com'],
          },
          delays: [0],
          delayUnits: ['minute'],
          delayNotes: [''],
        },
        {
          title: '1.2',
          id: 'node-1702355127135',
          position: {
            x: 42.22491030969991,
            y: -69.25730289443985,
          },
          children: ['node-1702355770112'],
          data: {
            options: ['Edge 3'],
            space: 'hectagon.eth',
            type: {
              label: 'Single Choice',
              value: 'single-choice',
            },
          },
          vote_machine_type: 'Snapshot',
          duration: 86400,
          participation: {
            type: 'identity',
            data: ['chaukhac4@gmail.com'],
          },
          delays: [0],
          delayUnits: ['minute'],
          delayNotes: [''],
        },
        {
          title: '1.2',
          id: 'node-1702355127135',
          position: {
            x: 42.22491030969991,
            y: -69.25730289443985,
          },
          children: ['node-1702355770112'],
          data: {
            options: ['Edge 3'],
            space: 'hectagon.eth',
            type: {
              label: 'Single Choice',
              value: 'single-choice',
            },
          },
          vote_machine_type: 'Snapshot',
          duration: 86400,
          participation: {
            type: 'identity',
            data: ['chaukhac4@gmail.com'],
          },
          delays: [0],
          delayUnits: ['minute'],
          delayNotes: [''],
        },
        {
          title: '1.2',
          id: 'node-1702355127135',
          position: {
            x: 42.22491030969991,
            y: -69.25730289443985,
          },
          children: ['node-1702355770112'],
          data: {
            options: ['Edge 3'],
            space: 'hectagon.eth',
            type: {
              label: 'Single Choice',
              value: 'single-choice',
            },
          },
          vote_machine_type: 'Snapshot',
          duration: 86400,
          participation: {
            type: 'identity',
            data: ['chaukhac4@gmail.com'],
          },
          delays: [0],
          delayUnits: ['minute'],
          delayNotes: [''],
        },
        {
          title: '1.2',
          id: 'node-1702355127135',
          position: {
            x: 42.22491030969991,
            y: -69.25730289443985,
          },
          children: ['node-1702355770112'],
          data: {
            options: ['Edge 3'],
            space: 'hectagon.eth',
            type: {
              label: 'Single Choice',
              value: 'single-choice',
            },
          },
          vote_machine_type: 'Snapshot',
          duration: 86400,
          participation: {
            type: 'identity',
            data: ['chaukhac4@gmail.com'],
          },
          delays: [0],
          delayUnits: ['minute'],
          delayNotes: [''],
        },
        {
          title: '1.2',
          id: 'node-1702355127135',
          position: {
            x: 42.22491030969991,
            y: -69.25730289443985,
          },
          children: ['node-1702355770112'],
          data: {
            options: ['Edge 3'],
            space: 'hectagon.eth',
            type: {
              label: 'Single Choice',
              value: 'single-choice',
            },
          },
          vote_machine_type: 'Snapshot',
          duration: 86400,
          participation: {
            type: 'identity',
            data: ['chaukhac4@gmail.com'],
          },
          delays: [0],
          delayUnits: ['minute'],
          delayNotes: [''],
        },
        {
          title: '1.2',
          id: 'node-1702355127135',
          position: {
            x: 42.22491030969991,
            y: -69.25730289443985,
          },
          children: ['node-1702355770112'],
          data: {
            options: ['Edge 3'],
            space: 'hectagon.eth',
            type: {
              label: 'Single Choice',
              value: 'single-choice',
            },
          },
          vote_machine_type: 'Snapshot',
          duration: 86400,
          participation: {
            type: 'identity',
            data: ['chaukhac4@gmail.com'],
          },
          delays: [0],
          delayUnits: ['minute'],
          delayNotes: [''],
        },
        {
          title: '1.2',
          id: 'node-1702355127135',
          position: {
            x: 42.22491030969991,
            y: -69.25730289443985,
          },
          children: ['node-1702355770112'],
          data: {
            options: ['Edge 3'],
            space: 'hectagon.eth',
            type: {
              label: 'Single Choice',
              value: 'single-choice',
            },
          },
          vote_machine_type: 'Snapshot',
          duration: 86400,
          participation: {
            type: 'identity',
            data: ['chaukhac4@gmail.com'],
          },
          delays: [0],
          delayUnits: ['minute'],
          delayNotes: [''],
        },
        {
          title: '1.2',
          id: 'node-1702355127135',
          position: {
            x: 42.22491030969991,
            y: -69.25730289443985,
          },
          children: ['node-1702355770112'],
          data: {
            options: ['Edge 3'],
            space: 'hectagon.eth',
            type: {
              label: 'Single Choice',
              value: 'single-choice',
            },
          },
          vote_machine_type: 'Snapshot',
          duration: 86400,
          participation: {
            type: 'identity',
          },
          delays: [0],
          delayUnits: ['minute'],
          delayNotes: [''],
        },
        {
          title: '1.2',
          id: 'node-1702355127135',
          position: {
            x: 42.22491030969991,
            y: -69.25730289443985,
          },
          children: ['node-1702355770112'],
          data: {
            options: ['Edge 3'],
            space: 'hectagon.eth',
            type: {
              label: 'Single Choice',
              value: 'single-choice',
            },
          },
          vote_machine_type: 'Snapshot',
          duration: 86400,
          participation: {
            type: 'identity',
          },
          delays: [0],
          delayUnits: ['minute'],
          delayNotes: [''],
        },
      ],
    },
    {
      refId: 'subWorkflow2',
      start: 'node-1702355656184',
      checkpoints: [
        {
          title: '2.1',
          id: 'node-1702355656184',
          position: {
            x: -141.18115557867708,
            y: 107.2061991058333,
          },
          children: [],
          data: {
            options: [],
            max: 3,
            token: '',
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
          duration: 86400,
          quorum: 5,
        },
      ],
    },
  ],
  variables: [],
};

const missionData = {
  id: '9999',
  title: 'Test create proposal',
  status: 'PUBLIC',
  start: 'root',
  data: data,
  creator_id: 'Chau Khac',
};
