"use client";
import React from "react";
import AllData from "./allData";
import DashboardCards from "./card";
import Graph from "./graph";

function Page() {
  return (
    <div className="w-dvw h-dvh bg-gray-50 p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>
      <div>
        <div id="dashboard" className="">
          <DashboardCards />
        </div>
        <div id="graph" className="">
          <Graph />
        </div>
        <div id="data" className="">
          <AllData />
        </div>
      </div>
    </div>
  );
}

export default Page;
