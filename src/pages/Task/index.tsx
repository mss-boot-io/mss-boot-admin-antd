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
import { FormattedMessage, history, Link, useParams } from '@umijs/max';
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
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="Operating" />,
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
                const res = await getTaskOperateId({ id: record.id!, operate: 'stop' });
                if (!res) {
                  message.success('停止成功');
                  actionRef.current?.reload();
                }
              }
              if (!record.status || record.status === '' || record.status === 'disabled') {
                const res = await getTaskOperateId({ id: record.id!, operate: 'start' });
                if (!res) {
                  message.success('启动成功');
                  actionRef.current?.reload();
                }
                return;
              }
            }}
          >
            {record.status === 'enabled' ? '停止' : '启动'}
          </Button>
        </Access>,
        <Access key="/task/edit">
          <Button key="edit">
            <Link to={`/task/${record.id}`}>编辑</Link>
          </Button>
        </Access>,
        <Access key="/task/delete">
          <Popconfirm
            key="delete"
            title="删除任务"
            description="你确定要删除这个任务吗?"
            onConfirm={async () => {
              const res = await deleteTasksId({ id: record.id! });
              if (!res) {
                message.success('删除成功');
                actionRef.current?.reload();
              }
            }}
            okText="确定"
            cancelText="再想想"
          >
            <Button key="delete.button">删除</Button>
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
      message.success('提交成功');
      history.push('/task');
      return;
    }
    await putTasksId({ id }, params);
    message.success('提交成功');
    history.push('/task');
  };

  const onChange = (e: any) => {
    console.log(e);
  };

  return (
    <PageContainer title={indexTitle(id)}>
      <ProTable<API.Task, API.Page>
        headerTitle="任务列表"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        type={id ? 'form' : 'table'}
        onSubmit={id ? onSubmit : undefined}
        onChange={(e) => {
          console.log('1231231');
          console.log(e);
        }}
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
