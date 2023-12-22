import { Access } from '@/components/MssBoot/Access';
import { getRoles } from '@/services/admin/role';
import { deleteUsersId, getUsers, getUsersId, postUsers, putUsersId } from '@/services/admin/user';
import { idRender, statusOptions } from '@/util/columnOptions';
import { indexTitle } from '@/util/indexTitle';
import { toOptions } from '@/util/toOptions';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import { PageContainer, ProDescriptions, ProTable } from '@ant-design/pro-components';
import { FormattedMessage, Link, useParams, history, useRequest, useIntl } from '@umijs/max';
import { Button, Drawer, Popconfirm, message } from 'antd';
import React, { useRef, useState } from 'react';

const UserList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<API.Role>();
  const { id } = useParams();
  const { data: roleOptions, loading } = useRequest(() => {
    return getRoles({ pageSize: 1000 });
  });

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const columns: ProColumns<API.User>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      hideInForm: true,
      render: (dom, entity) => {
        return idRender(dom, entity, setCurrentRow, setShowDetail);
      },
    },
    {
      title: '角色',
      dataIndex: 'roleID',
      search: false,
      valueType: 'select',
      valueEnum: toOptions(roleOptions),
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      search: false,
      valueType: 'avatar',
      hideInForm: true,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      formItemProps: {
        rules: [
          { required: true },
          { min: 3 },
          { max: 20 },
          {
            pattern: /^[a-zA-Z0-9_]+$/,
            message: intl.formatMessage({
              id: 'page.message.username.rule.pattern',
              defaultMessage: '用户名只能包含字母、数字和下划线',
            }),
          },
        ],
      },
    },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      formItemProps: {
        rules: [
          { required: true, message: '请输入邮箱' },
          { type: 'email', message: '请输入正确的邮箱' },
        ],
      },
    },
    {
      title: '密码',
      dataIndex: 'password',
      search: false,
      hideInTable: true,
      hideInDescriptions: true,
      valueType: 'password',
      formItemProps: {
        rules: [
          { required: true, message: '请输入密码' },
          { min: 8, message: '密码至少8位' },
          { max: 20, message: '密码最多20位' },
          { pattern: /[a-zA-Z]/, message: '密码必须包含字母' },
          { pattern: /[0-9]/, message: '密码必须包含数字' },
        ],
      },
    },
    {
      title: '确认密码',
      dataIndex: 'confirmPassword',
      search: false,
      hideInTable: true,
      valueType: 'password',
      hideInDescriptions: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '请确认密码',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('两次密码不一致'));
            },
          }),
        ],
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueEnum: statusOptions,
    },
    // {
    //   title: '用户来源',
    //   dataIndex: 'type',
    //   search: false,
    //   render: (dom) => {
    //     console.log(dom);
    //     return (
    //       <>
    //         {dom === 'admin' && <FormOutlined />}
    //         {dom === 'github' && <GithubOutlined />}
    //       </>
    //     );
    //   },
    // },
    {
      title: '上次修改时间',
      sorter: true,
      dataIndex: 'updatedAt',
      search: false,
      valueType: 'dateTime',
      hideInForm: true,
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="操作" />,
      dataIndex: 'option',
      valueType: 'option',
      hideInDescriptions: true,
      hideInForm: true,
      render: (_, record) => [
        <Access key="/users/edit">
          <Link to={`/users/control/${record.id}`}>
            <Button key="edit">
              <FormattedMessage id="page.title.edit" defaultMessage="编辑" />
            </Button>
          </Link>
        </Access>,
        <Access key="/users/password-reset">
          <Link to={`/users/password-reset/${record.id}/`}>
            <Button key="passwordReset">
              <FormattedMessage id="page.title.password.reset" defaultMessage="重置密码" />
            </Button>
          </Link>
        </Access>,
        <Access key="/users/delete">
          <Popconfirm
            key="delete"
            title={intl.formatMessage({
              id: 'page.title.delete.confirm',
              defaultMessage: '确认删除',
            })}
            description={intl.formatMessage({
              id: 'page.description.delete.confirm',
              defaultMessage: '确认删除该记录吗？',
            })}
            onConfirm={async () => {
              await deleteUsersId({ id: record.id! });
              message
                .success(
                  intl.formatMessage({
                    id: 'page.message.delete.success',
                    defaultMessage: '删除成功',
                  }),
                )
                .then(() => actionRef.current?.reload());
            }}
            okText={intl.formatMessage({ id: 'page.title.ok', defaultMessage: '确认' })}
            cancelText={intl.formatMessage({ id: 'page.title.cancel', defaultMessage: '取消' })}
          >
            <Button key="delete.button">
              <FormattedMessage id="page.title.delete" defaultMessage="删除" />
            </Button>
          </Popconfirm>
        </Access>,
      ],
    },
  ];

  const onSubmit = async (params: any) => {
    if (!id) {
      return;
    }
    if (id === 'create') {
      await postUsers(params);
      message.success(
        intl.formatMessage({ id: 'page.message.create.success', defaultMessage: '创建成功' }),
      );
      history.push('/users');
      return;
    }
    await putUsersId({ id }, params);
    message.success(
      intl.formatMessage({ id: 'page.message.edit.success', defaultMessage: '修改成功' }),
    );
    history.push('/users');
  };

  return loading ? (
    <></>
  ) : (
    <PageContainer title={indexTitle(id)}>
      <ProTable<API.User, API.Page>
        headerTitle={intl.formatMessage({ id: 'page.title.list', defaultMessage: '列表' })}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        type={id ? 'form' : 'table'}
        onSubmit={id ? onSubmit : undefined}
        toolBarRender={() => [
          <Access key="/users/create">
            <Button type="primary" key="create">
              <Link type="primary" key="primary" to="/users/control/create">
                <PlusOutlined />{' '}
                <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
              </Link>
            </Button>
          </Access>,
        ]}
        form={
          id && id !== 'create'
            ? {
                request: async () => {
                  const res = await getUsersId({ id });
                  return res;
                },
              }
            : undefined
        }
        request={getUsers}
        columns={columns}
      ></ProTable>

      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<API.User>
            column={2}
            title={currentRow?.name}
            request={async (params) => {
              // @ts-ignore
              const res = await getUsersId(params);
              res.name = currentRow?.name;
              return {
                data: res,
              };
            }}
            params={{
              id: currentRow?.id,
            }}
            columns={columns as ProDescriptionsItemProps<API.User>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default UserList;
