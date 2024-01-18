import { Access } from '@/components/MssBoot/Access';
import Auth from '@/components/MssBoot/Auth';
import { getMenuTree } from '@/services/admin/menu';
import {
  deleteRolesId,
  getRoleAuthorizeRoleID,
  getRoles,
  getRolesId,
  postRoleAuthorizeRoleID,
  postRoles,
  putRolesId,
} from '@/services/admin/role';
import { idRender, statusOptions } from '@/util/columnOptions';
import { indexTitle } from '@/util/indexTitle';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import { DrawerForm, PageContainer, ProDescriptions, ProTable } from '@ant-design/pro-components';
import { FormattedMessage, history, Link, useIntl, useParams } from '@umijs/max';
import { Button, Drawer, message, Popconfirm } from 'antd';
import { DataNode } from 'antd/es/tree';
import React, { useRef, useState } from 'react';

const TableList: React.FC = () => {
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.Role>();
  const [treeData, setTreeData] = useState<DataNode[]>([]);

  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);

  const { id } = useParams();

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const columns: ProColumns<API.Role>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      hideInForm: true,
      render: (dom, entity) => {
        return idRender(dom, entity, setCurrentRow, setShowDetail);
      },
    },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '描述',
      search: false,
      dataIndex: 'remark',
      valueType: 'textarea',
    },
    {
      title: 'root权限',
      dataIndex: 'root',
      search: false,
      hideInForm: true,
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
      title: '状态',
      dataIndex: 'status',
      valueEnum: statusOptions,
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
        <Access key="/role/edit">
          <Button key="edit">
            <Link to={`/role/${record.id}`}>编辑</Link>
          </Button>
        </Access>,
        <Access key="/role/auth">
          <Button
            key="auth"
            disabled={record.root}
            onClick={() => {
              setAuthModalOpen(true);
              setCurrentRow(record);
            }}
          >
            授权
          </Button>
        </Access>,
        <Access key="/role/delete">
          <Popconfirm
            key="delete"
            title="删除角色"
            disabled={record.root}
            description="你确定要删除这个角色吗?"
            onConfirm={async () => {
              const res = await deleteRolesId({ id: record.id! });
              if (!res) {
                message.success('删除成功');
                actionRef.current?.reload();
              }
            }}
            okText="确定"
            cancelText="再想想"
          >
            <Button disabled={record.root} key="delete.button">
              删除
            </Button>
          </Popconfirm>
        </Access>,
      ],
    },
  ];

  const transfer = (data: API.Menu[]): DataNode[] => {
    // @ts-ignore
    return data.map((item) => {
      return {
        title: intl.formatMessage({ id: `menu.${item.name}` }),
        key: item.path,
        // @ts-ignore
        children: item.children ? transfer(item.children) : null,
      };
    });
  };

  const onOpenChange = async (e: boolean) => {
    if (e) {
      const data = await getMenuTree();
      console.log(transfer(data));
      setTreeData(transfer(data));
      //get checkedKeys
      const checkedRes = await getRoleAuthorizeRoleID({
        roleID: currentRow?.id ?? '',
      });
      if (checkedRes) {
        const checkedKeys: React.Key[] = [];
        checkedRes.paths?.forEach((value) => {
          checkedKeys.push(value);
        });
        setCheckedKeys(checkedKeys);
      }
      console.log('onOpenChange0');
      return;
    }
    console.log('onOpenChange1');
    setTreeData([]);
    setAuthModalOpen(e);
  };

  const onSubmit = async (params: any) => {
    if (!id) {
      return;
    }
    if (id === 'create') {
      await postRoles(params);
      message.success('创建成功');
      history.push('/role');
      return;
    }
    await putRolesId({ id }, params);
    message.success('修改成功');
    history.push('/role');
  };

  return (
    <PageContainer title={indexTitle(id)}>
      <ProTable<API.Role, API.Page>
        headerTitle="角色列表"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        type={id ? 'form' : 'table'}
        onSubmit={id ? onSubmit : undefined}
        toolBarRender={() => [
          <Access key="/role/create">
            <Button type="primary" key="create">
              <Link type="primary" key="primary" to="/role/create">
                <PlusOutlined /> <FormattedMessage id="pages.table.new" defaultMessage="New" />
              </Link>
            </Button>
          </Access>,
        ]}
        form={
          id && id !== 'create'
            ? {
                request: async () => {
                  const res = await getRolesId({ id });
                  return res;
                },
              }
            : undefined
        }
        // @ts-ignore
        request={getRoles}
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
          <ProDescriptions<API.Role>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.id,
            }}
            columns={columns as ProDescriptionsItemProps<API.Role>[]}
          />
        )}
      </Drawer>

      <DrawerForm
        onOpenChange={onOpenChange}
        title="授权"
        open={authModalOpen}
        onFinish={async () => {
          const paths: string[] = [];
          checkedKeys.forEach((value) => {
            paths.push(value.toString());
          });

          const res = await postRoleAuthorizeRoleID(
            {
              roleID: currentRow?.id ?? '',
            },
            {
              paths,
            },
          );
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
