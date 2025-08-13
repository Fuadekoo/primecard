"use client";
import React from "react";
import AllData from "./allData";
import DashboardCards from "./card";
import Graph from "./graph";

function Page() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <DashboardCards />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Graph />
        <AllData />
      </div>
    </div>
  );
}

export default Page;
