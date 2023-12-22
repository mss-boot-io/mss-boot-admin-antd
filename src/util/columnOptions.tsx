import { FormattedMessage } from '@umijs/max';
import { Button } from 'antd';

export const statusOptions = {
  enabled: {
    text: <FormattedMessage id="page.options.status.enabled" defaultMessage="启用" />,
    color: 'green',
    status: 'enabled',
  },
  disabled: {
    text: <FormattedMessage id="page.options.status.disabled" defaultMessage="禁用" />,
    color: 'red',
    status: 'disabled',
  },
  locked: {
    text: <FormattedMessage id="page.options.status.locked" defaultMessage="锁定" />,
    color: 'yellow',
    status: 'locked',
  },
};

export const idRender = (
  dom: React.ReactNode,
  entity: Record<string, any>,
  setCurrentRow: any,
  setShowDetail: any,
) => {
  return (
    <Button
      key={entity.id}
      onClick={() => {
        setCurrentRow(entity);
        setShowDetail(true);
      }}
      type="link"
    >
      {dom}
    </Button>
  );
};
