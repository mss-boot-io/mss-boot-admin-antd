import { Access } from '@/components/MssBoot/Access';
import { getNotices, getNoticesId, putNoticeReadId } from '@/services/admin/notice';
import { idRender } from '@/util/columnOptions';
import { indexTitle } from '@/util/indexTitle';
import { PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  PageContainer,
  ProColumns,
  ProDescriptions,
  ProDescriptionsItemProps,
  ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage, Link, useIntl, useParams, useSearchParams } from '@umijs/max';
import { Button, Drawer, message } from 'antd';
import { useRef, useState } from 'react';

const Index: React.FC = () => {
  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.Notice>();

  const { id } = useParams();

  const [searchParams] = useSearchParams();

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const columns: ProColumns<API.Notice>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      hideInForm: true,
      render: (dom, entity) => {
        return idRender(dom, entity, setCurrentRow, setShowDetail);
      },
    },
    {
      title: '标题',
      dataIndex: 'title',
      ellipsis: true,
      copyable: true,
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: '5%',
      valueEnum: {
        notification: {
          text: '通知',
          color: 'red',
          status: 'notification',
        },
        message: {
          text: '消息',
          color: 'blue',
          status: 'message',
        },
        event: {
          text: '待办',
          color: 'gold',
          status: 'event',
        },
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: '5%',
      valueEnum: {
        urgent: {
          text: '紧急',
          color: 'red',
          status: 'urgent',
        },
        doing: {
          text: '正在做',
          color: 'green',
          status: 'doing',
        },
        processing: {
          text: '进行中',
          color: 'blue',
          status: 'processing',
        },
        todo: {
          text: '未开始',
          color: 'gold',
          status: 'todo',
        },
      },
    },
    {
      title: '日期',
      dataIndex: 'datetime',
      valueType: 'dateTime',
    },
    {
      title: '内容',
      dataIndex: 'description',
      ellipsis: true,
    },
    {
      title: '通知时间',
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="Operating" />,
      dataIndex: 'option',
      valueType: 'option',
      hideInDescriptions: true,
      width: '6%',
      hideInForm: true,
      render: (_, record) => [
        record.read ? (
          ''
        ) : (
          <Access key="/notice/read">
            <Button
              onClick={async () => {
                await putNoticeReadId({ id: record.id! });
                message.success(
                  intl.formatMessage({ id: 'page.title.notice.read', defaultMessage: '已读' }),
                );
                actionRef.current?.reload();
              }}
            >
              <FormattedMessage id="page.title.notice.read" defaultMessage="标为已读" />
            </Button>
          </Access>
        ),
      ],
    },
  ];

  return (
    <PageContainer title={indexTitle(id)}>
      <ProTable<API.Notice, API.getNoticesParams>
        headerTitle="通知列表"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Access key="/notice/create">
            <Link to="/notice/create" key="create">
              <Button type="primary" key="create">
                <PlusOutlined />{' '}
                <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
              </Button>
            </Link>
          </Access>,
        ]}
        // @ts-ignore
        params={{ type: searchParams.get('type') }}
        request={getNotices}
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
        {currentRow?.title && (
          <ProDescriptions<API.Notice>
            column={2}
            title={currentRow?.title}
            request={async (params) => {
              // @ts-ignore
              const res = await getNoticesId(params);
              res.title = currentRow?.title;
              return {
                data: res,
              };
            }}
            params={{
              id: currentRow?.id,
            }}
            columns={columns as ProDescriptionsItemProps<API.Notice>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default Index;
