import moment from 'npm:moment@^2.29.4';

import { getMissionVoteDetailsDatabase } from './integration/database/missionVoteDetails.ts';
import {
  checkMinDurationTally,
  handleMovingToNextCheckpoint,
} from './integration/start.ts';
import { supabase } from './configs/supabaseClient.ts';
import { VoteMachineController } from './VotingController.ts';
import { error } from 'console';

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

export const vote = async (req: any) => {
  try {
    const props = await req.json();
    const { mission_id, identify } = props;
    if (!mission_id) {
      throw new Error('VotingError: Missing mission id');
    }
    console.log('Voting at mission: ', mission_id);

    const { data: details, error: mvd_error } =
      await getMissionVoteDetailsDatabase({ mission_id: mission_id });

    if (mvd_error) {
      throw new Error('VotingError: ' + mvd_error);
    }

    // 1️⃣ check mission is not created or publish
    if (!details) {
      throw new Error('VotingError: This mission is not created or publish');
    }

    // 2️⃣ check mission is stopped
    if (details.status === 'STOPPED') {
      throw new Error('VotingError: This mission is stopped!');
    }

    if (!details?.vote_machine_type && details?.isEnd) {
      throw new Error('VotingError: Cannot vote in End Node');
    } else if (details.vote_machine_type === 'forkNode') {
      throw new Error('VotingError: Cannot vote in forkNode');
    } else {
      const voteMachineController = new VoteMachineController(details);
      // 4️⃣ check if fallback
      const { fallback, error: f_error } = voteMachineController.fallBack();

      if (fallback) {
        console.log('FallbackError: ', f_error);
        const tallyResult = {
          index: details?.props?.fallback
            ? details.children.indexOf(details?.props?.fallback)
            : 0,
        };

        const timeDefault = moment(details.startToVote).add(
          details.duration,
          'seconds'
        );

        let { next_checkpoint_id } = await handleMovingToNextCheckpoint({
          details,
          tallyResult,
          timeDefault,
        });

        return new Response(
          JSON.stringify({
            message: `FALLBACK: Move this checkpoint to ${next_checkpoint_id}`,
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        );
      }

      // 5️⃣ check if recorded
      const { notRecorded, error: r_error } =
        await voteMachineController.recordVote(props);

      if (notRecorded) {
        throw new Error('VotingError: ' + r_error);
      }

      // 6️⃣ write this record to vote data record and change the result
      const { error: nv_error } = await supabase
        .from('vote_record')
        .insert({
          identify,
          option: [props.option] || [props.submission],
          current_vote_data_id: details.cvd_id,
        })
        .select('*');

      if (nv_error) {
        throw new Error('VoteRecordError: ' + String(nv_error));
      }

      // 7️⃣ change the result
      const { who, result } = voteMachineController.getResult();
      const { error: cvd_err } = await supabase
        .from('current_vote_data')
        .update({ who: who, result: result })
        .eq('id', details.cvd_id);

      if (cvd_err) {
        throw new Error('ChangeResultError: ' + String(cvd_err));
      }

      // 8️⃣ Check if tally
      const {
        shouldTally,
        error: t_error,
        tallyResult,
      } = voteMachineController.shouldTally();

      // check if tally have error
      if (t_error) {
        console.log('TallyError: ', t_error);
        const tallyResult = {
          index: details?.props?.fallback
            ? details.children.indexOf(details?.props?.fallback)
            : 0,
        };

        const timeDefault = moment(details.startToVote).add(
          details.duration,
          'seconds'
        );

        let { next_checkpoint_id } = await handleMovingToNextCheckpoint({
          details,
          tallyResult,
          timeDefault,
        });

        return new Response(
          JSON.stringify({
            message: `FALLBACK: Move this checkpoint to ${next_checkpoint_id}`,
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        );
      }

      if (shouldTally && tallyResult && checkMinDurationTally(details)) {
        let timeDefault = moment();

        const { next_checkpoint_id } = await handleMovingToNextCheckpoint({
          details,
          tallyResult,
          timeDefault,
        });
        return new Response(
          JSON.stringify({
            message: `Vote successfully => Move to next checkpoint ${next_checkpoint_id}`,
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        );
      }

      return new Response(
        JSON.stringify({
          message: `Vote successfully`,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: error,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  }
};
