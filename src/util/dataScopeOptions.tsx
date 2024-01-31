import { ProSchemaValueEnumObj } from '@ant-design/pro-components';
import { fieldIntl } from '@/util/fieldIntl';
// @ts-ignore
import { IntlShape } from 'react-intl';

export const dataScopeOptions = (intl: IntlShape): ProSchemaValueEnumObj => {
  return {
    all: {
      text: fieldIntl(intl, 'options.all'),
      color: 'green',
      status: 'all',
    },
    currentDept: {
      text: fieldIntl(intl, 'options.currentDept'),
      color: 'red',
      status: 'currentDept',
    },
    currentAndChildrenDept: {
      text: fieldIntl(intl, 'options.currentAndChildrenDept'),
      color: 'yellow',
      status: 'currentAndChildrenDept',
    },
    customDept: {
      text: fieldIntl(intl, 'options.customDept'),
      color: 'yellow',
      status: 'customDept',
    },
    self: {
      text: fieldIntl(intl, 'options.self'),
      color: 'yellow',
      status: 'self',
    },
    selfAndChildren: {
      text: fieldIntl(intl, 'options.selfAndChildren'),
      color: 'yellow',
      status: 'selfAndChildren',
    },
    selfAndAllChildren: {
      text: fieldIntl(intl, 'options.selfAndAllChildren'),
      color: 'yellow',
      status: 'selfAndAllChildren',
    },
  };
};
