import React, { useRef, useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload, message } from 'antd';
import {
  ProColumns,
  ProFormDependency,
  ProFormInstance,
  ProFormSelect,
  ProTable,
} from '@ant-design/pro-components';

import styles from './BaseView.less';
import { getUserUserInfo, putUserUserInfo } from '@/services/admin/user';
import { useRequest } from 'ahooks';
import { province } from '../geographic/province';
import { city } from '../geographic/city';
import { request, useIntl } from '@umijs/max';

// 头像组件 方便以后独立，增加裁剪之类的功能
const AvatarView = ({ avatar, setAvatar }: { avatar: string; setAvatar: any }) => (
  <>
    <div className={styles.avatar_title}>头像</div>
    <div className={styles.avatar}>
      <img src={avatar} alt="avatar" />
    </div>
    <Upload
      showUploadList={false}
      // action={`${API_URL}/admin/api/user/avatar?token=${localStorage.getItem('token')}`}
      customRequest={async ({ file }) => {
        const formData = new FormData();

        formData.append('file', file);
        const res = await request('/admin/api/user/avatar', {
          method: 'POST',
          data: formData,
        });
        setAvatar(res.avatar);
        console.log(res);
        console.log(file);
      }}
    >
      <div className={styles.button_view}>
        <Button>
          <UploadOutlined />
          更换头像
        </Button>
      </div>
    </Upload>
  </>
);

const BaseView: React.FC = () => {
  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const formRef = useRef<ProFormInstance>();
  const [avatar, setAvatar] = useState<string>('');

  const getProvince = () => {
    return province.map((item) => {
      return {
        label: item.name,
        value: item.id,
      };
    });
  };

  const getCity = (key: string) => {
    // @ts-ignore
    return city[key].map((item) => {
      return {
        label: item.name,
        value: item.id,
      };
    });
  };

  const { data: currentUser, loading } = useRequest(async () => {
    const res = await getUserUserInfo();
    if (res) {
      const img = res.avatar;
      if (img) {
        setAvatar(img);
      }
      return res;
    }
    return {};
  });

  const columns: ProColumns<any>[] = [
    {
      title: '用户名',
      dataIndex: 'username',
      valueType: 'text',
      width: 'md',
      formItemProps: {
        rules: [
          { required: true, message: '请输入用户名' },
          { min: 3, message: '用户名至少3位' },
          { max: 20, message: '用户名最多20位' },
          { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字、下划线' },
        ],
      },
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      valueType: 'text',
      width: 'md',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '请输入您的邮箱!',
          },
        ],
      },
    },
    {
      title: '新密码',
      dataIndex: 'password',
      valueType: 'password',
      width: 'md',
      formItemProps: {
        rules: [
          { required: true },
          { min: 8 },
          { max: 20 },
          {
            pattern: /[a-zA-Z]/,
            message: intl.formatMessage({
              id: 'pages.message.password.rule.pattern.letters',
              defaultMessage: 'The password must contain letters',
            }),
          },
          {
            pattern: /[0-9]/,
            message: intl.formatMessage({
              id: 'pages.message.password.rule.pattern.numbers',
              defaultMessage: 'The password must contain numbers',
            }),
          },
        ],
      },
    },
    {
      title: '确认密码',
      dataIndex: 'confirm',
      valueType: 'password',
      width: 'md',
      formItemProps: {
        rules: [
          { required: true },
          { min: 8 },
          { max: 20 },
          {
            pattern: /[a-zA-Z]/,
            message: intl.formatMessage({
              id: 'pages.message.password.rule.pattern.letters',
              defaultMessage: 'The password must contain letters',
            }),
          },
          {
            pattern: /[0-9]/,
            message: intl.formatMessage({
              id: 'pages.message.password.rule.pattern.numbers',
              defaultMessage: 'The password must contain numbers',
            }),
          },
        ],
      },
    },
    {
      title: '昵称',
      dataIndex: 'name',
      valueType: 'text',
      width: 'md',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '请输入您的昵称!',
          },
        ],
      },
    },
    {
      title: '个人简介',
      dataIndex: 'profile',
      valueType: 'textarea',
      width: 'md',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '请输入个人简介!',
          },
        ],
      },
    },
    {
      title: '国家/地区',
      dataIndex: 'country',
      valueType: 'select',
      width: 'md',
      valueEnum: {
        China: '中国',
      },
    },
    {
      title: '所在省市',
      dataIndex: 'province',
      valueType: 'select',
      width: 'md',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '请输入您的所在省!',
          },
        ],
      },
      renderFormItem: () => {
        return (
          <>
            <ProFormSelect
              rules={[
                {
                  required: true,
                  message: '请输入您的所在省!',
                },
              ]}
              width="sm"
              fieldProps={{
                labelInValue: true,
              }}
              name="province"
              className={styles.item}
              onChange={() => {
                formRef.current?.setFieldsValue({
                  city: undefined,
                });
              }}
              // @ts-ignore
              request={getProvince}
            />
            <ProFormDependency name={['province']}>
              {({ province }) => {
                return (
                  <ProFormSelect
                    params={{
                      key: province?.value,
                    }}
                    name="city"
                    width="sm"
                    rules={[
                      {
                        required: true,
                        message: '请输入您的所在城市!',
                      },
                    ]}
                    disabled={!province}
                    className={styles.item}
                    request={async () => {
                      if (!province?.key) {
                        if (currentUser?.province) {
                          return getCity(currentUser?.province);
                        }
                        return [];
                      }
                      return getCity(province.key);
                    }}
                  />
                );
              }}
            </ProFormDependency>
          </>
        );
      },
    },
    {
      title: '街道地址',
      dataIndex: 'address',
      valueType: 'text',
      width: 'md',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '请输入您的街道地址!',
          },
        ],
      },
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      valueType: 'text',
      width: 'md',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '请输入您的联系电话!',
          },
        ],
      },
    },
  ];

  const handleFinish = async () => {
    const data = formRef.current?.getFieldsValue();
    data.avatar = avatar;
    const res = await putUserUserInfo(data);
    if (!res) {
      message.success('更新基本信息成功');
      return;
    }
    message.error('更新基本信息失败');
  };
  return (
    <div className={styles.baseView}>
      {loading ? null : (
        <>
          <div className={styles.left}>
            <ProTable
              type="form"
              formRef={formRef}
              columns={columns}
              onSubmit={handleFinish}
              form={{
                initialValues: {
                  ...currentUser,
                  country: currentUser?.country || 'China',
                },
                layout: 'vertical',
                requiredMark: false,
                submitter: {
                  searchConfig: {
                    submitText: '更新基本信息',
                  },
                  render: (_, dom) => dom[1],
                },
              }}
            />
          </div>
          <div className={styles.right}>
            <AvatarView avatar={avatar} setAvatar={setAvatar} />
          </div>
        </>
      )}
    </div>
  );
};

export default BaseView;
