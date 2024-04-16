import Footer from '@/components/Footer';
import { Question, SelectLang } from '@/components/RightContent';
import { LinkOutlined } from '@ant-design/icons';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import { SettingDrawer } from '@ant-design/pro-components';
import { RunTimeLayoutConfig } from '@umijs/max';
import { addLocale, FormattedMessage, history, Link } from '@umijs/max';
import defaultSettings from '../config/defaultSettings';
import { errorConfig } from './requestErrorConfig';
import React from 'react';
import { AvatarDropdown, AvatarName } from './components/RightContent/AvatarDropdown';
import { getUserUserInfo } from './services/admin/user';
import { getMenuAuthorize } from './services/admin/menu';
import fixMenuItemIcon from './util/fixMenuItemIcon';
import { MenuDataItem } from '@ant-design/pro-components';
import { getLanguages } from './services/admin/language';
import NoticeIconView from './components/NoticeIcon';
import HeaderSearch from './components/HeaderSearch';
import { getAppConfigsProfile } from '@/services/admin/appConfig';
import { getUserConfigsProfile } from '@/services/admin/userConfig';

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';
const callbackPath = ['/user/github-callback', '/user/lark-callback'];

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  appConfig?: Record<string, Record<string, string>>;
  userConfig?: Record<string, Record<string, string>>;
  currentUser?: API.User;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.User | undefined>;
}> {
  // load language
  const { data } = await getLanguages({ pageSize: 999 });
  if (data) {
    data.forEach((item) => {
      const obj = {};
      item.defines?.forEach((define) => {
        // @ts-ignore
        obj[`${define.group}.${define.key}`] = define.value;
      });

      const importPath = item.name!.replace('-', '_');
      //转成小写
      const momentLocale = item.name!.toLowerCase();

      addLocale(item.name!, obj, {
        momentLocale: momentLocale,
        // @ts-ignore
        antd: import(`antd/es/locale/${importPath}`).default,
      });
    });
  }
  const fetchUserInfo = async () => {
    try {
      const msg = await getUserUserInfo({
        skipErrorHandler: true,
      });
      return msg;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };

  // 如果不是登录页面，执行
  const { location } = history;
  const appConfig = await getAppConfigsProfile();
  const userConfig = await getUserConfigsProfile();
  //set title
  defaultSettings.title = appConfig?.base?.websiteName || 'mss-boot-admin';
  defaultSettings.logo = appConfig?.base?.websiteLogo || 'https://docs.mss-boot-io.top/favicon.ico';
  // set theme
  defaultSettings.navTheme =
    userConfig?.theme?.navTheme || appConfig?.theme?.navTheme || defaultSettings.navTheme;
  defaultSettings.layout =
    userConfig?.theme?.layout || appConfig?.theme?.layout || defaultSettings.layout;
  defaultSettings.contentWidth =
    userConfig?.theme?.contentWidth ||
    appConfig?.theme?.contentWidth ||
    defaultSettings.contentWidth;
  defaultSettings.fixedHeader =
    userConfig?.theme?.fixedHeader || appConfig?.theme?.fixedHeader || defaultSettings.fixedHeader;
  defaultSettings.fixSiderbar =
    userConfig?.theme?.fixSiderbar || appConfig?.theme?.fixSiderbar || defaultSettings.fixSiderbar;
  defaultSettings.colorWeak =
    userConfig?.theme?.colorWeak || appConfig?.theme?.colorWeak || defaultSettings.colorWeak;
  defaultSettings.pwa = userConfig?.theme?.pwa || appConfig?.theme?.pwa || defaultSettings.pwa;
  defaultSettings.colorPrimary =
    userConfig?.theme?.colorPrimary ||
    appConfig?.theme?.colorPrimary ||
    defaultSettings.colorPrimary;
  // defaultSettings.splitMenus = userConfig?.theme?.splitMenus || appConfig?.theme?.splitMenus || defaultSettings.splitMenus;

  if (location.pathname !== loginPath && !callbackPath.includes(location.pathname)) {
    const currentUser = await fetchUserInfo();
    return {
      appConfig,
      userConfig,
      fetchUserInfo,
      currentUser,
      settings: defaultSettings as Partial<LayoutSettings>,
    };
  }
  return {
    appConfig,
    userConfig,
    fetchUserInfo,
    settings: defaultSettings as Partial<LayoutSettings>,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {
    title: initialState?.appConfig?.base?.websiteName || 'mss-boot-admin',
    menu: {
      request: async () => {
        const menuData = await getMenuAuthorize();
        return menuData;
      },
    },
    actionsRender: () => [
      <HeaderSearch key="search" placeholder="component.search.placeholder" options={undefined} />,
      <NoticeIconView key="notice" />,
      <Question key="doc" />,
      <SelectLang key="SelectLang" />,
    ],
    avatarProps: {
      src: initialState?.currentUser?.avatar,
      title: <AvatarName />,
      render: (_, avatarChildren) => {
        return <AvatarDropdown menu={true}>{avatarChildren}</AvatarDropdown>;
      },
    },
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    layoutBgImgList: [
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/D2LWSqNny4sAAAAAAAAAAAAAFl94AQBr',
        left: 85,
        bottom: 100,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/C2TWRpJpiC0AAAAAAAAAAAAAFl94AQBr',
        bottom: -68,
        right: -45,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/F6vSTbj8KpYAAAAAAAAAAAAAFl94AQBr',
        bottom: 0,
        left: 0,
        width: '331px',
      },
    ],
    links: isDev
      ? [
          <Link key="openapi" to="/umi/plugin/openapi" target="_blank">
            <LinkOutlined />
            <span>
              OpenAPI <FormattedMessage id="app.documentation" defaultMessage="文档" />
            </span>
          </Link>,
        ]
      : [],
    // menuHeaderRender: undefined,
    menuDataRender: (menuData: MenuDataItem[]) => fixMenuItemIcon(menuData),
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          <SettingDrawer
            disableUrlParams
            enableDarkTheme
            settings={initialState?.settings}
            onSettingChange={(settings) => {
              setInitialState((preInitialState) => ({
                ...preInitialState,
                settings,
              }));
            }}
          />
        </>
      );
    },
    ...initialState?.settings,
  };
};

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request = {
  ...errorConfig,
};
