import Storage from '@/pages/AppConfig/components/storage';
import { PageContainer } from '@ant-design/pro-components';
import { useIntl, useSearchParams } from '@umijs/max';
import { Tabs } from 'antd';
import React from 'react';
import Base from './components/base';
import Security from './components/security';
import Theme from '../../components/MssBoot/theme';
import Email from '@/pages/AppConfig/components/email';

const Settings: React.FC = () => {
  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();
  const [searchParams, setSearchParams] = useSearchParams();
  const key = searchParams.get('key') || 'base';
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
          <Base />
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
          <Security />
        </PageContainer>
      ),
    },
    {
      label: intl.formatMessage({
        id: 'pages.storage.settings.title',
        defaultMessage: 'Storage Settings',
      }),
      key: 'storage',
      children: (
        <PageContainer
          title={intl.formatMessage({
            id: 'pages.storage.settings.title',
            defaultMessage: 'Storage Settings',
          })}
        >
          <Storage />
        </PageContainer>
      ),
    },
    {
      label: intl.formatMessage({
        id: 'pages.email.settings.title',
        defaultMessage: 'Email Settings',
      }),
      key: 'email',
      children: (
        <PageContainer
          title={intl.formatMessage({
            id: 'pages.email.settings.title',
            defaultMessage: 'Email Settings',
          })}
        >
          <Email />
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
        id: 'pages.application.settings.title',
        defaultMessage: 'Personal Settings',
      })}
    >
      <Tabs
        type="card"
        activeKey={key}
        tabPosition="left"
        items={menuMap}
        onTabClick={(key: string) => setSearchParams({ key })}
      />
    </PageContainer>
  );
};
export default Settings;
