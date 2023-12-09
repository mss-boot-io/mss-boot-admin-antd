import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import { DrawerForm, PageContainer, ProDescriptions, ProTable } from '@ant-design/pro-components';
import { FormattedMessage, Link, useIntl } from '@umijs/max';
import { Button, Drawer, Input, Popconfirm, message } from 'antd';
import React, { useRef, useState } from 'react';
import Auth from './components/Auth';
import { DataNode } from 'antd/es/tree';
import {
  deleteRolesId,
  getRoleAuthorizeRoleId,
  postRoleAuthorizeRoleId,
  getRoles,
} from '@/services/admin/role';
import { getMenuTree } from '@/services/admin/menu';

const TableList: React.FC = () => {
  const [authModalOpen, handleAuthModalOpen] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.Role>();
  const [treeData, setTreeData] = useState<DataNode[]>([]);

  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);

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
        return (
          <a
            key={entity.id}
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
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
      valueType: 'checkbox',
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
      valueEnum: {
        1: {
          text: '启用',
          status: '1',
        },
        2: {
          text: '禁用',
          status: '2',
        },
        3: {
          text: '锁定',
          status: '3',
        },
      },
    },
    {
      title: '上次修改时间',
      sorter: true,
      dataIndex: 'updatedAt',
      search: false,
      valueType: 'dateTime',
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        const status = form.getFieldValue('status');
        if (`${status}` === '0') {
          return false;
        }
        if (`${status}` === '3') {
          return (
            <Input
              {...rest}
              placeholder={intl.formatMessage({
                id: 'pages.searchTable.exception',
                defaultMessage: 'Please enter the reason for the exception!',
              })}
            />
          );
        }
        return defaultRender(item);
      },
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="Operating" />,
      dataIndex: 'option',
      valueType: 'option',
      hideInDescriptions: true,
      hideInForm: true,
      render: (_, record) => [
        <Button key="edit">
          <Link to={`/role/${record.id}`}>编辑</Link>
        </Button>,
        <Button
          key="auth"
          onClick={() => {
            handleAuthModalOpen(true);
            setCurrentRow(record);
          }}
        >
          授权
        </Button>,
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
        </Popconfirm>,
      ],
    },
  ];

  const onOpenChange = async (e: boolean) => {
    if (e) {
      const data = await getMenuTree();
      //@ts-ignore
      setTreeData(data);
      //get checkedKeys
      const checkedRes = await getRoleAuthorizeRoleId({
        roleID: currentRow?.id ?? '',
      });
      if (checkedRes) {
        const checkedKeys: React.Key[] = [];
        checkedRes.menuIDS?.forEach((value) => {
          checkedKeys.push(value);
        });
        setCheckedKeys(checkedKeys);
      }
      console.log('onOpenChange0');
      return;
    }
    console.log('onOpenChange1');
    setTreeData([]);
    handleAuthModalOpen(e);
  };

  return (
    <PageContainer>
      <ProTable<API.Role, API.Page>
        headerTitle="角色列表"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button type="primary" key="create">
            <Link type="primary" key="primary" to="/role/create">
              <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
            </Link>
          </Button>,
        ]}
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
          const menuIDS: string[] = [];
          checkedKeys.forEach((value) => {
            menuIDS.push(value.toString());
          });

          const res = await postRoleAuthorizeRoleId(
            {
              roleID: currentRow?.id ?? '',
            },
            {
              menuIDS: menuIDS,
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
        <Auth
          values={treeData}
          id={currentRow?.id}
          setCheckedKeys={setCheckedKeys}
          checkedKeys={checkedKeys}
        />
      </DrawerForm>
    </PageContainer>
  );
};

export default TableList;
