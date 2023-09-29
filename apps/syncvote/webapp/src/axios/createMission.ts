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
  onSuccess = () => {},
  onError = () => {},
}: {
  missionId: number;
  missionData: any;
  workflowVersion?: any;
  onSuccess?: () => void;
  onError?: () => void;
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
      const checkpoint = response.data.data[0];

      if (checkpoint.id === `${checkpoint.mission_id}-root`) {
        createCurrentVoteDataBE({
          checkpointId: checkpoint.id,
          missionId: checkpoint.mission_id,
        });
      }
    })
    .catch((error) => {
      console.log('Error', error);
    });
};

const createCurrentVoteDataBE = async ({
  checkpointId,
  missionId,
}: {
  checkpointId: string;
  missionId: number;
}) => {
  axios
    .post(`${import.meta.env.VITE_SERVER_URL}/current-vote-data/create`, {
      checkpoint_id: checkpointId,
    })
    .then(async (response) => {
      console.log('Success', response.data);

      await updateMission({
        missionId: missionId,
        missionData: {
          current_vote_data_id: response.data.data[0].id,
        },
      });
    })
    .catch((error) => {
      console.log('Error', error);
    });
};
