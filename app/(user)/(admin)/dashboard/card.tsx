"use client";
import React from "react";
import useAction from "@/hooks/useActions";
import { dashboardCard } from "@/actions/admin/dashboard";

export default function DashboardCards() {
  const [dashboardData, ,] = useAction(dashboardCard, [true, () => {}]);

  const cardData = [
    {
      title: "Total Cards",
      value: dashboardData?.totalCards ?? 0,
      desc: "Total cards in system",
    },
    {
      title: "Total Scans",
      value: dashboardData?.totalScan ?? 0,
      desc: "Total scans performed",
    },
    {
      title: "Total Users",
      value: dashboardData?.totalUsers ?? 0,
      desc: "Total registered users",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cardData.map((card, idx) => (
        <div
          key={idx}
          className="bg-white rounded-lg shadow p-4 flex flex-col items-start"
        >
          <div className="text-lg font-semibold">{card.title}</div>
          <div className="text-2xl font-bold mt-2">{card.value}</div>
          <div className="text-xs text-gray-500 mt-2">{card.desc}</div>
        </div>
      ))}
    </div>
  );
}
