import { deleteLanguagesId, getLanguages } from '@/services/admin/language';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { FormattedMessage, useIntl, Link } from '@umijs/max';
import { Button, Input, Popconfirm, message } from 'antd';
import React, { useRef } from 'react';

const Language: React.FC = () => {
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
    },
    {
      title: '名称',
      dataIndex: 'name',
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
          <Link to={`/language/${record.id}`}>编辑</Link>
        </Button>,
        <Popconfirm
          key="delete"
          title="删除语言"
          description="你确定要删除这个语言吗?"
          onConfirm={async () => {
            const res = await deleteLanguagesId({ id: record.id! });
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
      <ProTable<API.Task, API.Page>
        headerTitle="语言列表"
        actionRef={actionRef}
        rowKey="id"
        search={false}
        toolBarRender={() => [
          <Button type="primary" key="create">
            <Link type="primary" key="primary" to="/language/create">
              <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
            </Link>
          </Button>,
        ]}
        request={getLanguages}
        columns={columns}
      />
    </PageContainer>
  );
};

export default Language;
