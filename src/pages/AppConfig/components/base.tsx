import { getAppConfigsGroup, putAppConfigsGroup } from '@/services/admin/appConfig';
import { ProColumns, ProFormInstance, ProTable } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { Button, message, Upload } from 'antd';
import React, { useRef, useState } from 'react';
import { request } from '@@/exports';
import styles from '@/pages/Account/Settings/components/BaseView.less';
import { UploadOutlined } from '@ant-design/icons';

const AvatarView = ({ logo, setLogo }: { logo: string; setLogo: any }) => (
  <>
    <div className={styles.avatar_title}>网站logo</div>
    <div className={styles.avatar}>
      <img src={logo} alt="logo" />
    </div>
    <Upload
      showUploadList={false}
      // action={`${API_URL}/admin/api/user/avatar?token=${localStorage.getItem('token')}`}
      customRequest={async ({ file }) => {
        const formData = new FormData();

        formData.append('file', file);
        const res = await request('/admin/api/storage/upload', {
          method: 'POST',
          data: formData,
        });
        setLogo(res);
        console.log(res);
        console.log(file);
      }}
    >
      <div className={styles.button_view}>
        <Button>
          <UploadOutlined />
          更换logo
        </Button>
      </div>
    </Upload>
  </>
);

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
      dataIndex: ['websiteName', 'value'],
      initialValue: { value: 'mss-boot-admin' },
      formItemProps: () => {
        return {
          rules: [{ required: true, message: '此项为必填项' }],
        };
      },
    },
    {
      title: '网站描述',
      dataIndex: ['websiteDescription', 'value'],
      initialValue: { value: '快速开发http/grpc服务的框架，帮助您快速搭建单体服务或微服务系统' },
      valueType: 'textarea',
    },
    // {
    //   title: '网站logo',
    //   dataIndex: ['websiteLogo', 'value'],
    //   initialValue: 'https://docs.mss-boot-io.top/favicon.ico',
    //   valueType: 'avatar',
    //   renderFormItem: () => {
    //     return <Upload />;
    //   },
    // },
    {
      title: '备案编号',
      dataIndex: ['websiteRecordNumber', 'value'],
    },
    {
      title: '版权所有',
      initialValue: { value: '开源组织mss-boot-io出品' },
      dataIndex: ['websiteCopyRight', 'value'],
    },
  ];

  const onSubmit = async (params: Record<string, any>) => {
    params.websiteLogo = { value: logo };
    await putAppConfigsGroup({ group: 'base' }, { data: params });
    message.success(
      intl.formatMessage({ id: 'pages.message.edit.success', defaultMessage: 'Update Success!' }),
    );
  };

  return (
    <div className={styles.baseView}>
      <div className={styles.left}>
        <ProTable<any>
          type="form"
          formRef={formRef}
          columns={columns}
          onSubmit={onSubmit}
          form={{
            request: async () => {
              const res = await getAppConfigsGroup({ group: 'base' });
              setLogo(res?.websiteLogo?.value || 'https://docs.mss-boot-io.top/favicon.ico');
              return res;
            },
          }}
        />
      </div>
      <div className={styles.right}>
        <AvatarView logo={logo} setLogo={setLogo} />
      </div>
    </div>
  );
};

export default Base;
