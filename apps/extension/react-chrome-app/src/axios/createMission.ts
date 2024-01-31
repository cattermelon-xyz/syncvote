import axios from 'axios';
import { ICheckPoint } from 'directed-graph';
import { SingleChoice } from 'single-vote/src/SingleChoice/funcs';
import { DocInput } from 'doc-input/src/DocInput/funcs';
import { Veto } from 'veto/src/Veto/funcs';
import { UpVote } from 'upvote/src/UpVote/funcs';
import { Discourse } from 'discourse/src/Discourse/funcs';
import { Snapshot } from 'snapshot/src/Snapshot/funcs';

const serverUrl = process.env.BACKEND_URL as string;

const VoteMachineValidate = {
  SingleChoiceRaceToMax: SingleChoice.validate,
  DocInput: DocInput.validate,
  Veto: Veto.validate,
  UpVote: UpVote.validate,
  Discourse: Discourse.validate,
  Snapshot: Snapshot.validate,
};
type VoteMachineType =
  | 'SingleChoiceRaceToMax'
  | 'DocInput'
  | 'Veto'
  | 'UpVote'
  | 'Discourse'
  | 'Snapshot';

export const createMission = async ({
  missionData,
  onSuccess,
  onError,
  author,
}: {
  missionData: any;
  onSuccess: (data: any) => void;
  onError: (error: any) => void;
  author: string;
}) => {
  // check if all checkpoint of this mission is valid
  const newMissionData = structuredClone(missionData);
  const data = newMissionData.data;
  let isValidate = true;
  const allCheckPoints = data.checkpoints ? [...data.checkpoints] : [];
  data.subWorkflows?.map((sw: any) => {
    sw.checkpoints?.map((chk: any) => {
      allCheckPoints.push({ ...chk, subWorkflowId: sw.refId });
      return null;
    });
    return null;
  });
  allCheckPoints.forEach((checkpoint: ICheckPoint, index: number) => {
    if (
      !checkpoint?.isEnd &&
      checkpoint.vote_machine_type !== 'forkNode' &&
      checkpoint.vote_machine_type !== 'joinNode'
    ) {
      const { duration, participation, title } = checkpoint;
      if (checkpoint.vote_machine_type) {
        console.log('vote_machine_type', checkpoint.vote_machine_type);
        const { isValid, message } = VoteMachineValidate[
          checkpoint.vote_machine_type as VoteMachineType
        ]({ checkpoint: checkpoint });
        if (!duration || !participation || !title || !isValid) {
          isValidate = false;
          console.log(`${checkpoint.vote_machine_type}: `, message);
        }
      }
      if (checkpoint.participation?.type === 'identity') {
        const list = (participation?.data as string[]) || [];
        checkpoint.participation.data = list.map(function (id: string) {
          if (id === 'proposer' || id === 'author') {
            return author;
          }
          return id || '';
        });
      }
    }
  });
  if (isValidate) {
    axios
      .post(`${serverUrl}/mission/create`, newMissionData)
      .then((response) => {
        console.log('Respone', response.data);
        if (response.data.status === 'ERR') {
          onError(response.data.message);
        } else {
          onSuccess(response.data);
        }
      })
      .catch((error) => {
        console.log('Error', error);
        onError(error);
      });
  } else {
    console.log('Here');
    onError('Checkpoint of this proposal is missing attributes');
  }
};
