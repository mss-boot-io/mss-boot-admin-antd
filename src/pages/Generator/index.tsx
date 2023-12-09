import React, { useState, useRef, useEffect } from 'react';
import type { ProFormInstance } from '@ant-design/pro-components';
import {
  ProCard,
  ProFormSelect,
  ProFormText,
  StepsForm,
  ProForm,
} from '@ant-design/pro-components';
import { message } from 'antd';
import {
  getGithubGetLoginUrl,
  getTemplateGetBranches,
  getTemplateGetParams,
  getTemplateGetPath,
  postTemplateGenerate,
} from '@/services/admin/generator';
import { GithubOutlined } from '@ant-design/icons';
import { useLocation } from '@umijs/max';

function randToken(): string {
  const buffer = new Uint8Array(32);
  window.crypto.getRandomValues(buffer);
  // @ts-ignore
  return btoa(String.fromCharCode.apply(null, buffer));
}

const Generate: React.FC = () => {
  const formRef = useRef<ProFormInstance>();

  const [branches, setBranches] = useState<string[]>([]);
  const [accessToken, setAccessToken] = useState<string>('');
  const [paths, setPaths] = useState<string[]>([]);
  const [params, setParams] = useState<API.TemplateParam[]>([]);
  const [source, setSource] = useState<string>('');
  const [branch, setBranch] = useState<string>('');
  const [path, setPath] = useState<string>('');
  const location = useLocation();

  useEffect(() => {
    if (!accessToken) {
      const intervalId = setInterval(() => {
        console.log('interval');
        const token = localStorage.getItem('github.token');
        if (token) {
          setAccessToken(token);
          formRef.current?.setFieldsValue({ accessToken: token });
          clearInterval(intervalId);
        }
      }, 1000);
    }
  }, [setAccessToken]);

  return (
    <div>
      <ProCard>
        <StepsForm<{
          name: string;
        }>
          formRef={formRef}
          onFinish={async () => {
            const ps = formRef.current?.getFieldsValue();
            delete ps.repo;
            delete ps.service;
            const req = await postTemplateGenerate({
              accessToken: accessToken,
              email: formRef.current?.getFieldsValue().email,
              generate: {
                params: ps,
                repo: formRef.current?.getFieldsValue().repo,
                service: formRef.current?.getFieldsValue().service,
              },
              template: {
                source: source,
                branch: branch,
                path: path,
              },
            });
            if (req.repo && req.branch) {
              message.success('代码生成成功, 分支为: ' + req.branch);
            }
          }}
          formProps={{
            validateMessages: {
              required: '此项为必填项',
            },
          }}
        >
          <StepsForm.StepForm<{
            name: string;
          }>
            name="template"
            title="设置模板仓库"
            stepProps={{
              description: '这里填入模板仓库链接',
            }}
            onFinish={async () => {
              if (!accessToken) {
                const token = localStorage.getItem('github.token');
                if (token) {
                  setAccessToken(token);
                }
              }
              formRef.current?.setFieldsValue({ accessToken });
              setSource(formRef.current?.getFieldsValue().source);
              const data = formRef.current?.getFieldsValue();
              data.accessToken = accessToken;
              console.log(data);
              const branchesData = await getTemplateGetBranches(data);
              console.log(branchesData);
              setBranches(branchesData.branches || []);
              return true;
            }}
          >
            <ProFormText
              name="source"
              label="模板仓库地址"
              width="md"
              tooltip="目前支持github地址"
              placeholder="请输入模板仓库地址"
              rules={[{ required: true }]}
            />
            {accessToken ? (
              ''
            ) : (
              <ProCard
                onClick={async () => {
                  console.log(location);
                  const state = randToken();
                  localStorage.setItem('github.state', state);
                  const loginURL = await getGithubGetLoginUrl({ state: state });
                  const w = window.open('about:blank');
                  // @ts-ignore
                  w.location.href = loginURL;
                }}
              >
                获取GitHub权限 <GithubOutlined key="GithubOutlined" />
              </ProCard>
            )}
          </StepsForm.StepForm>
          <StepsForm.StepForm<{
            checkbox: string;
          }>
            name="branch"
            title="选择分支"
            stepProps={{
              description: '这里选择仓库分支',
            }}
            onFinish={async () => {
              setBranch(formRef.current?.getFieldsValue().branch);
              const pathData = await getTemplateGetPath({
                branch: formRef.current?.getFieldsValue().branch,
                source: source,
                accessToken: accessToken,
              });
              setPaths(pathData.path || []);

              console.log(formRef.current?.getFieldsValue());
              return true;
            }}
          >
            <ProFormSelect
              label="分支"
              name="branch"
              rules={[
                {
                  required: true,
                },
              ]}
              initialValue="请选择"
              options={branches}
            />
          </StepsForm.StepForm>
          <StepsForm.StepForm
            name="path"
            title="选择目录"
            stepProps={{
              description: '这里选择模板目录',
            }}
            onFinish={async () => {
              setPath(formRef.current?.getFieldsValue().path);
              const paramsData = await getTemplateGetParams({
                path: formRef.current?.getFieldsValue().path,
                source: source,
                branch: branch,
                accessToken: accessToken,
              });
              setParams(paramsData.params || []);

              console.log(formRef.current?.getFieldsValue());
              return true;
            }}
          >
            <ProFormSelect
              label="目录"
              name="path"
              rules={[
                {
                  required: true,
                },
              ]}
              initialValue="请选择"
              options={paths}
            />
          </StepsForm.StepForm>
          <StepsForm.StepForm
            name="params"
            title="填写参数"
            stepProps={{
              description: '这里填写模板参数',
            }}
          >
            <ProCard title="仓库信息" tooltip="生成代码的目标仓库信息" style={{ maxWidth: 500 }}>
              <ProForm.Group>
                <ProFormText name="repo" label="仓库地址" tooltip="生成代码目标仓库地址" />
              </ProForm.Group>
              <ProForm.Group>
                <ProFormText name="service" label="服务" tooltip="生成代码目标仓库目录" />
              </ProForm.Group>
              <ProForm.Group>
                <ProFormText name="email" label="邮箱" tooltip="代码仓库提交邮箱" />
              </ProForm.Group>
            </ProCard>

            <ProCard title="模板参数" tooltip="生成代码模板所用参数" style={{ maxWidth: 500 }}>
              {params.map((item) => (
                <ProForm.Group key={item.name}>
                  <ProFormText
                    key={item.name}
                    name={item.name}
                    label={item.name}
                    tooltip={item.tip}
                  />
                </ProForm.Group>
              ))}
            </ProCard>
          </StepsForm.StepForm>
        </StepsForm>
      </ProCard>
    </div>
  );
};

export default Generate;
