"use client";

import { useState, useEffect } from "react";
import Papa from "papaparse";

// Import all chart components
import ChartTop10Songs from "./components/ChartTop10Songs";
import ChartTop10Artists from "./components/ChartTop10Artists";
import ChartStreamsByYear from "./components/ChartStreamsByYear";
import ChartPlatformCorrelation from "./components/ChartPlatformCorrelation";
import ChartStreamsByMonth from "./components/ChartStreamsByMonth";
import ChartTop10ArtistsByMonth from "./components/ChartTop10ArtistsByMonth";
import ChartRankVsStreams from "./components/ChartRankVsStreams";
import ChartBoxPlotStreams from "./components/ChartBoxPlotStreams";
import ChartStreamsVsRankByYear from "./components/ChartStreamsVsRankByYear";
import ChartPlatformHeatmap from "./components/ChartPlatformHeatmap";
import ChartMonthlyTrend2024 from "./components/ChartMonthlyTrend2024";
import ChartTop5ArtistsTrend from "./components/ChartTop5ArtistsTrend";
import ChartMostStreamedByMonth from "./components/ChartMostStreamedByMonth";
import ChartArtistPopularityHeatmap from "./components/ChartArtistPopularityHeatmap";
import ChartDurationTrend from "./components/ChartDurationTrend";
import ChartStreamsPieChart from "./components/ChartStreamsPieChart";

export default function DashboardPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/Most_Streamed_Spotify_Songs_2024.csv");
        
        if (!response.ok) {
          throw new Error("Failed to fetch CSV file");
        }
        
        const text = await response.text();
        const result = Papa.parse(text, { 
          header: true,
          skipEmptyLines: true,
          dynamicTyping: false,
        });
        
        if (result.errors.length > 0) {
          console.warn("CSV parsing warnings:", result.errors);
        }
        
        setData(result.data);
        setLoading(false);
      } catch (err) {
        console.error("Error loading data:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-green-600 border-r-transparent"></div>
          <p className="mt-4 text-lg text-gray-600">Loading Spotify Data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <p className="text-xl text-red-600">Error loading data: {error}</p>
          <p className="mt-2 text-sm text-gray-500">Please check the CSV file location</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 py-6">
          <h1 className="text-4xl font-bold text-gray-900">
            Spotify Data Visualization Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Exploratory Data Analysis of Most Streamed Spotify Songs 2024
          </p>
          <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
            <span>📊 Total Songs: {data.length.toLocaleString()}</span>
            <span>•</span>
            <span>📅 Dataset: Most Streamed Spotify Songs 2024</span>
            <span>•</span>
            <span>🎵 Source: Kaggle</span>
          </div>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="max-w-[1600px] mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Top 10 Most Streamed Songs */}
          <ChartTop10Songs data={data} />

          {/* Chart 2: Top 10 Artists by Streams */}
          <ChartTop10Artists data={data} />

          {/* Chart 3: Spotify Streams by Year */}
          <ChartStreamsByYear data={data} />

          {/* Chart 4: Platform Correlation */}
          <ChartPlatformCorrelation data={data} />

          {/* Chart 5: Total Spotify Streams by Month */}
          <ChartStreamsByMonth data={data} />

          {/* Chart 6: Top 10 Artists by Total Spotify Streams */}
          <ChartTop10ArtistsByMonth data={data} />

          {/* Chart 7: Rank vs Spotify Streams */}
          <ChartRankVsStreams data={data} />

          {/* Chart 8: Distribution of Streams per Month */}
          <ChartBoxPlotStreams data={data} />

          {/* Chart 9: Streams vs Rank by Year */}
          <ChartStreamsVsRankByYear data={data} />

          {/* Chart 10: Platform Correlation Heatmap */}
          <ChartPlatformHeatmap data={data} />

          {/* Chart 11: Total Spotify Streams per Month (2024) */}
          <ChartMonthlyTrend2024 data={data} />

          {/* Chart 12: Top 5 Artists Monthly Trend */}
          <ChartTop5ArtistsTrend data={data} />

          {/* Chart 13: Most Streamed Song Each Month */}
          <ChartMostStreamedByMonth data={data} />

          {/* Chart 14: Top 10 Artists Popularity by Month */}
          <div className="lg:col-span-2">
            <ChartArtistPopularityHeatmap data={data} />
          </div>

          {/* Chart 15: Trending Duration of Top 10 Songs Across Months */}
          <ChartDurationTrend data={data} />

          {/* Chart 16: Share of Total Streams by Month */}
          <ChartStreamsPieChart data={data} />
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-[1600px] mx-auto px-6 py-6 text-center text-sm text-gray-500">
          <p>Built with Next.js 14, Tailwind CSS, Shadcn UI, and Recharts</p>
          <p className="mt-1">Data Source: Most Streamed Spotify Songs 2024 (Kaggle)</p>
        </div>
      </div>
    </div>
  );
}
