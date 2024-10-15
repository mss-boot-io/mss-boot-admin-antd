import { deleteUserUnbinding, getUserOauth2, postUserBinding } from '@/services/admin/user';
import { GithubOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { useRequest } from 'ahooks';
import { List, message } from 'antd';
import React, { Fragment, useEffect, useState } from 'react';
import { LarkOutlined } from '@/components/MssBoot/icon';

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
  const [bindingLark, setBindingLark] = useState(false);
  const scopes = initialState?.appConfig?.security?.githubScope?.replace(/,/g, '+') || '';
  const githubState = 'ghs_' + randToken();
  const githubURL = `https://github.com/login/oauth/authorize?client_id=${initialState?.appConfig?.security?.githubClientId}&response_type=code&scope=${scopes}&state=${githubState}`;
  const larkState = 'lark' + randToken();
  const larkURL = `https://open.larksuite.com/open-apis/authen/v1/index?redirect_uri=${initialState?.appConfig?.security?.larkRedirectURI}&app_id=${initialState?.appConfig?.security?.larkAppId}&state=${larkState}`;

  const {} = useRequest(
    async () => {
      const res = await getUserOauth2();
      if (res.length > 0) {
        res.forEach((item: any) => {
          if (item.type === 'github') {
            setBindingGithub(true);
            return;
          }
          if (item.type === 'lark') {
            setBindingLark(true);
            return;
          }
        });
      }
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
        bindingGithub ? (
          <a
            key="Bind"
            onClick={() => {
              deleteUserUnbinding({ type: 'github' }).then(() => {
                message.success('解绑成功');
                setBindingGithub(false);
              });
            }}
            // href={githubURL}
            rel="noopener noreferrer"
          >
            解绑
          </a>
        ) : (
          <a
            key="Bind"
            onClick={() => {
              localStorage.setItem('github.state', githubState);
              localStorage.setItem('bindingType', 'github');
              window.open(githubURL);
            }}
            // href={githubURL}
            target="_blank"
            rel="noopener noreferrer"
          >
            绑定
          </a>
        ),
      ],
      avatar: <GithubOutlined className="github" />,
    },
    {
      title: 'Lark',
      description: bindingLark ? '已绑定 Lark 账号' : '未绑定 Lark 账号',
      actions: [
        bindingLark ? (
          <a
            key="Bind"
            onClick={() => {
              deleteUserUnbinding({ type: 'lark' }).then(() => {
                message.success('解绑成功');
                setBindingLark(false);
              });
            }}
            rel="noopener noreferrer"
          >
            解绑
          </a>
        ) : (
          <a
            key="Bind"
            onClick={() => {
              localStorage.setItem('lark.state', larkState);
              localStorage.setItem('bindingType', 'lark');
              window.open(larkURL);
            }}
            // href={larkURL}
            target="_blank"
            rel="noopener noreferrer"
          >
            绑定
          </a>
        ),
      ],
      avatar: <LarkOutlined className="lark" />,
    },
  ];

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        const bindingType = localStorage.getItem('bindingType');
        let token: string | null = null;
        let setHandler = setBindingGithub;
        switch (bindingType) {
          case 'github':
            token = localStorage.getItem('github.token');
            setHandler = setBindingGithub;
            break;
          case 'lark':
            token = localStorage.getItem('lark.token');
            setHandler = setBindingLark;
            break;
        }
        if (!bindingType) {
          return;
        }
        postUserBinding({ type: bindingType as API.LoginProvider, password: token as string }).then(
          () => {
            setHandler(true);
          },
        );
        localStorage.removeItem('bindingType');
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
