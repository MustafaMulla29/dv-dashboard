'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold mb-4 text-gray-900">
          Spotify Data Visualization
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Explore insights from the most streamed Spotify songs of 2024
        </p>
        <Link 
          href="/dashboard"
          className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
        >
          View Dashboard →
        </Link>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-6 border border-gray-200 rounded-lg">
            <div className="text-3xl mb-2">📊</div>
            <h3 className="font-semibold text-lg mb-2">16 Charts</h3>
            <p className="text-sm text-gray-600">Comprehensive visualizations covering streams, rankings, and trends</p>
          </div>
          <div className="p-6 border border-gray-200 rounded-lg">
            <div className="text-3xl mb-2">🎵</div>
            <h3 className="font-semibold text-lg mb-2">Real Data</h3>
            <p className="text-sm text-gray-600">Actual Spotify streaming data from Kaggle dataset</p>
          </div>
          <div className="p-6 border border-gray-200 rounded-lg">
            <div className="text-3xl mb-2">💡</div>
            <h3 className="font-semibold text-lg mb-2">Interactive</h3>
            <p className="text-sm text-gray-600">Hover over charts for detailed information and insights</p>
          </div>
        </div>
      </div>
    </div>
  );
}
