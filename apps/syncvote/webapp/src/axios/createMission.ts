import axios from 'axios';

export const createMission = async ({
  missionData,
  workflowVersion,
  onSuccess,
  onError,
}: {
  missionData: any;
  workflowVersion: any;
  onSuccess: () => void;
  onError: () => void;
}) => {
  axios
    .post(`${import.meta.env.VITE_SERVER_URL}/mission/create`, missionData)
    .then((response) => {
      if (missionData.status === 'PUBLIC') {
        const mission = response.data.data[0];

        workflowVersion.data.checkpoints.map(async (checkpoint: any) => {
          const checkpointDataBe = {
            id: `${mission.id}-${checkpoint.id}`,
            vote_machine_type: checkpoint.vote_machine_type,
            mission_id: mission.id,
            participation: checkpoint?.participation,
            quorum: 60,
            options: checkpoint.data?.options,
            delays: checkpoint?.delays,
            delayUnits: checkpoint?.delayUnits,
            duration: checkpoint?.duration,
            children: checkpoint?.children,
          };

          await createCheckpointBE({ checkpointDataBe });
        });
      }

      onSuccess();
    })
    .catch((error) => {
      console.log('Error', error);
      onError();
    });
};

export const updateMission = async ({
  missionId,
  missionData,
  workflowVersion,
  onSuccess,
  onError,
}: {
  missionId: number;
  missionData: any;
  workflowVersion: any;
  onSuccess: () => void;
  onError: () => void;
}) => {
  axios
    .post(`${import.meta.env.VITE_SERVER_URL}/mission/update`, {
      params: missionData,
      missionId: missionId,
    })
    .then((response) => {
      if (missionData.status === 'PUBLIC') {
        const mission = response.data.data[0];

        workflowVersion.data.checkpoints.map(async (checkpoint: any) => {
          const checkpointDataBe = {
            id: `${mission.id}-${checkpoint.id}`,
            vote_machine_type: checkpoint.vote_machine_type,
            mission_id: mission.id,
            participation: checkpoint?.participation,
            quorum: 60,
            options: checkpoint.data?.options,
            delays: checkpoint?.delays,
            delayUnits: checkpoint?.delayUnits,
            duration: checkpoint?.duration,
            children: checkpoint?.children,
          };

          await createCheckpointBE({ checkpointDataBe });
        });
      }

      onSuccess();
    })
    .catch((error) => {
      console.log('Error', error);
      onError();
    });
};

const createCheckpointBE = async ({
  checkpointDataBe,
}: {
  checkpointDataBe: any;
}) => {
  axios
    .post(
      `${import.meta.env.VITE_SERVER_URL}/checkpoint/create`,
      checkpointDataBe
    )
    .then(async (response) => {
      console.log('Success create checkpoint', response.data);
    })
    .catch((error) => {
      console.log('Error', error);
    });
};

// const createCurrentVoteDataBE = async ({
//   checkpointId,
// }: {
//   checkpointId: string;
// }) => {
//   axios
//     .post(`${import.meta.env.VITE_SERVER_URL}/current-vote-data/create`, {
//       checkpoint_id: checkpointId,
//     })
//     .then((response) => {
//       console.log('Success', response.data);
//     })
//     .catch((error) => {
//       console.log('Error', error);
//     });
// };
