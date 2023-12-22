import { ProSchemaValueEnumMap } from '@ant-design/pro-components';

interface IOptions {
  id?: string;
  name?: string;
}

// 将数组转换为ProSchemaValueEnumMap
export const toOptions = (data?: IOptions[]): ProSchemaValueEnumMap => {
  console.log(data);
  // @ts-ignore
  let options: ProSchemaValueEnumMap = {};
  if (!data) return options;
  // @ts-ignore
  data.forEach((item) => {
    // @ts-ignore
    options[item.id] = {
      text: item.name,
      status: item.id,
    };
  });
  return options;
};
