"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import dynamic from "next/dynamic";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

export default function ChartBoxPlotStreams({ data }) {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthData = {};

  data.forEach(row => {
    if (row["Release Date"] && row["Spotify Streams"]) {
      const date = new Date(row["Release Date"]);
      const month = date.getMonth();
      const streams = parseInt(row["Spotify Streams"].replace(/,/g, "")) || 0;
      
      if (!monthData[month]) monthData[month] = [];
      monthData[month].push(streams);
    }
  });

  // Create box plot traces for each month
  const traces = Object.entries(monthData)
    .sort(([a], [b]) => parseInt(a) - parseInt(b))
    .map(([month, streams]) => ({
      y: streams,
      type: "box",
      name: monthNames[parseInt(month)],
      boxmean: "sd",
      marker: { color: "#1db954" },
    }));

  const layout = {
    yaxis: { 
      title: "Spotify Streams",
      tickformat: ".2s"
    },
    xaxis: { title: "Month" },
    showlegend: false,
    paper_bgcolor: "white",
    plot_bgcolor: "white",
    margin: { l: 60, r: 20, t: 20, b: 60 },
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Distribution of Streams per Month</CardTitle>
      </CardHeader>
      <CardContent>
        <Plot
          data={traces}
          layout={layout}
          config={{ responsive: true }}
          style={{ width: "100%", height: "400px" }}
        />
      </CardContent>
    </Card>
  );
}
