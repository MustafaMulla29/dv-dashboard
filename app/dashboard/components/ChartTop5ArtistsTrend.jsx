"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function ChartTop5ArtistsTrend({ data }) {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  // Get top 5 artists by total streams
  const artistStreams = {};
  data.forEach(row => {
    if (row.Artist && row["Spotify Streams"]) {
      const artist = row.Artist;
      const streams = parseInt(row["Spotify Streams"].replace(/,/g, "")) || 0;
      artistStreams[artist] = (artistStreams[artist] || 0) + streams;
    }
  });

  const top5Artists = Object.entries(artistStreams)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([artist]) => artist);

  // Get monthly trends for top 5 artists
  const monthlyData = {};
  data.forEach(row => {
    if (row.Artist && row["Release Date"] && row["Spotify Streams"] && top5Artists.includes(row.Artist)) {
      const date = new Date(row["Release Date"]);
      const month = date.getMonth();
      const artist = row.Artist;
      const streams = parseInt(row["Spotify Streams"].replace(/,/g, "")) || 0;
      
      if (!monthlyData[month]) monthlyData[month] = { month: monthNames[month], monthNum: month };
      monthlyData[month][artist] = (monthlyData[month][artist] || 0) + streams;
    }
  });

  const processedData = Object.values(monthlyData).sort((a, b) => a.monthNum - b.monthNum);
  const colors = ["#1db954", "#1ed760", "#4ade80", "#86efac", "#bbf7d0"];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Top 5 Artists Monthly Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={processedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(value) => (value / 1e9).toFixed(1) + "B"} />
            <Tooltip formatter={(value) => (value / 1e9).toFixed(2) + "B streams"} />
            <Legend />
            {top5Artists.map((artist, idx) => (
              <Line 
                key={artist}
                type="monotone" 
                dataKey={artist} 
                stroke={colors[idx]} 
                strokeWidth={2} 
                dot={{ r: 4 }} 
                name={artist}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
