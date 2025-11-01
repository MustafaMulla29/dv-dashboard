"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

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

  // Find max value for scaling
  let maxStreams = 0;
  Object.values(artistMonthData).forEach(months => {
    Object.values(months).forEach(streams => {
      if (streams > maxStreams) maxStreams = streams;
    });
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Top 10 Artists Popularity by Month</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border p-2 bg-gray-50 sticky left-0 z-10">Artist</th>
                {monthNames.map(month => (
                  <th key={month} className="border p-2 bg-gray-50">{month}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {top10Artists.map(artist => (
                <tr key={artist}>
                  <td className="border p-2 bg-gray-50 font-medium sticky left-0 z-10 whitespace-nowrap">
                    {artist.length > 20 ? artist.substring(0, 17) + "..." : artist}
                  </td>
                  {monthNames.map((_, idx) => {
                    const streams = artistMonthData[artist][idx];
                    const intensity = streams / maxStreams;
                    const bgColor = `rgba(29, 185, 84, ${intensity})`;
                    
                    return (
                      <td 
                        key={idx}
                        className="border p-2 text-center"
                        style={{ 
                          backgroundColor: bgColor,
                          color: intensity > 0.5 ? 'white' : 'black'
                        }}
                        title={`${(streams / 1e9).toFixed(2)}B streams`}
                      >
                        {streams > 0 ? (streams / 1e9).toFixed(1) + "B" : "-"}
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
