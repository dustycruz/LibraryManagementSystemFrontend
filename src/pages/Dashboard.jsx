import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import StatCard from '../components/dashboard/StatCard';
import { BorrowBarChart } from '../components/dashboard/BorrowChart';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getDashboardStats, getMostBorrowed } from '../api/reportsApi';
import { formatCurrency } from '../utils/helpers';
import { useAuth } from '../context/useAuth';

export default function Dashboard() {
  const { isAdminOrLibrarian } = useAuth();
  const [stats, setStats] = useState(null);
  const [topBooks, setTopBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, booksRes] = await Promise.all([
          getDashboardStats(),
          getMostBorrowed(10),
        ]);
        setStats(statsRes.data.data);
        setTopBooks(booksRes.data.data);
      } catch {
        toast.error('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#003f7f', marginBottom: '8px' }}>
          Dashboard
        </h1>
        <p style={{ fontSize: '14px', color: '#6c757d' }}>
          Welcome back! Here's what's happening with your library today.
        </p>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          <StatCard title="📚 Total Books" value={stats.totalBooks} color="#003f7f" />
          <StatCard title="✅ Available Copies" value={stats.totalAvailableCopies} color="#10b981" />
          <StatCard title="🔄 Active Borrows" value={stats.activeBorrows} color="#06b6d4" />
          <StatCard title="⚠️ Overdue" value={stats.overdueCount} color="#f59e0b" />
          <StatCard title="👥 Active Users" value={stats.totalActiveUsers} color="#8b5cf6" />
          {isAdminOrLibrarian() && (
            <StatCard title="💰 Unpaid Fines" value={formatCurrency(stats.totalUnpaidFines)} color="#ef4444" />
          )}
        </div>
      )}

      {/* Chart Section */}
      {topBooks.length > 0 && (
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 63, 127, 0.12)',
          overflow: 'hidden',
        }}>
          <div style={{
            padding: '24px',
            borderBottom: '1px solid #e8eaed',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            <span style={{ fontSize: '24px' }}>📊</span>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#003f7f', margin: 0 }}>
              Top 10 Most Borrowed Books
            </h2>
          </div>
          <div style={{ padding: '24px' }}>
            <BorrowBarChart data={topBooks} />
          </div>
        </div>
      )}
    </div>
  );
}
