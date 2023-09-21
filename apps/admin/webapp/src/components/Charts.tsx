import React, { useState, useEffect } from "react";
import BarChart from "./LineChart";
import HistogramChart from "./HistogramChart";
import ChartCard from "./ChartCard";
import { FilterType } from "./Dashboard";
import LineChart from "./LineChart";
import { supabase } from 'utils';

type ChartsProps = {
  selectedFilter: FilterType;
  setLoading: (loading: boolean) => void;
};

function Charts({ selectedFilter, setLoading }: ChartsProps) {
  const [workspaces, setWorkspaces] = useState<number[]>([]);
  const [workflows, setWorkflows] = useState<number[]>([]);
  const [histogramData, setHistogramData] = useState<number[]>([]);

  useEffect(() => {
    if (workspaces && workflows && histogramData) {
      setLoading(false)
    } else {
      setLoading(true)
    }
    const fetchData = async () => {
      let numberOfDays;
      switch (selectedFilter) {
        case "7 days":
          numberOfDays = 7;
          break;
        case "30 days":
          numberOfDays = 30;
          break;
        case "90 days":
          numberOfDays = 90;
          break;
        case "All":
          numberOfDays = 365;
          break;
        default:
          numberOfDays = 7;
      }

      const workspacesData = [];
      const workflowsData = [];

      for (let i = 0; i < numberOfDays; i++) {
        const filterDate = getFilterDate(numberOfDays - i);
        const workspacesCount = await fetchDataForDate("org", filterDate);
        const workflowsCount = await fetchDataForDate("workflow", filterDate);

        workspacesData.push(workspacesCount);
        workflowsData.push(workflowsCount);
      }

      setWorkspaces(workspacesData);
      setWorkflows(workflowsData);
    };

    const getFilterDate = (daysAgo: number): string => {
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      return date.toISOString();
    };

    const fetchDataForDate = async (table: string, filterDate: string) => {
      const { data } = await supabase
        .from(table)
        .select("created_at", { count: "exact" })
        .filter("created_at", "gt", filterDate);

      return data?.length ?? 0;
    };

    const fetchHistogramData = async () => {
      let daysAgo;
      switch (selectedFilter) {
        case "7 days":
          daysAgo = 7;
          break;
        case "30 days":
          daysAgo = 30;
          break;
        case "90 days":
          daysAgo = 90;
          break;
        case "All":
          daysAgo = 365;
          break;
      }
      const filterDate = getFilterDate(daysAgo);

      // Fetch workflows count per workspace
      const { data: workflowData } = await supabase
        .from("workflow")
        .select("owner_org_id")
        .filter("created_at", "gt", filterDate);

      const countsByWorkspace: Record<string, number> = {};
      workflowData?.forEach((workflow: any) => {
        const workspaceId = workflow.owner_org_id;
        countsByWorkspace[workspaceId] =
          (countsByWorkspace[workspaceId] || 0) + 1;
      });

      const binEdges = [1, 2, 3, 4, 5, 6, 7, 8];

      const counts = new Array(binEdges.length + 1).fill(0);
      const values = Object.values(countsByWorkspace);
      values.forEach((value) => {
        let binIndex = binEdges.findIndex((edge) => value < edge);
        if (binIndex === -1) {
          binIndex = binEdges.length; // Last bin for anything greater than the last edge
        }
        counts[binIndex]++;
      });

      setHistogramData(counts);
    };

    fetchData();
    fetchHistogramData();
  }, [selectedFilter, workflows, workspaces, histogramData]);

  return (
    <div className="grid grid-cols-2 gap-6 p-6 mt-6">
      <ChartCard title="New workspaces & workflows" date_range={selectedFilter}>
        <LineChart
          workspaces={workspaces}
          workflows={workflows}
          selectedFilter={selectedFilter}
        />
      </ChartCard>
      <ChartCard
        title="Distribution of workflows per workspace"
        date_range={selectedFilter}
      >
        <HistogramChart data={histogramData} />
      </ChartCard>
    </div>
  );
}

export default Charts;