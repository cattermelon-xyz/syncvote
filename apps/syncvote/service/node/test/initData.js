const { supabase } = require('../src/configs/supabaseClient');
const { insertCheckpoint } = require('../src/services/CheckpointService');
const moment = require('moment');
const data = {
  checkpoints: [
    {
      id: 'root',
      position: {
        x: -425.8460529454213,
        y: -107.58947452112363,
      },
      isEnd: false,
      data: {
        options: ['Yes', 'No'],
        max: 3,
      },
      children: ['node-1695788594379', 'node-1695788837818'],
      vote_machine_type: 'SingleChoiceRaceToMax',
      title: 'Proposal',
      votingLocation:
        '<p><a href="https://gov.push.org/c/governance-proposals/8" rel="noopener noreferrer" target="_blank">Discourse #Proposal</a></p>',
      duration: 3600,
      participation: {
        type: 'identity',
        data: [
          'trungbaotran1701@gmail.com',
          'chaukhac4@gmail.com',
          'chaukhac5@gmail.com',
          'chaukhac6@gmail.com',
          'chaukhac7@gmail.com',
          'chaukhac8@gmail.com',
          'chaukhac9@gmail.com',
          'chaukhac3@gmail.com',
          'chaukhac2@gmail.com',
          'chaukhac1@gmail.com',
        ],
      },
      description:
        '<p>The Proposal phase may be considered as the initial step towards the governance journey. It is meant for you to present your ideas to the community and run a temperature check on whether your proposal gets the support from other community members.</p><p><br></p><h6><strong style="color: rgb(51, 51, 51);">What you need to follow:</strong></h6><ol><li><span style="color: rgb(51, 51, 51);">Draft a proposal following </span><u style="color: rgb(51, 51, 51);">below template</u></li><li><span style="color: rgb(51, 51, 51);">Post the proposal under Discourse forum\'s </span><a href="https://github.com/ethereum-push-notification-service/push-governance/blob/main/draft-proposal-template.md" rel="noopener noreferrer" target="_blank" style="color: rgb(51, 51, 51);">Governance Proposal category</a></li><li>PUSH Champions then check the submitted draft proposal to ensure it follows the <a href="https://github.com/ethereum-push-notification-service/governance/blob/main/governance-rules.md" rel="noopener noreferrer" target="_blank">governance rules</a>. In some cases, you might be asked to resubmit based on the Champions’ discretion.</li><li>Draft proposals are then promoted to the next phase provided they meet the promotion criteria mentioned below.</li></ol>',
      note: '<p><a href="https://github.com/ethereum-push-notification-service/push-governance/blob/main/draft-proposal-template.md" rel="noopener noreferrer" target="_blank">Proposal template</a></p>',
      includedAbstain: true,
      quorum: 5,
      delays: [1, 0],
      delayUnits: ['day', 'minute'],
      delayNotes: ['', ''],
    },
    {
      id: 'node-1695788594379',
      position: {
        x: -90.98023463810279,
        y: -99.33552948465524,
      },
      isEnd: false,
      title: 'Discussion',
      children: ['node-1695788631850', 'node-1695788837818'],
      data: {
        pass: 'node-1695788631850',
        fallback: 'node-1695788837818',
        token: '',
        threshold: 5,
      },
      vote_machine_type: 'UpVote',
      description:
        '<p>The next step in the governance journey is Discussion. The purpose of this phase is to initiate discussion and allow the community to debate and express approval or disapproval of the proposal. It is the last step before moving on to the formal voting phase.</p><p><br></p><h6><strong style="color: rgb(51, 51, 51);">What you need to follow:</strong></h6><ol><li>A Push Champion will promote your draft proposals from phase 1 to this phase once they have met the criteria to Governance Discussion.</li><li>The draft proposal promoted by PUSH Champions can deviate a bit from what started in the Governance Proposal section owing to the discussion and the spirit of the proposal. In the event of discrepancies between the draft proposal submitted in the Governance Proposal section and the Governance Discussion section, the proposal under the Governance Discussion section will prevail.</li></ol>',
      duration: 432000,
      resultDescription:
        '<p>Proposal must receive at least 10 likes and 3 replies to pass this phase</p>',
      votingLocation:
        '<p><a href="https://gov.push.org/c/governance-discussions/5" rel="noopener noreferrer" target="_blank">Discourse #Discussion</a></p>',
      participation: {
        type: 'identity',
        data: [
          'trungbaotran1701@gmail.com',
          'chaukhac4@gmail.com',
          'chaukhac5@gmail.com',
          'chaukhac6@gmail.com',
          'chaukhac7@gmail.com',
          'chaukhac8@gmail.com',
          'chaukhac9@gmail.com',
          'chaukhac3@gmail.com',
          'chaukhac2@gmail.com',
          'chaukhac1@gmail.com',
        ],
      },
      participationDescription: '<p>Forum members</p>',
      quorum: 10,
    },
    {
      id: 'node-1695788631850',
      position: {
        x: 238.2632973248309,
        y: -101.75988268094862,
      },
      isEnd: false,
      title: 'Governance',
      children: ['node-1695791578250', 'node-1695788837818'],
      data: {
        options: ['For', 'Against'],
        token: 'eth.PUSH.0xf418588522d5dd018b425E472991E52EBBeEEEEE',
        max: 5,
      },
      vote_machine_type: 'SingleChoiceRaceToMax',
      participation: {
        type: 'identity',
        data: [
          'trungbaotran1701@gmail.com',
          'chaukhac4@gmail.com',
          'chaukhac5@gmail.com',
          'chaukhac6@gmail.com',
          'chaukhac7@gmail.com',
          'chaukhac8@gmail.com',
          'chaukhac9@gmail.com',
          'chaukhac3@gmail.com',
          'chaukhac2@gmail.com',
          'chaukhac1@gmail.com',
        ],
      },
      description:
        '<p>Governance is the final phase of the governance process. Once the proposal on the Governance Discussion section meets the promotion criteria, it’s considered a formal proposal and requires formal voting which takes place on Snapshot. A formal proposal can be defeated or accepted as outlined by <u>the rules below.</u></p>',
      duration: 604800,
      quorum: 10,
      votingLocation:
        '<p><a href="https://snapshot.org/#/pushdao.eth" rel="noopener noreferrer" target="_blank">Snapshot</a></p>',
      delays: [0, 0],
      delayUnits: ['minute', 'minute'],
      delayNotes: ['', ''],
      note: '<p>Only users who have 75k+ votes (delegated or owned) can initiate the formal proposal. If the user doesn’t have enough votes, then it’s expected of the user to either find a Delegatee to submit their formal proposal or request a Champion to find one for them.</p>',
      resultDescription:
        '<p>Votes on Snapshot are weighted by the number of $PUSH delegated to the address used to vote. For a vote to pass on Snapshot, it must achieve a quorum of 4% of the <a href="https://coinmarketcap.com/currencies/epns/" rel="noopener noreferrer" target="_blank">circulating supply of $PUSH</a> voting in the affirmative. The purpose of the quorum is to ensure that the approved proposals have adequate voter participation. This means that if a proposal that had a majority of votes affirmative but didn’t achieve the necessary quorum, it won’t be approved.</p>',
    },
    {
      id: 'node-1695788837818',
      position: {
        x: -24.91435009844536,
        y: 190.54953382164246,
      },
      isEnd: true,
      title: 'Cancel',
      children: [],
      description:
        '<p><span style="color: rgb(87, 86, 85);">If at any point of the process, you decide to give up or your proposal is not supported by the community, it will be moved to Cancel.</span></p>',
    },
    {
      id: 'node-1695791578250',
      position: {
        x: 532.398411798078,
        y: -69.64567529334056,
      },
      isEnd: true,
      title: 'Execution',
      children: [],
      description:
        '<p><span style="color: rgb(87, 86, 85);">Congrats! Your proposal has successfully pass the Governance Process and made it to execution.</span></p>',
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
            id: 'node-1695788594379',
            position: {
              x: -90.98023463810279,
              y: -99.33552948465524,
            },
            style: {
              title: {
                backgroundColor: '#A9D3F5',
                color: '#252422',
              },
              content: {
                backgroundColor: '#B0DCFF',
                color: '#252422',
              },
            },
          },
          {
            id: 'root',
            position: {
              x: -425.8460529454213,
              y: -107.58947452112363,
            },
            style: {
              title: {
                backgroundColor: '#A9D3F5',
                color: '#252422',
              },
              content: {
                backgroundColor: '#B0DCFF',
                color: '#252422',
              },
            },
          },
          {
            id: 'node-1695788631850',
            position: {
              x: 238.2632973248309,
              y: -101.75988268094862,
            },
            style: {
              title: {
                backgroundColor: '#E7AEF0',
                color: '#252422',
              },
              content: {
                backgroundColor: '#F0B5FA',
                color: '#252422',
              },
            },
          },
          {
            id: 'node-1695788837818',
            position: {
              x: -24.91435009844536,
              y: 190.54953382164246,
            },
            style: {
              title: {
                backgroundColor: '#F0B2AE',
                color: '#252422',
                strokeWidth: 2,
              },
              content: {
                backgroundColor: '#FAB9B5',
                color: '#252422',
              },
            },
          },
          {
            id: 'node-1695791578250',
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
            position: {
              x: 532.398411798078,
              y: -69.64567529334056,
            },
          },
        ],
        edges: [],
        markers: [
          {
            color: '#E7AEF0',
            title: 'Formal voting',
          },
          {
            color: '#A9D3F5',
            title: 'Informal voting',
          },
          {
            color: '#9CEAB3',
            title: 'Pass',
          },
          {
            color: '#F0B2AE',
            title: 'Red',
          },
        ],
      },
    ],
  },
  docs: [],
  start: 'root',
};

const missionData = {
  id: 9999,
  creator_id: '8ce1c0ae-77f8-4f58-9cfd-8d863971e4c6',
  status: 'PUBLIC',
  title: 'Test',
  data: data,
  icon_url: '0.09503771242976189.jpeg',
  start: 'root',
  workflow_version_id: 322,
};

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
