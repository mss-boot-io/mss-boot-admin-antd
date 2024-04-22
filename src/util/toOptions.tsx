import { ProSchemaValueEnumObj } from '@ant-design/pro-components';

interface IOptions {
  id?: string;
  name?: string;
}

// 将数组转换为ProSchemaValueEnumMap
export const toOptions = (data?: IOptions[]): ProSchemaValueEnumObj => {
  // @ts-ignore
  let options: ProSchemaValueEnumObj = {};
  if (!data) return options;
  console.log(data);
  // @ts-ignore
  data?.forEach((item) => {
    // @ts-ignore
    options[item.id] = {
      text: item.name,
      status: item.id,
    };
  });
  return options;
};
