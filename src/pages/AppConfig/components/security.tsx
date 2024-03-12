import { ProColumns, ProFormInstance, ProTable } from '@ant-design/pro-components';
import React, { useRef } from 'react';
import { useIntl } from '@umijs/max';
import { message } from 'antd';
import { getAppConfigsGroup, putAppConfigsGroup } from '@/services/admin/appConfig';
import AppConfigItem from '@/components/MssBoot/AppConfigItem';
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
      title: 'jwt颁发者',
      dataIndex: ['jwtRealm', 'value'],
      valueType: 'text',
    },
    {
      title: 'jwt密钥',
      dataIndex: 'jwtKey',
      valueType: 'text',
      renderFormItem: (schema) => {
        // @ts-ignore
        return <AppConfigItem dataIndex={schema.dataIndex} required={true} defaultChecked={true} />;
      },
    },
    {
      title: 'jwt过期时间(小时)',
      dataIndex: ['jwtTimeout', 'value'],
      valueType: 'digit',
    },
    {
      title: 'jwt刷新时间(月)',
      dataIndex: ['jwtMaxRefresh', 'value'],
      valueType: 'digit',
    },
    {
      title: '身份密钥',
      dataIndex: 'jwtIdentityKey',
      valueType: 'text',
      renderFormItem: (schema) => {
        // @ts-ignore
        return <AppConfigItem dataIndex={schema.dataIndex} required={true} defaultChecked={true} />;
      },
    },
    {
      title: 'github登录',
      dataIndex: ['githubEnabled', 'value'],
      valueType: 'switch',
    },
    {
      title: 'github client id',
      dataIndex: ['githubClientId', 'value'],
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
      renderFormItem: (schema) => {
        // @ts-ignore
        return <AppConfigItem dataIndex={schema.dataIndex} required={true} defaultChecked={true} />;
      },
    },
    {
      title: 'github redirect uri',
      dataIndex: ['githubRedirectURI', 'value'],
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
      dataIndex: ['githubScope', 'value'],
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
      dataIndex: ['githubAllowGroup', 'value'],
      valueType: 'text',
      hideInForm: !github,
    },
    {
      title: 'lark登录',
      dataIndex: ['larkEnabled', 'value'],
      valueType: 'switch',
    },
    {
      title: 'lark app id',
      dataIndex: ['larkAppId', 'value'],
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
      valueType: 'text',
      renderFormItem: (schema) => {
        // @ts-ignore
        return <AppConfigItem dataIndex={schema.dataIndex} required={true} defaultChecked={true} />;
      },
    },
    {
      title: 'lark redirect uri',
      dataIndex: ['larkRedirectURI', 'value'],
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
    params.githubEnabled = { value: github };
    params.larkEnabled = { value: lark };
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
          setGithub(res.githubEnabled.value);
          setLark(res.larkEnabled.value);
          return res;
        },
        onValuesChange: (values) => {
          if (values.larkEnabled !== undefined) {
            setLark(values.larkEnabled.value);
          }
          if (values.githubEnabled !== undefined) {
            setGithub(values.githubEnabled.value);
          }
        },
      }}
    />
  );
};

export default Security;
