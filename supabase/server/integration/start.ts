import axios from 'npm:axios@^1.5.0';
import moment from 'npm:moment@^2.29.4';
import { supabase } from '../configs/supabaseClient.ts';
import { VoteMachineController } from '../models/VotingController.ts';
// import { createArweave } from '../functions/index.ts';

export const handleMovingToNextCheckpoint = async ({
  details,
  tallyResult,
  timeDefault,
}: {
  details: any;
  tallyResult: any;
  timeDefault: any;
}) => {
  try {
    // change endedAt of current vote data to moment for this checkpoint
    const { data: current_vote_data } = await supabase
      .from('current_vote_data')
      .update({
        endedAt: moment().format(),
        tallyResult: tallyResult,
      })
      .eq('id', details.cvd_id)
      .select('*');

    // // Update arweave_id for current_vote_data
    // const { arweave_id } = await createArweave(current_vote_data[0]);
    // await supabase
    //   .from('current_vote_data')
    //   .update({ arweave_id: arweave_id })
    //   .eq('id', details.cvd_id);

    // Init startToVote for next checkpoint
    let startToVote = timeDefault;

    // Index of next checkpoint
    const index = tallyResult.index;

    // Update startToVote if have delays
    if (details.delays) {
      if (details.delays[index]) {
        let delayUnits = `${details.delayUnits[index]}s`;

        startToVote = startToVote.add(details.delays[index], delayUnits);
      }
    }

    // Next checkpontId
    const next_checkpoint_id = `${details.mission_id}-${details.children[index]}`;

    // create current vote data for next checkpoint
    const { data: new_current_vote_data } = await supabase
      .from('current_vote_data')
      .insert({
        checkpoint_id: next_checkpoint_id,
        startToVote: startToVote,
        initData: tallyResult,
      })
      .select('*');
    // console.log('data to insert new_current_vote_data: ', {
    //   checkpoint_id: next_checkpoint_id,
    //   startToVote: startToVote,
    //   initData: tallyResult,
    // });
    // console.log('new_current_vote_data: ', new_current_vote_data);
    // Update next current vote data for mission
    const { error } = await supabase
      .from('mission')
      .update({
        current_vote_data_id: new_current_vote_data[0].id,
      })
      .eq('id', details.mission_id);

    let { data: next_details } = await supabase
      .from('mission_vote_details')
      .select(`*`)
      .eq('mission_id', details.mission_id);

    const startNextCheckpoint = async (details) => {
      if (!details?.vote_machine_type && details?.isEnd) {
        await startEndNode({ details: details });
      } else if (details?.vote_machine_type && !details?.isEnd) {
        if (details?.vote_machine_type === 'forkNode') {
          await startForkNode({ details: details });
        } else {
          await start({ details: details });
        }
      } else {
        console.log('Debug', details);
      }
    };

    if (startToVote.unix() === timeDefault.unix()) {
      await startNextCheckpoint(next_details[0]);
    } else {
      // const cronSyntax = convertToCron(moment(startToVote));
      // const job = new CronJob(cronSyntax, async function () {
      //   await startNextCheckpoint(next_details[0]);
      // });
      // job.start();
      // console.log(`Start a job to start for ${next_checkpoint_id} `);
    }

    if (error) {
      console.log(error);
    }

    return { next_checkpoint_id };
  } catch (error) {
    console.log('Handle moving to next checkpoint error', error);
    return {};
  }
};

