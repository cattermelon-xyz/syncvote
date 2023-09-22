import React, { useState, useEffect } from "react";
import { UsersTable, Workspaces, Workflows } from "./Table";
import { Workspace, Workflow, User } from "./Table";
import { supabase } from 'utils';

function TabTable() {
  const [sortOrder, setSortOrder] = useState("asc");
  const [activeTab, setActiveTab] = useState(0);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      const { data } = await supabase.from("org").select("*");
      setWorkspaces(data || []);
    };

    const fetchWorkflows = async () => {
      const { data } = await supabase.from("workflow_with_org").select("*");
      setWorkflows(data || []);
    };

    const fetchUsers = async () => {
      const { data } = await supabase.from("profile").select("*");
      setUsers(data || []);
    };

    fetchWorkspaces();
    fetchWorkflows();
    fetchUsers();
  }, []);

  const sortData = (data: any[]) => {
    return data.sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return sortOrder === "asc"
        ? dateA.getTime() - dateB.getTime()
        : dateB.getTime() - dateA.getTime();
    });
  };

  const handleSort = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    setWorkspaces(sortData(workspaces));
    setWorkflows(sortData(workflows));
    setUsers(sortData(users));
  };

  const tabs = [
    {
      title: `Workspaces (${workspaces.length})`,
      content: <Workspaces workspace={workspaces} />,
    },
    {
      title: `Workflows (${workflows.length})`,
      content: <Workflows workflow={workflows} />,
    },
    { title: `Users (${users.length})`, content: <UsersTable users={users} /> },
  ];

  return (
    <div>
      <div className="flex justify-between space-x-2 p-6 mt-6">
        <div className="flex space-x-2">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`py-2 px-1 mr-2 text-base transition-colors duration-300 ease-in-out ${
                activeTab === index ? "border-b text-white" : "text-gray-300"
              }`}
            >
              {tab.title}
            </button>
          ))}
        </div>
        <button onClick={handleSort} className="px-6 py-3  text-[#BBBBBA] rounded-full border  border-gray-700 mt-4">
          Sort by Date  {sortOrder === "asc" ? "▲" : "▼"}
        </button>
      </div>
      <div className="tab-content mt-2 mb-12 px-6 pb-6 text-white border-gray-300">
        {tabs[activeTab].content}
      </div>
    </div>
  );
}

export default TabTable;
