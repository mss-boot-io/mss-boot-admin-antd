import { Access } from '@/components/MssBoot/Access';
import {
  deleteSystemConfigsId,
  getSystemConfigs,
  getSystemConfigsId,
  postSystemConfigs,
  putSystemConfigsId,
} from '@/services/admin/systemConfig';
import { idRender } from '@/util/columnOptions';
import { indexTitle } from '@/util/indexTitle';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import { PageContainer, ProDescriptions, ProTable } from '@ant-design/pro-components';
import { FormattedMessage, history, Link, useParams } from '@umijs/max';
import { Button, Drawer, message, Popconfirm } from 'antd';
import React, { useRef, useState } from 'react';

const SystemConfig: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const { id } = useParams();
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<API.SystemConfig>();

  const columns: ProColumns<API.SystemConfig>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      hideInForm: true,
      search: false,
      render: (dom, entity) => {
        return idRender(dom, entity, setCurrentRow, setShowDetail);
      },
    },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '格式',
      dataIndex: 'ext',
      search: false,
      valueEnum: {
        yaml: {
          text: 'yaml',
          status: 'yaml',
        },
        json: {
          text: 'json',
          status: 'json',
        },
      },
    },
    {
      title: '内容',
      dataIndex: 'content',
      search: false,
      hideInTable: true,
      valueType: 'code',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      search: false,
      valueType: 'textarea',
    },
    {
      title: '创建时间',
      sorter: true,
      dataIndex: 'createdAt',
      search: false,
      hideInForm: true,
      valueType: 'dateTime',
    },
    {
      title: '上次修改时间',
      sorter: true,
      dataIndex: 'updatedAt',
      search: false,
      hideInForm: true,
      valueType: 'dateTime',
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="Operating" />,
      dataIndex: 'option',
      valueType: 'option',
      hideInDescriptions: true,
      hideInForm: true,
      render: (_, record) => [
        <Access key="/system-config/edit">
          <Button key="edit">
            <Link to={`/system-config/${record.id}`}>编辑</Link>
          </Button>
        </Access>,
        <Access key="/system-config/delete">
          <Popconfirm
            key="delete"
            title="删除语言"
            description="你确定要删除这个语言吗?"
            disabled={record.isBuiltIn}
            onConfirm={async () => {
              const res = await deleteSystemConfigsId({ id: record.id! });
              if (!res) {
                message.success('删除成功');
                actionRef.current?.reload();
              }
            }}
            okText="确定"
            cancelText="再想想"
          >
            <Button disabled={record.isBuiltIn} key="delete.button">
              删除
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
      await postSystemConfigs(params);
      message.success('创建成功');
      history.push('/system-config');
      return;
    }
    await putSystemConfigsId({ id }, params);
    message.success('修改成功');
    history.push('/system-config');
  };

  return (
    <PageContainer title={indexTitle(id)}>
      <ProTable<API.SystemConfig, API.Page>
        headerTitle="配置列表"
        actionRef={actionRef}
        rowKey="id"
        search={false}
        type={id ? 'form' : 'table'}
        onSubmit={id ? onSubmit : undefined}
        toolBarRender={() => [
          <Access key="/system-config/create">
            <Button type="primary" key="create">
              <Link type="primary" key="primary" to="/system-config/create">
                <PlusOutlined /> <FormattedMessage id="pages.table.new" defaultMessage="New" />
              </Link>
            </Button>
          </Access>,
        ]}
        form={
          id && id !== 'create'
            ? {
                request: async () => {
                  const res = await getSystemConfigsId({ id });
                  return res;
                },
              }
            : undefined
        }
        request={getSystemConfigs}
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
          <ProDescriptions<API.SystemConfig>
            column={1}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.id,
            }}
            columns={columns as ProDescriptionsItemProps<API.SystemConfig>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default SystemConfig;
