import React, { useEffect } from 'react';
import { Modal, Form, Input } from 'antd';
import { vote } from '@axios/vote';
import { useDispatch } from 'react-redux';
import { insertDocInput } from '@dal/data';

interface Props {
  open: boolean;
  onClose: () => void;
  option: any[];
  missionId: number;
  listParticipants: any[];
  currentCheckpointData: any;
  submission?: any;
}

const ModalVoterInfo: React.FC<Props> = ({
  open,
  onClose,
  option,
  missionId,
  listParticipants,
  currentCheckpointData,
  submission,
}) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    console.log('submission', submission);
  }, [submission]);

  const handleInsertDocInput = async (content: any) => {
    let arweaveData: any;
    await insertDocInput({
      content,
      onSuccess: (data: any) => {
        arweaveData = data;
      },
      onError: (error) => {
        Modal.error({
          title: 'Error',
          content: error,
        });
      },
      dispatch,
    });
    return arweaveData;
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      form.resetFields();
      let voteData: any = {
        identify: values.info,
        option: option,
        mission_id: missionId,
      };

      if (
        currentCheckpointData.vote_machine_type === 'DocInput' &&
        submission
      ) {
        const arweaveIds: any[] = [];
        for (const content of Object.values(submission)) {
          const data = await handleInsertDocInput(content);
          if (data) {
            arweaveIds.push(data);
          }
        }
        console.log('arweaveIds', arweaveIds);

        voteData.submission = arweaveIds.reduce(
          (acc: any, dataArweave: any, index) => {
            const docId = Object.keys(submission)[index];
            acc.push({ [docId]: dataArweave.id });
            return acc;
          },
          []
        );
      } else {
        voteData.voting_power = values.votepower;
      }

      console.log('voteData', voteData);

      if (!listParticipants.includes(voteData.identify)) {
        onClose();
        Modal.error({
          title: 'Error',
          content: `You're not in list participants`,
        });
        return;
      }

      // vote({
      //   data: voteData,
      //   onSuccess: (res: any) => {
      //     if (res.data.status === 'FALLBACK') {
      //       Modal.error({
      //         title: 'Error',
      //         content: res.data.message,
      //       });
      //     } else if (res.data.status === 'ERR') {
      //       Modal.error({
      //         title: 'Error',
      //         content: res.data.message,
      //       });
      //     } else {
      //       Modal.success({
      //         title: 'Success',
      //         content: 'Voting successfully',
      //         onOk: () => {
      //           window.location.reload();
      //         },
      //       });
      //     }
      //   },
      //   onError: () => {
      //     Modal.error({
      //       title: 'Error',
      //       content: 'Voting error',
      //     });
      //   },
      //   dispatch,
      // });

      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Modal
        title={'Please fill your info'}
        open={open}
        onOk={handleOk}
        onCancel={() => {
          onClose();
        }}
      >
        <Form form={form} layout='vertical' initialValues={{ votepower: 1 }}>
          <Form.Item
            label='Email or wallet address'
            name='info'
            rules={[
              {
                required: true,
                message: 'Please input your email or wallet address',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label='Voting power'
            name='votepower'
            rules={[
              {
                required: true,
                message: 'Please input your vote power',
              },
            ]}
          >
            <Input disabled />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ModalVoterInfo;
