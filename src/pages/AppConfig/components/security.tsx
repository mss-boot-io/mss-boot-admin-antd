import { ProColumns, ProFormInstance, ProFormSwitch, ProTable } from '@ant-design/pro-components';
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

  const columns: ProColumns<any>[] = [
    {
      title: 'jwt颁发者',
      dataIndex: 'jwtRealm',
      valueType: 'text',
      formItemProps: () => {
        return {
          rules: [{ required: true }],
        };
      },
    },
    {
      title: 'jwt密钥',
      dataIndex: 'jwtKey',
      valueType: 'text',
      formItemProps: () => {
        return {
          rules: [{ required: true }],
        };
      },
    },
    {
      title: 'jwt过期时间(小时)',
      dataIndex: 'jwtTimeout',
      valueType: 'digit',
      formItemProps: () => {
        return {
          rules: [{ required: true }, { type: 'number', min: 1 }],
        };
      },
    },
    {
      title: 'jwt刷新时间(月)',
      dataIndex: 'jwtMaxRefresh',
      valueType: 'digit',
      formItemProps: () => {
        return {
          rules: [{ required: true }, { type: 'number', min: 1 }],
        };
      },
    },
    {
      title: '身份密钥',
      dataIndex: 'jwtIdentityKey',
      valueType: 'text',
      formItemProps: () => {
        return {
          rules: [{ required: true }],
        };
      },
    },
    {
      title: 'github登录',
      dataIndex: 'githubEnabled',
      valueType: 'switch',
      renderFormItem() {
        return (
          <ProFormSwitch
            // checkedChildren="开"
            // unCheckedChildren="关"
            // @ts-ignore
            onChange={(value) => {
              setGithub(value);
            }}
          />
        );
      },
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
      valueType: 'text',
      formItemProps: () => {
        return {
          rules: [{ required: true }],
        };
      },
    },
    {
      title: 'github redirect uri',
      dataIndex: 'githubRedirectUri',
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
      title: 'github auth url',
      dataIndex: 'githubAuthURL',
      hideInForm: !github,
      valueType: 'text',
      formItemProps: () => {
        return {
          rules: [{ required: true }],
        };
      },
    },
    {
      title: 'github token url',
      dataIndex: 'githubTokenURL',
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
  ];

  const onSubmit = async (params: Record<string, any>) => {
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
        request: async () => getAppConfigsGroup({ group: 'security' }),
      }}
    />
  );
};

export default Security;
