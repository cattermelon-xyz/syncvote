import { Modal } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import {
  upsertAMission, deleteMission, queryAMission, queryWeb2Integration,
} from '@middleware/data';
import { extractIdFromIdString, shouldUseCachedData } from '@utils/helpers';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IMission } from '@types';
import { create } from '@middleware/data/dash';

import MissionData from './fragments/MissionData';

const EditMission = () => {
  const {
    missionIdString, orgIdString,
  } = useParams();
  const { web2Integrations } = useSelector((state: any) => state.integration);
  const { lastFetch, missions } = useSelector((state: any) => state.workflow);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const missionId = extractIdFromIdString(missionIdString);
  const orgId = extractIdFromIdString(orgIdString);
  const [currentMission, setCurrentMission] = useState<IMission>(
    missions.find((m: any) => m.id === missionId) || {
    id: -1,
    title: '',
    desc: '',
    data: '{checkpoints:[]}',
    status: 'DRAFT',
  });
  const [web2IntegrationsState, setWeb2IntegrationsState] = useState(web2Integrations);
  useEffect(() => {
    if (missionIdString && !shouldUseCachedData(lastFetch)) {
      queryAMission({
        missionId,
        onLoad: (data) => {
          setCurrentMission(data[0]);
        },
        dispatch,
      });
      queryWeb2Integration({
        orgId,
        onLoad: (data) => {
          setWeb2IntegrationsState(data);
        },
        dispatch,
      });
    }
  }, [missions, lastFetch]);
  const onSave = async (newMission:any) => {
    await upsertAMission({
      mission: newMission,
      onLoad: (data) => {
        setCurrentMission(data[0]);
        Modal.success({
          title: 'Success',
          content: 'Mission saved successfully',
        });
      },
      onError: (error) => {
        Modal.error({
          title: 'Error',
          content: error.message,
        });
      },
      dispatch,
    });
  };
  const onDelete = () => {
    deleteMission({
      id: currentMission.id || -1,
      onLoad: () => {
        navigate(`/${orgIdString}`);
        Modal.success({
          title: 'Success',
          content: 'Mission deleted successfully',
        });
      },
      dispatch,
    });
  };
  const onPublish = () => {
    create({
      json: currentMission.data,
      title: currentMission.title || '',
      desc: currentMission.desc || '',
      dispatch,
      onSuccess: (blockchainResp:any) => {
        const newMission = {
          ...currentMission,
          status: 'PUBLISHED',
          solana_address: blockchainResp.id,
        };
        setCurrentMission(newMission);
        onSave(newMission);
      },
      onError: (error) => {
        Modal.error({
          title: 'Error',
          content: error.message,
        });
      },
    });
  };
  const onUnPublish = () => {
    const newMission = {
      ...currentMission,
      status: 'DRAFT',
      solana_address: '',
    };
    setCurrentMission(newMission);
    onSave(newMission);
  };
  return (
    <div className="w-full h-full">
      <MissionData
        currentMission={currentMission}
        web2IntegrationsState={web2IntegrationsState}
        setCurrentMissionData={(data: any) => {
          setCurrentMission({
            ...currentMission,
            data,
          });
        }}
        onPublish={onPublish}
        onDelete={onDelete}
        onUnPublish={onUnPublish}
      />
    </div>
  );
};

export default EditMission;
