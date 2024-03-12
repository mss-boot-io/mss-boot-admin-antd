import React, { useState } from 'react';
import { List } from 'antd';

type Unpacked<T> = T extends (infer U)[] ? U : T;

const passwordStrength = {
  strong: <span className="strong">强</span>,
  medium: <span className="medium">中</span>,
  weak: <span className="weak">弱 Weak</span>,
};

const SecurityView: React.FC = () => {
  const [changePassword, setChangePassword] = useState<boolean>(false);
  console.log(changePassword);
  const getData = () => [
    {
      title: '账户密码',
      description: (
        <>
          当前密码强度：
          {passwordStrength.strong}
        </>
      ),
      actions: [
        <a key="Modify" onClick={() => setChangePassword(true)}>
          修改
        </a>,
      ],
    },
    {
      title: '手机号',
      description: `已绑定手机：138****8293`,
      actions: [<a key="Modify">修改</a>],
    },
    {
      title: '邮箱',
      description: `已绑定邮箱：ant***sign.com`,
      actions: [<a key="Modify">修改</a>],
    },
  ];

  const data = getData();
  return (
    <>
      <List<Unpacked<typeof data>>
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item) => (
          <List.Item actions={item.actions}>
            <List.Item.Meta title={item.title} description={item.description} />
          </List.Item>
        )}
      />
    </>
  );
};

export default SecurityView;
