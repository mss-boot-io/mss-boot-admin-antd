import { Access } from '@/components/MssBoot/Access';
import { indexTitle } from '@/util/indexTitle';
import { PlusOutlined } from '@ant-design/icons';
import type {
  ActionType,
  ProDescriptionsItemProps,
  ProFormInstance,
} from '@ant-design/pro-components';
import { PageContainer, ProDescriptions, ProTable } from '@ant-design/pro-components';
import { FormattedMessage, Link, useParams, history, useLocation } from '@umijs/max';
import { Button, Drawer, message } from 'antd';
import React, { useRef, useState } from 'react';
import {
  createVirtualModel,
  getVirtualDocumentation,
  getVirtualModel,
  listVirtualModels,
  updateVirtualModel,
} from './service/virtual';
import { useRequest } from 'ahooks';
import { addOption } from '@/util/addOption';
import { useIntl } from '@@/exports';

const Virtual: React.FC = () => {
  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const actionRef = useRef<ActionType>();
  const { id, key } = useParams();
  const { pathname } = useLocation();
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<API.Model>();
  const formRef = useRef<ProFormInstance>();
  const { data, loading } = useRequest(() => {
    return getVirtualDocumentation({ key: key! });
  });

  const getListPath = (path: string): string => {
    const lastIndex = path.lastIndexOf('/');
    return path.substring(0, lastIndex);
  };

  const onSubmit = async (params: { [key: string]: any }) => {
    if (!id) {
      return;
    }

    if (id === 'create') {
      await createVirtualModel({ key }, params);
      message.success('创建成功');
      history.push(getListPath(pathname));
      return;
    }
    await updateVirtualModel({ id, key }, params);
    message.success('更新成功');
    history.push(getListPath(pathname));
  };

  return loading ? (
    <></>
  ) : (
    <PageContainer title={indexTitle(id)}>
      <ProTable<{ [key: string]: any }, API.listVirtualModelsParams>
        headerTitle={`${data.name}列表`}
        actionRef={actionRef}
        formRef={formRef}
        rowKey="id"
        search={false}
        type={id ? 'form' : 'table'}
        onSubmit={id ? onSubmit : undefined}
        toolBarRender={() => [
          <Access key="/model/create">
            <Button type="primary" key="create">
              <Link type="primary" key="primary" to="/models/create">
                <PlusOutlined />{' '}
                <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
              </Link>
            </Button>
          </Access>,
        ]}
        form={
          id && id !== 'create'
            ? {
                request: async () => {
                  const res = await getVirtualModel({ id, key });
                  return res;
                },
              }
            : undefined
        }
        params={{ key }}
        request={listVirtualModels}
        // @ts-ignore
        columns={addOption(intl, pathname, key, actionRef, data.columns)}
      />

      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<{ [key: string]: any }>
            column={1}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.id,
            }}
            columns={data.columns as ProDescriptionsItemProps<{ [key: string]: any }>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default Virtual;
