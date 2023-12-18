import { getLanguagesId, postLanguages, putLanguagesId } from '@/services/admin/language';
import { deleteLanguageDefinesId } from '@/services/admin/languageDefine';
import {
  EditableFormInstance,
  EditableProTable,
  PageContainer,
  ProColumns,
  ProForm,
  ProFormInstance,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { useParams, history } from '@umijs/max';
import { message } from 'antd';
import { useRef, useState } from 'react';
// @ts-ignore
import { v4 as uuidv4 } from 'uuid';

const LanguageControl: React.FC = () => {
  const { id } = useParams();
  const formRef = useRef<ProFormInstance>();
  const editorFormRef = useRef<EditableFormInstance<API.LanguageDefine>>();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() => []);

  const columns: ProColumns<API.LanguageDefine>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      hideInForm: true,
      hideInTable: true,
    },
    {
      title: '语言id',
      dataIndex: 'languageID',
      hideInForm: true,
      hideInTable: true,
    },
    {
      title: '分组',
      dataIndex: 'group',
      formItemProps: () => {
        return {
          rules: [{ required: true, message: '此项为必填项' }],
        };
      },
      width: '30%',
    },
    {
      title: '键',
      dataIndex: 'key',
      formItemProps: () => {
        return {
          rules: [{ required: true, message: '此项为必填项' }],
        };
      },
      width: '30%',
    },
    {
      title: '值',
      dataIndex: 'value',
      formItemProps: () => {
        return {
          rules: [{ required: true, message: '此项为必填项' }],
        };
      },
      width: '30%',
    },
    {
      title: '操作',
      valueType: 'option',
      width: 200,
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id!);
          }}
        >
          编辑
        </a>,
        <a
          key="delete"
          onClick={async () => {
            console.log(record.id);
            const res = await deleteLanguageDefinesId({ id: record.id! });
            if (!res) {
              message.success('删除成功');
            }
            const tableDataSource = formRef.current?.getFieldValue(
              'defines',
            ) as API.LanguageDefine[];
            formRef.current?.setFieldsValue({
              defines: tableDataSource.filter((item) => item.id !== record.id),
            });
          }}
        >
          删除
        </a>,
      ],
    },
  ];

  const statusOptions = [
    { label: '启用', value: 1 },
    { label: '禁用', value: 2 },
  ];
  const onFinish = async () => {
    if (id === 'create') {
      const res = await postLanguages(formRef.current?.getFieldsValue());
      if (!res) {
        message.success('新增成功').then(() => {
          history.push('/language');
        });
      }
      return;
    }
    //update
    const res = await putLanguagesId({ id: id! }, formRef.current?.getFieldsValue());
    if (!res) {
      message.success('更新成功').then(() => {
        history.push('/language');
      });
    }
  };

  return (
    <PageContainer title={id === 'create' ? '新增' : '更新'}>
      <ProForm
        formRef={formRef}
        omitNil={true}
        onFinish={onFinish}
        params={{ id, preloads: ['Defines'] }}
        // @ts-ignore
        request={id === 'create' ? null : getLanguagesId}
        autoFocusFirstInput
      >
        <ProFormText
          width="md"
          name="name"
          label="语言名称"
          rules={[{ required: true, message: '请输入语言名称' }]}
        />
        <ProFormSelect width="md" name="status" label="状态" options={statusOptions} />
        <EditableProTable<API.LanguageDefine>
          rowKey="id"
          scroll={{
            x: 960,
          }}
          editableFormRef={editorFormRef}
          headerTitle="语言内容"
          maxLength={1000}
          name="defines"
          controlled={false}
          // @ts-ignore
          recordCreatorProps={{
            position: 'bottom' as 'top',
            // @ts-ignore
            record: () => ({
              id: uuidv4().replace(/-/g, ''),
              languageID: id === 'create' ? '' : id,
            }),
          }}
          columns={columns}
          editable={{
            type: 'multiple',
            editableKeys,
            onChange: setEditableRowKeys,
            actionRender: (row, config, defaultDom) => {
              return [defaultDom.save, defaultDom.delete || defaultDom.cancel];
            },
          }}
        />
      </ProForm>
    </PageContainer>
  );
};

export default LanguageControl;
