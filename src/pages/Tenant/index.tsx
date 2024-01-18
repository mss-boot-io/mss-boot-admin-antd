import { Access } from '@/components/MssBoot/Access';
import { idRender } from '@/util/columnOptions';
import { indexTitle } from '@/util/indexTitle';
import { PlusOutlined } from '@ant-design/icons';
import type {
  ActionType,
  ProColumns,
  ProDescriptionsItemProps,
  ProFormInstance,
} from '@ant-design/pro-components';
import {
  EditableProTable,
  PageContainer,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage, history, Link, useParams } from '@umijs/max';
import { Button, Drawer, List, message, Popconfirm, Typography } from 'antd';
import React, { useRef, useState } from 'react';
// @ts-ignore
import {
  deleteTenantsId,
  getTenants,
  getTenantsId,
  postTenants,
  putTenantsId,
} from '@/services/admin/tenant';
import { v4 as uuidv4 } from 'uuid';

const Tenant: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const { id } = useParams();
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<API.Tenant>();
  const formRef = useRef<ProFormInstance>();
  const [editableKeys, setEditableKeys] = useState<React.Key[]>(() => []);

  const columnsTable: ProColumns<API.TenantDomain>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      hideInForm: true,
      hideInTable: true,
    },
    {
      title: '名称',
      dataIndex: 'name',
      formItemProps: () => {
        return {
          rules: [{ required: true, message: '此项为必填项' }],
        };
      },
    },
    {
      title: '域名',
      dataIndex: 'domain',
      formItemProps: () => {
        return {
          rules: [{ required: true, message: '此项为必填项' }],
        };
      },
    },
    {
      title: '操作',
      valueType: 'option',
      render: (text, record, _, action) => [
        <Button
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id!);
          }}
        >
          编辑
        </Button>,
        <Button
          key="delete"
          onClick={async () => {
            const tableDataSource = formRef.current?.getFieldValue('domains') as API.TenantDomain[];
            formRef.current?.setFieldsValue({
              items: tableDataSource.filter((item) => item.id !== record.id),
            });
          }}
        >
          删除
        </Button>,
      ],
    },
  ];

  const columns: ProColumns<API.Tenant>[] = [
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
      title: '状态',
      dataIndex: 'status',
      valueEnum: {
        enabled: {
          text: '启用',
          status: 'enabled',
        },
        disbaled: {
          text: '禁用',
          status: 'disabled',
        },
      },
    },
    {
      title: '域名',
      dataIndex: 'domains',
      hideInTable: true,
      search: false,
      renderText(text) {
        return (
          <List
            bordered
            dataSource={text}
            renderItem={(item: API.TenantDomain) => (
              <List.Item>
                <Typography.Text mark>{item.name}</Typography.Text>: {item.domain}
              </List.Item>
            )}
          />
        );
      },
      renderFormItem() {
        return (
          <EditableProTable<API.TenantDomain>
            rowKey="id"
            scroll={{
              x: 960,
            }}
            formRef={formRef}
            // editableFormRef={schema.formRef}
            headerTitle="域名列表"
            maxLength={1000}
            name="domains"
            controlled={false}
            // @ts-ignore
            recordCreatorProps={{
              position: 'bottom' as 'top',
              // @ts-ignore
              record: () => ({
                id: uuidv4().replace(/-/g, ''),
              }),
            }}
            columns={columnsTable}
            editable={{
              type: 'multiple',
              editableKeys,
              onChange: setEditableKeys,
              actionRender: (row, config, defaultDom) => {
                return [defaultDom.save, defaultDom.delete ?? defaultDom.cancel];
              },
            }}
          />
        );
      },
    },
    {
      title: '过期时间',
      sorter: true,
      dataIndex: 'expire',
      search: false,
      valueType: 'dateTime',
      // hideInForm: true,
    },
    {
      title: '管理员用户名',
      dataIndex: 'username',
      search: false,
      hideInTable: true,
      hideInDescriptions: true,
      hideInForm: id !== undefined && id !== 'create',
    },
    {
      title: '管理员密码',
      dataIndex: 'password',
      search: false,
      hideInTable: true,
      hideInDescriptions: true,
      hideInForm: id !== undefined && id !== 'create',
      valueType: 'password',
    },
    {
      title: '备注',
      search: false,
      dataIndex: 'remark',
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
      title: <FormattedMessage id="pages.title.option" defaultMessage="Operating" />,
      dataIndex: 'option',
      valueType: 'option',
      hideInDescriptions: true,
      hideInForm: true,
      render: (_, record) => [
        <Access key="/tenant/edit">
          <Link to={`/tenant/${record.id}`}>
            <Button key="edit">编辑</Button>
          </Link>
        </Access>,
        <Access key="/tenant/delete">
          <Popconfirm
            disabled={record.default}
            key="delete"
            title="删除"
            description="你确定要删除吗?"
            onConfirm={async () => {
              const res = await deleteTenantsId({ id: record.id! });
              if (!res) {
                message.success('删除成功');
                actionRef.current?.reload();
              }
            }}
            okText="确定"
            cancelText="再想想"
          >
            <Button disabled={record.default} key="delete.button">
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
      await postTenants(params);
      message.success('创建成功');
      history.push('/tenant');
      return;
    }
    await putTenantsId({ id }, params);
    message.success('修改成功');
    history.push('/tenant');
  };

  return (
    <PageContainer title={indexTitle(id)}>
      <ProTable<API.Tenant, API.getTenantsParams>
        headerTitle="租户列表"
        actionRef={actionRef}
        formRef={formRef}
        rowKey="id"
        search={false}
        type={id ? 'form' : 'table'}
        onSubmit={id ? onSubmit : undefined}
        toolBarRender={() => [
          <Access key="/tenant/create">
            <Button type="primary" key="create">
              <Link type="primary" key="primary" to="/tenant/create">
                <PlusOutlined /> <FormattedMessage id="pages.table.new" defaultMessage="New" />
              </Link>
            </Button>
          </Access>,
        ]}
        form={
          id && id !== 'create'
            ? {
                request: async () => {
                  const res = await getTenantsId({ id, preloads: ['Domains'] });
                  return res;
                },
              }
            : undefined
        }
        request={getTenants}
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
          <ProDescriptions<API.Tenant>
            column={1}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.id,
            }}
            columns={columns as ProDescriptionsItemProps<API.Tenant>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default Tenant;
