import React, { useEffect, useState } from 'react';
import { Card, Avatar, Descriptions, Spin, Tag, message, Row, Col } from 'antd';
import { UserOutlined, TeamOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { getUserUserInfo } from '@/services/admin/user';
import { getDepartmentsId } from '@/services/admin/department';
import { getPostsId } from '@/services/admin/post';
import { useIntl } from '@umijs/max';
import styles from './index.less';

const Center: React.FC = () => {
  const intl = useIntl();
  const [userInfo, setUserInfo] = useState<API.User>();
  const [departmentInfo, setDepartmentInfo] = useState<API.Department>();
  const [postInfo, setPostInfo] = useState<API.Post>();
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const userRes = await getUserUserInfo();
      console.log('userRes:', userRes);
      setUserInfo(userRes);

      // 获取部门信息
      if (userRes.department?.id) {
        // console.log('department id:', userRes.department.id);
        const deptRes = await getDepartmentsId({ id: userRes.department.id });
        // console.log('deptRes:', deptRes);
        setDepartmentInfo(deptRes);
      }

      // 获取岗位信息
      if (userRes.post?.id) {
        // console.log('post id:', userRes.post.id);
        const postRes = await getPostsId({ id: userRes.post.id });
        // console.log('postRes:', postRes);
        setPostInfo(postRes);
      }
    } catch (error) {
      console.error('error:', error);
      message.error(intl.formatMessage({ id: 'pages.account.center.fetchDataError' }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className={styles.container}>
      <Spin spinning={loading}>
        <Row gutter={24}>
          <Col span={8}>
            <Card bordered={false} className={styles.userCard}>
              <div className={styles.userInfo}>
                <Avatar size={100} src={userInfo?.avatar} icon={<UserOutlined />} />
                <div className={styles.userDetail}>
                  <h2>{userInfo?.name}</h2>
                  <p>{userInfo?.title}</p>
                </div>
              </div>
              <div className={styles.userStats}>
                <div className={styles.statItem}>
                  <TeamOutlined className={styles.icon} />
                  <div className={styles.content}>
                    <div className={styles.label}>{intl.formatMessage({ id: 'pages.account.center.department' })}</div>
                    <div className={styles.value}>{departmentInfo?.name || '-'}</div>
                  </div>
                </div>
                <div className={styles.statItem}>
                  <SafetyCertificateOutlined className={styles.icon} />
                  <div className={styles.content}>
                    <div className={styles.label}>{intl.formatMessage({ id: 'pages.account.center.post' })}</div>
                    <div className={styles.value}>{postInfo?.name || '-'}</div>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
          <Col span={16}>
            <Card bordered={false} className={styles.detailCard}>
              <Descriptions title={intl.formatMessage({ id: 'pages.account.center.title' })} column={2}>
                <Descriptions.Item label={intl.formatMessage({ id: 'pages.account.center.username' })}>
                  {userInfo?.username}
                </Descriptions.Item>
                <Descriptions.Item label={intl.formatMessage({ id: 'pages.account.center.phone' })}>
                  {userInfo?.phone}
                </Descriptions.Item>
                <Descriptions.Item label={intl.formatMessage({ id: 'pages.account.center.email' })}>
                  {userInfo?.email}
                </Descriptions.Item>
                <Descriptions.Item label={intl.formatMessage({ id: 'pages.account.center.role' })}>
                  {userInfo?.role?.name}
                </Descriptions.Item>
                <Descriptions.Item label={intl.formatMessage({ id: 'pages.account.center.address' })} span={2}>
                  {[userInfo?.country, userInfo?.province, userInfo?.city, userInfo?.address]
                    .filter(Boolean)
                    .join(' ')}
                </Descriptions.Item>
                <Descriptions.Item label={intl.formatMessage({ id: 'pages.account.center.profile' })} span={2}>
                  {userInfo?.profile}
                </Descriptions.Item>
                <Descriptions.Item label={intl.formatMessage({ id: 'pages.account.center.signature' })} span={2}>
                  {userInfo?.signature}
                </Descriptions.Item>
                <Descriptions.Item label={intl.formatMessage({ id: 'pages.account.center.tags' })} span={2}>
                  {userInfo?.tags?.map((tag: string) => (
                    <Tag key={tag} color="blue">
                      {tag}
                    </Tag>
                  ))}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  );
};

export default Center;
