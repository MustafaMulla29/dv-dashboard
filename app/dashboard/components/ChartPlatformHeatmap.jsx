"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

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

  const correlations = {};
  platforms.forEach((p1, i) => {
    platforms.forEach((p2, j) => {
      const key = `${p1.label}-${p2.label}`;
      if (i === j) {
        correlations[key] = 1;
      } else {
        const data1 = platformData[p1.key].slice(0, 100);
        const data2 = platformData[p2.key].slice(0, 100);
        const minLen = Math.min(data1.length, data2.length);
        correlations[key] = calculateCorrelation(data1.slice(0, minLen), data2.slice(0, minLen));
      }
    });
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Platform Correlation Heatmap</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2 bg-gray-50"></th>
                {platforms.map(p => (
                  <th key={p.label} className="border p-2 bg-gray-50 text-sm">{p.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {platforms.map(p1 => (
                <tr key={p1.label}>
                  <td className="border p-2 bg-gray-50 font-medium text-sm">{p1.label}</td>
                  {platforms.map(p2 => {
                    const corr = correlations[`${p1.label}-${p2.label}`];
                    const intensity = Math.abs(corr);
                    const bgColor = corr >= 0 
                      ? `rgba(29, 185, 84, ${intensity})`
                      : `rgba(239, 68, 68, ${intensity})`;
                    
                    return (
                      <td 
                        key={p2.label}
                        className="border p-2 text-center text-sm font-medium"
                        style={{ backgroundColor: bgColor, color: intensity > 0.5 ? 'white' : 'black' }}
                      >
                        {corr.toFixed(2)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
