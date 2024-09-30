import { List, Switch } from 'antd';
import React, { Fragment, useState } from 'react';
import { getUserConfigsGroup, putUserConfigsGroup } from '@/services/admin/userConfig';
import { useRequest } from 'ahooks';

type Unpacked<T> = T extends (infer U)[] ? U : T;

const NotificationView: React.FC = () => {
  const [refresh, setRefresh] = useState(0);

  const { data, loading } = useRequest(
    async () => {
      return await getUserConfigsGroup({ group: 'notification' });
    },
    {
      refreshDeps: [refresh],
    },
  );

  const getData = () => {
    return [
      {
        title: '账户密码',
        description: '其他用户的消息将以站内信的形式通知',
        actions: [
          <Switch
            key="password"
            checkedChildren="开"
            unCheckedChildren="关"
            onChange={async (e) => {
              await putUserConfigsGroup({ group: 'notification' }, { data: { password: e } });
              setRefresh(refresh + 1);
            }}
            value={data?.password === 'true'}
            loading={loading}
          />,
        ],
      },
      {
        title: '系统消息',
        description: '系统消息将以站内信的形式通知',
        actions: [
          <Switch
            key="system"
            checkedChildren="开"
            unCheckedChildren="关"
            onChange={async (e) => {
              await putUserConfigsGroup({ group: 'notification' }, { data: { system: e } });
              setRefresh(refresh + 1);
            }}
            value={data?.system === 'true'}
            loading={loading}
          />,
        ],
      },
      {
        title: '待办任务',
        description: '待办任务将以站内信的形式通知',
        actions: [
          <Switch
            key="todo"
            checkedChildren="开"
            unCheckedChildren="关"
            onChange={async (e) => {
              await putUserConfigsGroup({ group: 'notification' }, { data: { todo: e } });
              setRefresh(refresh + 1);
            }}
            value={data?.todo === 'true'}
            loading={loading}
          />,
        ],
      },
      {
        title: '邮件通知',
        description: '所有通知再以邮件方式通知',
        actions: [
          <Switch
            key="email"
            checkedChildren="开"
            unCheckedChildren="关"
            onChange={async (e) => {
              await putUserConfigsGroup({ group: 'notification' }, { data: { email: e } });
              setRefresh(refresh + 1);
            }}
            value={data?.email === 'true'}
            loading={loading}
          />,
        ],
      },
    ];
  };

  const dataSource = getData();
  return (
    <Fragment>
      <List<Unpacked<typeof dataSource>>
        itemLayout="horizontal"
        dataSource={dataSource}
        renderItem={(item) => (
          <List.Item key={`${item.title}-${refresh}`} actions={item.actions}>
            <List.Item.Meta title={item.title} description={item.description} />
          </List.Item>
        )}
      />
    </Fragment>
  );
};

export default NotificationView;
