import axios from 'axios';

export const createMission = ({
  missionData,
  workflowVersion,
}: {
  missionData: any;
  workflowVersion: any;
}) => {
  console.log(workflowVersion);

  axios
    .post('http://localhost:3000/api/mission/create', missionData)
    .then((response) => {
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
        };

        await createCheckpointBE({ checkpointDataBe });
      });
    })
    .catch((error) => {
      console.log('Error', error);
    });
};

const createCheckpointBE = async ({
  checkpointDataBe,
}: {
  checkpointDataBe: any;
}) => {
  axios
    .post('http://localhost:3000/api/checkpoint/create', checkpointDataBe)
    .then(async (response) => {
      const checkpoint = response.data.data[0];
      if (checkpoint.vote_machine_type) {
        await createCurrentVoteDataBE({ checkpointId: checkpoint.id });
      }
    })
    .catch((error) => {
      console.log('Error', error);
    });
};

const createCurrentVoteDataBE = async ({
  checkpointId,
}: {
  checkpointId: string;
}) => {
  axios
    .post('http://localhost:3000/api/current-vote-data/create', {
      checkpoint_id: checkpointId,
    })
    .then((response) => {
      console.log('Success', response.data);
    })
    .catch((error) => {
      console.log('Error', error);
    });
};
