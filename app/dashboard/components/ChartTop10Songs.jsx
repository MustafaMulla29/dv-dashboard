"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function ChartTop10Songs({ data }) {
  const processedData = data
    .filter(row => row.Track && row["Spotify Streams"])
    .map(row => ({
      track: row.Track,
      streams: parseInt(row["Spotify Streams"].replace(/,/g, "")) || 0,
    }))
    .sort((a, b) => b.streams - a.streams)
    .slice(0, 10)
    .reverse();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Top 10 Most Streamed Songs</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={processedData} layout="vertical" margin={{ left: 150 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" tickFormatter={(value) => (value / 1e9).toFixed(1) + "B"} />
            <YAxis type="category" dataKey="track" width={140} />
            <Tooltip formatter={(value) => (value / 1e9).toFixed(2) + "B streams"} />
            <Legend />
            <Bar dataKey="streams" fill="#1db954" name="Spotify Streams" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
