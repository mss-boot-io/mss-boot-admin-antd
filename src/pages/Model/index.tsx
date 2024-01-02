import { Access } from '@/components/MssBoot/Access';
import {
  deleteModelsId,
  getModels,
  getModelsId,
  postModels,
  putModelMigrateId,
  putModelsId,
} from '@/services/admin/model';
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
import React, { useRef, useState } from 'react';

const Model: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const { id } = useParams();
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<API.Model>();
  const formRef = useRef<ProFormInstance>();

  const migrate = async (id: string) => {
    await putModelMigrateId({ id });
    message.success('生成成功');
    actionRef.current?.reload();
  };

  const columns: ProColumns<API.Model>[] = [
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
      title: '名称',
      dataIndex: 'name',
      formItemProps: () => {
        return {
          rules: [{ required: true, message: '此项为必填项' }],
        };
      },
    },
    {
      title: '表名',
      dataIndex: 'table',
    },
    {
      title: 'path路径',
      dataIndex: 'path',
    },
    {
      title: '描述',
      dataIndex: 'description',
    },
    {
      title: '硬删除',
      dataIndex: 'hardDeleted',
      valueType: 'switch',
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="Operating" />,
      dataIndex: 'option',
      valueType: 'option',
      hideInDescriptions: true,
      hideInForm: true,
      render: (_, record) => [
        <Access key="/model/edit">
          <Link to={`/model/${record.id}`}>
            <Button key="edit">编辑</Button>
          </Link>
        </Access>,
        <Access key="/model/field">
          <Link to={`/field/${record.id}`}>
            <Button key="field">字段</Button>
          </Link>
        </Access>,
        <Access key="/model/migrate">
          <Button onClick={async () => migrate(record.id!)} disabled={record.migrate} key="migrate">
            生成表
          </Button>
        </Access>,
        <Access key="/model/delete">
          <Popconfirm
            key="delete"
            title="删除"
            description="你确定要删除吗?"
            onConfirm={async () => {
              const res = await deleteModelsId({ id: record.id! });
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
      await postModels(params);
      message.success('创建成功');
      history.push('/model');
      return;
    }
    await putModelsId({ id }, params);
    message.success('修改成功');
    history.push('/model');
  };

  return (
    <PageContainer title={indexTitle(id)}>
      <ProTable<API.Model, API.getModelsParams>
        headerTitle="模型列表"
        actionRef={actionRef}
        formRef={formRef}
        rowKey="id"
        search={false}
        type={id ? 'form' : 'table'}
        onSubmit={id ? onSubmit : undefined}
        toolBarRender={() => [
          <Access key="/model/create">
            <Button type="primary" key="create">
              <Link type="primary" key="primary" to="/models/create">
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
                  const res = await getModelsId({ id });
                  return res;
                },
              }
            : undefined
        }
        request={getModels}
        params={{ preloads: ['Fields'] }}
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
          <ProDescriptions<API.Model>
            column={1}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.id,
            }}
            columns={columns as ProDescriptionsItemProps<API.Model>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default Model;
