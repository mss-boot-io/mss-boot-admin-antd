import { PageContainer } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { Tabs } from 'antd';
import React from 'react';
import BaseView from './components/base';
import BindingView from './components/binding';
import NotificationView from './components/notification';
import SecurityView from './components/security';
import Theme from '../../../components/MssBoot/theme';

const Settings: React.FC = () => {
  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();
  const menuMap: any[] = [
    {
      label: intl.formatMessage({
        id: 'pages.base.settings.title',
        defaultMessage: 'Basic Settings',
      }),
      key: 'base',
      children: (
        <PageContainer
          title={intl.formatMessage({
            id: 'pages.base.settings.title',
            defaultMessage: 'Basic Settings',
          })}
        >
          <BaseView />
        </PageContainer>
      ),
    },
    {
      label: intl.formatMessage({
        id: 'pages.security.settings.title',
        defaultMessage: 'Security Settings',
      }),
      key: 'security',
      children: (
        <PageContainer
          title={intl.formatMessage({
            id: 'pages.security.settings.title',
            defaultMessage: 'Security Settings',
          })}
        >
          <SecurityView />
        </PageContainer>
      ),
    },
    {
      label: intl.formatMessage({
        id: 'pages.binding.settings.title',
        defaultMessage: 'Account Binding',
      }),
      key: 'binding',
      children: (
        <PageContainer
          title={intl.formatMessage({
            id: 'pages.binding.settings.title',
            defaultMessage: 'Account Binding',
          })}
        >
          <BindingView />
        </PageContainer>
      ),
    },
    {
      label: intl.formatMessage({
        id: 'pages.notification.settings.title',
        defaultMessage: 'New Message Notification',
      }),
      key: 'notification',
      children: (
        <PageContainer
          title={intl.formatMessage({
            id: 'pages.notification.settings.title',
            defaultMessage: 'New Message Notification',
          })}
        >
          <NotificationView />
        </PageContainer>
      ),
    },
    {
      label: intl.formatMessage({
        id: 'pages.theme.settings.title',
        defaultMessage: 'Theme Settings',
      }),
      key: 'theme',
      children: (
        <PageContainer
          title={intl.formatMessage({
            id: 'pages.theme.settings.title',
            defaultMessage: 'Theme Settings',
          })}
        >
          <Theme />
        </PageContainer>
      ),
    },
  ];

  return (
    <PageContainer
      title={intl.formatMessage({
        id: 'pages.account.settings.title',
        defaultMessage: 'Personal Settings',
      })}
    >
      <Tabs tabPosition="left" type="card" items={menuMap} />
    </PageContainer>
  );
};
export default Settings;
