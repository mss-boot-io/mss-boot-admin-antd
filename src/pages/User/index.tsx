import { Access } from '@/components/MssBoot/Access';
import { getRoles } from '@/services/admin/role';
import { deleteUsersId, getUsers, getUsersId, postUsers, putUsersId } from '@/services/admin/user';
import { idRender, statusOptions } from '@/util/columnOptions';
import { indexTitle } from '@/util/indexTitle';
import { toOptions } from '@/util/toOptions';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import { PageContainer, ProDescriptions, ProTable } from '@ant-design/pro-components';
import { FormattedMessage, history, Link, useIntl, useParams, useRequest } from '@umijs/max';
import { Button, Drawer, message, Popconfirm } from 'antd';
import React, { useRef, useState } from 'react';
import { fieldIntl } from '@/util/fieldIntl';

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
      title: fieldIntl(intl, 'id'),
      dataIndex: 'id',
      hideInForm: true,
      render: (dom, entity) => {
        return idRender(dom, entity, setCurrentRow, setShowDetail);
      },
    },
    {
      title: fieldIntl(intl, 'roleID'),
      dataIndex: 'roleID',
      search: false,
      valueType: 'select',
      valueEnum: toOptions(roleOptions),
    },
    {
      title: fieldIntl(intl, 'avatar'),
      dataIndex: 'avatar',
      search: false,
      valueType: 'avatar',
      hideInForm: true,
    },
    {
      title: fieldIntl(intl, 'username'),
      dataIndex: 'username',
      formItemProps: {
        rules: [
          { required: true },
          { min: 3 },
          { max: 20 },
          {
            pattern: /^[a-zA-Z0-9_]+$/,
            message: intl.formatMessage({
              id: 'pages.message.username.rule.pattern',
              defaultMessage: '用户名只能包含字母、数字和下划线',
            }),
          },
        ],
      },
    },
    {
      title: fieldIntl(intl, 'name'),
      dataIndex: 'name',
    },
    {
      title: fieldIntl(intl, 'email'),
      dataIndex: 'email',
      formItemProps: {
        rules: [{ required: true }, { type: 'email' }],
      },
    },
    {
      title: fieldIntl(intl, 'password'),
      dataIndex: 'password',
      search: false,
      hideInTable: true,
      hideInDescriptions: true,
      valueType: 'password',
      formItemProps: {
        rules: [
          { required: true },
          { min: 8 },
          { max: 20 },
          {
            pattern: /[a-zA-Z]/,
            message: intl.formatMessage({
              id: 'pages.message.password.rule.pattern.letters',
              defaultMessage: 'The password must contain letters',
            }),
          },
          {
            pattern: /[0-9]/,
            message: intl.formatMessage({
              id: 'pages.message.password.rule.pattern.numbers',
              defaultMessage: 'The password must contain numbers',
            }),
          },
        ],
      },
    },
    {
      title: fieldIntl(intl, 'confirmPassword'),
      dataIndex: 'confirmPassword',
      search: false,
      hideInTable: true,
      valueType: 'password',
      hideInDescriptions: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: intl.formatMessage({
              id: 'pages.message.password.confirm.required',
              defaultMessage: 'Please confirm your password!',
            }),
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error(
                  intl.formatMessage({
                    id: 'pages.message.password.confirm.failed',
                    defaultMessage: 'The two passwords that you entered do not match!',
                  }),
                ),
              );
            },
          }),
        ],
      },
    },
    {
      title: fieldIntl(intl, 'status'),
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
      title: fieldIntl(intl, 'updatedAt'),
      sorter: true,
      dataIndex: 'updatedAt',
      search: false,
      valueType: 'dateTime',
      hideInForm: true,
    },
    {
      title: <FormattedMessage id="pages.title.option" />,
      dataIndex: 'option',
      valueType: 'option',
      hideInDescriptions: true,
      hideInForm: true,
      render: (_, record) => [
        <Access key="/users/edit">
          <Link to={`/users/control/${record.id}`}>
            <Button key="edit">
              <FormattedMessage id="pages.title.edit" defaultMessage="Edit" />
            </Button>
          </Link>
        </Access>,
        <Access key="/users/password-reset">
          <Link to={`/users/password-reset/${record.id}/`}>
            <Button key="passwordReset">
              <FormattedMessage id="pages.title.password.reset" defaultMessage="ResetPassword" />
            </Button>
          </Link>
        </Access>,
        <Access key="/users/delete">
          <Popconfirm
            key="delete"
            title={intl.formatMessage({
              id: 'pages.title.delete.confirm',
              defaultMessage: 'Confirm Delete',
            })}
            description={intl.formatMessage({
              id: 'pages.description.delete.confirm',
              defaultMessage: 'Are you sure to delete this record?',
            })}
            onConfirm={async () => {
              await deleteUsersId({ id: record.id! });
              message
                .success(
                  intl.formatMessage({
                    id: 'pages.message.delete.success',
                    defaultMessage: 'Delete successfully!',
                  }),
                )
                .then(() => actionRef.current?.reload());
            }}
            okText={intl.formatMessage({ id: 'pages.title.ok', defaultMessage: 'OK' })}
            cancelText={intl.formatMessage({ id: 'pages.title.cancel', defaultMessage: 'Cancel' })}
          >
            <Button key="delete.button">
              <FormattedMessage id="pages.title.delete" defaultMessage="Delete" />
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
        intl.formatMessage({
          id: 'pages.message.create.success',
          defaultMessage: 'Create successfully!',
        }),
      );
      history.push('/users');
      return;
    }
    await putUsersId({ id }, params);
    message.success(
      intl.formatMessage({
        id: 'pages.message.update.success',
        defaultMessage: 'Update successfully!',
      }),
    );
    history.push('/users');
  };

  return loading ? (
    <></>
  ) : (
    <PageContainer title={indexTitle(id)}>
      <ProTable<API.User, API.Page>
        headerTitle={intl.formatMessage({
          id: 'pages.user.list.title',
          defaultMessage: 'User List',
        })}
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
                <PlusOutlined /> <FormattedMessage id="pages.table.new" defaultMessage="New" />
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
