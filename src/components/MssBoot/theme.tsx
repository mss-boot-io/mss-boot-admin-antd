import React, { useRef } from 'react';
import { useIntl } from '@@/exports';
import { ProColumns, ProFormInstance, ProTable } from '@ant-design/pro-components';
import { getAppConfigsGroup, putAppConfigsGroup } from '@/services/admin/appConfig';
import { message } from 'antd';

const Theme: React.FC = () => {
  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const formRef = useRef<ProFormInstance>();

  const columns: ProColumns<any>[] = [
    {
      title: '导航主题',
      dataIndex: 'navTheme',
      valueType: 'select',
      valueEnum: {
        light: 'light',
        realDark: 'realDark',
      },
    },
    {
      title: '主题色',
      dataIndex: 'colorPrimary',
      valueType: 'color',
    },
    {
      title: '布局',
      dataIndex: 'layout',
      valueType: 'select',
      initialValue: {
        value: 'mix',
      },
      valueEnum: {
        side: 'side',
        top: 'top',
        mix: 'mix',
      },
    },
    {
      title: '内容宽度',
      dataIndex: 'contentWidth',
      valueType: 'select',
      initialValue: {
        value: 'Fluid',
      },
      valueEnum: {
        Fluid: 'Fluid',
        Fixed: 'Fixed',
      },
    },
    {
      title: '固定头部',
      dataIndex: 'fixedHeader',
      valueType: 'switch',
    },
    {
      title: '固定侧边栏',
      dataIndex: 'fixSiderbar',
      valueType: 'switch',
    },
    {
      title: '渐进式',
      dataIndex: 'pwa',
      valueType: 'switch',
    },
    {
      title: '色弱模式',
      dataIndex: 'colorWeak',
      valueType: 'switch',
    },
  ];

  const onSubmit = async (params: Record<string, any>) => {
    params.colorPrimary = params.colorPrimary.toHexString();
    await putAppConfigsGroup({ group: 'theme' }, { data: params });
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
          return await getAppConfigsGroup({ group: 'theme' });
        },
      }}
    />
  );
};

export default Theme;
