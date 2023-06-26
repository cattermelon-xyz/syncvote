import GlobalLoading from "@components/GlobalLoading/GlobalLoading";
import { Session } from "@supabase/supabase-js";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import PublicHeader from "@layout/fragments/PublicHeader";
import PublicMissionLayout from "@layout/PublicMissionLayout";

function PublicMission({ isFullHeight = false }: { isFullHeight?: boolean }) {
  const navigate = useNavigate();
  const [session] = useState<Session | null>(null);
  console.log(navigate);

  return (
    <div className={`w-full ${isFullHeight ? "bg-slate-100 h-screen" : null}`}>
      <GlobalLoading />
      <PublicHeader />

      <PublicMissionLayout />
    </div>
  );
}

export default PublicMission;
