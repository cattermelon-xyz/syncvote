import {
  EditOutlined,
  EllipsisOutlined,
  FileTextOutlined,
  HomeOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import {
  Layout,
  theme,
  Image,
  Space,
  Button,
  Drawer,
} from "antd";
import Meta from "antd/es/card/Meta";
import Sider from "antd/es/layout/Sider";
import { Content } from "antd/es/layout/layout";
import { useState } from "react";

const PublicMissionLayout = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [open, setOpen] = useState(false);
  // const [placement, setPlacement] = useState<DrawerProps["placement"]>("right");
  // setPlacement("left");

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <Layout>
      <Layout>
        <Image className="w-full"
          src="https://media.discordapp.net/attachments/1080674075669700728/1122847243100246026/Screenshot_2023-06-26_at_18.13.41.png?width=1440&height=163"
        />
      </Layout>

      <Layout style={{ paddingTop: 20 }}>
        <Space className="flex justify-end ">
          <Button onClick={showDrawer}>
            <FileTextOutlined/>
          </Button>

          <Drawer
            title="Uniswap Governance Proces"
            placement={"left"}
            width={500}
            onClose={onClose}
            open={open}
            extra={
              <Space>
                <Button type="primary" onClick={onClose}>
                  Hide
                </Button>
              </Space>
            }
          >
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
          </Drawer>
        </Space>
      </Layout>
    </Layout>
  );
};

export default PublicMissionLayout;
