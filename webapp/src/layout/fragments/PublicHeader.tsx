import Logo from "@assets/icons/svg-icons/Logo";
import { L } from "@utils/locales/L";
import { useLocation, useNavigate, useParams } from "react-router-dom";
// import { sliceAddressToken } from '@utils/helpers';
// import { AddressToken } from '@utils/mockData/addressToken';
import { supabase } from "@utils/supabaseClient";
import { useDispatch, useSelector } from "react-redux";
import { extractIdFromIdString, getImageUrl } from "@utils/helpers";
import { Avatar, Button, Menu, MenuProps } from "antd";
import {
  HomeOutlined,
  FacebookFilled,
  InstagramOutlined,
  TwitterOutlined,
  CaretDownFilled,
  FontColorsOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import { RxLightningBolt } from "react-icons/rx";
import React from "react";

type MenuItem = Required<MenuProps>["items"][number];
function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group",
  style?: React.CSSProperties
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
    style,
  } as MenuItem;
}

function PublicHeader() {
  const params = useLocation();
  const items: MenuProps["items"] = [
    getItem("About us", "1"),

    getItem(
      "Social",
      "2",
      <CaretDownFilled />,
      [
        getItem("Facebook", "facebook", <FacebookFilled />),
        getItem("Twitter", "twitter", <TwitterOutlined />),
        getItem("Instagram", "instagram", <InstagramOutlined />),
      ],
      undefined
    ),

    getItem("Docs", "3"),

    getItem(
      "Create your own workflow",
      "4",
      <RxLightningBolt />,
      undefined,
      undefined,
      { color: "purple" }
    ),
  ];

  const onClick: MenuProps["onClick"] = (e) => {
    console.log("click ", e);
  };

  return (
    <div
      className={`flex justify-between items-center px-[32px] md:px-p_1 h-20 w-full border-b-b_1 border-gray-normal font-sans z-20 bg-white`}
    >
      <div className=" w-full flex justify-between">
        <div className="flex p-0 gap-2 items-center">
          <div className="flex items-center gap-2">
            <Logo width="128" height="24" />
          </div>

          <div className="flex w-w_5 items-center justify-end">
            <div style={{ display: "flex" }}>
              <Menu
                className="header-public"
                mode="horizontal"
                items={items}
                onClick={onClick}
              ></Menu>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PublicHeader;
