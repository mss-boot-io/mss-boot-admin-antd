import { getGithubCallback } from '@/services/admin/generator';
import { useSearchParams } from '@umijs/max';
import { Spin, message } from 'antd';
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
            //get token

            getGithubCallback(req).then((res: API.GithubToken ) => {
                if (res && res.accessToken) {
                    localStorage.setItem('github.token', res.accessToken);
                    setLoad(false);
                    // localStorage.setItem('github.state', '');
                    message.success('授权成功');
                    //todo: 跳转到state中获取的页面
                    window.close();
                }
            });
        }
    }, [code, state]);

    return (
        <div>等待github回调
            {load ? (<Spin size="large" />) : ''}
        </div>
    );
}

export default Github;