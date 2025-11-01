"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import dynamic from "next/dynamic";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

export default function ChartPlatformHeatmap({ data }) {
  const platforms = [
    { key: "Spotify Streams", label: "Spotify" },
    { key: "YouTube Views", label: "YouTube" },
    { key: "TikTok Views", label: "TikTok" },
    { key: "Apple Music Playlist Count", label: "Apple Music" },
  ];

  const calculateCorrelation = (arr1, arr2) => {
    const n = arr1.length;
    const mean1 = arr1.reduce((a, b) => a + b, 0) / n;
    const mean2 = arr2.reduce((a, b) => a + b, 0) / n;
    
    let numerator = 0;
    let denom1 = 0;
    let denom2 = 0;
    
    for (let i = 0; i < n; i++) {
      const diff1 = arr1[i] - mean1;
      const diff2 = arr2[i] - mean2;
      numerator += diff1 * diff2;
      denom1 += diff1 * diff1;
      denom2 += diff2 * diff2;
    }
    
    return numerator / Math.sqrt(denom1 * denom2);
  };

  const platformData = {};
  platforms.forEach(platform => {
    platformData[platform.key] = data
      .map(row => parseFloat(row[platform.key]?.replace(/,/g, "")) || 0)
      .filter(val => val > 0);
  });

  // Build correlation matrix
  const correlationMatrix = [];
  const labels = platforms.map(p => p.label);
  
  platforms.forEach((p1) => {
    const row = [];
    platforms.forEach((p2) => {
      if (p1.key === p2.key) {
        row.push(1);
      } else {
        const data1 = platformData[p1.key].slice(0, 100);
        const data2 = platformData[p2.key].slice(0, 100);
        const minLen = Math.min(data1.length, data2.length);
        row.push(calculateCorrelation(data1.slice(0, minLen), data2.slice(0, minLen)));
      }
    });
    correlationMatrix.push(row);
  });

  const trace = {
    z: correlationMatrix,
    x: labels,
    y: labels,
    type: "heatmap",
    colorscale: "RdYlGn",
    text: correlationMatrix.map(row => row.map(val => val.toFixed(2))),
    texttemplate: "%{text}",
    textfont: { size: 14 },
    showscale: true,
    colorbar: {
      title: "Correlation",
      tickmode: "linear",
      tick0: -1,
      dtick: 0.5,
    },
  };

  const layout = {
    xaxis: { title: "Platform", side: "bottom" },
    yaxis: { title: "Platform" },
    paper_bgcolor: "white",
    plot_bgcolor: "white",
    margin: { l: 100, r: 50, t: 20, b: 100 },
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Platform Correlation Heatmap</CardTitle>
      </CardHeader>
      <CardContent>
        <Plot
          data={[trace]}
          layout={layout}
          config={{ responsive: true }}
          style={{ width: "100%", height: "400px" }}
        />
      </CardContent>
    </Card>
  );
}
