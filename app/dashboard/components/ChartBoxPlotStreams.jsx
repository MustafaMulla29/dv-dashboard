"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function ChartBoxPlotStreams({ data }) {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthData = {};

  data.forEach(row => {
    if (row["Release Date"] && row["Spotify Streams"]) {
      const date = new Date(row["Release Date"]);
      const month = date.getMonth();
      const streams = parseInt(row["Spotify Streams"].replace(/,/g, "")) || 0;
      
      if (!monthData[month]) monthData[month] = [];
      monthData[month].push(streams);
    }
  });

  const processedData = Object.entries(monthData).map(([month, streams]) => {
    streams.sort((a, b) => a - b);
    const q1 = streams[Math.floor(streams.length * 0.25)];
    const median = streams[Math.floor(streams.length * 0.5)];
    const q3 = streams[Math.floor(streams.length * 0.75)];
    const min = streams[0];
    const max = streams[streams.length - 1];
    
    return {
      month: monthNames[parseInt(month)],
      monthNum: parseInt(month),
      min,
      q1,
      median,
      q3,
      max,
      avg: streams.reduce((a, b) => a + b, 0) / streams.length,
    };
  }).sort((a, b) => a.monthNum - b.monthNum);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Distribution of Streams per Month</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={processedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(value) => (value / 1e9).toFixed(1) + "B"} />
            <Tooltip formatter={(value) => (value / 1e9).toFixed(2) + "B streams"} />
            <Legend />
            <Bar dataKey="median" fill="#1db954" name="Median Streams" />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
