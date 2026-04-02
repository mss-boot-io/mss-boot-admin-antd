import { DownloadOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Card, Col, DatePicker, Form, Input, Row, Select, Space, Table, Tag, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { request } from '@umijs/max';

const { Title } = Typography;
const { RangePicker } = DatePicker;

interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  raw: string;
}

interface LogListResponse {
  total: number;
  list: LogEntry[];
}

const levelColors: Record<string, string> = {
  info: 'blue',
  warn: 'orange',
  error: 'red',
  debug: 'green',
};

const Log: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<LogListResponse>({ total: 0, list: [] });
  const [params, setParams] = useState({
    level: '',
    keyword: '',
    startTime: '',
    endTime: '',
    page: 1,
    pageSize: 50,
  });

  useEffect(() => {
    fetchLogs();
  }, [params]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (params.level) query.append('level', params.level);
      if (params.keyword) query.append('keyword', params.keyword);
      if (params.startTime) query.append('startTime', params.startTime);
      if (params.endTime) query.append('endTime', params.endTime);
      query.append('page', params.page.toString());
      query.append('pageSize', params.pageSize.toString());

      const res = await request<LogListResponse>(`/admin/api/logs?${query.toString()}`);
      setData(res);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    const query = new URLSearchParams();
    if (params.level) query.append('level', params.level);
    if (params.keyword) query.append('keyword', params.keyword);
    if (params.startTime) query.append('startTime', params.startTime);
    if (params.endTime) query.append('endTime', params.endTime);

    window.open(`/admin/api/logs/export?${query.toString()}`);
  };

  const columns = [
    {
      title: '时间',
      dataIndex: 'timestamp',
      width: 180,
      render: (text: string) => text || '-',
    },
    {
      title: '级别',
      dataIndex: 'level',
      width: 80,
      render: (text: string) => {
        const color = levelColors[text] || 'default';
        return text ? <Tag color={color}>{text.toUpperCase()}</Tag> : '-';
      },
    },
    {
      title: '消息',
      dataIndex: 'message',
      ellipsis: true,
      render: (text: string) => text || '-',
    },
  ];

  return (
    <div>
      <Title level={4}>日志管理</Title>

      <Card style={{ marginBottom: 16 }}>
        <Form layout="inline">
          <Form.Item label="级别">
            <Select
              allowClear
              style={{ width: 120 }}
              placeholder="全部"
              value={params.level || undefined}
              onChange={(value) => setParams({ ...params, level: value || '', page: 1 })}
              options={[
                { label: 'INFO', value: 'info' },
                { label: 'WARN', value: 'warn' },
                { label: 'ERROR', value: 'error' },
                { label: 'DEBUG', value: 'debug' },
              ]}
            />
          </Form.Item>
          <Form.Item label="关键词">
            <Input
              style={{ width: 200 }}
              placeholder="搜索关键词"
              value={params.keyword}
              onChange={(e) => setParams({ ...params, keyword: e.target.value })}
              onPressEnter={() => setParams({ ...params, page: 1 })}
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={() => setParams({ ...params, page: 1 })}
              >
                搜索
              </Button>
              <Button icon={<ReloadOutlined />} onClick={fetchLogs}>
                刷新
              </Button>
              <Button icon={<DownloadOutlined />} onClick={handleExport}>
                导出
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <Card>
        <Table
          loading={loading}
          dataSource={data.list}
          columns={columns}
          rowKey={(record) => `${record.timestamp}-${record.message}`}
          pagination={{
            current: params.page,
            pageSize: params.pageSize,
            total: data.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
            onChange: (page, pageSize) => setParams({ ...params, page, pageSize }),
          }}
          expandable={{
            expandedRowRender: (record) => (
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                {record.raw}
              </pre>
            ),
          }}
        />
      </Card>
    </div>
  );
};

export default Log;