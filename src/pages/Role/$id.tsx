import { getRolesId, postRoles, putRolesId } from '@/services/admin/role';
import {
  PageContainer,
  ProForm,
  ProFormInstance,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { useParams, history } from '@umijs/max';
import { message } from 'antd';
import { useRef } from 'react';

const RoleControl: React.FC = () => {
  const { id } = useParams();
  const formRef = useRef<ProFormInstance>();
  const statusOptions = [
    { label: '启用', value: 1 },
    { label: '禁用', value: 2 },
  ];
  const onFinish = async () => {
    if (id === 'create') {
      const res = await postRoles(formRef.current?.getFieldsValue());
      if (!res) {
        message.success('新增成功').then(() => {
          history.push('/role');
        });
      }
      return;
    }
    //update
    const res = await putRolesId({ id: id! }, formRef.current?.getFieldsValue());
    if (!res) {
      message.success('更新成功').then(() => {
        history.push('/role');
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
        request={id === 'create' ? null : getRolesId}
        autoFocusFirstInput
      >
        <ProFormText
          width="md"
          name="name"
          label="角色名"
          rules={[{ required: true, message: '请输入角色名' }]}
        />
        <ProFormTextArea width="md" name="remark" label="描述" />
        <ProFormSelect width="md" name="status" label="状态" options={statusOptions} />
        {/* <ProForm.Item label="权限">
          <Spin spinning={authTreeLoading}>
            <Alert
              message="获取权限树失败"
              type="error"
              showIcon
              style={{ display: authTreeError ? 'block' : 'none' }}
            />
            <Auth
              values={authTree}
              checkedKeys={checkedKeys}
              setCheckedKeys={setCheckedKeys}
              id={id}
            />
          </Spin>
        </ProForm.Item> */}
      </ProForm>
    </PageContainer>
  );
};

export default RoleControl;
