import React, { PropsWithChildren, useState } from 'react';
import { message, Card } from 'antd';
import { useRequest } from 'ahooks';
import { useIntl } from '@umijs/max';
import {
  getUserAuthTokenGenerate,
  getUserAuthTokens,
  putUserAuthTokenIdRevoke,
} from '@/services/admin/userAuthToken';
import { CopyOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { ProForm, ModalForm, ProFormSelect } from '@ant-design/pro-components';

// 自定义日期解析和格式化函数
const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);

  // 获取年、月、日、时、分、秒
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const CopyButton: React.FC<PropsWithChildren<{ textToCopy: string }>> = (props) => {
  const [copySuccess, setCopySuccess] = useState('');

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(props.textToCopy)
      .then(() => {
        setCopySuccess('Copied!');
      })
      .catch((err) => {
        setCopySuccess('Failed to copy');
        console.error('Failed to copy: ', err);
      });
  };

  return (
    <div>
      token: **********
      <CopyOutlined onClick={copyToClipboard} />
      {copySuccess && <span>{copySuccess}</span>}
    </div>
  );
};

const AccessTokenView: React.FC = () => {
  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const [addToken, setAddToken] = useState<boolean>(false);
  const [refresh, setRefresh] = useState(0);

  const now = new Date();
  const oneYearLater = new Date(now).setFullYear(now.getFullYear() + 1);

  const { data: accessTokenDatas, loading } = useRequest(
    async () => {
      const res = await getUserAuthTokens();
      return res.data;
    },
    {
      refreshDeps: [refresh],
    },
  );

  return (
    <>
      {loading ? (
        <></>
      ) : (
        <Card
          title={intl.formatMessage({
            id: 'pages.accessToken.settings.title',
            defaultMessage: 'Access Token',
          })}
          extra={<PlusOutlined onClick={() => setAddToken(true)} />}
        >
          {accessTokenDatas?.map((item: any) => (
            <Card
              key={item.id}
              type="inner"
              title={`id: ${item.id}`}
              extra={
                <DeleteOutlined
                  onClick={async () => {
                    await putUserAuthTokenIdRevoke({ id: item.id });
                    setRefresh(refresh + 1);
                  }}
                />
              }
            >
              <CopyButton textToCopy={item.token} />
              <div>
                expired:{' '}
                {new Date(item.expiredAt).getTime() > oneYearLater
                  ? intl.formatMessage({
                      id: 'pages.accessToken.settings.longTime',
                      defaultMessage: 'Long Time',
                    })
                  : formatDateTime(item.expiredAt)}
              </div>
            </Card>
          ))}
        </Card>
      )}
      <ModalForm
        title={intl.formatMessage({
          id: 'pages.accessToken.settings.addToken',
          defaultMessage: 'Add Token',
        })}
        open={addToken}
        onFinish={async (item: API.getUserAuthTokenGenerateParams) => {
          await getUserAuthTokenGenerate(item);
          message.success('提交成功');
          setRefresh(refresh + 1);
          return true;
        }}
        onOpenChange={setAddToken}
      >
        <ProForm.Group>
          <ProFormSelect
            name="validityPeriod"
            width="md"
            label={intl.formatMessage({
              id: 'pages.accessToken.settings.validityPeriod',
              defaultMessage: 'Validity Period',
            })}
            valueEnum={{
              '24h': {
                text: intl.formatMessage({
                  id: 'pages.accessToken.settings.oneDay',
                  defaultMessage: 'One Day',
                }),
              },
              '168h': {
                text: intl.formatMessage({
                  id: 'pages.accessToken.settings.sevenDay',
                  defaultMessage: 'Seven Day',
                }),
              },
              '720h': {
                text: intl.formatMessage({
                  id: 'pages.accessToken.settings.thirtyDay',
                  defaultMessage: 'Thirty Day',
                }),
              },
              '2160h': {
                text: intl.formatMessage({
                  id: 'pages.accessToken.settings.ninetyDay',
                  defaultMessage: 'Ninety Day',
                }),
              },
              '0': {
                text: intl.formatMessage({
                  id: 'pages.accessToken.settings.noExpired',
                  defaultMessage: 'No Expired',
                }),
              },
            }}
          />
        </ProForm.Group>
      </ModalForm>
    </>
  );
};

export default AccessTokenView;
