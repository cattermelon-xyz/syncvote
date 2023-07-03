// import GlobalLoading from "@components/GlobalLoading/GlobalLoading";
// import { Session } from "@supabase/supabase-js";
// import { useEffect, useState } from "react";
// import { Outlet, useNavigate } from "react-router-dom";
// import PublicHeader from "@layout/fragments/PublicHeader";
// import { useDispatch, useSelector } from "react-redux";
// import { shouldUseCachedData } from "@utils/helpers";
// import { queryOrgs, queryPresetBanner, queryPresetIcon } from "@middleware/data";
// import { setUser } from "@redux/reducers/orginfo.reducer";
// import { supabase } from "@utils/supabaseClient";
// import SingleChoiceRaceToMax from "@votemachines/SingleChoiceRaceToMax";
// import { registerVoteMachine } from "@components/DirectedGraph";
// import MultipleChoiceRaceToMax from "@votemachines/MultipleChoiceRaceToMax";
// import MainLayout from "@layout/MainLayout";

// function PublicMission({ isFullHeight = false }: { isFullHeight?: boolean }) {
//   const navigate = useNavigate();
//   const [session, setSession] = useState<Session | null>(null);
//   const { presetIcons, presetBanners, initialized } = useSelector(
//     (state: any) => state.ui
//   );
//   const dispatch = useDispatch();
//   const { lastFetch } = useSelector((state: any) => state.orginfo);

//   const handleSession = async (_session: Session | null) => {
//     setSession(_session);
//     if (_session === null) {
//       console.log(_session);
//     }

//     if (_session !== null) {
//       // query to server to get preset icons and banners
//       queryPresetBanner({
//         dispatch, presetBanners,
//       });
//       queryPresetIcon({
//         dispatch, presetIcons,
//       });
//     }

//     if (_session !== null) {
//       const { user } = _session as Session;
//       if (!shouldUseCachedData(lastFetch)) {
//         queryOrgs({
//           filter: {
//             userId: user.id,
//           },
//           onSuccess: () => {},
//           dispatch,
//         });
//       }
//       if (initialized === false) {
//         dispatch(
//           setUser({
//             id: user.id,
//             email: user.email,
//             full_name: user.user_metadata.full_name,
//           })
//         );
//       }
//     }
//   };

//   // query from redux user info
//   useEffect(() => {
//     // if (!token) {
//     //   navigate(PAGE_ROUTES.CONNECT_WALLET);
//     // }
//     supabase.auth.getSession().then(async ({ data: { session: _session } }) => {
//       await handleSession(_session);
//     });
//     registerVoteMachine(SingleChoiceRaceToMax);
//     registerVoteMachine(MultipleChoiceRaceToMax);
//   }, []);

//   return (
//     <div className={`w-full ${isFullHeight ? "bg-slate-100 h-screen" : null}`}>
//       <GlobalLoading />
//       <PublicHeader session={session} isMainAppFullHeight={isFullHeight} />
//       {/* <PublicMissionLayout />
//        */}
//       <MainLayout isFullHeight={isFullHeight}>
//         <Outlet
//           context={{
//             // isAuth,
//             // setIsAuth,
//             session,
//           }}
//         />
//       </MainLayout>
//     </div>
//   );
// }

// export default PublicMission;