export const startEndNode = async ({ details }) => {
  try {
    console.log('Start EndNode: ', details.id);
    // update mission
    await supabase
      .from('mission')
      .update({ status: 'STOPPED' })
      .eq('id', details.mission_id);

    // update current_vote_data
    await supabase
      .from('current_vote_data')
      .update({ endedAt: moment().format() })
      .eq('id', details.cvd_id);

    // check if this misison have parent
    if (details.m_parent) {
      // get data of current_vote_data of m_parent
      const { data } = await supabase
        .from('mission')
        .select('*, current_vote_data(*, checkpoint(*))')
        .eq('id', details.m_parent);

      const misison_parent_data = data[0];

      // check if current checkpoint is ForkNode
      if (
        misison_parent_data.current_vote_data.checkpoint.vote_machine_type ===
        'forkNode'
      ) {
        // Update current_vote_data of ForkNode
        let result = misison_parent_data.current_vote_data.result;
        if (result && result.condition.length > 0) {
          // Append to result mission Id
          result.condition.push(details.mission_id);
        } else {
          result = { condition: [details.mission_id] };
        }

        await supabase
          .from('current_vote_data')
          .update({
            result: result,
          })
          .eq('id', misison_parent_data.current_vote_data.id);

        // Check if parent misson satisfy the conditions to go to JoinNode
        if (
          arraysEqual(
            result.condition,
            misison_parent_data.current_vote_data.initData.end
          )
        ) {
          // Update current_vote_data for ForkNode
          await supabase
            .from('current_vote_data')
            .update({ tallyResult: result, endedAt: moment().format() })
            .eq('id', misison_parent_data.current_vote_data.id);

          // Create current_vote_data for JointNode
          const { data: new_current_vote_data } = await supabase
            .from('current_vote_data')
            .insert({
              checkpoint_id:
                misison_parent_data.current_vote_data.initData.joinNode,
              startToVote: moment().format(),
            })
            .select('*');

          // Update current_vote_data for mission
          await supabase
            .from('mission')
            .update({ current_vote_data_id: new_current_vote_data[0].id })
            .eq('id', details.m_parent);

          // Get new details
          const { data: new_details } = await supabase
            .from('mission_vote_details')
            .select('*')
            .eq('mission_id', details.m_parent);

          const tallyResult = { index: 0 };
          const timeDefault = moment();
          // go to next checkpoint

          await handleMovingToNextCheckpoint({
            details: new_details[0],
            tallyResult,
            timeDefault,
          });
        }
      } else {
        console.log(
          `Children checkpoint is running but mission parent don't run in ForkNode`
        );
      }
    }
  } catch (error) {
    console.log('StartEndNodeError', error);
  }
};

export const startForkNode = async ({ details }) => {
  try {
    const subWorkflows = details?.data?.subWorkflows;
    const end = details?.props?.end;
    const start = details?.props?.start;
    const startMissionId: any[] = [];
    const endMissionId: any[] = [];

    for (let subWorkflowData of subWorkflows) {
      if (start.includes(subWorkflowData.refId)) {
        const { checkpoints, ...newObject } = subWorkflowData;

        await axios
          .post(`${process.env.BACKEND_API}/mission/create`, {
            data: { checkpoints: checkpoints },
            ...newObject,
            status: 'PUBLIC',
            creator_id: details.creator_id,
            parent: details.mission_id,
            workflow_version_id: details.workflow_version_id,
          })
          .then(async (response: any) => {
            if (response.data.status !== 'ERR') {
              startMissionId.push(response.data.data[0].id);
              if (end.includes(subWorkflowData.refId)) {
                endMissionId.push(response.data.data[0].id);
              }
            }
          });
      }
    }

    // update current_vote_data of ForkNode
    await supabase
      .from('current_vote_data')
      .update({
        initData: {
          joinNode: details.mission_id + '-' + details.props.joinNode,
          start: startMissionId,
          end: endMissionId,
        },
      })
      .eq('id', details.cvd_id);
  } catch (error) {
    console.log('StartForkNodeError: ', error);
  }
};

export const start = async ({ details }) => {
  try {
    console.log(`Start ${details.vote_machine_type} Node: `, details.id);
    const voteMachineController = new VoteMachineController(details);
    // 1. Get the data was created by voteMachine
    const { result } = voteMachineController.initDataForCVD();

    // 2. Update result current_vote_data for checkpoint
    await supabase
      .from('current_vote_data')
      .update({
        result: result,
      })
      .eq('id', details.cvd_id);

    // 3. Update the result of mission_vote_details
    details.result = result;

    // create a job to stop this checkpoint
    const stopTime = moment(details.startToVote).add(
      details.duration,
      'seconds'
    );
    // const cronSyntax = convertToCron(stopTime);
    // const job = new CronJob(cronSyntax, async function () {
    //   await fetch(`${process.env.BACKEND_API}/vote/create`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       identify: `cronjob-${checkpointData.id}`,
    //       option: ['fake option'],
    //       mission_id: details.id,
    //     }),
    //   });
    // });
    // job.start();
  } catch (error) {
    console.log('StartRegularNodeError: ', error);
  }
};

function arraysEqual(arr1: any, arr2: any) {
  if (arr1.length !== arr2.length) {
    return false;
  }

  return arr1.every((element) => arr2.includes(element));
}

export function checkMinDurationTally(details: any) {
  if (details.minDuration) {
    const now = moment().unix();
    const startToVoteMoment = moment(details.startToVote).unix();

    if (startToVoteMoment + details.minDuration <= now) {
      return true;
    }

    return false;
  }

  return true;
}
