"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#22c55e", "#facc15", "#ef4444"];

export default function DashboardPage() {
  // -------------------------
  // STATE
  // -------------------------
  const [summary, setSummary] = useState({
    total_patients: 0,
    normal: 0,
    early: 0,
    advanced: 0,
  });

  const [timelineData, setTimelineData] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);

  // -------------------------
  // FETCH DASHBOARD DATA
  // -------------------------
  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      // SUMMARY
      const summaryRes = await fetch(
        "http://127.0.0.1:8000/api/dashboard/summary"
      );
      setSummary(await summaryRes.json());

      // PATIENTS OVER TIME
      const timelineRes = await fetch(
        "http://127.0.0.1:8000/api/dashboard/patients-over-time"
      );
      const timelineJson = await timelineRes.json();
      setTimelineData(Array.isArray(timelineJson) ? timelineJson : []);

      // PATIENTS BY MONTH
      const monthRes = await fetch(
        "http://127.0.0.1:8000/api/dashboard/patients-by-month"
      );
      const monthJson = await monthRes.json();
      setMonthlyData(Array.isArray(monthJson) ? monthJson : []);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
      setTimelineData([]);
      setMonthlyData([]);
    }
  };

  // -------------------------
  // GRAPH DATA
  // -------------------------
  const barData = [
    { stage: "Normal", value: summary.normal },
    { stage: "Early", value: summary.early },
    { stage: "Advanced", value: summary.advanced },
  ];

  const pieData = [
    { name: "Normal", value: summary.normal },
    { name: "Early", value: summary.early },
    { name: "Advanced", value: summary.advanced },
  ];

  // -------------------------
  // UI
  // -------------------------
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-slate-800">
        Doctor Dashboard
      </h1>
      <p className="text-sm text-slate-500 mt-1">
        Healthcare analytics & glaucoma overview
      </p>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        {[
          { title: "Total Patients", value: summary.total_patients },
          { title: "Normal", value: summary.normal },
          { title: "Early Glaucoma", value: summary.early },
          { title: "Advanced Glaucoma", value: summary.advanced },
        ].map((card) => (
          <div
            key={card.title}
            className="bg-white border border-slate-200 rounded-lg p-4"
          >
            <p className="text-sm text-slate-500">{card.title}</p>
            <p className="text-2xl font-semibold text-slate-800">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* LINE + BAR */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* PATIENTS OVER TIME */}
        <div className="bg-white border rounded-lg p-5">
          <h2 className="text-lg font-medium mb-4">
            Patients Over Time
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData}>
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#2563eb"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* STAGE COUNT */}
        <div className="bg-white border rounded-lg p-5">
          <h2 className="text-lg font-medium mb-4">
            Glaucoma Stage Count
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="stage" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* MONTHLY GROWTH */}
      <div className="bg-white border rounded-lg p-5 mt-6">
        <h2 className="text-lg font-medium mb-4">
          Monthly Patient Growth
        </h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData}>
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#16a34a"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* PIE CHART */}
      <div className="bg-white border rounded-lg p-5 mt-6">
        <h2 className="text-lg font-medium mb-4">
          Glaucoma Stage Percentage
        </h2>
        <div className="h-[300px] flex justify-center">
          <ResponsiveContainer width="60%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={110}
                label
              >
                {pieData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
