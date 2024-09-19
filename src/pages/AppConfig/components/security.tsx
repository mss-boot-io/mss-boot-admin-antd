import { ProColumns, ProFormInstance, ProTable } from '@ant-design/pro-components';
import React, { useRef } from 'react';
import { useIntl } from '@umijs/max';
import { message } from 'antd';
import { getAppConfigsGroup, putAppConfigsGroup } from '@/services/admin/appConfig';
const Security: React.FC = () => {
  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const formRef = useRef<ProFormInstance>();

  const [github, setGithub] = React.useState(false);
  const [lark, setLark] = React.useState(false);

  const columns: ProColumns<any>[] = [
    {
      title: '开放注册',
      dataIndex: 'registerEnabled',
      valueType: 'switch',
    },
    {
      title: '邮箱登录',
      dataIndex: 'emailEnabled',
      valueType: 'switch',
    },
    {
      title: 'github登录',
      dataIndex: 'githubEnabled',
      valueType: 'switch',
    },
    {
      title: 'github client id',
      dataIndex: 'githubClientId',
      hideInForm: !github,
      valueType: 'text',
      formItemProps: () => {
        return {
          rules: [{ required: true }],
        };
      },
    },
    {
      title: 'github client secret',
      dataIndex: 'githubClientSecret',
      hideInForm: !github,
      valueType: 'password',
    },
    {
      title: 'github redirect uri',
      dataIndex: 'githubRedirectURI',
      hideInForm: !github,
      valueType: 'text',
      formItemProps: () => {
        return {
          rules: [{ required: true }],
        };
      },
    },
    {
      title: 'github scope',
      dataIndex: 'githubScope',
      hideInForm: !github,
      valueType: 'text',
      formItemProps: () => {
        return {
          rules: [{ required: true }],
        };
      },
    },
    {
      title: 'github allow group',
      dataIndex: 'githubAllowGroup',
      valueType: 'text',
      hideInForm: !github,
    },
    {
      title: 'lark登录',
      dataIndex: 'larkEnabled',
      valueType: 'switch',
    },
    {
      title: 'lark app id',
      dataIndex: 'larkAppId',
      hideInForm: !lark,
      valueType: 'text',
      formItemProps: () => {
        return {
          rules: [{ required: true }],
        };
      },
    },
    {
      title: 'lark app secret',
      dataIndex: 'larkAppSecret',
      hideInForm: !lark,
      valueType: 'password',
    },
    {
      title: 'lark redirect uri',
      dataIndex: 'larkRedirectURI',
      hideInForm: !lark,
      valueType: 'text',
      formItemProps: () => {
        return {
          rules: [{ required: true }],
        };
      },
    },
  ];

  const onSubmit = async (params: Record<string, any>) => {
    params.githubEnabled = github;
    params.larkEnabled = lark;
    await putAppConfigsGroup({ group: 'security' }, { data: params });
    message.success(
      intl.formatMessage({ id: 'pages.message.edit.success', defaultMessage: 'Update Success!' }),
    );
  };

  return (
    <ProTable<any>
      type="form"
      formRef={formRef}
      columns={columns}
      onSubmit={onSubmit}
      form={{
        request: async () => {
          const res = await getAppConfigsGroup({ group: 'security' });
          setGithub(res.githubEnabled);
          setLark(res.larkEnabled);
          return res;
        },
        onValuesChange: (values) => {
          if (values.larkEnabled !== undefined) {
            setLark(values.larkEnabled);
          }
          if (values.githubEnabled !== undefined) {
            setGithub(values.githubEnabled);
          }
        },
      }}
    />
  );
};

export default Security;
