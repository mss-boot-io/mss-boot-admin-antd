import Footer from '@/components/Footer';
import { getUserRefreshToken, postUserFakeCaptcha, postUserLogin } from '@/services/admin/user';
import {
  GithubOutlined,
  LockOutlined,
  MailOutlined,
  MobileOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  LoginForm,
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormInstance,
  ProFormText,
} from '@ant-design/pro-components';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { FormattedMessage, Helmet, history, Link, SelectLang, useIntl, useModel } from '@umijs/max';
import { Alert, message, Tabs, Avatar } from 'antd';
import Icon from '@ant-design/icons';

import React, { useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import Settings from '../../../../config/defaultSettings';
import { useRequest } from 'ahooks';

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

export type ActionIconsFormProps = {
  fetchUserInfo: () => void;
};

const ActionIcons: React.FC<ActionIconsFormProps> = (props) => {
  const { initialState } = useModel('@@initialState');
  const scopes = initialState?.appConfig?.security?.githubScope?.replace(/,/g, '+') || '';
  const langClassName = useEmotionCss(({ token }) => {
    return {
      marginLeft: '8px',
      color: 'rgba(0, 0, 0, 0.2)',
      fontSize: '24px',
      verticalAlign: 'middle',
      cursor: 'pointer',
      transition: 'color 0.3s',
      '&:hover': {
        color: token.colorPrimaryActive,
      },
    };
  });

  const FeiShuSvg: any = () => (
    <svg
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      fill="currentColor"
    >
      <path d="M512 0c282.76736 0 512 229.23264 512 512s-229.23264 512-512 512S0 794.76736 0 512 229.23264 0 512 0zM224.03072 421.59104l-0.03072 7.08096 0.4096 186.0096-0.23552 37.09952 0.26624 15.8976 0.29184 5.43232 0.41984 3.74272 0.08192 0.4608c0.0512 0.29184 0.11264 0.54784 0.17408 0.77824 1.1776 4.42368 3.72224 8.2432 7.64416 11.79136 3.47648 3.14368 7.74144 5.91872 14.21824 9.48736 31.46752 17.26976 61.6448 29.952 92.3904 38.62016 31.83616 8.97536 64.68608 13.77792 100.12672 14.54592 36.62336 0.7936 70.79936-3.02592 104.2176-11.50464 32-8.12032 63.69792-20.61312 97.18272-38.02624 24.92928-12.96896 52.0704-33.23392 76.96896-57.216l8.82688-8.76032 8.48896-8.94464 3.44576-3.88096-1.95584 1.1264-7.22432 3.67616-2.62656 1.24416c-28.04736 12.99456-57.18528 16.68096-89.65632 12.78464l-9.90208-1.37216-9.82528-1.7408-2.4832-0.512-2.5088-0.53248-10.3936-2.4576-2.71872-0.70144-2.77504-0.73728-11.80672-3.35872-2.09408-0.62464c-1.408-0.41984-2.8416-0.85504-4.31104-1.3056l-21.78048-6.95296-10.61888-3.5328-31.03744-11.21792-15.2576-5.7344-13.03552-5.07904-6.9632-2.85696-7.40864-3.34336-0.70144-0.35328a22.59968 22.59968 0 0 1-2.09408-1.19296l-10.0352-5.01248-26.25536-12.30336-16.32768-8.07424-5.85728-3.05152c-29.27616-15.44192-58.2144-33.7152-86.9888-54.71744-27.76576-20.26496-55.21408-42.94656-82.79552-68.16256l-13.80864-12.82048-3.64032-3.69664z m553.72288-7.5008l-10.3936 0.21504-3.97824 0.2048a230.64576 230.64576 0 0 0-46.27456 7.36768 215.62368 215.62368 0 0 0-40.13568 15.24736 229.7856 229.7856 0 0 0-37.248 23.31136l-6.50752 5.11488-1.5872 1.28-1.57696 1.3056-6.36928 5.43232-6.72768 6.0416-7.45472 6.96832-34.86208 33.85344-2.32448 2.21184c-16.8704 15.9744-29.45536 26.55232-43.93472 36.51584l-5.71904 3.84-15.09376 9.76896-2.17088 1.36704c-2.85184 1.792-5.5552 3.45088-8.11008 4.98176l-7.53152 4.34176 11.02336 4.3776 32.4352 12.1088 20.10112 7.1424 22.68672 7.38816 12.85632 3.95264 11.45856 3.26656 2.688 0.7168c2.65728 0.70656 5.2224 1.35168 7.72608 1.9456l9.72288 2.12992 2.36544 0.4608 2.34496 0.4352 9.35424 1.4848 2.3552 0.3072 2.37056 0.30208c30.6432 3.68128 57.8304 0.02048 83.98336-12.66176 33.47968-16.24064 49.3056-32.82944 71.41376-73.24672l7.2192-13.58336 11.38176-22.23104 4.99712-9.61536 1.536-2.93376c15.29344-28.96896 26.82368-46.68416 42.68032-63.05792l1.54624-1.5872-3.71712-1.42848-4.5568-1.63328-9.50784-3.1488-8.13056-2.42176-3.66592-0.96256a229.76512 229.76512 0 0 0-46.30016-6.656l-10.368-0.22016zM332.4672 272.64l9.1136 6.56384 12.90752 9.48224 5.1712 3.88096a809.55392 809.55392 0 0 1 42.68544 34.47808 730.65984 730.65984 0 0 1 55.808 53.9648c16.384 17.55136 30.5664 33.78176 43.63776 50.0224 10.24 12.71808 19.968 25.64096 29.50656 39.22432l11.19232 16.44032 18.08384 28.75904 11.2896-10.47552 17.11616-16.39424 9.8304-9.22112 12.94336-11.84256 3.00032-2.6624a403.51744 403.51744 0 0 1 25.61536-20.9408c7.12704-5.33504 15.616-10.56768 25.02656-15.50848a268.47744 268.47744 0 0 1 20.0192-9.4208l11.42272-4.51584 6.1952-2.05312-0.1536-0.91136-0.33792-1.37728c-1.42336-5.63712-3.82464-12.7744-7.00416-20.92032l-4.55168-11.1104-1.05472-2.4576c-7.1168-16.3584-15.64672-33.2544-22.03648-43.776l-12.83584-19.85536-7.08096-10.35264-1.2032-1.6896c-9.5488-13.27104-17.11616-21.36064-23.57248-24.32-4.35712-2.00192-8.14592-2.7648-14.73024-2.93888h-7.64416l-5.51936 0.08192-260.74624-0.03584-2.09408-0.11776z"></path>
    </svg>
  );

  return (
    <>
      {initialState?.appConfig?.security?.githubEnabled && (
        <GithubOutlined
          key="GithubOutlined"
          className={langClassName}
          onClick={async () => {
            localStorage.removeItem('login.type');
            localStorage.removeItem('github.token');
            localStorage.removeItem('token');
            localStorage.removeItem('github.state');
            const state = 'ghs_' + randToken();
            localStorage.setItem('github.state', state);
            const loginURL = `https://github.com/login/oauth/authorize?client_id=${initialState?.appConfig?.security?.githubClientId}&response_type=code&scope=${scopes}&state=${state}`;
            const w = window.open('about:blank');
            // @ts-ignore
            w.location.href = loginURL;
            const intervalId = setInterval(() => {
              const loginType = localStorage.getItem('login.type');
              const token = localStorage.getItem('token');
              if (token && loginType === 'github') {
                clearInterval(intervalId);
                try {
                  props.fetchUserInfo();
                } catch (e) {
                  message.error('登录失败，请重试！');
                  return;
                } finally {
                  //登录成功跳转
                  const urlParams = new URL(window.location.href).searchParams;
                  setTimeout(() => {
                    history.push(urlParams.get('redirect') || '/');
                  }, 1000);
                }
              }
            }, 1000);
          }}
        />
      )}
      {initialState?.appConfig?.security?.larkEnabled && (
        <Icon
          component={FeiShuSvg}
          className={langClassName}
          onClick={async () => {
            localStorage.removeItem('login.type');
            localStorage.removeItem('lark.token');
            localStorage.removeItem('token');
            localStorage.removeItem('lark.state');
            const state = 'lark' + randToken();
            localStorage.setItem('lark.state', state);
            const loginURL = `https://open.larksuite.com/open-apis/authen/v1/index?redirect_uri=${initialState?.appConfig?.security?.larkRedirectURI}&app_id=${initialState?.appConfig?.security?.larkAppId}&state=${state}`;
            const w = window.open('about:blank');
            // @ts-ignore
            w.location.href = loginURL;
            const intervalId = setInterval(() => {
              const loginType = localStorage.getItem('login.type');
              const token = localStorage.getItem('token');
              if (token && loginType === 'lark') {
                clearInterval(intervalId);
                try {
                  props.fetchUserInfo();
                } catch (e) {
                  message.error('登录失败，请重试！');
                  return;
                } finally {
                  //登录成功跳转
                  const urlParams = new URL(window.location.href).searchParams;
                  setTimeout(() => {
                    history.push(urlParams.get('redirect') || '/');
                  }, 1000);
                }
              }
            }, 1000);
          }}
        >
          <Avatar src="https://sf16-scmcdn2-va.larksuitecdn.com/lark/open/doc/frontend/favicon-logo.svg" />
        </Icon>
      )}
    </>
  );
};

const Lang = () => {
  const langClassName = useEmotionCss(({ token }) => {
    return {
      width: 42,
      height: 42,
      lineHeight: '42px',
      position: 'fixed',
      right: 16,
      borderRadius: token.borderRadius,
      ':hover': {
        backgroundColor: token.colorBgTextHover,
      },
      'path.fill': '#555',
    };
  });

  return (
    <div className={langClassName} data-lang>
      {SelectLang && <SelectLang />}
    </div>
  );
};

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => {
  return (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );
};

const Login: React.FC = () => {
  const intl = useIntl();

  // const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});
  const [type, setType] = useState<string>('account');
  const { initialState, setInitialState } = useModel('@@initialState');
  const formRef = useRef<ProFormInstance>();

  const containerClassName = useEmotionCss(() => {
    return {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    };
  });

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: userInfo,
        }));
      });
    }
  };

  const loginSuccessed = async (data: API.LoginResponse, autoLogin?: boolean, popup?: boolean) => {
    if (data.code === 200 && data.token) {
      if (popup) {
        const defaultLoginSuccessMessage = intl.formatMessage({
          id: 'pages.login.success',
          defaultMessage: '登录成功！',
        });
        message.success(defaultLoginSuccessMessage);
      }
      //set token to localstorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('token.expire', data.expire?.toString() || '');
      localStorage.setItem('autoLogin', autoLogin?.toString() || 'false');
      await fetchUserInfo();
      const urlParams = new URL(window.location.href).searchParams;
      if (urlParams.get('redirect') === '/user/login') {
        history.push('/');
        return;
      }
      history.push(urlParams.get('redirect') || '/');
      return;
    }
  };

  const { loading } = useRequest(async () => {
    if (
      localStorage.getItem('autoLogin') &&
      localStorage.getItem('token') &&
      localStorage.getItem('token.expire')
    ) {
      const res = await getUserRefreshToken();
      await loginSuccessed(res, true);
    }
  });

  const handleSubmit = async (values: API.UserLogin, autoLogin?: boolean) => {
    try {
      // 登录
      // @ts-ignore
      const msg = await postUserLogin({ ...values, type });
      await loginSuccessed(msg, autoLogin, true);
      // 如果失败去设置用户错误信息
      // setUserLoginState(msg);
    } catch (error) {
      const defaultLoginFailureMessage = intl.formatMessage({
        id: 'pages.login.failure',
        defaultMessage: '登录失败，请重试！',
      });
      message.error(defaultLoginFailureMessage);
    }
  };
  // const { status, type: loginType } = userLoginState;
  const loginItem = () => {
    let items = [
      {
        key: 'account',
        label: intl.formatMessage({
          id: 'pages.login.accountLogin.tab',
          defaultMessage: '账户密码登录',
        }),
      },
    ];
    const phoneEnabled = initialState?.appConfig?.security?.phoneEnabled;
    const emailEnabled = initialState?.appConfig?.security?.emailEnabled;
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    phoneEnabled &&
      items.push({
        key: 'mobile',
        label: intl.formatMessage({
          id: 'pages.login.phoneLogin.tab',
          defaultMessage: '手机号登录',
        }),
      });
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    emailEnabled &&
      items.push({
        key: 'email',
        label: intl.formatMessage({
          id: 'pages.login.emailLogin.tab',
          defaultMessage: '邮箱登录',
        }),
      });

    return items;
  };

  return loading ? (
    <></>
  ) : (
    <div className={containerClassName}>
      <Helmet>
        <title>
          {intl.formatMessage({
            id: 'menu.login',
            defaultMessage: '登录页',
          })}
          - {Settings.title}
        </title>
      </Helmet>
      <Lang />
      <div
        style={{
          flex: '1',
          padding: '32px 0',
        }}
      >
        <LoginForm
          contentStyle={{
            minWidth: 280,
            maxWidth: '75vw',
          }}
          formRef={formRef}
          logo={
            <img
              alt="logo"
              src={
                initialState?.appConfig?.base?.websiteLogo ||
                'https://docs.mss-boot-io.top/favicon.ico'
              }
            />
          }
          title={initialState?.appConfig?.base?.websiteName || 'mss-boot-io'}
          subTitle={
            initialState?.appConfig?.base?.websiteDescription ||
            intl.formatMessage({ id: 'pages.login.form.title' })
          }
          initialValues={{
            autoLogin: true,
          }}
          actions={[
            initialState?.appConfig?.security?.githubEnabled ||
            initialState?.appConfig?.security?.larkEnabled ? (
              <FormattedMessage
                key="loginWith"
                id="pages.login.loginWith"
                defaultMessage="其他登录方式"
              />
            ) : (
              ''
            ),
            <ActionIcons fetchUserInfo={fetchUserInfo} key="icons" />,
            initialState?.appConfig?.security?.registerEnabled ? (
              <p>
                还没有账号? &nbsp;
                <Link to="/user/register">
                  <a>
                    <FormattedMessage id="pages.login.signup" defaultMessage="注册账户" />
                  </a>
                </Link>
              </p>
            ) : (
              ''
            ),
          ]}
          onFinish={async (values) => {
            await handleSubmit(values as API.UserLogin, values.autoLogin);
          }}
        >
          <Tabs activeKey={type} onChange={setType} items={loginItem()} />

          {status === 'error' && type === 'account' && (
            <LoginMessage
              content={intl.formatMessage({
                id: 'pages.login.accountLogin.errorMessage',
                defaultMessage: '账户或密码错误(admin/ant.design)',
              })}
            />
          )}
          {type === 'account' && (
            <>
              <ProFormText
                name="username"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined />,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.username.placeholder',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.username.required"
                        defaultMessage="请输入用户名!"
                      />
                    ),
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.password.placeholder',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.password.required"
                        defaultMessage="请输入密码！"
                      />
                    ),
                  },
                ]}
              />
            </>
          )}

          {status === 'error' && type === 'mobile' && (
            <LoginMessage
              content={intl.formatMessage({
                id: 'pages.login.phoneLogin.errorMessage',
                defaultMessage: '验证码错误',
              })}
            />
          )}
          {type === 'mobile' && (
            <>
              <ProFormText
                fieldProps={{
                  size: 'large',
                  prefix: <MobileOutlined />,
                }}
                name="mobile"
                placeholder={intl.formatMessage({
                  id: 'pages.login.phoneNumber.placeholder',
                  defaultMessage: '手机号',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.phoneNumber.required"
                        defaultMessage="请输入手机号！"
                      />
                    ),
                  },
                  {
                    pattern: /^1\d{10}$/,
                    message: (
                      <FormattedMessage
                        id="pages.login.phoneNumber.invalid"
                        defaultMessage="手机号格式错误！"
                      />
                    ),
                  },
                ]}
              />
              <ProFormCaptcha
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                }}
                captchaProps={{
                  size: 'large',
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.captcha.placeholder',
                  defaultMessage: '请输入验证码',
                })}
                captchaTextRender={(timing, count) => {
                  if (timing) {
                    return `${count} ${intl.formatMessage({
                      id: 'pages.getCaptchaSecondText',
                      defaultMessage: '获取验证码',
                    })}`;
                  }
                  return intl.formatMessage({
                    id: 'pages.login.phoneLogin.getVerificationCode',
                    defaultMessage: '获取验证码',
                  });
                }}
                name="captcha"
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.captcha.required"
                        defaultMessage="请输入验证码！"
                      />
                    ),
                  },
                ]}
                onGetCaptcha={async (phone) => {
                  const result = await postUserFakeCaptcha({
                    phone,
                  });
                  if (!result) {
                    return;
                  }
                  message.success('获取验证码成功！验证码为：1234');
                }}
              />
            </>
          )}
          {status === 'error' && type === 'email' && (
            <LoginMessage
              content={intl.formatMessage({
                id: 'pages.login.emailLogin.errorMessage',
                defaultMessage: '验证码错误',
              })}
            />
          )}
          {type === 'email' && (
            <>
              <ProFormText
                fieldProps={{
                  size: 'large',
                  prefix: <MailOutlined />,
                }}
                name="email"
                placeholder={intl.formatMessage({
                  id: 'pages.login.email.placeholder',
                  defaultMessage: '邮箱',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.email.required"
                        defaultMessage="请输入邮箱！"
                      />
                    ),
                  },
                  {
                    pattern: /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/,
                    message: (
                      <FormattedMessage
                        id="pages.login.email.invalid"
                        defaultMessage="邮箱格式错误！"
                      />
                    ),
                  },
                ]}
              />
              <ProFormCaptcha
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                }}
                captchaProps={{
                  size: 'large',
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.captcha.placeholder',
                  defaultMessage: '请输入验证码',
                })}
                captchaTextRender={(timing, count) => {
                  if (timing) {
                    return `${count} ${intl.formatMessage({
                      id: 'pages.getCaptchaSecondText',
                      defaultMessage: '获取验证码',
                    })}`;
                  }
                  return intl.formatMessage({
                    id: 'pages.login.emailLogin.getVerificationCode',
                    defaultMessage: '获取验证码',
                  });
                }}
                name="captcha"
                phoneName="email"
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.captcha.required"
                        defaultMessage="请输入验证码！"
                      />
                    ),
                  },
                ]}
                onGetCaptcha={async () => {
                  // @ts-ignore
                  const email: string = formRef.current?.getFieldFormatValue('email');
                  const result = await postUserFakeCaptcha({
                    email,
                    useBy: 'login',
                  });
                  if (!result) {
                    return;
                  }
                  message.success('获取验证码成功！');
                }}
              />
            </>
          )}
          <div
            style={{
              marginBottom: 24,
            }}
          >
            <ProFormCheckbox noStyle name="autoLogin">
              <FormattedMessage id="pages.login.rememberMe" defaultMessage="自动登录" />
            </ProFormCheckbox>

            <Link to="/user/forget">
              <a
                style={{
                  float: 'right',
                }}
              >
                <FormattedMessage id="pages.login.forgotPassword" defaultMessage="忘记密码" />
              </a>
            </Link>
          </div>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
