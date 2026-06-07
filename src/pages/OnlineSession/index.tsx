import { deleteOnlineSession, getOnlineSessions } from '@/services/admin/onlineSession';
import {
  PageContainer,
  ProTable,
  type ActionType,
  type ProColumns,
} from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { Button, message, Popconfirm, Tag, Tooltip, Typography } from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import React, { useRef, useState } from 'react';
import RevokeUserModal from './components/RevokeUserModal';
import SessionDetailDrawer from './components/SessionDetailDrawer';
import { getSessionStatus, STATUS_COLOR, STATUS_INTL_ID, type SessionStatus } from './utils';

dayjs.extend(relativeTime);

const OnlineSessionPage: React.FC = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const [detailId, setDetailId] = useState<string | undefined>();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [revokeUserOpen, setRevokeUserOpen] = useState(false);
  const [presetUserID, setPresetUserID] = useState<string | undefined>();

  const openDetail = (id?: string) => {
    if (!id) return;
    setDetailId(id);
    setDrawerOpen(true);
  };

  const openRevokeUser = (userID?: string) => {
    setPresetUserID(userID);
    setRevokeUserOpen(true);
  };

  const handleRevoke = async (id?: string) => {
    if (!id) return;
    await deleteOnlineSession({ id });
    message.success(intl.formatMessage({ id: 'pages.onlineSession.result.revoke.success' }));
    actionRef.current?.reload();
  };

  const columns: ProColumns<API.UserSession>[] = [
    {
      title: intl.formatMessage({ id: 'pages.onlineSession.columns.username' }),
      dataIndex: 'username',
      render: (_, row) => <a onClick={() => openDetail(row.id)}>{row.username || '—'}</a>,
    },
    {
      title: intl.formatMessage({ id: 'pages.onlineSession.columns.userID' }),
      dataIndex: 'userID',
      copyable: true,
      ellipsis: true,
    },
    {
      title: intl.formatMessage({ id: 'pages.onlineSession.columns.ip' }),
      dataIndex: 'ip',
    },
    {
      title: intl.formatMessage({ id: 'pages.onlineSession.columns.userAgent' }),
      dataIndex: 'userAgent',
      hideInSearch: true,
      render: (_, row) => (
        <Tooltip title={row.userAgent}>
          <Typography.Text style={{ maxWidth: 240 }} ellipsis>
            {row.userAgent || '—'}
          </Typography.Text>
        </Tooltip>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.onlineSession.columns.loginAt' }),
      dataIndex: 'loginAt',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({ id: 'pages.onlineSession.columns.lastSeenAt' }),
      dataIndex: 'lastSeenAt',
      hideInSearch: true,
      render: (_, row) =>
        row.lastSeenAt ? (
          <Tooltip title={dayjs(row.lastSeenAt).format('YYYY-MM-DD HH:mm:ss')}>
            {dayjs(row.lastSeenAt).fromNow()}
          </Tooltip>
        ) : (
          '—'
        ),
    },
    {
      title: intl.formatMessage({ id: 'pages.onlineSession.columns.expiredAt' }),
      dataIndex: 'expiredAt',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({ id: 'pages.onlineSession.columns.status' }),
      dataIndex: 'status',
      valueType: 'select',
      initialValue: 'active',
      valueEnum: {
        all: { text: intl.formatMessage({ id: 'pages.onlineSession.status.all' }) },
        active: { text: intl.formatMessage({ id: 'pages.onlineSession.status.active' }) },
        revoked: { text: intl.formatMessage({ id: 'pages.onlineSession.status.revoked' }) },
        expired: { text: intl.formatMessage({ id: 'pages.onlineSession.status.expired' }) },
      },
      render: (_, row) => {
        const s: SessionStatus = getSessionStatus(row);
        return <Tag color={STATUS_COLOR[s]}>{intl.formatMessage({ id: STATUS_INTL_ID[s] })}</Tag>;
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.onlineSession.columns.option' }),
      dataIndex: 'option',
      valueType: 'option',
      render: (_, row) => {
        const isActive = getSessionStatus(row) === 'active';
        return [
          <a key="detail" onClick={() => openDetail(row.id)}>
            {intl.formatMessage({ id: 'pages.onlineSession.action.detail' })}
          </a>,
          isActive && (
            <Popconfirm
              key="revoke"
              title={intl.formatMessage({ id: 'pages.onlineSession.confirm.revoke' })}
              onConfirm={() => handleRevoke(row.id)}
            >
              <a style={{ color: '#ff4d4f' }}>
                {intl.formatMessage({ id: 'pages.onlineSession.action.revoke' })}
              </a>
            </Popconfirm>
          ),
          isActive && row.userID && (
            <a
              key="revokeUser"
              style={{ color: '#ff4d4f' }}
              onClick={() => openRevokeUser(row.userID)}
            >
              {intl.formatMessage({ id: 'pages.onlineSession.action.revokeUser' })}
            </a>
          ),
        ].filter(Boolean);
      },
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.UserSession, API.getOnlineSessionsParams>
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        request={async (params) => {
          const { current, pageSize, status, userID, username, ip } = params as any;
          // status === 'all' 或为空 → 不传，后端按全集返回
          const apiStatus = status && status !== 'all' ? (status as SessionStatus) : undefined;
          const res = await getOnlineSessions({
            current,
            pageSize,
            status: apiStatus,
            userID,
            username,
            ip,
          });
          return {
            data: res.data ?? [],
            total: typeof res.total === 'number' ? res.total : 0,
            success: true,
          };
        }}
        toolBarRender={() => [
          <Button key="revokeUser" danger onClick={() => openRevokeUser()}>
            {intl.formatMessage({ id: 'pages.onlineSession.action.revokeUserToolbar' })}
          </Button>,
        ]}
        search={{ labelWidth: 80 }}
      />
      <SessionDetailDrawer id={detailId} open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <RevokeUserModal
        open={revokeUserOpen}
        presetUserID={presetUserID}
        onClose={() => setRevokeUserOpen(false)}
        onSuccess={() => actionRef.current?.reload()}
      />
    </PageContainer>
  );
};

export default OnlineSessionPage;
