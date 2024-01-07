import { Access } from '@/components/MssBoot/Access';
import Auth from '@/components/MssBoot/Auth';
import { getApis } from '@/services/admin/api';
import {
  deleteMenusId,
  getMenuApiId,
  getMenus,
  getMenusId,
  postMenuBindApi,
  postMenus,
  putMenusId,
} from '@/services/admin/menu';
import { idRender } from '@/util/columnOptions';
import { indexTitle } from '@/util/indexTitle';
import { menuTransferTree } from '@/util/menuTransferTree';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import { DrawerForm, PageContainer, ProDescriptions, ProTable } from '@ant-design/pro-components';
import { FormattedMessage, history, Link, useIntl, useParams } from '@umijs/max';
import { Button, Drawer, message, Popconfirm, TreeSelect } from 'antd';
import { DataNode } from 'antd/es/tree';
import React, { useEffect, useRef, useState } from 'react';

const TableList: React.FC = () => {
  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.Role>();

  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [treeData, setTreeData] = useState<DataNode[]>([]);

  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);

  const [list, setList] = useState<[]>([]);

  const { id } = useParams();

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const columns: ProColumns<API.Menu>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      hideInForm: true,
      render: (dom, entity) => {
        return idRender(dom, entity, setCurrentRow, setShowDetail);
      },
    },
    {
      title: '父级',
      search: false,
      hideInTable: true,
      dataIndex: 'parentID',
      renderFormItem: () => {
        return (
          <TreeSelect
            showSearch
            style={{ width: '100%' }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder="请选择父级"
            allowClear
            treeDefaultExpandAll
            // onChange={onChange}
            treeData={list}
          />
        );
      },
    },
    {
      title: '类型',
      dataIndex: 'type',
      search: false,
      valueEnum: {
        DIRECTORY: {
          text: '目录',
          color: 'blue',
          status: 'DIRECTORY',
        },
        MENU: {
          text: '菜单',
          color: 'green',
          status: 'MENU',
        },
        COMPONENT: {
          text: '组件',
          color: 'yellow',
          status: 'COMPONENT',
        },
        API: {
          text: '接口',
          color: 'red',
          status: 'API',
        },
      },
    },
    {
      title: '名称',
      dataIndex: 'name',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '名称为必填项',
          },
        ],
      },
      render: (dom) => {
        return intl.formatMessage({ id: `menu.${dom}` });
      },
    },

    {
      title: '路径',
      search: false,
      dataIndex: 'path',
      // valueType: 'textarea',
    },
    {
      title: '隐藏',
      dataIndex: 'hideInMenu',
      search: false,
      valueType: 'switch',
      valueEnum: {
        false: {
          text: '否',
          status: 'fasle',
        },
        true: {
          text: '是',
          status: 'true',
        },
      },
    },
    {
      title: '排序',
      dataIndex: 'sort',
      search: false,
      valueType: 'digit',
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueEnum: {
        enabled: {
          text: '启用',
          status: 'enabled',
        },
        disabled: {
          text: '禁用',
          status: 'disabled',
        },
        locked: {
          text: '锁定',
          status: 'locked',
        },
      },
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
        <Access key="/menu/edit">
          <Link to={`/menu/${record.id}`} key="edit">
            <Button>编辑</Button>
          </Link>
        </Access>,
        <Access key="/menu/bind-api">
          <Button
            disabled={record.type === 'DIRECTORY'}
            key="bind-api"
            onClick={() => {
              setCurrentRow(record);
              setAuthModalOpen(true);
            }}
          >
            绑定API
          </Button>
        </Access>,
        <Access key="/menu/delete">
          <Popconfirm
            key="delete"
            title="删除菜单"
            description="你确定要删除这个菜单吗?"
            onConfirm={async () => {
              await deleteMenusId({ id: record.id! });
              message.success('删除成功');
              actionRef.current?.reload();
            }}
            okText="确定"
            cancelText="再想想"
          >
            <Button>删除</Button>
          </Popconfirm>
        </Access>,
      ],
    },
  ];

  const onOpenChange = async (e: boolean) => {
    if (e) {
      const { data } = await getApis({ pageSize: 1000 });
      setTreeData(menuTransferTree(intl, data!));
      //get checkedKeys
      const checkedRes = await getMenuApiId({
        id: currentRow?.id ?? '',
      });
      if (checkedRes) {
        const checkedKeys: React.Key[] = [];
        checkedRes?.forEach((value) => {
          checkedKeys.push(`${value.method}---${value.path}`);
        });
        console.log(checkedKeys);
        setCheckedKeys(checkedKeys);
      }
      return;
    }
    setTreeData([]);
    setAuthModalOpen(e);
  };

  const transferTree = (data: API.Menu[]): DataNode[] => {
    // @ts-ignore
    return data.map((item) => {
      return {
        title: intl.formatMessage({ id: `menu.${item.name}` }),
        value: item.id,
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
      await postMenus(params);
      message.success('提交成功');
      history.push('/menu');
      return;
    }
    await putMenusId({ id }, params);
    message.success('提交成功');
    history.push('/menu');
  };

  useEffect(() => {
    if (id) {
      getMenus({ pageSize: 1000, type: 'MENU' }).then((res) => {
        console.log(res);
        // @ts-ignore
        setList(transferTree(res.data!));
      });
    }
  }, [id]);

  return (
    <PageContainer title={indexTitle(id)}>
      <ProTable<API.Menu, API.getMenusParams>
        headerTitle="角色列表"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        type={id ? 'form' : 'table'}
        onSubmit={id ? onSubmit : undefined}
        // onSubmit={async (params) => {
        //   console.log(params);
        // }}
        toolBarRender={() => [
          <Access key="/menu/create">
            <Link to="/menu/create" key="create">
              <Button type="primary" key="create">
                <PlusOutlined />{' '}
                <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
              </Button>
            </Link>
          </Access>,
        ]}
        form={
          id && id !== 'create'
            ? {
                request: async () => {
                  const res = await getMenusId({ id });
                  return res;
                },
              }
            : undefined
        }
        request={getMenus}
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
          <ProDescriptions<API.Menu>
            column={2}
            title={currentRow?.name}
            request={async (params) => {
              // @ts-ignore
              const res = await getMenusId(params);
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
      <DrawerForm
        onOpenChange={onOpenChange}
        title="绑定API"
        open={authModalOpen}
        onFinish={async () => {
          const paths: string[] = [];
          checkedKeys.forEach((value) => {
            paths.push(value.toString());
          });

          const res = await postMenuBindApi({
            menuID: currentRow?.id ?? '',
            paths,
          });
          if (!res) {
            message.success('提交成功');
            return true;
          }
          message.error('提交失败');
          return false;
        }}
      >
        <Auth values={treeData} setCheckedKeys={setCheckedKeys} checkedKeys={checkedKeys} />
      </DrawerForm>
    </PageContainer>
  );
};

export default TableList;
