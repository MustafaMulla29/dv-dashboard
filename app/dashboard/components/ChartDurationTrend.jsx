"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function ChartDurationTrend({ data }) {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  // Get top 10 songs
  const top10Songs = data
    .filter(row => row.Track && row["Spotify Streams"])
    .map(row => ({
      track: row.Track,
      streams: parseInt(row["Spotify Streams"].replace(/,/g, "")) || 0,
      releaseDate: row["Release Date"],
    }))
    .sort((a, b) => b.streams - a.streams)
    .slice(0, 10);

  // Get monthly stream counts for top 10 songs
  const monthlyData = {};
  monthNames.forEach((month, idx) => {
    monthlyData[idx] = { month, monthNum: idx, totalStreams: 0, count: 0 };
  });

  data.forEach(row => {
    if (row["Release Date"] && row.Track && row["Spotify Streams"]) {
      const isTop10 = top10Songs.some(song => song.track === row.Track);
      if (isTop10) {
        const date = new Date(row["Release Date"]);
        const month = date.getMonth();
        const streams = parseInt(row["Spotify Streams"].replace(/,/g, "")) || 0;
        
        monthlyData[month].totalStreams += streams;
        monthlyData[month].count += 1;
      }
    }
  });

  const processedData = Object.values(monthlyData)
    .map(item => ({
      ...item,
      avgStreams: item.count > 0 ? item.totalStreams / item.count : 0,
    }))
    .sort((a, b) => a.monthNum - b.monthNum);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Trending Duration of Top 10 Songs Across Months</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={processedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" tickFormatter={(value) => (value / 1e9).toFixed(1) + "B"} />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip 
              formatter={(value, name) => {
                if (name === "Total Streams" || name === "Avg Streams") {
                  return (value / 1e9).toFixed(2) + "B";
                }
                return value;
              }}
            />
            <Legend />
            <Bar yAxisId="left" dataKey="totalStreams" fill="#1db954" name="Total Streams" />
            <Line yAxisId="right" type="monotone" dataKey="count" stroke="#f97316" strokeWidth={2} name="Song Count" />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
