import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, ResponsiveContainer } from 'recharts';
import { AlertTriangle, Shield, Activity, Coins, TrendingUp, Calendar, AlertCircle, CheckCircle, XCircle, Search, Loader } from 'lucide-react';

const WalletRiskAnalyzer = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const analyzeWallet = async () => {
    if (!walletAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      setError('Please enter a valid Ethereum address');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ wallet_address: walletAddress }),
  });

  if (!response.ok) {
    throw new Error('Analysis failed');
  }

  const data = await response.json();
  setAnalysis(data);
} catch (err) {
  setError('Failed to analyze wallet. Please try again.');
  console.error(err);
} finally {
  setLoading(false);
}
  }


  const getRiskColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getRiskBgColor = (score) => {
    if (score >= 80) return 'bg-green-100 border-green-300';
    if (score >= 60) return 'bg-yellow-100 border-yellow-300';
    if (score >= 40) return 'bg-orange-100 border-orange-300';
    return 'bg-red-100 border-red-300';
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  // Mock data generation for demo when backend is not available
  const generateMockData = () => {
    const mockData = {
      wallet_address: walletAddress.toLowerCase(),
      risk_analysis: {
        risk_score: Math.floor(Math.random() * 100),
        risk_level: ['Low Risk', 'Medium Risk', 'High Risk', 'Very High Risk'][Math.floor(Math.random() * 4)],
        wallet_age_days: Math.floor(Math.random() * 1000) + 1,
        total_transactions: Math.floor(Math.random() * 5000) + 10,
        token_diversity: Math.floor(Math.random() * 20) + 1,
        suspicious_interactions: Math.floor(Math.random() * 3),
        contract_approvals: Math.floor(Math.random() * 5),
        balance_eth: parseFloat((Math.random() * 100).toFixed(4)),
        warnings: ['Low transaction activity', 'New wallet warning'].slice(0, Math.floor(Math.random() * 3))
      },
      tx_summary: {
        first_transaction: '2023-01-15T10:30:00Z',
        last_transaction: '2024-12-01T15:45:00Z',
        total_volume_eth: parseFloat((Math.random() * 1000).toFixed(3)),
        average_tx_per_day: parseFloat((Math.random() * 10).toFixed(2))
      },
      token_distribution: [
        { name: 'ETH', symbol: 'ETH', percentage: 40, value_usd: 8000 },
        { name: 'USDC', symbol: 'USDC', percentage: 30, value_usd: 6000 },
        { name: 'USDT', symbol: 'USDT', percentage: 20, value_usd: 4000 },
        { name: 'WBTC', symbol: 'WBTC', percentage: 10, value_usd: 2000 }
      ],
      activity_timeline: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        tx_count: Math.floor(Math.random() * 10),
        volume_eth: parseFloat((Math.random() * 50).toFixed(3))
      })).reverse(),
      wallet_metadata: {
        analysis_timestamp: new Date().toISOString(),
        data_sources: ['Etherscan', 'Alchemy', 'CryptoScamDB'],
        component_scores: {
          wallet_age: 0.8,
          transaction_count: 0.7,
          token_diversity: 0.9,
          scam_interactions: 1.0,
          flash_loan_usage: 1.0,
          contract_approvals: 0.6,
          blacklist_match: 1.0
        }
      }
    };
    setAnalysis(mockData);
  };

  const handleDemoMode = () => {
    if (!walletAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      setWalletAddress('0x742d35Cc6634C0532925a3b8D362579bB2137c41');
    }
    generateMockData();
  };

  const radarData = analysis ? [
    { subject: 'Wallet Age', A: analysis.wallet_metadata.component_scores.wallet_age * 100, fullMark: 100 },
    { subject: 'Tx Count', A: analysis.wallet_metadata.component_scores.transaction_count * 100, fullMark: 100 },
    { subject: 'Token Diversity', A: analysis.wallet_metadata.component_scores.token_diversity * 100, fullMark: 100 },
    { subject: 'Scam Free', A: analysis.wallet_metadata.component_scores.scam_interactions * 100, fullMark: 100 },
    { subject: 'Flash Loans', A: analysis.wallet_metadata.component_scores.flash_loan_usage * 100, fullMark: 100 },
    { subject: 'Approvals', A: analysis.wallet_metadata.component_scores.contract_approvals * 100, fullMark: 100 }
  ] : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Shield className="text-blue-400" size={40} />
            Wallet Risk Analyzer
          </h1>
          <p className="text-gray-300 text-lg">Comprehensive blockchain wallet security assessment</p>
        </div>

        {/* Input Section */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-8 border border-white/20">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-white text-sm font-medium mb-2">
                Ethereum Wallet Address
              </label>
              <input
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="0x742d35Cc6634C0532925a3b8D362579bB2137c41"
                className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {error && (
                <p className="text-red-400 text-sm mt-2 flex items-center gap-2">
                  <AlertCircle size={16} />
                  {error}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={analyzeWallet}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? <Loader className="animate-spin" size={20} /> : <Search size={20} />}
                {loading ? 'Analyzing...' : 'Analyze'}
              </button>
              <button
                onClick={handleDemoMode}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-teal-700 transition-all duration-200"
              >
                Demo
              </button>
            </div>
          </div>
        </div>

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-8">
            {/* Risk Score Card */}
            <div className={`${getRiskBgColor(analysis.risk_analysis.risk_score)} backdrop-blur-md rounded-xl p-6 border-2`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <Shield size={28} />
                  Risk Assessment
                </h2>
                <div className="text-right">
                  <div className={`text-4xl font-bold ${getRiskColor(analysis.risk_analysis.risk_score)}`}>
                    {analysis.risk_analysis.risk_score}/100
                  </div>
                  <div className={`text-lg font-semibold ${getRiskColor(analysis.risk_analysis.risk_score)}`}>
                    {analysis.risk_analysis.risk_level}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-white/50 rounded-lg p-3">
                  <div className="text-sm text-gray-600">Wallet Age</div>
                  <div className="text-lg font-semibold">{analysis.risk_analysis.wallet_age_days} days</div>
                </div>
                <div className="bg-white/50 rounded-lg p-3">
                  <div className="text-sm text-gray-600">Total Transactions</div>
                  <div className="text-lg font-semibold">{analysis.risk_analysis.total_transactions.toLocaleString()}</div>
                </div>
                <div className="bg-white/50 rounded-lg p-3">
                  <div className="text-sm text-gray-600">Token Diversity</div>
                  <div className="text-lg font-semibold">{analysis.risk_analysis.token_diversity} tokens</div>
                </div>
                <div className="bg-white/50 rounded-lg p-3">
                  <div className="text-sm text-gray-600">Balance</div>
                  <div className="text-lg font-semibold">{analysis.risk_analysis.balance_eth} ETH</div>
                </div>
              </div>

              {analysis.risk_analysis.warnings.length > 0 && (
                <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4">
                  <h3 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                    <AlertTriangle size={20} />
                    Warnings
                  </h3>
                  <ul className="space-y-1">
                    {analysis.risk_analysis.warnings.map((warning, index) => (
                      <li key={index} className="text-yellow-700 text-sm flex items-center gap-2">
                        <XCircle size={16} />
                        {warning}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Activity Timeline */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Activity size={24} />
                  Activity Timeline
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analysis.activity_timeline}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                    <XAxis dataKey="date" stroke="#ffffff80" fontSize={12} />
                    <YAxis stroke="#ffffff80" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.8)', 
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px',
                        color: 'white'
                      }} 
                    />
                    <Legend />
                    <Line type="monotone" dataKey="tx_count" stroke="#8884d8" strokeWidth={2} name="Transactions" />
                    <Line type="monotone" dataKey="volume_eth" stroke="#82ca9d" strokeWidth={2} name="Volume (ETH)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Token Distribution */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Coins size={24} />
                  Token Distribution
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analysis.token_distribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name} ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="percentage"
                    >
                      {analysis.token_distribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.8)', 
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px',
                        color: 'white'
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Risk Profile Radar */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <TrendingUp size={24} />
                  Risk Profile
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#ffffff30" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'white', fontSize: 10 }} />
                    <PolarRadiusAxis 
                      angle={45} 
                      domain={[0, 100]} 
                      tick={{ fill: 'white', fontSize: 10 }} 
                    />
                    <Radar
                      name="Risk Factors"
                      dataKey="A"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.8)', 
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px',
                        color: 'white'
                      }} 
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Transaction Summary */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Calendar size={24} />
                  Transaction Summary
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">First Transaction:</span>
                    <span className="text-white font-mono text-sm">
                      {new Date(analysis.tx_summary.first_transaction).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Last Transaction:</span>
                    <span className="text-white font-mono text-sm">
                      {new Date(analysis.tx_summary.last_transaction).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Total Volume:</span>
                    <span className="text-white font-semibold">
                      {analysis.tx_summary.total_volume_eth} ETH
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Avg Tx/Day:</span>
                    <span className="text-white font-semibold">
                      {analysis.tx_summary.average_tx_per_day}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Metrics */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <AlertTriangle size={24} />
                Security Metrics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/10 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-red-400 mb-2">
                    {analysis.risk_analysis.suspicious_interactions}
                  </div>
                  <div className="text-gray-300 text-sm">Suspicious Interactions</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-orange-400 mb-2">
                    {analysis.risk_analysis.contract_approvals}
                  </div>
                  <div className="text-gray-300 text-sm">Risky Approvals</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-400 mb-2">
                    {analysis.risk_analysis.risk_score >= 80 ? '✓' : analysis.risk_analysis.risk_score >= 60 ? '⚠' : '✗'}
                  </div>
                  <div className="text-gray-300 text-sm">Overall Status</div>
                </div>
              </div>
            </div>

            {/* Footer Info */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h4 className="text-white font-semibold mb-2">Analysis Details</h4>
                  <p className="text-gray-300 text-sm">
                    Analyzed: {new Date(analysis.wallet_metadata.analysis_timestamp).toLocaleString()}
                  </p>
                  <p className="text-gray-300 text-sm">
                    Data Sources: {analysis.wallet_metadata.data_sources.join(', ')}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle size={20} />
                  <span className="text-sm">Analysis Complete</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!analysis && !loading && (
          <div className="text-center py-16">
            <Shield className="mx-auto text-gray-500 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              Ready to Analyze
            </h3>
            <p className="text-gray-500">
              Enter an Ethereum wallet address to get started with risk analysis
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletRiskAnalyzer;
                  