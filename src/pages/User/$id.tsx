import { PageContainer } from '@ant-design/pro-components';
import { useParams } from '@umijs/max';

const UserControl: React.FC = () => {
  const { id } = useParams();

  return <PageContainer title={id === 'create' ? '新增' : '更新'}></PageContainer>;
};

export default UserControl;
