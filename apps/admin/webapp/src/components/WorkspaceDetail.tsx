import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { getImageUrl } from 'utils';
import Org_Blank from "../assets/Blank Org.png";
import Back_icon from "../assets/Chevron left.svg";
import WF_Icon from "../assets/WF Icon.png";
import Member_Icon from "../assets/Member Icon.png";
import Calender from "../assets/Calendar Icon.png";
import Globe from "../assets/Globe Icon.png";
import Identity_Blank from "../assets/Blank.png";
import { supabase } from 'utils';

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const options: any = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return date.toLocaleString("en-US", options);
}

function formatDatew(dateString: string) {
  const date = new Date(dateString);
  const options: any = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return date.toLocaleString("en-US", options);
}

type Workflow = {
  id: number;
  title: string;
  workspacename: string;
  created_at: string;
};

type WorkspaceDetailProps = {
  id: number;
  icon_url: string;
  workspaceName: string;
  workflows: number;
  members: number;
  created_at: string;
};

const WorkspaceDetail: React.FC = () => {
  const [workflows, setWorkflows] = useState<any[]>([]);
  const { workspaceName } = useParams();
  const navigate = useNavigate();
  const [workspaceData, setWorkspaceData] =
    useState<WorkspaceDetailProps | null>(null);
  const [imageUrls, setImageUrls] = useState<Record<number, string>>({});
  const [numOfWorkflows, setNumOfWorkflows] = useState<number | null>(null);
  const [numOfMembers, setNumOfMembers] = useState<number | null>(null);
  const ITEMS_PER_PAGE = 10;
  const [numItemsToShow, setNumItemsToShow] = useState(ITEMS_PER_PAGE);

  const handleShowMore = () => {
    setNumItemsToShow(numItemsToShow + ITEMS_PER_PAGE);
  };

  useEffect(() => {
    async function fetchWorkflows(workspaceId: number) {
      const { data, error } = await supabase
        .from("workflow")
        .select("*", { count: "exact" })
        .eq("owner_org_id", workspaceId);

      if (error) {
        console.error(error);
        return [];
      }

      return data || [];
    }
    async function fetchMembers(workspaceId: number) {
      const { data, error } = await supabase
        .from("user_org")
        .select("*", { count: "exact" })
        .eq("org_id", workspaceId);

      if (error) {
        console.error(error);
        return [];
      }

      return data || [];
    }

    const fetchWorkspaceData = async () => {
      // Fetch workspace details
      const { data, error } = await supabase
        .from("org")
        .select("*")
        .eq("title", workspaceName);

      if (error) {
        console.error("Error fetching workspace data:", error);
        return;
      }

      const workspace = data ? data[0] : null;
      setWorkspaceData(workspace);

      if (workspace) {
        // Fetch the number of workflows and members
        const workflows = await fetchWorkflows(workspace.id);
        const members = await fetchMembers(workspace.id);
        const fetchedWorkflows = await fetchWorkflows(workspace.id);
        setWorkflows(fetchedWorkflows);
        setNumOfWorkflows(workflows.length);
        setNumOfMembers(members.length);

        // Fetch the image for the workspace
        if (workspace.icon_url) {
          const isPreset = workspace.icon_url.startsWith("preset:");
          const filePath = isPreset
            ? workspace.icon_url.replace("preset:", "")
            : workspace.icon_url;
          const url = await getImageUrl({ filePath, isPreset, type: 'icon' });
          setImageUrls({ [workspace.id]: url });
        }
      }
    };

    fetchWorkspaceData();
  }, [workspaceName]);

  return (
    <div className="relative flex flex-col bg-black min-h-screen">
      <div
        className="absolute z-[0] w-[50%] h-[50%] -right-[50%] -top-[30%] rounded-full blue__gradient"
      ></div>
      <button
        className="text-white text-sm mb-12 flex items-center"
        onClick={() => navigate("/")}
      >
        <img src={Back_icon} alt="Back" className="h-4 w-4 mr-2" />
        Back to Dashboard
      </button>
      {workspaceData && (
        <div>
          <div className="w-16 h-16 rounded-full overflow-hidden">
            <img
              src={imageUrls[workspaceData.id] || Org_Blank}
              alt="Workspace Icon"
              className="object-cover w-full h-full"
            />
          </div>
          <h1 className="text-white text-5xl my-5 ml-1">{workspaceName}</h1>
          <div className="flex items-center ml-[6px]">
            <p className="text-[#E3E3E2] mr-2 text-base">
              {numOfMembers} Members
            </p>
            <p className="text-[#E3E3E2] mr-2 text-base">
              • {numOfWorkflows} Workflows
            </p>
            <p className="text-[#E3E3E2] text-base">
              • {formatDatew(workspaceData.created_at)}
            </p>
          </div>
        </div>
  
      )}
      {workflows.length > 0 && (
        <WorkflowTable
          workflows={workflows}
          imageUrls={imageUrls}
          numItemsToShow={numItemsToShow}
          handleShowMore={handleShowMore}
        />
      )}
    </div>
  );
};

const WorkflowTable: React.FC<{
  workflows: Workflow[];
  numItemsToShow: number;
  handleShowMore: () => void;
  imageUrls: Record<number, string>;
}> = ({ workflows, numItemsToShow, handleShowMore, imageUrls }) => {
  return (
    <div className="mt-10 ml-[6px]">
      {workflows && workflows.length > 0 && (
        <div className="my-[60px]">
          <h2 className="text-white text-base mb-4">
            Workflows ({workflows.length})
          </h2>
          <div className="  text-[#BBBBBA] rounded-2xl border  border-gray-700 bg-[#0b0b0b] border-separate border-spacing-1 py-5 px-3">
            <table className="min-w-full">
              <tbody>
                {workflows
                  .slice(0, numItemsToShow)
                  .map((workflow: Workflow) => (
                    <tr key={workflow.id}>
                      <td className="py-3 px-5 w-96">
                        <div className="flex items-center">
                          <img
                            src={imageUrls[workflow.id] || Identity_Blank}
                            alt="blank"
                            className="inline-block mr-2 w-6 h-6 rounded-full"
                          />
                          <div className="truncate">{workflow.title}</div>
                        </div>
                      </td>
                      <td className="py-3 px-5 w-96">
                        <div className="flex items-center">
                          <img
                            src={Calender}
                            alt="sign-up date"
                            className="inline-block mr-2"
                          />
                          {formatDate(workflow.created_at)}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {numItemsToShow < workflows.length && (
              <div className="text-center">
                <button
                  onClick={handleShowMore}
                  className="px-6 py-3 text-[#BBBBBA] rounded-full border border-gray-700 mt-4"
                >
                  Show More
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkspaceDetail;
