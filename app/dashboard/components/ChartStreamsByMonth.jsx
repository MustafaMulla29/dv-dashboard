"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function ChartStreamsByMonth({ data }) {
  const monthStreams = {};
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
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
      month: monthNames[parseInt(month)],
      monthNum: parseInt(month),
      streams 
    }))
    .sort((a, b) => a.monthNum - b.monthNum);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Total Spotify Streams by Month</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={processedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(value) => (value / 1e9).toFixed(0) + "B"} />
            <Tooltip formatter={(value) => (value / 1e9).toFixed(2) + "B streams"} />
            <Legend />
            <Bar dataKey="streams" fill="#1db954" name="Spotify Streams" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
