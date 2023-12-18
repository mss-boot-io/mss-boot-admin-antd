import { deleteUsersId, getUsers } from '@/services/admin/user';
import { FormOutlined, GithubOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { FormattedMessage, Link, useIntl } from '@umijs/max';
import { Avatar, Button, Input, Popconfirm, message } from 'antd';
import React, { useRef } from 'react';

const UserList: React.FC = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<API.User>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      hideInForm: true,
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      search: false,
      render: (dom) => {
        return <Avatar src={dom} />;
      },
    },
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueEnum: {
        0: {
          text: '未知',
          status: '0',
        },
        1: {
          text: '启用',
          status: '1',
        },
        2: {
          text: '禁用',
          status: '2',
        },
        3: {
          text: '锁定',
          status: '3',
        },
      },
    },
    {
      title: '用户来源',
      dataIndex: 'type',
      search: false,
      render: (dom) => {
        console.log(dom);
        return (
          <>
            {dom === 'admin' && <FormOutlined />}
            {dom === 'github' && <GithubOutlined />}
          </>
        );
      },
    },
    {
      title: '上次修改时间',
      sorter: true,
      dataIndex: 'updatedAt',
      search: false,
      valueType: 'dateTime',
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        const status = form.getFieldValue('status');
        if (`${status}` === '0') {
          return false;
        }
        if (`${status}` === '3') {
          return (
            <Input
              {...rest}
              placeholder={intl.formatMessage({
                id: 'pages.searchTable.exception',
                defaultMessage: 'Please enter the reason for the exception!',
              })}
            />
          );
        }
        return defaultRender(item);
      },
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="Operating" />,
      dataIndex: 'option',
      valueType: 'option',
      hideInDescriptions: true,
      hideInForm: true,
      render: (_, record) => [
        <Button key="edit">
          <Link to={`/users/control/${record.id}`}>编辑</Link>
        </Button>,
        <Button key="passwordReset">
          <Link to={`/users/password-reset/${record.id}/`}>重置密码</Link>
        </Button>,
        <Popconfirm
          key="delete"
          title="删除用户"
          description="你确定要删除这个用户吗?"
          onConfirm={async () => {
            const res = await deleteUsersId({ id: record.id! });
            if (!res) {
              message.success('删除成功');
              actionRef.current?.reload();
            }
          }}
          okText="确定"
          cancelText="再想想"
        >
          <Button key="delete.button">删除</Button>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.User, API.Page>
        headerTitle="用户列表"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button type="primary" key="create">
            <Link type="primary" key="primary" to="/users/control/create">
              <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
            </Link>
          </Button>,
        ]}
        request={getUsers}
        columns={columns}
      ></ProTable>
    </PageContainer>
  );
};

export default UserList;
