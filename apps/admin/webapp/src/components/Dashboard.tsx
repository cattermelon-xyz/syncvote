import React, { useState, useEffect } from "react";
import SearchFilter from "./SearchFilter";
import CardSection from "./CardSection";
import { supabase } from 'utils';





type CardData = {
  value: number;
  growth_rate: number;
};

type DashboardData = {
  workspaces: CardData;
  workflows: CardData;
  users: CardData;
};

export type FilterType = "7 days" | "30 days" | "90 days" | "All";

type DashboardProps = {
  setLoading: (loading:boolean) => void; 
  selectedFilter: FilterType;
  setSelectedFilter: React.Dispatch<React.SetStateAction<FilterType>>;
};

function Dashboard({ selectedFilter, setSelectedFilter, setLoading }: DashboardProps) {
  const [data, setData] = useState<DashboardData | null>(null);

  const getFilterDate = (filter: FilterType, isOld = false): string => {
    const date = new Date();
    let daysToSubtract;
    switch (filter) {
      case "7 days":
        daysToSubtract = 7;
        break;
      case "30 days":
        daysToSubtract = 30;
        break;
      case "90 days":
        daysToSubtract = 90;
        break;
      case "All":
        daysToSubtract = 365;
        break;
      default:
        return "";
    }
  
    date.setDate(date.getDate() - daysToSubtract - (isOld ? daysToSubtract : 0));
    return date.toISOString();
  };
  

  useEffect(() => {
    if (!data) {
      setLoading(true)
    } else {
      setLoading(false)
    }
    const fetchData = async () => {
      const filterDateNew = getFilterDate(selectedFilter);
      const filterDateOld = getFilterDate(selectedFilter, true);

      const calculateGrowthRate = (newValue: number, oldValue: number) => {
        const growthRate =
          oldValue !== 0 ? ((newValue - oldValue) / oldValue) * 100 : 0;
        return Number(growthRate.toFixed(2));
      };

      const getValues = async (table: string) => {
        const { data: newData } = await supabase
          .from(table)
          .select("created_at",{ count: 'exact'})
          .filter("created_at", "gt", filterDateNew);
        const { data: oldData } = await supabase
          .from(table)
          .select("created_at",{ count: 'exact'})
          .filter("created_at", "gt", filterDateOld)
          .filter("created_at", "lt", filterDateNew);
        const newValue = newData?.length ?? 0;
        const oldValue = oldData?.length ?? 0;
        console.log("New Value:", newValue, "Old Value:", oldValue);
        return {
          value: newValue,
          growth_rate: calculateGrowthRate(newValue, oldValue),
        };
      };
      

      const workspaces = await getValues("org");
      const workflows = await getValues("workflow");
      const users = await getValues("profile");

      const transformedData = {
        workspaces,
        workflows,
        users,
      };
      console.log("Transformed Data:", transformedData);

      setData(transformedData);
    };

    fetchData();
  }, [selectedFilter, data]);

  return (
    <div>
      <SearchFilter
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
      />
      {data ? (
        <CardSection data={data} selectedFilter={selectedFilter} />
      ) : (
        <div> Loading...</div>
      )}
    </div>
  );
}

export default Dashboard;