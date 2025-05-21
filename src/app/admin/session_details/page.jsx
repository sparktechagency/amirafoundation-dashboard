import React from "react";
import SessionTable from "./Component/SessionTable";

export const metadata = {
  title: "Session Table",
  description: "Session page",
};

const page = () => {
  return (
    <div>
      <SessionTable />
    </div>
  );
};

export default page;
