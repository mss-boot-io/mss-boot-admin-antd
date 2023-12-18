import { getUsersId, postUsers, putUsersId } from '@/services/admin/user';
import { getRoles } from '@/services/admin/role';
import {
  PageContainer,
  ProForm,
  ProFormInstance,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { useParams, history } from '@umijs/max';
import { message } from 'antd';
import { useRef } from 'react';

const UserControl: React.FC = () => {
  const { id } = useParams();
  const formRef = useRef<ProFormInstance>();

  // useEffect(() => {
  //   getRolesOptions(false);
  // });

  const onFinish = async () => {
    if (id === 'create') {
      // create
      const res = await postUsers(formRef.current?.getFieldsValue());
      if (!res) {
        message.success('新增成功').then(() => {
          history.push('/users');
        });
      }
    }
    // update
    const res = await putUsersId({ id: id! }, formRef.current?.getFieldsValue());
    if (!res) {
      message.success('更新成功').then(() => {
        history.push('/users');
      });
    }
  };

  return (
    <PageContainer title={id === 'create' ? '新增' : '更新'}>
      <ProForm
        formRef={formRef}
        omitNil={true}
        onFinish={onFinish}
        params={{ id }}
        // @ts-ignore
        request={id === 'create' ? null : getUsersId}
        autoFocusFirstInput
      >
        <ProFormText
          name="username"
          label="用户名"
          placeholder="请输入用户名"
          rules={[
            { required: true, message: '请输入用户名' },
            { min: 3, message: '用户名至少3位' },
            { max: 20, message: '用户名最多20位' },
            { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字、下划线' },
          ]}
        />
        <ProFormText.Password
          name="password"
          label="密码"
          placeholder="请输入密码"
          rules={[
            { required: true, message: '请输入密码' },
            { min: 8, message: '密码至少8位' },
            { max: 20, message: '密码最多20位' },
            { pattern: /[a-zA-Z]/, message: '密码必须包含字母' },
            { pattern: /[0-9]/, message: '密码必须包含数字' },
          ]}
        />
        <ProFormText.Password
          name="confirm"
          label="确认密码"
          placeholder="请确认密码"
          rules={[
            { required: true, message: '请确认密码' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('两次密码不一致'));
              },
            }),
          ]}
        />
        <ProFormText
          name="name"
          label="名称"
          placeholder="请输入名称"
          rules={[{ required: true, message: '请输入名称' }]}
        />
        <ProFormText
          name="email"
          label="邮箱"
          placeholder="请输入邮箱"
          rules={[{ type: 'email', message: '请输入正确的邮箱' }]}
        />
        <ProFormSelect
          name="status"
          label="状态"
          placeholder="请选择状态"
          options={[
            { label: '启用', value: 1 },
            { label: '禁用', value: 2 },
          ]}
          rules={[{ required: true, message: '请选择状态' }]}
        />
        <ProFormSelect
          name="roleID"
          label={'角色'}
          placeholder="请选择角色"
          // @ts-ignore
          request={async (params) => {
            const res = await getRoles(params);
            if (res) {
              return res.data?.map((item: any) => ({
                label: item.name,
                value: item.id,
              }));
            }
          }}
          params={{ pageSize: 999 }}
          rules={[{ required: true, message: '请选择角色' }]}
        />
      </ProForm>
    </PageContainer>
  );
};

export default UserControl;
