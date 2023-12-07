const {
  VoteMachineController,
} = require('../../models/votemachines/VotingController');
const { supabase } = require('../../configs/supabaseClient');

const moment = require('moment');
var CronJob = require('cron').CronJob;
const { createArweave, convertToCron } = require('../../functions');
const PostService = require('../PostService');

const checkIfFirstTimeOfVoting = async (details) => {
  let voteMachineController = new VoteMachineController(details);
  let firstTimeToVote = false;

  if (!details.result) {
    console.log(`It's first time of voting`);
    // 1. Get the data was created by voteMachine
    const {
      initData,
      error: init_error,
      result,
    } = voteMachineController.initDataForCVD();

    // check if cannot init the data for current_vote_data
    if (!initData) {
      resolve({
        status: 'ERR',
        message: init_error,
      });
      return;
    }

    // 2. Update result current_vote_data for checkpoint
    await supabase
      .from('current_vote_data')
      .update({
        result: result,
      })
      .eq('id', details.cvd_id);

    // 3. Update the result of mission_vote_details
    details.result = result;

    // 4. Update voteController
    voteMachineController = new VoteMachineController(details);

    firstTimeToVote = true;
  }

  return { firstTimeToVote, voteMachineController };
};

const handleMovingToNextCheckpoint = async (
  details,
  tallyResult,
  timeDefault
) => {
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

    // Update arweave_id for current_vote_data
    const { arweave_id } = await createArweave(current_vote_data[0]);
    await supabase
      .from('current_vote_data')
      .update({ arweave_id: arweave_id })
      .eq('id', details.cvd_id);

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

    // Init next checkpontId
    const next_checkpoint_id = `${details.mission_id}-${
      details.children[tallyResult.index]
    }`;

    // get data of next checkpoint
    const { data: next_checkpoint } = await supabase
      .from('checkpoint')
      .select('*')
      .eq('id', next_checkpoint_id);

    // create current vote data for next checkpoint
    const { data: new_current_vote_data } = await supabase
      .from('current_vote_data')
      .insert({
        checkpoint_id: next_checkpoint_id,
        initData: tallyResult,
        startToVote: startToVote,
      })
      .select('*');

    // create a job for create post
    const cronSyntax = convertToCron(moment(startToVote));
    const job = new CronJob(cronSyntax, async function () {
      // post when have topic
      if (details.topic_id !== null) {
        const { data: web2KeyData, error: errorWeb2KeyData } = await supabase
          .from('web2_key')
          .select('*')
          .eq('org_id', details.org_id);

        if (web2KeyData.length > 0) {
          const filteredDiscourse = web2KeyData.filter(
            (integration) => integration.provider === 'discourse'
          );

          if (filteredDiscourse.length === 1) {
            const discourseConfig = filteredDiscourse[0];

            const postData = {
              topic_id: details.topic_id,
              raw: `<p>Checkpoint ${next_checkpoint[0].title} has been started</p>
                            <p>Checkpoint description: ${next_checkpoint[0].desc} </p>`,
              org_id: details.org_id,
              discourseConfig,
            };

            PostService.createPost(postData);
          }
        }
      }

      // vote to start checkpoint
      await fetch(`${process.env.BACKEND_API}/vote/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identify: `cronjob-${checkpointData.id}`,
          option: ['fake option'],
          voting_power: 9999,
          mission_id: details.id,
        }),
      });
    });
    job.start();
    console.log(`Start a job to post and start for ${next_checkpoint_id} `);

    // Update next current vote data for mission
    await supabase
      .from('mission')
      .update({
        current_vote_data_id: new_current_vote_data[0].id,
      })
      .eq('id', details.mission_id);

    return { next_checkpoint_id };
  } catch (error) {
    console.log('Handle moving to next checkpoint error', error);
    return {};
  }
};

module.exports = {
  checkIfFirstTimeOfVoting,
  handleMovingToNextCheckpoint,
};