import axios from 'axios';
import { ICheckPoint } from 'directed-graph';
import { SingleChoice } from 'single-vote/src/SingleChoice/funcs';
import { DocInput } from 'doc-input/src/DocInput/funcs';
import { Veto } from 'veto/src/Veto/funcs';
import { UpVote } from 'upvote/src/UpVote/funcs';

const serverUrl = process.env.SERVER_URL as string;

const VoteMachineValidate = {
  SingleChoiceRaceToMax: SingleChoice.validate,
  DocInput: DocInput.validate,
  Veto: Veto.validate,
  UpVote: UpVote.validate,
};
type VoteMachineType = 'SingleChoiceRaceToMax' | 'DocInput' | 'Veto' | 'UpVote';

export const createMission = async ({
  missionData,
  onSuccess,
  onError,
}: {
  missionData: any;
  onSuccess: (data: any) => void;
  onError: (error: any) => void;
}) => {
  // check if all checkpoint of this mission is valid
  const data = missionData.data;
  let isValidate = false;
  data.checkpoints.forEach((checkpoint: ICheckPoint, index: number) => {
    if (
      !checkpoint?.isEnd &&
      checkpoint.vote_machine_type !== 'Snapshot' &&
      checkpoint.vote_machine_type !== 'Discourse'
    ) {
      const { duration, participation, title, quorum } = checkpoint;
      if (checkpoint.vote_machine_type) {
        const { isValid, message } = VoteMachineValidate[
          checkpoint.vote_machine_type as VoteMachineType
        ]({ checkpoint: checkpoint });
        if (duration && participation && title && isValid) {
          if (checkpoint.vote_machine_type !== 'DocInput') {
            if (quorum) {
              isValidate = true;
            }
          } else {
            isValidate = true;
          }
        }
      }
    }
  });
  if (isValidate) {
    axios
      .post(`${serverUrl}/mission/create`, missionData)
      .then((response: any) => {
        console.log('Respone', response.data);
        if (response.data.status === 'ERR') {
          onError(response.data.message);
        } else {
          onSuccess(response.data);
        }
      })
      .catch((error: any) => {
        console.log('Error', error);
        onError(error);
      });
  } else {
    console.log('Here');
    onError('Checkpoint of this proposal is missing attributes');
  }
};
