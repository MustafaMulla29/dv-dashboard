"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function ChartRankVsStreams({ data }) {
  const processedData = data
    .filter(row => row["All Time Rank"] && row["Spotify Streams"])
    .map(row => ({
      rank: parseInt(row["All Time Rank"]) || 0,
      streams: parseInt(row["Spotify Streams"].replace(/,/g, "")) || 0,
      track: row.Track,
    }))
    .filter(item => item.rank > 0 && item.streams > 0)
    .slice(0, 100);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Rank vs Spotify Streams</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              type="number" 
              dataKey="rank" 
              name="All Time Rank" 
              reversed
            />
            <YAxis 
              type="number" 
              dataKey="streams" 
              name="Spotify Streams" 
              tickFormatter={(value) => (value / 1e9).toFixed(1) + "B"}
            />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              formatter={(value, name) => name === "streams" ? (value / 1e9).toFixed(2) + "B" : value}
            />
            <Legend />
            <Scatter name="Rank vs Streams" data={processedData} fill="#1db954" />
          </ScatterChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
