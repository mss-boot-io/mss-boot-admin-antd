import { Access } from '@/components/MssBoot/Access';
import {
  deleteFieldsId,
  getFields,
  getFieldsId,
  postFields,
  putFieldsId,
} from '@/services/admin/field';
import { idRender } from '@/util/columnOptions';
import { indexTitle } from '@/util/indexTitle';
import { PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  EditableProTable,
  PageContainer,
  ProColumns,
  ProDescriptions,
  ProDescriptionsItemProps,
  ProFormInstance,
  ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage, history, useIntl, Link, useParams } from '@umijs/max';
import { Button, Drawer, message, Popconfirm } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
// @ts-ignore
import { v4 as uuidv4 } from 'uuid';

const Field: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const { id, modelID } = useParams();

  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<API.Field>();
  const formRef = useRef<ProFormInstance>();
  const [editableKeys, setEditableKeys] = useState<React.Key[]>(() => []);
  const intl = useIntl();

  const columnsTable: ProColumns<API.BaseRule>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      hideInForm: true,
      hideInTable: true,
    },
    {
      title: '必填',
      dataIndex: 'required',
      valueType: 'switch',
    },
    {
      dataIndex: 'message',
      title: '错误信息',
    },
    {
      dataIndex: 'pattern',
      title: '正则表达式',
    },
    {
      dataIndex: 'type',
      title: '类型',
      valueEnum: {
        string: {
          text: '字符串',
          status: 'string',
        },
        number: {
          text: '数字',
          status: 'number',
        },
        boolean: {
          text: '布尔值',
          status: 'boolean',
        },
        method: {
          text: '方法',
          status: 'method',
        },
        regexp: {
          text: '正则表达式',
          status: 'regexp',
        },
        integer: {
          text: '整数',
          status: 'integer',
        },
        float: {
          text: '浮点数',
          status: 'float',
        },
        array: {
          text: '数组',
          status: 'array',
        },
        object: {
          text: '对象',
          status: 'object',
        },
        enum: {
          text: '枚举',
          status: 'enum',
        },
        date: {
          text: '日期',
          status: 'date',
        },
        url: {
          text: 'url',
          status: 'url',
        },
        hex: {
          text: 'hex',
          status: 'hex',
        },
        email: {
          text: 'email',
          status: 'email',
        },
      },
    },
    {
      dataIndex: 'min',
      title: '最小值',
    },
    {
      dataIndex: 'max',
      title: '最大值',
    },
    {
      dataIndex: 'len',
      title: '长度',
    },
    {
      dataIndex: 'warningOnly',
      title: '警告',
    },
    {
      dataIndex: 'whitespace',
      title: '空格',
    },
    {
      dataIndex: 'validateTrigger',
      title: '触发器',
      valueEnum: {
        onChange: {
          text: 'onChange',
          status: 'onChange',
        },
        onBlur: {
          text: 'onBlur',
          status: 'onBlur',
        },
        onValidate: {
          text: 'onValidate',
          status: 'onValidate',
        },
      },
    },
    {
      title: <FormattedMessage id="pages.title.option" defaultMessage="Operating" />,
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
            const tableDataSource = formRef.current?.getFieldValue('defines') as API.BaseRule[];
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

  const columns: ProColumns<API.Field>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      hideInForm: true,
      // hideInTable: true,
      render: (dom, entity) => {
        return idRender(dom, entity, setCurrentRow, setShowDetail);
      },
    },
    {
      title: '模型ID',
      dataIndex: 'modelID',
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
      title: 'json标签',
      dataIndex: 'jsonTag',
    },
    {
      title: '标签',
      dataIndex: 'label',
    },
    {
      title: '数据类型',
      dataIndex: 'type',
      valueEnum: {
        string: {
          text: '字符串',
          status: 'string',
        },
        float: {
          text: '浮点数',
          status: 'float',
        },
        int: {
          text: '整数',
          status: 'int',
        },
        uint: {
          text: '无符号整数',
          status: 'uint',
        },
        bool: {
          text: '布尔值',
          status: 'bool',
        },
        time: {
          text: '时间',
          status: 'time',
        },
        bytes: {
          text: '字节',
          status: 'bytes',
        },
      },
    },
    {
      title: '长度',
      dataIndex: 'size',
      valueType: 'digit',
    },
    {
      title: '主键',
      dataIndex: 'primaryKey',
    },
    {
      title: '唯一键',
      dataIndex: 'uniqueKey',
    },
    {
      title: '索引',
      dataIndex: 'index',
    },
    {
      title: '默认值',
      dataIndex: 'default',
    },
    {
      title: '注释',
      dataIndex: 'comment',
    },
    {
      title: '搜索类型',
      dataIndex: 'search',
      valueEnum: {
        exact: {
          text: '精确匹配',
          status: 'exact',
        },
        contains: {
          text: '包含',
          status: 'contains',
        },
        gt: {
          text: '大于',
          status: 'gt',
        },
        lt: {
          text: '小于',
          status: 'lt',
        },
        startswith: {
          text: '前缀',
          status: 'startswith',
        },
        endswith: {
          text: '后缀',
          status: 'endswith',
        },
        in: {
          text: '在',
          status: 'in',
        },
        isnull: {
          text: '为空',
          status: 'isnull',
        },
        order: {
          text: '排序',
          status: 'order',
        },
      },
    },
    {
      title: '非空',
      dataIndex: 'notNull',
      valueType: 'switch',
      search: false,
    },
    {
      title: '表单中隐藏',
      dataIndex: 'hideInForm',
      valueType: 'switch',
      search: false,
    },
    {
      title: '表格中隐藏',
      dataIndex: 'hideInTable',
      valueType: 'switch',
      search: false,
    },
    {
      title: '详情中隐藏',
      dataIndex: 'hideInDescriptions',
      valueType: 'switch',
      search: false,
    },
    {
      title: '验证规则',
      dataIndex: 'rules',
      hideInTable: true,
      search: false,
      renderFormItem() {
        return (
          <EditableProTable<API.BaseRule>
            rowKey="id"
            scroll={{ x: 960 }}
            formRef={formRef}
            headerTitle="验证规则"
            maxLength={10}
            name="rules"
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
      title: <FormattedMessage id="pages.title.option" />,
      dataIndex: 'option',
      valueType: 'option',
      hideInDescriptions: true,
      hideInForm: true,
      render: (_, record) => [
        <Access key="/field/edit">
          <Link to={`/field/${modelID}/${record.id}`}>
            <Button key="edit">
              <FormattedMessage id="pages.title.edit" defaultMessage="Edit" />
            </Button>
          </Link>
        </Access>,
        <Access key="/field/delete">
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
              await deleteFieldsId({ id: record.id! });
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
      await postFields(params);
      message.success(
        intl.formatMessage({
          id: 'pages.message.create.success',
          defaultMessage: 'Create successfully!',
        }),
      );
      history.push(`/field/${modelID}`);
      return;
    }
    await putFieldsId({ id }, params);
    message.success(
      intl.formatMessage({
        id: 'pages.message.update.success',
        defaultMessage: 'Update successfully!',
      }),
    );
    history.push(`/field/${modelID}`);
  };

  useEffect(() => {
    // request modelID
    if (!modelID) {
      message.error('modelID is empty').then(() => history.push('/model'));
    }
  }, [modelID]);

  return (
    <PageContainer title={indexTitle(id)}>
      <ProTable<API.Field, API.getFieldsParams>
        headerTitle={intl.formatMessage({
          id: 'pages.field.list.title',
          defaultMessage: 'Field List',
        })}
        actionRef={actionRef}
        formRef={formRef}
        rowKey="id"
        search={false}
        type={id ? 'form' : 'table'}
        onSubmit={id ? onSubmit : undefined}
        toolBarRender={() => [
          <Access key="/field/create">
            <Button type="primary" key="create">
              <Link type="primary" key="primary" to={`/field/${modelID}/create`}>
                <PlusOutlined /> <FormattedMessage id="pages.table.new" defaultMessage="New" />
              </Link>
            </Button>
          </Access>,
        ]}
        form={
          id && id !== 'create'
            ? {
                request: async () => {
                  const res = await getFieldsId({ id });
                  return res;
                },
              }
            : undefined
        }
        request={getFields}
        params={{ modelID }}
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
          <ProDescriptions<API.Field>
            column={1}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.id,
            }}
            columns={columns as ProDescriptionsItemProps<API.Field>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default Field;
