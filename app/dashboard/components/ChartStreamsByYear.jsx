"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function ChartStreamsByYear({ data }) {
  const yearStreams = {};
  
  data.forEach(row => {
    if (row["Release Date"] && row["Spotify Streams"]) {
      const year = new Date(row["Release Date"]).getFullYear();
      const streams = parseInt(row["Spotify Streams"].replace(/,/g, "")) || 0;
      yearStreams[year] = (yearStreams[year] || 0) + streams;
    }
  });

  const processedData = Object.entries(yearStreams)
    .map(([year, streams]) => ({ year: parseInt(year), streams }))
    .filter(item => item.year >= 2015 && item.year <= 2024)
    .sort((a, b) => a.year - b.year);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Spotify Streams by Year</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={processedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis tickFormatter={(value) => (value / 1e9).toFixed(0) + "B"} />
            <Tooltip formatter={(value) => (value / 1e9).toFixed(2) + "B streams"} />
            <Legend />
            <Line type="monotone" dataKey="streams" stroke="#1db954" strokeWidth={2} dot={{ r: 5 }} name="Spotify Streams" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
