import React, { useState } from 'react';
import { List, message } from 'antd';
import { ModalForm, ProForm, ProFormText } from '@ant-design/pro-components';
import { useIntl } from '@@/exports';
import { fieldIntl } from '@/util/fieldIntl';
import { getUserUserInfo, postUserResetPassword } from '@/services/admin/user';
import { useRequest } from 'ahooks';

type Unpacked<T> = T extends (infer U)[] ? U : T;

// const passwordStrength = {
//   strong: <span className="strong">强</span>,
//   medium: <span className="medium">中</span>,
//   weak: <span className="weak">弱 Weak</span>,
// };

const SecurityView: React.FC = () => {
  const intl = useIntl();

  // const [changePassword, setChangePassword] = useState<boolean>(false);
  const [openChangePassword, setOpenChangePassword] = useState<boolean>(false);

  const { data: currentUser, loading } = useRequest(async () => {
    const res = await getUserUserInfo();
    if (res) {
      return res;
    }
    return {};
  });

  const getData = () => [
    {
      title: '账户密码',
      description: <>密码存储方式为非对称加密，请妥善保管</>,
      actions: [
        <a key="Modify" onClick={() => setOpenChangePassword(true)}>
          修改
        </a>,
      ],
    },
    {
      title: '手机号',
      description:
        loading || !currentUser?.phone ? '未绑定手机' : `已绑定手机：${currentUser?.phone}`,
      actions: [<a key="Modify">{currentUser?.phone ? '修改' : '绑定'}</a>],
    },
    {
      title: '邮箱',
      description:
        loading || !currentUser?.email ? '未绑定邮箱' : `已绑定邮箱：${currentUser?.email}`,
      actions: [<a key="Modify">{currentUser?.email ? '修改' : '绑定'}</a>],
    },
  ];

  const data = getData();
  return (
    <>
      <List<Unpacked<typeof data>>
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item) => (
          <List.Item actions={item.actions}>
            <List.Item.Meta title={item.title} description={item.description} />
          </List.Item>
        )}
      />
      <ModalForm
        title={intl.formatMessage({
          id: 'pages.security.settings.changePassword',
          defaultMessage: 'Change Password',
        })}
        open={openChangePassword}
        onFinish={async (item: API.ResetPasswordRequest) => {
          await postUserResetPassword(item);
          message.success('修改成功');
          setOpenChangePassword(false);
          return true;
        }}
        onOpenChange={setOpenChangePassword}
      >
        <ProForm.Group>
          <ProFormText.Password
            name="password"
            label={fieldIntl(intl, 'password')}
            placeholder={intl.formatMessage({
              id: 'pages.login.password.placeholder',
            })}
            rules={[
              { required: true },
              { min: 8, message: intl.formatMessage({ id: 'pages.validate.password.min8' }) },
              { max: 20, message: intl.formatMessage({ id: 'pages.validate.password.max20' }) },
              {
                pattern: /[a-zA-Z]/,
                message: intl.formatMessage({ id: 'pages.validate.password.letter' }),
              },
              {
                pattern: /[0-9]/,
                message: intl.formatMessage({ id: 'pages.validate.password.number' }),
              },
            ]}
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormText.Password
            name="confirm"
            label={fieldIntl(intl, 'confirm')}
            placeholder={intl.formatMessage({
              id: 'pages.login.password.placeholder',
            })}
            rules={[
              { required: true },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      intl.formatMessage({
                        id: 'pages.login.passwordInconsistent',
                        defaultMessage: '两次密码不一致',
                      }),
                    ),
                  );
                },
              }),
            ]}
          />
        </ProForm.Group>
      </ModalForm>
    </>
  );
};

export default SecurityView;
