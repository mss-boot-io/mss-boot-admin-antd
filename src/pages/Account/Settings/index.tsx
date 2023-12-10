import { PageContainer, ProCard } from '@ant-design/pro-components';
import React from 'react';

const Settings: React.FC = () => {
  const [tab, setTab] = React.useState('account');

  return (
    <PageContainer
      content="欢迎使用 ProLayout 组件"
      tabList={[
        {
          tab: '账号设置',
          key: 'account',
        },
        {
          tab: '安全设置',
          key: 'security',
        },
      ]}
      onTabChange={(key: any) => {
        console.log(key);
        setTab(key);
        console.log(tab);
      }}
    >
      <ProCard direction="column" ghost gutter={[0, 16]}>
        <ProCard style={{ height: 200 }} />
        <ProCard gutter={16} ghost style={{ height: 200 }}>
          <ProCard colSpan={16} />
          <ProCard colSpan={8} />
        </ProCard>
      </ProCard>
    </PageContainer>
  );
};
export default Settings;
