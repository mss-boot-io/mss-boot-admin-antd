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
import { PageContainer, ProDescriptions, ProTable } from '@ant-design/pro-components';
import { FormattedMessage, Link, useParams, history } from '@umijs/max';
import { Button, Drawer, Popconfirm, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import {
  deleteFieldsId,
  getFields,
  getFieldsId,
  postFields,
  putFieldsId,
} from '@/services/admin/field';

const Field: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const { id, modelID } = useParams();

  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<API.Field>();
  const formRef = useRef<ProFormInstance>();

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
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="Operating" />,
      dataIndex: 'option',
      valueType: 'option',
      hideInDescriptions: true,
      hideInForm: true,
      render: (_, record) => [
        <Access key="/field/edit">
          <Link to={`/field/${modelID}/${record.id}`}>
            <Button key="edit">编辑</Button>
          </Link>
        </Access>,
        <Access key="/field/delete">
          <Popconfirm
            key="delete"
            title="删除"
            description="你确定要删除吗?"
            onConfirm={async () => {
              const res = await deleteFieldsId({ id: record.id! });
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
      await postFields(params);
      message.success('创建成功');
      history.push('/field');
      return;
    }
    await putFieldsId({ id }, params);
    message.success('修改成功');
    history.push('/field');
  };

  useEffect(() => {
    // request modelID
    if (!modelID || !id) {
      message.error('modelID is empty').then(() => history.push('/model'));
    }
  }, [modelID]);

  return (
    <PageContainer title={indexTitle(id)}>
      <ProTable<API.Field, API.getFieldsParams>
        headerTitle="字段列表"
        actionRef={actionRef}
        formRef={formRef}
        rowKey="id"
        search={false}
        type={id ? 'form' : 'table'}
        onSubmit={id ? onSubmit : undefined}
        toolBarRender={() => [
          <Access key="/field/create">
            <Button type="primary" key="create">
              <Link type="primary" key="primary" to="/field/create">
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
