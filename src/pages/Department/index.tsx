import { Access } from '@/components/MssBoot/Access';
import { idRender } from '@/util/columnOptions';
import { indexTitle } from '@/util/indexTitle';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import { PageContainer, ProDescriptions, ProTable } from '@ant-design/pro-components';
import { FormattedMessage, history, Link, useIntl, useParams } from '@umijs/max';
import { Button, Drawer, message, Popconfirm, TreeSelect } from 'antd';
import { DataNode } from 'antd/es/tree';
import React, { useEffect, useRef, useState } from 'react';
import { fieldIntl } from '@/util/fieldIntl';
import {
  deleteDepartmentsId,
  getDepartments,
  getDepartmentsId,
  postDepartments,
  putDepartmentsId,
} from '@/services/admin/department';
import { statusOptions } from '@/util/statusOptions';

const TableList: React.FC = () => {
  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.Role>();
  const [list, setList] = useState<[]>([]);
  const { id } = useParams();

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const columns: ProColumns<API.Department>[] = [
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
      title: fieldIntl(intl, 'parentID'),
      search: false,
      hideInTable: true,
      dataIndex: 'parentID',
      renderFormItem: () => {
        return (
          <TreeSelect
            showSearch
            style={{ width: '100%' }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder={fieldIntl(intl, 'parent.placeholder')}
            allowClear
            treeDefaultExpandAll
            // onChange={onChange}
            treeData={list}
          />
        );
      },
    },
    {
      title: fieldIntl(intl, 'name'),
      dataIndex: 'name',
      formItemProps: {
        rules: [{ required: true }],
      },
    },
    {
      title: fieldIntl(intl, 'code'),
      dataIndex: 'code',
      formItemProps: {
        rules: [{ required: true }],
      },
    },
    {
      title: fieldIntl(intl, 'leaderID'),
      dataIndex: 'leaderID',
    },
    {
      title: fieldIntl(intl, 'phone'),
      search: false,
      dataIndex: 'phone',
      formItemProps: {
        rules: [
          {
            pattern: /^1\d{10}$/,
            message: (
              <FormattedMessage
                id="pages.login.phoneNumber.invalid"
                defaultMessage="The phone number is in the wrong format!"
              />
            ),
          },
        ],
      },
    },
    {
      title: fieldIntl(intl, 'email'),
      dataIndex: 'email',
      search: false,
      formItemProps: {
        rules: [
          {
            type: 'email',
          },
        ],
      },
    },
    {
      title: fieldIntl(intl, 'sort'),
      dataIndex: 'sort',
      search: false,
      valueType: 'digit',
    },
    {
      title: fieldIntl(intl, 'status'),
      dataIndex: 'status',
      valueEnum: statusOptions(intl),
    },
    {
      title: fieldIntl(intl, 'updatedAt'),
      sorter: true,
      dataIndex: 'updatedAt',
      search: false,
      hideInForm: true,
      valueType: 'dateTime',
    },
    {
      title: <FormattedMessage id="pages.title.option" />,
      dataIndex: 'option',
      valueType: 'option',
      hideInDescriptions: true,
      hideInForm: true,
      render: (_, record) => [
        <Access key="/department/edit">
          <Link to={`/department/${record.id}`} key="edit">
            <Button key="edit">
              <FormattedMessage id="pages.title.edit" defaultMessage="Edit" />
            </Button>
          </Link>
        </Access>,
        <Access key="/department/delete">
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
              await deleteDepartmentsId({ id: record.id! });
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

  const transferTree = (data: API.Department[], self: string): DataNode[] => {
    // @ts-ignore
    return data.map((item) => {
      return {
        title: item.name,
        value: item.id,
        disabled: item.id === self,
        // @ts-ignore
        children: item.children ? transferTree(item.children) : null,
      };
    });
  };

  const onSubmit = async (params: any) => {
    if (!id) {
      return;
    }
    if (id === 'create') {
      await postDepartments(params);
      message.success(
        intl.formatMessage({
          id: 'pages.message.create.success',
          defaultMessage: 'Create successfully!',
        }),
      );
      history.push('/department');
      return;
    }
    await putDepartmentsId({ id }, params);
    message.success(
      intl.formatMessage({
        id: 'pages.message.edit.success',
        defaultMessage: 'Update successfully!',
      }),
    );
    history.push('/department');
  };

  useEffect(() => {
    if (id) {
      getDepartments({ pageSize: 1000, parentID: '' }).then((res) => {
        // @ts-ignore
        setList(transferTree(res.data!, id));
      });
    }
  }, [id]);

  return (
    <PageContainer title={indexTitle(id)}>
      <ProTable<API.Department, API.getDepartmentsParams>
        headerTitle={intl.formatMessage({
          id: 'pages.department.list.title',
          defaultMessage: 'Department List',
        })}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        type={id ? 'form' : 'table'}
        onSubmit={id ? onSubmit : undefined}
        toolBarRender={() => [
          <Access key="/department/create">
            <Link to="/department/create" key="create">
              <Button type="primary" key="create">
                <PlusOutlined /> <FormattedMessage id="pages.table.new" defaultMessage="New" />
              </Button>
            </Link>
          </Access>,
        ]}
        form={
          id && id !== 'create'
            ? {
                request: async () => {
                  const res = await getDepartmentsId({ id });
                  return res;
                },
              }
            : undefined
        }
        request={getDepartments}
        params={{ parentID: '' }}
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
          <ProDescriptions<API.Department>
            column={2}
            title={currentRow?.name}
            request={async (params) => {
              // @ts-ignore
              const res = await getDepartmentsId(params);
              res.name = currentRow?.name;
              return {
                data: res,
              };
            }}
            params={{
              id: currentRow?.id,
            }}
            columns={columns as ProDescriptionsItemProps<API.Menu>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
