import React from 'react';
import { Modal, Form, Input } from 'antd';

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
          voting_power: 1,
          mission_id: missionId,
        };

        console.log('voteData', voteData);
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
        </Form>
      </Modal>
    </>
  );
};

export default ModalVoterInfo;
