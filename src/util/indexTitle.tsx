import { FormattedMessage } from '@umijs/max';

export const indexTitle = (id: string | undefined): string | React.ReactNode => {
  if (!id) {
    return <FormattedMessage id="page.title.list" defaultMessage="列表" />;
  }
  if (id && id !== 'create') {
    return <FormattedMessage id="page.title.edit" defaultMessage="编辑" />;
  }
  return <FormattedMessage id="page.title.create" defaultMessage="新增" />;
};
