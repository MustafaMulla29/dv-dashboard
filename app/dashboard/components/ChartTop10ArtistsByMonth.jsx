"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function ChartTop10ArtistsByMonth({ data }) {
  const artistStreams = {};
  
  data.forEach(row => {
    if (row.Artist && row["Spotify Streams"]) {
      const artist = row.Artist;
      const streams = parseInt(row["Spotify Streams"].replace(/,/g, "")) || 0;
      artistStreams[artist] = (artistStreams[artist] || 0) + streams;
    }
  });

  const processedData = Object.entries(artistStreams)
    .map(([artist, streams]) => ({ artist, streams }))
    .sort((a, b) => b.streams - a.streams)
    .slice(0, 10)
    .reverse();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Top 10 Artists by Total Spotify Streams</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={processedData} layout="vertical" margin={{ left: 100 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" tickFormatter={(value) => (value / 1e9).toFixed(1) + "B"} />
            <YAxis type="category" dataKey="artist" width={90} />
            <Tooltip formatter={(value) => (value / 1e9).toFixed(2) + "B streams"} />
            <Legend />
            <Bar dataKey="streams" fill="#1db954" name="Total Streams" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
