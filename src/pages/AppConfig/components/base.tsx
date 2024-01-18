import { getAppConfigsGroup, putAppConfigsGroup } from '@/services/admin/appConfig';
import { ProColumns, ProFormInstance, ProTable } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { message, Upload } from 'antd';
import { useRef } from 'react';

const Base: React.FC = () => {
  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const formRef = useRef<ProFormInstance>();

  const columns: ProColumns<any>[] = [
    {
      title: '网站名称',
      dataIndex: 'websiteName',
      formItemProps: () => {
        return {
          rules: [{ required: true, message: '此项为必填项' }],
        };
      },
    },
    {
      title: '网站logo',
      dataIndex: 'websiteLogo',
      valueType: 'avatar',
      renderFormItem: () => {
        return <Upload />;
      },
    },
    {
      title: '备案编号',
      dataIndex: 'websiteRecordNumber',
    },
    {
      title: '版权所有',
      dataIndex: 'websiteCopyRight',
    },
  ];

  const onSubmit = async (params: any) => {
    await putAppConfigsGroup({ group: 'base' }, { data: params });
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
        request: async () => getAppConfigsGroup({ group: 'base' }),
      }}
    ></ProTable>
  );
};

export default Base;
