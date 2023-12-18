import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import { PageContainer, ProDescriptions, ProTable } from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Button, Drawer, Popconfirm, message } from 'antd';
import React, { useRef, useState } from 'react';
import { deleteMenusId, getMenus, getMenusId } from '@/services/admin/menu';

const TableList: React.FC = () => {
  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.Role>();
  const [control, setControl] = useState<boolean>(false);

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const columns: ProColumns<API.Role>[] & ProDescriptionsItemProps<API.Menu>[] = [
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
      title: '父级id',
      search: false,
      hideInTable: true,
      dataIndex: 'parentID',
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
      valueType: 'textarea',
    },
    {
      title: '隐藏',
      dataIndex: 'hideInMenu',
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
      title: '排序',
      dataIndex: 'sort',
      search: false,
      valueType: 'digit',
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
        <Button
          key="edit"
          onClick={() => {
            setControl(true);
            setCurrentRow(record);
          }}
        >
          编辑
        </Button>,
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
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.Role, API.Page>
        headerTitle="角色列表"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        type={control ? 'form' : 'table'}
        onSubmit={async (params) => {
          console.log(params);
        }}
        toolBarRender={() => [
          <Button type="primary" key="create" onClick={() => setControl(true)}>
            <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
          </Button>,
        ]}
        form={
          control
            ? {
                request: async () => {
                  if (currentRow?.id) {
                    // @ts-ignore
                    const res = await getMenusId({ id: currentRow?.id });
                    return res;
                  }
                  return {};
                },
              }
            : undefined
        }
        // @ts-ignore
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
    </PageContainer>
  );
};

export default TableList;
