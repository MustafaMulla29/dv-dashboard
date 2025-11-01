"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function ChartStreamsVsRankByYear({ data }) {
  const years = [2022, 2023, 2024];
  const colors = ["#1db954", "#1ed760", "#4ade80"];
  
  const yearData = years.map((year, idx) => {
    const filtered = data
      .filter(row => {
        if (!row["Release Date"] || !row["All Time Rank"] || !row["Spotify Streams"]) return false;
        const releaseYear = new Date(row["Release Date"]).getFullYear();
        return releaseYear === year;
      })
      .map(row => ({
        rank: parseInt(row["All Time Rank"]) || 0,
        streams: parseInt(row["Spotify Streams"].replace(/,/g, "")) || 0,
      }))
      .filter(item => item.rank > 0 && item.streams > 0)
      .slice(0, 50);
    
    return { year, data: filtered, color: colors[idx] };
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Streams vs Rank by Year</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              type="number" 
              dataKey="rank" 
              name="Rank" 
              reversed
            />
            <YAxis 
              type="number" 
              dataKey="streams" 
              name="Streams" 
              tickFormatter={(value) => (value / 1e9).toFixed(1) + "B"}
            />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              formatter={(value, name) => name === "streams" ? (value / 1e9).toFixed(2) + "B" : value}
            />
            <Legend />
            {yearData.map((item, idx) => (
              <Scatter 
                key={item.year}
                name={`Year ${item.year}`}
                data={item.data}
                fill={item.color}
              />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
