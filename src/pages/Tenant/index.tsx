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
import { FormattedMessage, history, useIntl, Link, useParams } from '@umijs/max';
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
// @ts-ignore
import { v4 as uuidv4 } from 'uuid';
import { fieldIntl } from '@/util/fieldIntl';

const Tenant: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const { id } = useParams();
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<API.Tenant>();
  const formRef = useRef<ProFormInstance>();
  const [editableKeys, setEditableKeys] = useState<React.Key[]>(() => []);
  const intl = useIntl();

  const columnsTable: ProColumns<API.TenantDomain>[] = [
    {
      title: fieldIntl(intl, 'id'),
      dataIndex: 'id',
      hideInForm: true,
      hideInTable: true,
    },
    {
      title: fieldIntl(intl, 'name'),
      dataIndex: 'name',
      formItemProps: () => {
        return {
          rules: [{ required: true }],
        };
      },
    },
    {
      title: fieldIntl(intl, 'domain'),
      dataIndex: 'domain',
      formItemProps: () => {
        return {
          rules: [{ required: true }],
        };
      },
    },
    {
      title: <FormattedMessage id="pages.title.option" />,
      valueType: 'option',
      render: (text, record, _, action) => [
        <Button
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id!);
          }}
        >
          <FormattedMessage id="pages.title.edit" defaultMessage="Edit" />
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
          <FormattedMessage id="pages.title.delete" defaultMessage="Delete" />
        </Button>,
      ],
    },
  ];

  const columns: ProColumns<API.Tenant>[] = [
    {
      title: fieldIntl(intl, 'id'),
      dataIndex: 'id',
      hideInForm: true,
      search: false,
      render: (dom, entity) => {
        return idRender(dom, entity, setCurrentRow, setShowDetail);
      },
    },
    {
      title: fieldIntl(intl, 'name'),
      dataIndex: 'name',
    },
    {
      title: fieldIntl(intl, 'status'),
      dataIndex: 'status',
      valueEnum: {
        enabled: {
          text: fieldIntl(intl, 'options.enabled'),
          status: 'enabled',
        },
        disabled: {
          text: fieldIntl(intl, 'options.disabled'),
          status: 'disabled',
        },
      },
    },
    {
      title: fieldIntl(intl, 'domains'),
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
            headerTitle={intl.formatMessage({ id: 'pages.tenant.domain.list' })}
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
      title: fieldIntl(intl, 'expire'),
      sorter: true,
      dataIndex: 'expire',
      search: false,
      valueType: 'dateTime',
      // hideInForm: true,
    },
    {
      title: fieldIntl(intl, 'username'),
      dataIndex: 'username',
      search: false,
      hideInTable: true,
      hideInDescriptions: true,
      hideInForm: id !== undefined && id !== 'create',
    },
    {
      title: fieldIntl(intl, 'password'),
      dataIndex: 'password',
      search: false,
      hideInTable: true,
      hideInDescriptions: true,
      hideInForm: id !== undefined && id !== 'create',
      valueType: 'password',
    },
    {
      title: fieldIntl(intl, 'remark'),
      search: false,
      dataIndex: 'remark',
    },
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
        <Access key="/tenant/edit">
          <Link to={`/tenant/${record.id}`}>
            <Button key="edit">
              <FormattedMessage id="pages.title.edit" defaultMessage="Edit" />
            </Button>
          </Link>
        </Access>,
        <Access key="/tenant/delete">
          <Popconfirm
            disabled={record.default}
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
              await deleteTenantsId({ id: record.id! });
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
            <Button disabled={record.default} key="delete.button">
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
      await postTenants(params);
      message.success(
        intl.formatMessage({
          id: 'pages.message.create.success',
          defaultMessage: 'Create successfully!',
        }),
      );
      history.push('/tenant');
      return;
    }
    await putTenantsId({ id }, params);
    message.success(
      intl.formatMessage({
        id: 'pages.message.update.success',
        defaultMessage: 'Update successfully!',
      }),
    );
    history.push('/tenant');
  };

  return (
    <PageContainer title={indexTitle(id)}>
      <ProTable<API.Tenant, API.getTenantsParams>
        headerTitle={intl.formatMessage({
          id: 'pages.tenant.list.title',
          defaultMessage: 'Tenant List',
        })}
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
