import { Tabs } from "antd";
import React from "react";
import ArticlesTable from "./ArticlesTable";
import PodcastTable from "./PodcastTable";

const ResourceHubConatiner = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-[#A57EA5]">
        Resource Hub Management
      </h1>
      <Tabs defaultActiveKey="1" style={{ marginTop: "20px" }}>
        {/* ============== Articles============ */}
        <Tabs.TabPane tab="Articles" key="1">
          <ArticlesTable />
        </Tabs.TabPane>
        {/* ==============Podcast=========== ================*/}
        <Tabs.TabPane tab="Podcast" key="2">
          <PodcastTable />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default ResourceHubConatiner;
