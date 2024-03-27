import { getMonitor } from '@/services/admin/monitor';
import { timeFormat } from '@/util/timeFormat';
import { Liquid } from '@ant-design/plots';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import React, { useEffect, useState } from 'react';

const Monitor: React.FC = () => {
  const [data, setData] = React.useState<API.MonitorResponse>();
  const [responsive, setResponsive] = useState(false);

  useEffect(() => {
    getMonitor().then((res) => {
      setData(res);
    });
    setResponsive(false);
  }, []);

  return (
    <PageContainer title={'监控'}>
      <ProCard
        title="计算资源"
        extra={timeFormat(new Date())}
        split={responsive ? 'horizontal' : 'vertical'}
        bordered
        headerBordered
      >
        <ProCard
          title="内存使用情况"
          key={'memory'}
          colSpan={(1 / (1 + (data?.cpuInfo?.length || 0))) * 100 + '%'}
        >
          <Liquid
            key={'memory'}
            title={'memory'}
            percent={data?.memoryUsagePercent}
            style={{ background: 'pink', width: '100%' }}
          />
        </ProCard>
        {data?.cpuInfo?.map((item) => (
          <ProCard
            key={item.physicalId}
            title={'物理核ID:' + item.physicalId}
            colSpan={(1 / (1 + (data?.cpuInfo?.length || 0))) * 100 + '%'}
          >
            <Liquid
              key={item.physicalId}
              title={'物理核ID:' + item.physicalId}
              percent={item.cpuUsagePercent}
              style={{ background: 'pink', width: '100%' }}
            />
          </ProCard>
        ))}
      </ProCard>
      <ProCard
        title="存储资源"
        extra={timeFormat(new Date())}
        split={responsive ? 'horizontal' : 'vertical'}
        bordered
        headerBordered
      ></ProCard>
    </PageContainer>
  );
};

export default Monitor;
