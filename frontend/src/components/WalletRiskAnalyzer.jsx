import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, ResponsiveContainer } from 'recharts';
import { AlertTriangle, Shield, Activity, Coins, TrendingUp, Calendar, AlertCircle, CheckCircle, XCircle, Search, Loader } from 'lucide-react';
import './WalletRiskAnalyzer.css';

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
    if (score >= 80) return 'risk-low';
    if (score >= 60) return 'risk-medium';
    if (score >= 40) return 'risk-high';
    return 'risk-critical';
  };

  const getRiskBgColor = (score) => {
    if (score >= 80) return 'risk-bg-low';
    if (score >= 60) return 'risk-bg-medium';
    if (score >= 40) return 'risk-bg-high';
    return 'risk-bg-critical';
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
    <div className="wallet-analyzer">
      <div className="container">
        {/* Header */}
        <div className="header">
          <h1 className="title">
            <Shield className="title-icon" size={40} />
            ScoreBloc
          </h1>
          <p className="subtitle">Comprehensive blockchain wallet security assessment</p>
        </div>

        {/* Input Section */}
        <div className="input-section">
          <div className="input-wrapper">
            <div className="input-group">
              <label className="input-label">
                Ethereum Wallet Address
              </label>
              <input
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="0x742d35Cc6634C0532925a3b8D362579bB2137c41"
                className="wallet-input"
              />
              {error && (
                <p className="error-message">
                  <AlertCircle size={16} />
                  {error}
                </p>
              )}
            </div>
            <div className="button-group">
              <button
                onClick={analyzeWallet}
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? <Loader className="btn-icon animate-spin" size={20} /> : <Search size={20} />}
                {loading ? 'Analyzing...' : 'Analyze'}
              </button>
              <button
                onClick={handleDemoMode}
                className="btn btn-demo"
              >
                Demo
              </button>
            </div>
          </div>
        </div>

        {/* Analysis Results */}
        {analysis && (
          <div className="results-section">
            {/* Risk Score Card */}
            <div className={`risk-card ${getRiskBgColor(analysis.risk_analysis.risk_score)}`}>
              <div className="risk-header">
                <h2 className="risk-title">
                  <Shield size={28} />
                  Risk Assessment
                </h2>
                <div className="risk-score-display">
                  <div className={`risk-score ${getRiskColor(analysis.risk_analysis.risk_score)}`}>
                    {analysis.risk_analysis.risk_score}/100
                  </div>
                  <div className={`risk-level ${getRiskColor(analysis.risk_analysis.risk_score)}`}>
                    {analysis.risk_analysis.risk_level}
                  </div>
                </div>
              </div>
              
              <div className="metrics-grid">
                <div className="metric-card">
                  <div className="metric-label">Wallet Age</div>
                  <div className="metric-value">{analysis.risk_analysis.wallet_age_days} days</div>
                </div>
                <div className="metric-card">
                  <div className="metric-label">Total Transactions</div>
                  <div className="metric-value">{analysis.risk_analysis.total_transactions.toLocaleString()}</div>
                </div>
                <div className="metric-card">
                  <div className="metric-label">Token Diversity</div>
                  <div className="metric-value">{analysis.risk_analysis.token_diversity} tokens</div>
                </div>
                <div className="metric-card">
                  <div className="metric-label">Balance</div>
                  <div className="metric-value">{analysis.risk_analysis.balance_eth} ETH</div>
                </div>
              </div>

              {analysis.risk_analysis.warnings.length > 0 && (
                <div className="warnings-section">
                  <h3 className="warnings-title">
                    <AlertTriangle size={20} />
                    Warnings
                  </h3>
                  <ul className="warnings-list">
                    {analysis.risk_analysis.warnings.map((warning, index) => (
                      <li key={index} className="warning-item">
                        <XCircle size={16} />
                        {warning}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Charts Grid */}
            <div className="charts-grid">
              {/* Activity Timeline */}
              <div className="chart-card">
                <h3 className="chart-title">
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
              <div className="chart-card">
                <h3 className="chart-title">
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
              <div className="chart-card">
                <h3 className="chart-title">
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
              <div className="chart-card">
                <h3 className="chart-title">
                  <Calendar size={24} />
                  Transaction Summary
                </h3>
                <div className="summary-content">
                  <div className="summary-row">
                    <span className="summary-label">First Transaction:</span>
                    <span className="summary-value">
                      {new Date(analysis.tx_summary.first_transaction).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="summary-row">
                    <span className="summary-label">Last Transaction:</span>
                    <span className="summary-value">
                      {new Date(analysis.tx_summary.last_transaction).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="summary-row">
                    <span className="summary-label">Total Volume:</span>
                    <span className="summary-value summary-highlight">
                      {analysis.tx_summary.total_volume_eth} ETH
                    </span>
                  </div>
                  <div className="summary-row">
                    <span className="summary-label">Avg Tx/Day:</span>
                    <span className="summary-value summary-highlight">
                      {analysis.tx_summary.average_tx_per_day}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Metrics */}
            <div className="security-metrics">
              <h3 className="section-title">
                <AlertTriangle size={24} />
                Security Metrics
              </h3>
              <div className="security-grid">
                <div className="security-metric">
                  <div className="security-value security-critical">
                    {analysis.risk_analysis.suspicious_interactions}
                  </div>
                  <div className="security-label">Suspicious Interactions</div>
                </div>
                <div className="security-metric">
                  <div className="security-value security-warning">
                    {analysis.risk_analysis.contract_approvals}
                  </div>
                  <div className="security-label">Risky Approvals</div>
                </div>
                <div className="security-metric">
                  <div className="security-value security-status">
                    {analysis.risk_analysis.risk_score >= 80 ? '✓' : analysis.risk_analysis.risk_score >= 60 ? '⚠' : '✗'}
                  </div>
                  <div className="security-label">Overall Status</div>
                </div>
              </div>
            </div>

            {/* Footer Info */}
            <div className="footer-info">
              <div className="footer-content">
                <div className="analysis-details">
                  <h4 className="footer-title">Analysis Details</h4>
                  <p className="footer-text">
                    Analyzed: {new Date(analysis.wallet_metadata.analysis_timestamp).toLocaleString()}
                  </p>
                  <p className="footer-text">
                    Data Sources: {analysis.wallet_metadata.data_sources.join(', ')}
                  </p>
                </div>
                <div className="status-indicator">
                  <CheckCircle size={20} />
                  <span className="status-text">Analysis Complete</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!analysis && !loading && (
          <div className="empty-state">
            <Shield className="empty-icon" size={64} />
            <h3 className="empty-title">
              Ready to Analyze
            </h3>
            <p className="empty-description">
              Enter an Ethereum wallet address to get started with risk analysis
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletRiskAnalyzer;