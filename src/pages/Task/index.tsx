import { Access } from '@/components/MssBoot/Access';
import {
  deleteTasksId,
  getTaskOperateId,
  getTasks,
  getTasksId,
  postTasks,
  putTasksId,
} from '@/services/admin/task';
import { idRender } from '@/util/columnOptions';
import { indexTitle } from '@/util/indexTitle';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
  PageContainer,
  ProDescriptions,
  ProFormSelect,
  ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage, history, useIntl, Link, useParams } from '@umijs/max';
import { Button, Drawer, message, Popconfirm } from 'antd';
import React, { useRef, useState } from 'react';

const TaskList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [needMethod, setNeedMethod] = useState<boolean>(false);
  const [needBody, setNeedBody] = useState<boolean>(false);
  const [mustBody, setMustBody] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<API.Role>();
  const { id } = useParams();
  const intl = useIntl();

  const columns: ProColumns<API.Task>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      hideInForm: true,
      render: (dom, entity) => {
        return idRender(dom, entity, setCurrentRow, setShowDetail);
      },
    },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: 'cron表达式',
      dataIndex: 'spec',
      hideInTable: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: 'cron表达式为必填项',
          },
        ],
      },
    },
    {
      title: '描述',
      dataIndex: 'remark',
      search: false,
      valueType: 'textarea',
    },
    {
      title: '协议',
      dataIndex: 'protocol',
      hideInTable: true,
      renderFormItem() {
        return (
          <ProFormSelect
            options={[
              {
                value: 'http',
                label: 'http',
              },
              {
                value: 'https',
                label: 'https',
              },
              {
                value: 'grpc',
                label: 'grpc',
              },
              {
                value: 'grpcs',
                label: 'grpcs',
              },
            ]}
            onChange={(value) => {
              setNeedMethod(value === 'http' || value === 'https');
            }}
            name="protocol"
          />
        );
      },
      formItemProps: {
        rules: [
          {
            required: true,
            message: '协议为必填项',
          },
        ],
      },
    },
    {
      title: '调用地址',
      dataIndex: 'endpoint',
      hideInTable: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '调用地址为必填项',
          },
        ],
      },
    },
    {
      title: '调用方法',
      dataIndex: 'method',
      hideInTable: !needMethod,
      renderFormItem() {
        return (
          <ProFormSelect
            options={[
              {
                value: 'GET',
                label: 'GET',
              },
              {
                value: 'POST',
                label: 'POST',
              },
              {
                value: 'PUT',
                label: 'PUT',
              },
              {
                value: 'DELETE',
                label: 'DELETE',
              },
            ]}
            onChange={(value) => {
              setNeedBody(value !== 'GET');
              setMustBody(value === 'POST' || value === 'PUT');
            }}
            name="method"
            placeholder="请选择http调用方法"
          />
        );
      },
    },
    {
      title: '请求体',
      dataIndex: 'body',
      hideInTable: true,
      hideInForm: !needBody,
      valueType: 'jsonCode',
      formItemProps: {
        rules: [
          {
            required: mustBody,
            message: '请求体为必填项',
          },
        ],
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '状态为必填项',
          },
        ],
      },
      valueEnum: {
        enabled: {
          text: '启用',
          color: 'green',
          status: 'enabled',
        },
        disabled: {
          text: '禁用',
          color: 'red',
          status: 'disabled',
        },
        locked: {
          text: '锁定',
          color: 'yellow',
          status: 'locked',
        },
      },
    },
    {
      title: '上次执行时间',
      sorter: false,
      dataIndex: 'checkedAt',
      search: false,
      valueType: 'dateTime',
      hideInForm: true,
    },
    {
      title: '上次修改时间',
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
        <Access key="/task/operate">
          <Button
            key="operate"
            onClick={async () => {
              if (record.status === 'enabled') {
                await getTaskOperateId({ id: record.id!, operate: 'stop' });
                message
                  .success(
                    intl.formatMessage({
                      id: 'pages.message.stop.success',
                      defaultMessage: 'Stop successfully!',
                    }),
                  )
                  .then(() => actionRef.current?.reload());
              }
              if (!record.status || record.status === '' || record.status === 'disabled') {
                await getTaskOperateId({ id: record.id!, operate: 'start' });
                message
                  .success(
                    intl.formatMessage({
                      id: 'pages.message.start.success',
                      defaultMessage: 'Start successfully!',
                    }),
                  )
                  .then(() => actionRef.current?.reload());
                return;
              }
            }}
          >
            {record.status === 'enabled'
              ? intl.formatMessage({ id: 'pages.task.stop.title' })
              : intl.formatMessage({ id: 'pages.task.start.title' })}
          </Button>
        </Access>,
        <Access key="/task/edit">
          <Link to={`/task/${record.id}`}>
            <Button key="edit">
              <FormattedMessage id="pages.title.edit" defaultMessage="Edit" />
            </Button>
          </Link>
        </Access>,
        <Access key="/task/delete">
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
              await deleteTasksId({ id: record.id! });
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
      await postTasks(params);
      message.success(
        intl.formatMessage({
          id: 'pages.message.create.success',
          defaultMessage: 'Create successfully!',
        }),
      );
      history.push('/task');
      return;
    }
    await putTasksId({ id }, params);
    message.success(
      intl.formatMessage({
        id: 'pages.message.update.success',
        defaultMessage: 'Update successfully!',
      }),
    );
    history.push('/task');
  };

  const onChange = (e: any) => {
    console.log(e);
  };

  return (
    <PageContainer title={indexTitle(id)}>
      <ProTable<API.Task, API.Page>
        headerTitle={intl.formatMessage({
          id: 'pages.task.list.title',
          defaultMessage: 'Options List',
        })}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        type={id ? 'form' : 'table'}
        onSubmit={id ? onSubmit : undefined}
        toolBarRender={() => [
          <Access key="/task/create">
            <Button type="primary" key="create">
              <Link type="primary" key="primary" to="/task/create">
                <PlusOutlined /> <FormattedMessage id="pages.table.new" defaultMessage="New" />
              </Link>
            </Button>
          </Access>,
        ]}
        form={
          id && id !== 'create'
            ? {
                request: async () => {
                  const res = await getTasksId({ id });
                  setNeedBody(res.method !== 'GET');
                  return res;
                },
                onChange,
              }
            : { onChange }
        }
        request={getTasks}
        columns={columns}
      />

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
          <ProDescriptions<API.Task>
            column={1}
            title={currentRow?.name}
            request={async (params) => {
              // @ts-ignore
              const res = await getTasksId(params);
              res.name = currentRow?.name;
              return {
                data: res,
              };
            }}
            params={{
              id: currentRow?.id,
            }}
            columns={columns as ProDescriptionsItemProps<API.Task>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TaskList;
