import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import BorrowTable from '../components/borrow/BorrowTable';
import Pagination from '../components/common/Pagination';
import { getAllBorrows, returnBook } from '../api/borrowApi';

export default function ManageBorrows() {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const res = await getAllBorrows({ status: statusFilter || undefined, page, size: 15 });
        if (!cancelled) {
          const d = res.data.data;
          setBorrows(d.data);
          setTotalPages(d.totalPages);
          setTotalRecords(d.totalRecords);
        }
      } catch {
        if (!cancelled) toast.error('Failed to load borrows.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [page, statusFilter, refreshKey]);

  const handleReturn = async (borrowId) => {
    if (!window.confirm('Mark this book as returned?')) return;
    try {
      const res = await returnBook(borrowId);
      const borrow = res.data.data;
      if (borrow.fineAmount) {
        toast.warning(`Book returned. Fine: ₱${borrow.fineAmount.toFixed(2)} (${borrow.daysOverdue} days overdue)`);
      } else {
        toast.success('Book returned successfully!');
      }
      setRefreshKey(k => k + 1);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Return failed.');
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#003f7f', marginBottom: '8px' }}>
          🔄 Manage Borrows
        </h1>
        <p style={{ fontSize: '14px', color: '#6c757d', margin: 0 }}>
          Monitor and manage all book borrowing transactions
        </p>
      </div>

      {/* Filter Section */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px',
        boxShadow: '0 4px 12px rgba(0, 63, 127, 0.12)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '16px',
        flexWrap: 'wrap',
      }}>
        <p style={{ margin: 0, fontSize: '14px', color: '#6c757d', fontWeight: '600' }}>
          Filter by Status:
        </p>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          style={{
            padding: '8px 12px',
            fontSize: '14px',
            border: '1px solid #e8eaed',
            borderRadius: '8px',
            backgroundColor: '#ffffff',
            color: '#1a1a1a',
            cursor: 'pointer',
            outline: 'none',
          }}
          onFocus={(e) => (e.target.style.borderColor = '#003f7f')}
          onBlur={(e) => (e.target.style.borderColor = '#e8eaed')}
        >
          <option value="">All Status</option>
          <option value="Borrowed">Borrowed</option>
          <option value="Returned">Returned</option>
          <option value="Overdue">Overdue</option>
        </select>
      </div>

      {/* Borrows Table */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 63, 127, 0.12)',
        overflow: 'hidden',
      }}>
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #e8eaed',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#003f7f', margin: 0 }}>
            Borrow Records
          </h2>
          <span style={{ fontSize: '13px', color: '#6c757d', fontWeight: '600' }}>
            {totalRecords} total
          </span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <BorrowTable borrows={borrows} loading={loading} onReturn={handleReturn} />
        </div>
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #e8eaed',
          backgroundColor: '#fafbfc',
        }}>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>
    </div>
  );
}
