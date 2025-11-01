"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import dynamic from "next/dynamic";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

export default function ChartArtistPopularityHeatmap({ data }) {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  // Get top 10 artists
  const artistStreams = {};
  data.forEach(row => {
    if (row.Artist && row["Spotify Streams"]) {
      const artist = row.Artist;
      const streams = parseInt(row["Spotify Streams"].replace(/,/g, "")) || 0;
      artistStreams[artist] = (artistStreams[artist] || 0) + streams;
    }
  });

  const top10Artists = Object.entries(artistStreams)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([artist]) => artist);

  // Get monthly data for top 10 artists
  const artistMonthData = {};
  top10Artists.forEach(artist => {
    artistMonthData[artist] = {};
    monthNames.forEach((_, idx) => {
      artistMonthData[artist][idx] = 0;
    });
  });

  data.forEach(row => {
    if (row.Artist && row["Release Date"] && row["Spotify Streams"] && top10Artists.includes(row.Artist)) {
      const date = new Date(row["Release Date"]);
      const month = date.getMonth();
      const artist = row.Artist;
      const streams = parseInt(row["Spotify Streams"].replace(/,/g, "")) || 0;
      artistMonthData[artist][month] += streams;
    }
  });

  // Build heatmap data
  const zData = top10Artists.map(artist => 
    monthNames.map((_, idx) => artistMonthData[artist][idx] / 1e9) // Convert to billions
  );

  const trace = {
    z: zData,
    x: monthNames,
    y: top10Artists,
    type: "heatmap",
    colorscale: "Greens",
    text: zData.map(row => row.map(val => val.toFixed(2) + "B")),
    texttemplate: "%{text}",
    textfont: { size: 10 },
    showscale: true,
    colorbar: {
      title: "Streams (B)",
    },
  };

  const layout = {
    xaxis: { title: "Month", side: "bottom" },
    yaxis: { title: "Artist" },
    paper_bgcolor: "white",
    plot_bgcolor: "white",
    margin: { l: 150, r: 50, t: 20, b: 80 },
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Top 10 Artists Popularity by Month</CardTitle>
      </CardHeader>
      <CardContent>
        <Plot
          data={[trace]}
          layout={layout}
          config={{ responsive: true }}
          style={{ width: "100%", height: "500px" }}
        />
      </CardContent>
    </Card>
  );
}
