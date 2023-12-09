import { deleteTasksId, getTaskOperateId, getTasks } from '@/services/admin/task';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { FormattedMessage, useIntl, Link } from '@umijs/max';
import { Button, Input, Popconfirm, message } from 'antd';
import React, { useRef } from 'react';

const TaskList: React.FC = () => {
  const actionRef = useRef<ActionType>();

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const columns: ProColumns<API.Task>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      hideInForm: true,
      // render: (dom, entity) => {
      //   return (
      //     <a
      //       onClick={() => {
      //         // setCurrentRow(entity);
      //         // setShowDetail(true);
      //       }}
      //     >
      //       {dom}
      //     </a>
      //   );
      // },
    },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '描述',
      dataIndex: 'remark',
      search: false,
      valueType: 'textarea',
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueEnum: {
        1: {
          text: '启用',
          status: '1',
        },
        2: {
          text: '禁用',
          status: '2',
        },
      },
    },
    {
      title: '上次执行时间',
      sorter: false,
      dataIndex: 'checkedAt',
      search: false,
      valueType: 'dateTime',
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        const status = form.getFieldValue('status');
        if (`${status}` === '0') {
          return false;
        }
        if (`${status}` === '1') {
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
        <Button
          key="operate"
          onClick={async () => {
            if (record.status === 0 || record.status === 2) {
              const res = await getTaskOperateId({ id: record.id!, operate: 'start' });
              if (!res) {
                message.success('启动成功');
                actionRef.current?.reload();
              }
              return;
            }
            if (record.status === 1) {
              const res = await getTaskOperateId({ id: record.id!, operate: 'stop' });
              if (!res) {
                message.success('停止成功');
                actionRef.current?.reload();
              }
              return;
            }
          }}
        >
          {record.status === 0 || record.status === 2 ? '启动' : '停止'}
        </Button>,
        <Button key="edit">
          <Link to={`/task/${record.id}`}>编辑</Link>
        </Button>,
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
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.RuleListItem, API.PageParams>
        headerTitle="任务列表"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button type="primary" key="create">
            <Link type="primary" key="primary" to="/task/create">
              <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
            </Link>
          </Button>,
        ]}
        request={getTasks}
        columns={columns}
      />
    </PageContainer>
  );
};

export default TaskList;
