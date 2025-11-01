"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function ChartMonthlyTrend2024({ data }) {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthStreams = {};

  data.forEach(row => {
    if (row["Release Date"] && row["Spotify Streams"]) {
      const date = new Date(row["Release Date"]);
      const year = date.getFullYear();
      const month = date.getMonth();
      
      if (year === 2024) {
        const streams = parseInt(row["Spotify Streams"].replace(/,/g, "")) || 0;
        monthStreams[month] = (monthStreams[month] || 0) + streams;
      }
    }
  });

  const processedData = Object.entries(monthStreams)
    .map(([month, streams]) => ({ 
      month: monthNames[parseInt(month)],
      monthNum: parseInt(month),
      streams 
    }))
    .sort((a, b) => a.monthNum - b.monthNum);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Total Spotify Streams per Month (2024)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={processedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(value) => (value / 1e9).toFixed(0) + "B"} />
            <Tooltip formatter={(value) => (value / 1e9).toFixed(2) + "B streams"} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="streams" 
              stroke="#1db954" 
              strokeWidth={2} 
              dot={{ r: 5 }} 
              name="2024 Streams" 
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
