import { getTasksId, postTasks, putTasksId } from '@/services/admin/task';
import {
  PageContainer,
  ProForm,
  ProFormInstance,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { useParams } from '@umijs/max';
import { message } from 'antd';
import { useRef, useState } from 'react';

const TaskControl: React.FC = () => {
  const { id } = useParams();
  const formRef = useRef<ProFormInstance>();
  const [needMethod, setNeedMethod] = useState<boolean>(false);
  const [needBody, setNeedBody] = useState<boolean>(false);
  const [mustBody, setMustBody] = useState<boolean>(false);

  return (
    <PageContainer title={id === 'create' ? '新增' : '更新'}>
      <ProForm
        formRef={formRef}
        omitNil={true}
        onFinish={async () => {
          formRef.current?.setFieldValue(
            'endpoint',
            formRef.current?.getFieldValue('protocol') +
              '://' +
              formRef.current?.getFieldValue('endpoint'),
          );
          formRef.current?.setFieldValue('protocol', null);
          if (id === 'create') {
            console.log(formRef.current?.getFieldsValue());
            const res = await postTasks(formRef.current?.getFieldsValue());
            if (!res) {
              message.success('新增成功');
            }
            return;
          }
          //update
          const res = await putTasksId({ id: id! }, formRef.current?.getFieldsValue());
          if (!res) {
            message.success('更新成功');
          }
        }}
        // initialValues={{
        //   // name: '',
        //   // useMode: '',
        // }}
        request={async () => {
          if (id === 'create') {
            return {};
          }
          const data = await getTasksId({ id: id! });
          if (data?.endpoint) {
            data.protocol = data.endpoint.split('://')[0];
            data.endpoint = data.endpoint.split('://')[1];
          }
          setNeedMethod(data.protocol === 'http' || data.protocol === 'https');
          setNeedBody(data.method !== 'GET');
          setMustBody(data.method === 'POST' || data.method === 'PUT');
          return data;
        }}
        autoFocusFirstInput
      >
        <ProFormText
          width="md"
          name="name"
          label="名称"
          placeholder="请输入任务名称"
          rules={[{ required: true }]}
        />
        <ProFormText
          width="md"
          name="spec"
          label="cron表达式"
          placeholder="请输入cron表达式"
          rules={[{ required: true }]}
        />
        <ProForm.Group>
          <ProFormSelect
            options={[
              {
                value: 'http',
                label: 'http',
              },
              {
                value: 'https',
                label: 'https',
              },
              {
                value: 'grpc',
                label: 'grpc',
              },
              {
                value: 'grpcs',
                label: 'grpcs',
              },
            ]}
            onChange={(value) => {
              setNeedMethod(value === 'http' || value === 'https');
            }}
            width="xs"
            name="protocol"
            label="调用地址"
          />
          <ProFormText width="sm" name="endpoint" label="   " placeholder="请输入任务调用地址" />
        </ProForm.Group>
        {needMethod && (
          <ProFormSelect
            options={[
              {
                value: 'GET',
                label: 'GET',
              },
              {
                value: 'POST',
                label: 'POST',
              },
              {
                value: 'PUT',
                label: 'PUT',
              },
              {
                value: 'DELETE',
                label: 'DELETE',
              },
            ]}
            onChange={(value) => {
              setNeedBody(value !== 'GET');
              setMustBody(value === 'POST' || value === 'PUT');
            }}
            width="md"
            name="method"
            label="调用方法"
            placeholder="请选择http调用方法"
          />
        )}

        {needBody && (
          <ProFormTextArea
            width="md"
            name="body"
            label="请求体"
            placeholder="请输入请求体"
            rules={[{ required: mustBody }]}
          />
        )}

        <ProFormTextArea width="md" name="remark" label="备注" placeholder="请输入任务备注" />
      </ProForm>
    </PageContainer>
  );
};

export default TaskControl;
