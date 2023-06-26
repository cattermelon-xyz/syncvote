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

type HeaderProps = {
  // isAuth: boolean;
  // setIsAuth: (value: boolean) => void;
  session: any;
  isMainAppFullHeight: boolean;
};

enum Pages {
  LOGIN,
  ORG_HOME,
  ORG_SELECTOR,
  ORG_SETTING,
  UNKNOWN,
  PUBLIC,
}

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

function Header({
  // isAuth = false,
  // setIsAuth = () => {},
  session,
  isMainAppFullHeight = false,
}: HeaderProps) {
  const params = useLocation();
  // const token = window.localStorage.getItem('isConnectWallet');
  const dispatch = useDispatch();
  const { orgs } = useSelector((state: any) => state.orginfo);
  const navigate = useNavigate();
  const { orgIdString } = useParams();
  const orgId = extractIdFromIdString(orgIdString);
  const [currentOrg, setCurrentOrg] = useState(
    orgs.find((org: any) => org.id === orgId)
  );
  const handleClearStore = () => {};
  useEffect(() => {
    setCurrentOrg(orgs.find((org: any) => org.id === orgId));
  }, [orgs, orgId]);
  let currentPage = Pages.UNKNOWN;
  console.log(params.pathname);

  switch (params.pathname) {
    case "/login":
      currentPage = Pages.LOGIN;
      break;
    case `/${orgIdString}`:
      currentPage = Pages.ORG_HOME;
      break;
    case `/${orgIdString}/setting`:
      currentPage = Pages.ORG_SETTING;
      break;
    case "/":
      currentPage = Pages.ORG_SELECTOR;
      break;
    case "/public":
      currentPage = Pages.PUBLIC;
      break;

    default:
      currentPage = Pages.UNKNOWN;
      break;
  }

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
      className={`flex justify-between items-center px-[32px] md:px-p_1 h-20 w-full border-b-b_1 border-gray-normal font-sans z-20 bg-white ${
        !isMainAppFullHeight ? "fixed top-0 left-0" : null
      }`}
    >
      <div className=" w-full flex justify-between">
        <div className="flex p-0 gap-2 items-center">
          {currentPage !== Pages.LOGIN ? (
            <div className="flex items-center gap-2">
              <span className="cursor-pointer flex">
                {orgId !== -1 ? (
                  <span className="text-xl flex flex-row items-center">
                    <HomeOutlined
                      style={{ fontSize: "24px" }}
                      onClick={() => {
                        navigate("/");
                      }}
                    />
                    <span className="ml-2 mr-2">/</span>
                    <span
                      onClick={() => {
                        navigate(`/${orgIdString}`);
                      }}
                    >
                      {currentOrg?.icon_url ? (
                        <Avatar
                          src={getImageUrl({
                            filePath: currentOrg?.icon_url?.replace(
                              "preset:",
                              ""
                            ),
                            isPreset:
                              currentOrg?.icon_url?.indexOf("preset:") === 0,
                            type: "icon",
                          })}
                          className="mx-2"
                        />
                      ) : (
                        <Avatar>{currentOrg?.title[0]}</Avatar>
                      )}
                    </span>
                    <span
                      className="mr-4"
                      onClick={() => {
                        navigate(`/${orgIdString}`);
                      }}
                    >
                      {currentOrg?.title}
                    </span>
                    <Button
                      type="text"
                      disabled={currentPage === Pages.ORG_HOME}
                      onClick={() => {
                        navigate(`/${orgIdString}`);
                      }}
                    >
                      Governance
                    </Button>
                    <Button
                      type="text"
                      className="ml-2"
                      disabled={currentPage === Pages.ORG_SETTING}
                      onClick={() => {
                        navigate(`/${orgIdString}/setting`);
                      }}
                    >
                      Settings
                    </Button>
                  </span>
                ) : (
                  <span
                    className="mr-2"
                    onClick={() => {
                      handleClearStore();
                      navigate("/");
                    }}
                  >
                    <Logo width="128" height="24" />
                  </span>
                )}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Logo width="128" height="24" />
            </div>
          )}
        </div>

        <div className="flex w-w_5 items-center justify-end">
          {currentPage === Pages.LOGIN ? (
            ""
          ) : (
            // <div
            //   className="border-b_2 py-3 px-4 my-3 mr-0 rounded-lg border-gray-normal  cursor-pointer"
            //   onClick={async () => {
            //     dispatch(startLoading({}));
            //     await supabase.auth.signOut();
            //     dispatch(finishLoading({}));
            //     navigate("/login");
            //   }}
            //   title={L("clickToLogout")}
            // >
            //   <p className="text-text_2 text-[#252422]">
            //     {/* {token ? sliceAddressToken(AddressToken.ip_address, 5) : 'Connect wallet'} */}
            //     <img
            //       src={session?.user?.user_metadata?.avatar_url}
            //       alt="user_avatar"
            //       className="w-8 h-8 rounded-full inline-block mr-2"
            //     />
            //     {session?.user?.user_metadata?.full_name}
            //   </p>

            // </div>
            <div style={{ display: "flex" }}>
              <Menu
                className="header-public"
                mode="horizontal"
                items={items}
                onClick={onClick}
              ></Menu>

              <Button className="">Login</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
