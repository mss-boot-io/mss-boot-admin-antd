import { Area, Column } from '@ant-design/charts';
import { Card, Col, Row, Statistic, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { getMonitor } from '@/services/admin/monitor';

const { Title } = Typography;

interface MonitorData {
  cpuPhysicalCore: number;
  cpuLogicalCore: number;
  memoryTotal: number;
  memoryUsage: number;
  diskTotal: number;
  diskUsage: number;
  network?: {
    bytesSent: number;
    bytesRecv: number;
  };
  runtime?: {
    goroutines: number;
    heapAlloc: number;
    numGC: number;
  };
  uptime?: number;
}

const Monitor: React.FC = () => {
  const [data, setData] = useState<MonitorData | null>(null);
  const [history, setHistory] = useState<{ time: string; cpu: number; memory: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const res = await getMonitor();
      setData(res);
      setHistory((prev) => {
        const now = new Date().toLocaleTimeString();
        const newItem = {
          time: now,
          cpu: res.cpuUsage || 0,
          memory: res.memoryUsage ? (res.memoryUsage / res.memoryTotal) * 100 : 0,
        };
        const updated = [...prev, newItem].slice(-20);
        return updated;
      });
    } catch (error) {
      console.error('Failed to fetch monitor data:', error);
    } finally {
      setLoading(false);
    }
  };

  const cpuConfig = {
    data: history,
    xField: 'time',
    yField: 'cpu',
    smooth: true,
    animation: false,
    meta: {
      cpu: { alias: 'CPU 使用率 (%)', max: 100 },
    },
  };

  const memoryConfig = {
    data: history,
    xField: 'time',
    yField: 'memory',
    smooth: true,
    animation: false,
    meta: {
      memory: { alias: '内存使用率 (%)', max: 100 },
    },
  };

  if (loading) {
    return <Card loading />;
  }

  const memoryPercent = data?.memoryTotal ? ((data.memoryUsage / data.memoryTotal) * 100).toFixed(1) : 0;
  const diskPercent = data?.diskTotal ? ((data.diskUsage / data.diskTotal) * 100).toFixed(1) : 0;

  return (
    <div>
      <Title level={4}>系统监控</Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="CPU 使用率"
              value={data?.cpuUsage || 0}
              suffix="%"
              valueStyle={{ color: (data?.cpuUsage || 0) > 80 ? '#cf1322' : '#3f8600' }}
            />
            <div style={{ marginTop: 8, color: '#999' }}>
              {data?.cpuPhysicalCore} 物理核心 / {data?.cpuLogicalCore} 逻辑核心
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="内存使用"
              value={memoryPercent}
              suffix="%"
              valueStyle={{ color: parseFloat(memoryPercent as string) > 80 ? '#cf1322' : '#3f8600' }}
            />
            <div style={{ marginTop: 8, color: '#999' }}>
              {((data?.memoryUsage || 0) / 1024 / 1024).toFixed(0)} MB / {((data?.memoryTotal || 0) / 1024 / 1024).toFixed(0)} MB
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="磁盘使用"
              value={diskPercent}
              suffix="%"
              valueStyle={{ color: parseFloat(diskPercent as string) > 80 ? '#cf1322' : '#3f8600' }}
            />
            <div style={{ marginTop: 8, color: '#999' }}>
              {data?.diskUsage} GB / {data?.diskTotal} GB
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Goroutines" value={data?.runtime?.goroutines || 0} />
            <div style={{ marginTop: 8, color: '#999' }}>
              GC 次数: {data?.runtime?.numGC || 0}
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card title="CPU 使用率趋势">
            <Area {...cpuConfig} height={200} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="内存使用率趋势">
            <Area {...memoryConfig} height={200} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24}>
          <Card title="运行时信息">
            <Row gutter={16}>
              <Col span={6}>
                <Statistic title="堆内存" value={((data?.runtime?.heapAlloc || 0) / 1024 / 1024).toFixed(2)} suffix="MB" />
              </Col>
              <Col span={6}>
                <Statistic title="GC 次数" value={data?.runtime?.numGC || 0} />
              </Col>
              <Col span={6}>
                <Statistic title="Goroutines" value={data?.runtime?.goroutines || 0} />
              </Col>
              <Col span={6}>
                <Statistic title="运行时间" value={Math.floor((data?.uptime || 0) / 3600)} suffix="小时" />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Monitor;