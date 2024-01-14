import axios from 'axios';
import { startLoading, finishLoading } from '@redux/reducers/ui.reducer';
// TODO: fix this, syncvote should not depend on any votemachine
import { SingleChoice } from 'single-vote/src/SingleChoice/funcs';
import { ICheckPoint } from 'directed-graph';
import { DocInput } from 'doc-input/src/DocInput/funcs';
import { Veto } from 'veto/src/Veto/funcs';
import { UpVote } from 'upvote/src/UpVote/funcs';
import { Discourse } from 'discourse/src/Discourse/funcs';
import { Snapshot } from 'snapshot/src/Snapshot/funcs';
import { Tally } from 'tally-xyz/src/Tally/funcs';
import { Realms } from 'realms-solana/src/Realms/funcs';

// TODO: fix this, syncvote should not depend on any votemachine
const VoteMachineValidate = {
  SingleChoiceRaceToMax: SingleChoice.validate,
  DocInput: DocInput.validate,
  Veto: Veto.validate,
  UpVote: UpVote.validate,
  Discourse: Discourse.validate,
  Snapshot: Snapshot.validate,
  Tally: Tally.validate,
  Realms: Realms.validate,
};
type VoteMachineType =
  | 'SingleChoiceRaceToMax'
  | 'DocInput'
  | 'Veto'
  | 'UpVote'
  | 'Discourse'
  | 'Snapshot'
  | 'Tally'
  | 'Realms';

export const createMission = async ({
  missionData,
  onSuccess,
  onError,
  dispatch,
  author,
}: {
  missionData: any;
  onSuccess: (data: any) => void;
  onError: (error: any) => void;
  dispatch: any;
  author: string;
}) => {
  dispatch(startLoading({}));
  // check if all checkpoint of this mission is valid
  const newMissionData = structuredClone(missionData);
  const data = newMissionData.data;
  let isValidate = true;
  const allCheckPoints = data.checkpoints ? [...data.checkpoints] : [];
  data.subWorkflows?.map((sw: any) => {
    sw.checkpoints?.map((chk: any) => {
      allCheckPoints.push({ ...chk, subWorkflowId: sw.refId });
    });
  });
  allCheckPoints.forEach((checkpoint: ICheckPoint, index: number) => {
    if (
      !checkpoint?.isEnd &&
      checkpoint.vote_machine_type !== 'forkNode' &&
      checkpoint.vote_machine_type !== 'joinNode'
    ) {
      const { duration, participation, title } = checkpoint;
      if (checkpoint.vote_machine_type) {
        const { isValid, message } = VoteMachineValidate[
          checkpoint.vote_machine_type as VoteMachineType
        ]({ checkpoint: checkpoint });
        if (!duration || !participation || !title || !isValid) {
          isValidate = false;
          console.log(`${checkpoint.vote_machine_type}: `, message);
        }
      }
      if (checkpoint.participation?.type === 'identity') {
        const list = <string[]>participation?.data || [];
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
      .post(`${import.meta.env.VITE_SERVER_URL}/mission/create`, newMissionData)
      .then((response) => {
        console.log('Respone', response.data);
        if (response.data.status === 'ERR') {
          onError(response.data.message);
        } else {
          onSuccess(response.data);
        }
        dispatch(finishLoading({}));
      })
      .catch((error) => {
        console.log('Error', error);
        onError(error);
        dispatch(finishLoading({}));
      });
  } else {
    console.log('Here');
    onError('Checkpoint of this proposal is missing attributes');
    dispatch(finishLoading({}));
  }
};

export const updateMission = async ({
  missionId,
  missionData,
  onSuccess = () => {},
  onError = () => {},
  dispatch,
}: {
  missionId: number;
  missionData: any;
  onSuccess?: (msg: any) => void;
  onError?: (mgs: any) => void;
  dispatch: any;
}) => {
  dispatch(startLoading({}));
  axios
    .post(`${import.meta.env.VITE_SERVER_URL}/mission/update`, {
      params: missionData,
      missionId: missionId,
    })
    .then((response) => {
      console.log('Respone', response.data);
      if (response.data.status === 'ERR') {
        onError(response.data.message);
      }
      onSuccess('');
      dispatch(finishLoading({}));
    })
    .catch((error) => {
      console.log('Error', error);
      onError('Error to edit a proposal');
      dispatch(finishLoading({}));
    });
};
