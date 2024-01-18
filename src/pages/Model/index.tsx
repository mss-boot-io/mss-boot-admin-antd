import { Access } from '@/components/MssBoot/Access';
import { getMenus } from '@/services/admin/menu';
import {
  deleteModelsId,
  getModels,
  getModelsId,
  postModels,
  putModelGenerateData,
  putModelsId,
} from '@/services/admin/model';
import { idRender } from '@/util/columnOptions';
import { indexTitle } from '@/util/indexTitle';
import { menuTransferTree } from '@/util/menuTransferTree';
import { PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  DrawerForm,
  PageContainer,
  ProColumns,
  ProDescriptions,
  ProDescriptionsItemProps,
  ProFormInstance,
  ProFormText,
  ProFormTreeSelect,
  ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage, history, Link, useIntl, useParams } from '@umijs/max';
import { Button, Drawer, Form, message, Popconfirm } from 'antd';
import React, { useRef, useState } from 'react';

const Model: React.FC = () => {
  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const actionRef = useRef<ActionType>();
  const { id } = useParams();
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<API.Model>();
  const formRef = useRef<ProFormInstance>();
  const [openSelectMenu, setOpenSelectMenu] = useState<boolean>(false);
  const [generateDataForm] = Form.useForm<{ id: string; menuParentID: string }>();

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
      title: '需要认证',
      dataIndex: 'auth',
      valueType: 'switch',
    },
    {
      title: '多租户',
      dataIndex: 'multiTenant',
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
        <Access key="/model/generate-data">
          <Button
            onClick={async () => {
              setCurrentRow(record);
              setOpenSelectMenu(true);
            }}
            disabled={record.generatedData}
          >
            生成数据
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

  const onOpenChange = async (e: boolean) => {
    if (e) {
      return;
    }
    setOpenSelectMenu(e);
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
              <Link type="primary" key="primary" to="/model/create">
                <PlusOutlined /> <FormattedMessage id="pages.table.new" defaultMessage="New" />
              </Link>
            </Button>
          </Access>,
        ]}
        form={
          id && id !== 'create'
            ? {
                request: async () => {
                  return await getModelsId({ id });
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
      <DrawerForm<API.ModelGenerateDataRequest>
        title="选择父级"
        width={600}
        form={generateDataForm}
        open={openSelectMenu}
        onOpenChange={onOpenChange}
        onFinish={async (e) => {
          await putModelGenerateData(e);
          message.success('生成成功');
          actionRef.current?.reload();
          setOpenSelectMenu(false);
        }}
      >
        <ProFormText name="id" hidden initialValue={currentRow?.id} />
        <ProFormTreeSelect
          name="menuParentID"
          allowClear
          width="xl"
          placeholder="请选择父级"
          request={async () => {
            const res = await getMenus({ pageSize: 1000 });
            // @ts-ignore
            return menuTransferTree(intl, res.data);
          }}
        />
      </DrawerForm>
    </PageContainer>
  );
};

export default Model;
