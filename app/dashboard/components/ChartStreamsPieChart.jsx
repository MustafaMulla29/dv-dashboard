"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function ChartStreamsPieChart({ data }) {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthStreams = {};

  data.forEach(row => {
    if (row["Release Date"] && row["Spotify Streams"]) {
      const date = new Date(row["Release Date"]);
      const month = date.getMonth();
      const streams = parseInt(row["Spotify Streams"].replace(/,/g, "")) || 0;
      monthStreams[month] = (monthStreams[month] || 0) + streams;
    }
  });

  const processedData = Object.entries(monthStreams)
    .map(([month, streams]) => ({ 
      name: monthNames[parseInt(month)],
      value: streams 
    }));

  const COLORS = [
    "#1db954", "#1ed760", "#4ade80", "#86efac", 
    "#22c55e", "#16a34a", "#15803d", "#166534",
    "#14532d", "#052e16", "#84cc16", "#65a30d"
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Share of Total Streams by Month</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={processedData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {processedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => (value / 1e9).toFixed(2) + "B streams"} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
