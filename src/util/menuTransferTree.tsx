import { DataNode } from 'antd/es/tree';
// @ts-ignore
import { IntlShape } from 'react-intl';

export const menuTransferTree = (intl: IntlShape, data: API.Menu[]): DataNode[] => {
  // @ts-ignore
  return data.map((item) => {
    return {
      title: intl.formatMessage({ id: `menu.${item.name}` }),
      value: item.id,
      // @ts-ignore
      children: item.children ? menuTransferTree(intl, item.children) : null,
    };
  });
};
