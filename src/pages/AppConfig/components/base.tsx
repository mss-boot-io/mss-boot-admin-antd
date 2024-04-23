import { getAppConfigsGroup, putAppConfigsGroup } from '@/services/admin/appConfig';
import { ProColumns, ProFormInstance, ProTable } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { message, Upload } from 'antd';
import React, { useRef, useState } from 'react';
import { request } from '@@/exports';
import { PlusOutlined } from '@ant-design/icons';

const Base: React.FC = () => {
  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const formRef = useRef<ProFormInstance>();
  const [logo, setLogo] = useState<string>('');

  const columns: ProColumns<any>[] = [
    {
      title: '网站名称',
      dataIndex: 'websiteName',
      initialValue: 'mss-boot-admin',
      formItemProps: () => {
        return {
          rules: [{ required: true, message: '此项为必填项' }],
        };
      },
    },
    {
      title: '网站描述',
      dataIndex: 'websiteDescription',
      initialValue: '快速开发http/grpc服务的框架，帮助您快速搭建单体服务或微服务系统',
      valueType: 'textarea',
    },
    {
      title: '网站logo',
      dataIndex: 'websiteLogo',
      valueType: 'avatar',
      renderFormItem: () => {
        return (
          <Upload
            listType="picture-circle"
            className="avatar-uploader"
            showUploadList={false}
            customRequest={async ({ file }) => {
              const formData = new FormData();

              formData.append('file', file);
              const res = await request('/admin/api/storage/upload', {
                method: 'POST',
                data: formData,
              });
              setLogo(res);
            }}
          >
            {logo ? <img src={logo} alt="avatar" style={{ width: '100%' }} /> : <PlusOutlined />}
          </Upload>
        );
      },
    },
    {
      title: '备案编号',
      dataIndex: 'websiteRecordNumber',
    },
    {
      title: '版权所有',
      initialValue: '开源组织mss-boot-io出品',
      dataIndex: 'websiteCopyRight',
    },
  ];

  const onSubmit = async (params: Record<string, any>) => {
    params.websiteLogo = logo;
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
        request: async () => {
          const res = await getAppConfigsGroup({ group: 'base' });
          setLogo(res?.websiteLogo || 'https://docs.mss-boot-io.top/favicon.ico');
          return res;
        },
      }}
    />
  );
};

export default Base;
