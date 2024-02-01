import { SingleVote } from './SingleVote.ts';
import { DocInput } from './DocInput.ts';
import { Veto } from './Veto.ts';
import { UpVote } from './UpVote.ts';
import { Snapshot } from './Snapshot.ts';
import { Discourse } from './Discourse.ts';
import { Tally } from './Tally.ts';
import { Realms } from './Realms.ts';
import moment from 'npm:moment@^2.29.4';

import {
  insertMissionDatabase,
  updateMissionDatabase,
} from './integration/database/mission.ts';
import { insertCheckpointDatabase } from './integration/database/checkpoint.ts';
import { insertCvdDatabase } from './integration/database/currentVoteData.ts';
import { getMissionVoteDetailsDatabase } from './integration/database/missionVoteDetails.ts';
import { start } from './integration/start.ts';
import { createArweave } from './functions/index.ts';

const VoteMachineValidate = {
  SingleChoiceRaceToMax: new SingleVote({}),
  DocInput: new DocInput({}),
  Veto: new Veto({}),
  UpVote: new UpVote({}),
  Snapshot: new Snapshot({}),
  Discourse: new Discourse({}),
  Tally: new Tally({}),
  Realms: new Realms({}),
};

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

export const handler = async (req: any) => {
  try {
    const props = await req.json();
    if (props.refId && props.parent) {
      console.log('Create Mission: ', props.refId);
    } else {
      console.log('Create Mission');
    }

    // const { arweave_id, error: arweave_err } = await createArweave(props);
    // if (arweave_err) {
    //   throw new Error('CreateArweaveError: ' + arweave_err);
    // }

    const { data: newMission, error } = await insertMissionDatabase({
      ...props,
      // arweave_id: arweave_id,
    });

    if (error) {
      throw new Error(`CreateMissionError: ${error}`);
    } else {
      if (newMission.status === 'PUBLIC') {
        console.log('Loop to create all checkpoint');
        for (const checkpoint of newMission.data.checkpoints) {
          if (
            !checkpoint.isEnd &&
            checkpoint?.vote_machine_type !== 'forkNode' &&
            checkpoint?.vote_machine_type !== 'joinNode'
          ) {
            const { duration, participation, title } = checkpoint;
            const { isValid, message } =
              VoteMachineValidate[checkpoint.vote_machine_type].validate(
                checkpoint
              );

            if (!duration || !participation || !title || !isValid) {
              throw new Error(
                `${checkpoint?.vote_machine_type}: ` + String(message)
              );
            }
          }

          const checkpointData = {
            id: `${newMission.id}-${checkpoint.id}`,
            vote_machine_type: checkpoint.vote_machine_type,
            mission_id: newMission.id,
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
            desc: checkpoint?.description,
            props: checkpoint?.data,
            inHappyPath: checkpoint?.inHappyPath,
          };

          console.log('CreateCheckpoint: ', checkpointData.id);
          const { error } = await insertCheckpointDatabase(checkpointData);

          if (error) {
            throw new Error(`CreateCheckPointError: ${JSON.stringify(error)}`);
          }
        }

        console.log('Start mission');
        const { data: current_vote_data } = await insertCvdDatabase({
          checkpoint_id: `${newMission.id}-${newMission.start}`,
          startToVote: moment().format(),
        });

        const { error: u_error } = await updateMissionDatabase({
          cvd_id: current_vote_data.id,
          mission_id: newMission.id,
        });

        if (u_error) {
          throw new Error(u_error);
        }

        const { data: details } = await getMissionVoteDetailsDatabase({
          mission_id: newMission.id,
        });

        await start({ details: details });
      }
    }

    return new Response(
      JSON.stringify({
        message: 'CreateMissionSuccessfully',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        message: error,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
};
