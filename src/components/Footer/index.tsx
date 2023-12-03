import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import React from 'react';

const Footer: React.FC = () => {
  const intl = useIntl();
  const defaultMessage = intl.formatMessage({
    id: 'app.copyright.produced',
    defaultMessage: '开源组织mss-boot-io出品',
  });

  const currentYear = new Date().getFullYear();

  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright={`${currentYear} ${defaultMessage}`}
      links={[
        {
          key: 'mss-boot-io',
          title: 'mss-boot-io',
          href: 'https://github.com/mss-boot-io/mss-boot',
          blankTarget: true,
        },
        {
          key: 'github',
          title: <GithubOutlined />,
          href: 'https://github.com/mss-boot-io/mss-boot',
          blankTarget: true,
        },
        {
          key: 'mss-boot-admin',
          title: 'mss-boot-admin',
          href: 'https://github.com/mss-boot-io/mss-boot-admin',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
