import { getOnlineSession } from '@/services/admin/onlineSession';
import { useIntl, useRequest } from '@umijs/max';
import { Descriptions, Drawer, Spin, Tag } from 'antd';
import moment from 'moment';
import React from 'react';
import { getSessionStatus, STATUS_COLOR, STATUS_INTL_ID } from '../utils';

type Props = {
  id?: string;
  open: boolean;
  onClose: () => void;
};

const SessionDetailDrawer: React.FC<Props> = ({ id, open, onClose }) => {
  const intl = useIntl();
  const { data, loading } = useRequest(
    async () => {
      if (!id) return undefined;
      return getOnlineSession({ id });
    },
    { refreshDeps: [id] },
  );

  const fmtTime = (t?: string) => (t ? moment(t).format('YYYY-MM-DD HH:mm:ss') : '—');
  const status = data ? getSessionStatus(data) : undefined;

  return (
    <Drawer
      title={intl.formatMessage({ id: 'pages.onlineSession.drawer.title' })}
      open={open}
      onClose={onClose}
      width={520}
      destroyOnClose
    >
      {loading || !data ? (
        <Spin />
      ) : (
        <Descriptions column={1} bordered size="small">
          <Descriptions.Item
            label={intl.formatMessage({ id: 'pages.onlineSession.columns.username' })}
          >
            {data.username || '—'}
          </Descriptions.Item>
          <Descriptions.Item
            label={intl.formatMessage({ id: 'pages.onlineSession.columns.userID' })}
          >
            {data.userID || '—'}
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({ id: 'pages.onlineSession.columns.ip' })}>
            {data.ip || '—'}
          </Descriptions.Item>
          <Descriptions.Item
            label={intl.formatMessage({ id: 'pages.onlineSession.columns.userAgent' })}
          >
            <span style={{ wordBreak: 'break-all' }}>{data.userAgent || '—'}</span>
          </Descriptions.Item>
          <Descriptions.Item
            label={intl.formatMessage({ id: 'pages.onlineSession.columns.loginAt' })}
          >
            {fmtTime(data.loginAt)}
          </Descriptions.Item>
          <Descriptions.Item
            label={intl.formatMessage({ id: 'pages.onlineSession.columns.lastSeenAt' })}
          >
            {fmtTime(data.lastSeenAt)}
          </Descriptions.Item>
          <Descriptions.Item
            label={intl.formatMessage({ id: 'pages.onlineSession.columns.expiredAt' })}
          >
            {fmtTime(data.expiredAt)}
          </Descriptions.Item>
          <Descriptions.Item
            label={intl.formatMessage({ id: 'pages.onlineSession.columns.status' })}
          >
            {status ? (
              <Tag color={STATUS_COLOR[status]}>
                {intl.formatMessage({ id: STATUS_INTL_ID[status] })}
              </Tag>
            ) : (
              '—'
            )}
          </Descriptions.Item>
          <Descriptions.Item
            label={intl.formatMessage({ id: 'pages.onlineSession.drawer.field.revokedBy' })}
          >
            {data.revokedBy || '—'}
          </Descriptions.Item>
          <Descriptions.Item
            label={intl.formatMessage({ id: 'pages.onlineSession.drawer.field.revokedAt' })}
          >
            {fmtTime(data.revokedAt)}
          </Descriptions.Item>
          <Descriptions.Item
            label={intl.formatMessage({ id: 'pages.onlineSession.drawer.field.revokeReason' })}
          >
            {data.revokeReason || '—'}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Drawer>
  );
};

export default SessionDetailDrawer;
