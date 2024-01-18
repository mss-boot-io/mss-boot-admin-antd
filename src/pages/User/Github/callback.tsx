import { getGithubCallback } from '@/services/admin/generator';
import { postUserLogin } from '@/services/admin/user';
import { useSearchParams } from '@umijs/max';
import { message, Spin } from 'antd';
import React, { useEffect } from 'react';

const Github: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [load, setLoad] = React.useState(true);
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  useEffect(() => {
    if (state) {
      if (!localStorage.getItem('github.state') || localStorage.getItem('github.state') !== state) {
        message.error('state error');
        return;
      }
      const req = {
        code: code!,
        state: state,
      };
      console.log(req);

      getGithubCallback(req).then((res: API.GithubToken) => {
        if (res && res.accessToken) {
          localStorage.setItem('github.token', res.accessToken);
          setLoad(false);
          message.success('获取成功');

          //get token
          if (state.startsWith('ghs_')) {
            postUserLogin({ password: res.accessToken, type: 'github' }).then((msg) => {
              if (msg.code === 200 && msg.token) {
                message.success('登录成功');
                //set token to localstorage
                localStorage.setItem('token', msg.token);
                localStorage.setItem('login.type', 'github');
                // const urlParams = new URL(window.location.href).searchParams;
                // history.push(urlParams.get('redirect') || '/');
                // return;
              }
            });
          }

          setTimeout(() => {
            window.close();
          }, 2000);
        }
      });
    }
  }, [code, state]);

  return (
    <div>
      等待github回调
      {load ? <Spin size="large" /> : ''}
    </div>
  );
};

export default Github;
