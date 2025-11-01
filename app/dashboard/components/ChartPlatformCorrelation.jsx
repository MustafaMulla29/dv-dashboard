"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function ChartPlatformCorrelation({ data }) {
  const processedData = data
    .filter(row => row["Spotify Streams"] && row["YouTube Views"])
    .map(row => ({
      spotify: parseInt(row["Spotify Streams"].replace(/,/g, "")) || 0,
      youtube: parseInt(row["YouTube Views"].replace(/,/g, "")) || 0,
      track: row.Track,
    }))
    .filter(item => item.spotify > 0 && item.youtube > 0)
    .slice(0, 100);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Platform Correlation (Spotify vs YouTube)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              type="number" 
              dataKey="spotify" 
              name="Spotify Streams" 
              tickFormatter={(value) => (value / 1e9).toFixed(1) + "B"}
            />
            <YAxis 
              type="number" 
              dataKey="youtube" 
              name="YouTube Views" 
              tickFormatter={(value) => (value / 1e9).toFixed(1) + "B"}
            />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              formatter={(value) => (value / 1e9).toFixed(2) + "B"}
            />
            <Legend />
            <Scatter name="Spotify vs YouTube" data={processedData} fill="#1db954" />
          </ScatterChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
