import React from 'react';
import { Modal, Form, Input } from 'antd';
import { vote } from '@axios/vote';

interface Props {
  open: boolean;
  onClose: () => void;
  option: any[];
  missionId: number;
}

const ModalVoterInfo: React.FC<Props> = ({
  open,
  onClose,
  option,
  missionId,
}) => {
  const [form] = Form.useForm();

  const handleOk = async () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();
        const voteData = {
          identify: values.info,
          option: option,
          voting_power: values.votepower,
          mission_id: missionId,
        };

        vote({
          data: voteData,
          onSuccess: (res: any) => {
            console.log('res', res);
            Modal.success({
              title: 'Success',
              content: 'Voting successfully',
            });
          },
          onError: () => {
            Modal.error({
              title: 'Error',
              content: 'Voting error',
            });
          },
        });

        onClose();
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
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
        <Form form={form} layout='vertical'>
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
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ModalVoterInfo;
