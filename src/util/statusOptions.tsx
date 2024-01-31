import { ProSchemaValueEnumObj } from '@ant-design/pro-components';
import { fieldIntl } from '@/util/fieldIntl';
// @ts-ignore
import { IntlShape } from 'react-intl';

export const statusOptions = (intl: IntlShape): ProSchemaValueEnumObj => {
  return {
    enabled: {
      text: fieldIntl(intl, 'options.enabled'),
      color: 'green',
      status: 'enabled',
    },
    disabled: {
      text: fieldIntl(intl, 'options.disabled'),
      color: 'red',
      status: 'disabled',
    },
    locked: {
      text: fieldIntl(intl, 'options.locked'),
      color: 'yellow',
      status: 'locked',
    },
  };
};
