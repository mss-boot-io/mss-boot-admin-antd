import { Access } from '@/components/MssBoot/Access';
import {
  deleteOptionsId,
  getOptions,
  getOptionsId,
  postOptions,
  putOptionsId,
} from '@/services/admin/option';
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
import { FormattedMessage, Link, useParams, history } from '@umijs/max';
import { Button, Drawer, List, Popconfirm, Typography, message } from 'antd';
import React, { useRef, useState } from 'react';
// @ts-ignore
import { v4 as uuidv4 } from 'uuid';

const Option: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const { id } = useParams();
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<API.Option>();
  const formRef = useRef<ProFormInstance>();
  const [editableKeys, setEditableKeys] = useState<React.Key[]>(() => []);

  const columnsTable: ProColumns<API.OptionItem>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      hideInForm: true,
      hideInTable: true,
    },
    {
      title: '标签',
      dataIndex: 'label',
      formItemProps: () => {
        return {
          rules: [{ required: true, message: '此项为必填项' }],
        };
      },
    },
    {
      title: '键',
      dataIndex: 'key',
      formItemProps: () => {
        return {
          rules: [{ required: true, message: '此项为必填项' }],
        };
      },
    },
    {
      title: '值',
      dataIndex: 'value',
      formItemProps: () => {
        return {
          rules: [{ required: true, message: '此项为必填项' }],
        };
      },
    },
    {
      title: '颜色',
      dataIndex: 'color',
      valueEnum: {
        red: {
          text: '红色',
          status: 'red',
          color: 'red',
        },
        green: {
          text: '绿色',
          status: 'green',
          color: 'green',
        },
        yellow: {
          text: '黄色',
          status: 'yellow',
          color: 'yellow',
        },
        orange: {
          text: '橙色',
          status: 'orange',
          color: 'orange',
        },
        blue: {
          text: '蓝色',
          status: 'blue',
          color: 'blue',
        },
        purple: {
          text: '紫色',
          status: 'purple',
          color: 'purple',
        },
        cyan: {
          text: '青色',
          status: 'cyan',
          color: 'cyan',
        },
        volcano: {
          text: '火山色',
          status: 'volcano',
          color: 'volcano',
        },
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
            const tableDataSource = formRef.current?.getFieldValue('items') as API.OptionItem[];
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

  const columns: ProColumns<API.Option>[] = [
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
      title: '选项',
      dataIndex: 'items',
      hideInTable: true,
      search: false,
      renderText(text) {
        return (
          <List
            bordered
            dataSource={text}
            renderItem={(item: API.OptionItem) => (
              <List.Item>
                <Typography.Text mark>
                  {item.label}[{item.key}]
                </Typography.Text>
                : {item.value}
              </List.Item>
            )}
          />
        );
      },
      renderFormItem() {
        return (
          <EditableProTable<API.OptionItem>
            rowKey="id"
            scroll={{
              x: 960,
            }}
            formRef={formRef}
            // editableFormRef={schema.formRef}
            headerTitle="选项列表"
            maxLength={1000}
            name="items"
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
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="Operating" />,
      dataIndex: 'option',
      valueType: 'option',
      hideInDescriptions: true,
      hideInForm: true,
      render: (_, record) => [
        <Access key="/option/edit">
          <Link to={`/option/${record.id}`}>
            <Button key="edit">编辑</Button>
          </Link>
        </Access>,
        <Access key="/option/delete">
          <Popconfirm
            key="delete"
            title="删除"
            description="你确定要删除吗?"
            onConfirm={async () => {
              const res = await deleteOptionsId({ id: record.id! });
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
      await postOptions(params);
      message.success('创建成功');
      history.push('/option');
      return;
    }
    await putOptionsId({ id }, params);
    message.success('修改成功');
    history.push('/option');
  };

  return (
    <PageContainer title={indexTitle(id)}>
      <ProTable<API.Option, API.getOptionsParams>
        headerTitle="选项列表"
        actionRef={actionRef}
        formRef={formRef}
        rowKey="id"
        search={false}
        type={id ? 'form' : 'table'}
        onSubmit={id ? onSubmit : undefined}
        toolBarRender={() => [
          <Access key="/option/create">
            <Button type="primary" key="create">
              <Link type="primary" key="primary" to="/option/create">
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
                  const res = await getOptionsId({ id });
                  return res;
                },
              }
            : undefined
        }
        request={getOptions}
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
          <ProDescriptions<API.Option>
            column={1}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.id,
            }}
            columns={columns as ProDescriptionsItemProps<API.Option>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default Option;
