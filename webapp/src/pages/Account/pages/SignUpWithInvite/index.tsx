import React, { useEffect, useState } from 'react';
import { Input, Button, Form } from 'antd';
import { useNavigate } from 'react-router-dom';
import { L } from '@utils/locales/L';
import LogoSyncVote from '@assets/icons/svg-icons/LogoSyncVote';
import { changePassword } from '@middleware/data';
import { Modal } from 'antd';

type FieldType = {
  password?: string;
};

function SignUpWithInvite() {
  const navigate = useNavigate();
  const currentUrl = new URL(window.location.href);
  const email = currentUrl.searchParams.get('email');

  const onFinish = (values: any) => {
    changePassword({
      password: values.password,
      onSuccess: () => {
        Modal.success({
          title: 'Success',
          content: 'Invite user successfully',
          onOk() {
            navigate('/');
          },
        });
      },
      onError: (error: any) => {
        console.error(error);
        Modal.error({
          title: 'Error',
          content: 'Cannot invite user',
        });
      },
    });
  };

  return (
    <div>
      <div className='flex flex-col mt-36 w-96 px-6 items-center justify-center'>
        <LogoSyncVote width='63' height='48' />
        <p className='text-neutral-800 text-[28px] font-semibold mt-16 mb-2'>
          {L('welcomeToSyncvote')}
        </p>
        <p className='text-neutral-600 text-sm font-medium mb-14'>
          {`${L('youSignUpWith')} ${email} `}
        </p>
      </div>
      <Form
        layout={'vertical'}
        name='basic'
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete='off'
        size='large'
      >
        <Form.Item<FieldType>
          label={L('password')}
          name='password'
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type='primary' htmlType='submit' block className='mt-2'>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default SignUpWithInvite;
