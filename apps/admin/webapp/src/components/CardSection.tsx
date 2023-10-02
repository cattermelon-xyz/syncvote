import React from "react";
import Card from "./Cards";
import Globe_Icon from "../assets/Globe Icon.png";
import WF_Icon from "../assets/WF Icon.png";
import User_Icon from "../assets/User Icon.png";
import SearchFilter from "./SearchFilter";
import { FilterType } from "./Dashboard";

type CardSectionProps = {
  data: {
    workspaces: { value: number; growth_rate: number };
    workflows: { value: number; growth_rate: number };
    users: { value: number; growth_rate: number };
  };
  selectedFilter: FilterType;
};

function CardSection({ data, selectedFilter }: CardSectionProps) {
  return (
    <div className="grid grid-cols-3 gap-3 p-6 mt-6">
      <Card
        title="New workspaces"
        value={data.workspaces.value}
        growth_rate={data.workspaces.growth_rate}
        icon={Globe_Icon}
        date_range= {selectedFilter}
      />
      <Card
        title="New workflows"
        value={data.workflows.value}
        growth_rate={data.workflows.growth_rate}
        icon={WF_Icon}
        date_range= {selectedFilter}
      />
      <Card
        title="New users"
        value={data.users.value}
        growth_rate={data.users.growth_rate}
        icon={User_Icon}
        date_range= {selectedFilter}
      />
    </div>
  );
}

export default CardSection;
