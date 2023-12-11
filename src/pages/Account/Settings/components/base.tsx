import React, { useRef, useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload, message } from 'antd';
import {
  ProForm,
  ProFormDependency,
  ProFormInstance,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';

import styles from './BaseView.less';
import { getUserUserInfo, putUserUserInfo } from '@/services/admin/user';
import { useRequest } from 'ahooks';
import { province } from '../geographic/province';
import { city } from '../geographic/city';
import { request } from '@umijs/max';

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
  const formRef = useRef<ProFormInstance>();
  const [avatar, setAvatar] = useState<string>('');

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
            <ProForm
              formRef={formRef}
              layout="vertical"
              onFinish={handleFinish}
              submitter={{
                searchConfig: {
                  submitText: '更新基本信息',
                },
                render: (_, dom) => dom[1],
              }}
              initialValues={{
                ...currentUser,
                country: currentUser?.country || 'China',
              }}
              requiredMark={false}
            >
              <ProFormText
                width="md"
                name="username"
                disabled
                label="用户名"
                rules={[
                  { required: true, message: '请输入用户名' },
                  { min: 3, message: '用户名至少3位' },
                  { max: 20, message: '用户名最多20位' },
                  { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字、下划线' },
                ]}
              />
              <ProFormText
                width="md"
                name="email"
                label="邮箱"
                rules={[
                  {
                    required: true,
                    message: '请输入您的邮箱!',
                  },
                ]}
              />
              <ProFormText
                width="md"
                name="name"
                label="昵称"
                rules={[
                  {
                    required: true,
                    message: '请输入您的昵称!',
                  },
                ]}
              />
              <ProFormTextArea
                name="profile"
                label="个人简介"
                rules={[
                  {
                    required: true,
                    message: '请输入个人简介!',
                  },
                ]}
                placeholder="个人简介"
              />
              <ProFormSelect
                width="sm"
                name="country"
                label="国家/地区"
                rules={[
                  {
                    required: true,
                    message: '请输入您的国家或地区!',
                  },
                ]}
                options={[
                  {
                    label: '中国',
                    value: 'China',
                  },
                ]}
              />

              <ProForm.Group title="所在省市" size={8}>
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
              </ProForm.Group>
              <ProFormText
                width="md"
                name="address"
                label="街道地址"
                rules={[
                  {
                    required: true,
                    message: '请输入您的街道地址!',
                  },
                ]}
              />
              <ProFormText
                width="md"
                name="phone"
                label="联系电话"
                rules={[
                  {
                    required: true,
                    message: '请输入您的联系电话!',
                  },
                ]}
              />
            </ProForm>
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
