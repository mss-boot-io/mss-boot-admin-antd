import { Access } from '@/components/MssBoot/Access';
import {
  deleteLanguagesId,
  getLanguages,
  getLanguagesId,
  postLanguages,
  putLanguagesId,
} from '@/services/admin/language';
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

const Language: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const { id } = useParams();
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<API.Language>();
  const formRef = useRef<ProFormInstance>();
  const [editableKeys, setEditableKeys] = useState<React.Key[]>(() => []);

  const columnsTable: ProColumns<API.LanguageDefine>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      hideInForm: true,
      hideInTable: true,
      render: (dom, entity) => {
        return idRender(dom, entity, setCurrentRow, setShowDetail);
      },
    },
    {
      title: '分组',
      dataIndex: 'group',
      formItemProps: () => {
        return {
          rules: [{ required: true, message: '此项为必填项' }],
        };
      },
      width: '30%',
    },
    {
      title: '键',
      dataIndex: 'key',
      formItemProps: () => {
        return {
          rules: [{ required: true, message: '此项为必填项' }],
        };
      },
      width: '30%',
    },
    {
      title: '值',
      dataIndex: 'value',
      formItemProps: () => {
        return {
          rules: [{ required: true, message: '此项为必填项' }],
        };
      },
      width: '30%',
    },
    {
      title: '操作',
      valueType: 'option',
      width: 200,
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
            const tableDataSource = formRef.current?.getFieldValue(
              'defines',
            ) as API.LanguageDefine[];
            formRef.current?.setFieldsValue({
              defines: tableDataSource.filter((item) => item.id !== record.id),
            });
          }}
        >
          删除
        </Button>,
      ],
    },
  ];

  const columns: ProColumns<API.Language>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      hideInForm: true,
      search: false,
      render: (dom, entity) => {
        return (
          <Button
            key={entity.id}
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
            type="link"
          >
            {dom}
          </Button>
        );
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
      title: '定义',
      dataIndex: 'defines',
      hideInTable: true,
      search: false,
      renderText(text) {
        return (
          <List
            bordered
            dataSource={text}
            renderItem={(item: API.LanguageDefine) => (
              <List.Item>
                <Typography.Text mark>
                  {item.group}.{item.id}
                </Typography.Text>
                : {item.value}
              </List.Item>
            )}
          />
        );
      },
      renderFormItem() {
        return (
          <EditableProTable<API.LanguageDefine>
            rowKey="id"
            scroll={{
              x: 960,
            }}
            formRef={formRef}
            // editableFormRef={schema.formRef}
            headerTitle="语言内容"
            maxLength={1000}
            name="defines"
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
        <Access key="/language/edit">
          <Link to={`/language/${record.id}`}>
            <Button key="edit">编辑</Button>
          </Link>
        </Access>,
        <Access key="/language/delete">
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
      await postLanguages(params);
      message.success('创建成功');
      history.push('/language');
      return;
    }
    await putLanguagesId({ id }, params);
    message.success('修改成功');
    history.push('/language');
  };

  return (
    <PageContainer title={indexTitle(id)}>
      <ProTable<API.Language, API.Page>
        headerTitle="语言列表"
        actionRef={actionRef}
        formRef={formRef}
        rowKey="id"
        search={false}
        type={id ? 'form' : 'table'}
        onSubmit={id ? onSubmit : undefined}
        toolBarRender={() => [
          <Access key="/language/create">
            <Button type="primary" key="create">
              <Link type="primary" key="primary" to="/language/create">
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
                  const res = await getLanguagesId({ id });
                  return res;
                },
              }
            : undefined
        }
        request={getLanguages}
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
          <ProDescriptions<API.Language>
            column={1}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.id,
            }}
            columns={columns as ProDescriptionsItemProps<API.Language>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default Language;
