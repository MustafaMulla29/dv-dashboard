"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function ChartMostStreamedByMonth({ data }) {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlyTopSongs = {};

  data.forEach(row => {
    if (row["Release Date"] && row["Spotify Streams"] && row.Track) {
      const date = new Date(row["Release Date"]);
      const month = date.getMonth();
      const streams = parseInt(row["Spotify Streams"].replace(/,/g, "")) || 0;
      
      if (!monthlyTopSongs[month] || streams > monthlyTopSongs[month].streams) {
        monthlyTopSongs[month] = {
          month: monthNames[month],
          monthNum: month,
          track: row.Track,
          streams,
        };
      }
    }
  });

  const processedData = Object.values(monthlyTopSongs).sort((a, b) => a.monthNum - b.monthNum);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Most Streamed Song Each Month</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={processedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(value) => (value / 1e9).toFixed(0) + "B"} />
            <Tooltip 
              formatter={(value) => (value / 1e9).toFixed(2) + "B streams"}
              labelFormatter={(label, payload) => {
                if (payload && payload[0]) {
                  return `${label}: ${payload[0].payload.track}`;
                }
                return label;
              }}
            />
            <Legend />
            <Bar dataKey="streams" fill="#1db954" name="Streams" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
