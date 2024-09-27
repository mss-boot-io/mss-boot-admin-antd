import { getUserOauth2, postUserBinding } from '@/services/admin/user';
import { GithubOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { useRequest } from 'ahooks';
import { List } from 'antd';
import React, { Fragment, useEffect, useState } from 'react';

function randToken(): string {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < 28; i++) {
    // 可以根据需要调整长度
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const BindingView: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const [bindingGithub, setBindingGithub] = useState(false);
  const scopes = initialState?.appConfig?.security?.githubScope?.replace(/,/g, '+') || '';
  const state = 'ghs_' + randToken();
  const githubURL = `https://github.com/login/oauth/authorize?client_id=${initialState?.appConfig?.security?.githubClientId}&response_type=code&scope=${scopes}&state=${state}`;

  const {} = useRequest(
    () => {
      return getUserOauth2().then((res) => {
        if (res.length > 0) {
          res.forEach((item: any) => {
            if (item.type === 'github') {
              setBindingGithub(true);
            }
          });
        }
      });
    },
    {
      refreshDeps: [],
    },
  );

  const getData = () => [
    {
      title: 'Github',
      description: bindingGithub ? '已绑定 Github 账号' : '未绑定 Github 账号',
      actions: [
        bindingGithub ? null : (
          <a
            key="Bind"
            onClick={() => {
              localStorage.setItem('github.state', state);
            }}
            href={githubURL}
            target="_blank"
            rel="noopener noreferrer"
          >
            绑定
          </a>
        ),
      ],
      avatar: <GithubOutlined className="github" />,
    },
  ];

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        const token = localStorage.getItem('github.token');
        postUserBinding({ type: 'github', password: token as string }).then(() => {
          setBindingGithub(true);
        });
      }
    };

    // 添加事件监听器
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 清理事件监听器
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [setBindingGithub]);

  return (
    <Fragment>
      <List
        itemLayout="horizontal"
        dataSource={getData()}
        renderItem={(item) => (
          <List.Item actions={item.actions}>
            <List.Item.Meta
              avatar={item.avatar}
              title={item.title}
              description={item.description}
            />
          </List.Item>
        )}
      />
    </Fragment>
  );
};

export default BindingView;
