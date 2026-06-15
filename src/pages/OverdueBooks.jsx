import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Pagination from '../components/common/Pagination';
import { getOverdueBooks } from '../api/reportsApi';
import { formatCurrency } from '../utils/helpers';

export default function OverdueBooks() {
  const [overdueBooks, setOverdueBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ pageNumber: 1, pageSize: 10, totalRecords: 0, totalPages: 1 });
  const [page, setPage] = useState(1);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const res = await getOverdueBooks();
        if (!cancelled) {
          console.log('Overdue books loaded:', res.data.data);
          setOverdueBooks(res.data.data);
          setPagination({
            pageNumber: 1,
            pageSize: 10,
            totalRecords: res.data.data.length,
            totalPages: Math.ceil(res.data.data.length / 10)
          });
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Full error:', err);
          console.error('Error response:', err.response?.data);
          const errorMsg = err.response?.data?.message || err.message || 'Failed to load overdue books.';
          toast.error(errorMsg);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []); // Only run once on mount

  if (loading) return <LoadingSpinner />;

  const startIdx = (page - 1) * 10;
  const endIdx = startIdx + 10;
  const paginatedData = overdueBooks.slice(startIdx, endIdx);

  return (
    <div>
      <h4 className="fw-bold mb-4">Overdue Books Report</h4>
      
      {overdueBooks.length === 0 ? (
        <div className="card shadow-sm">
          <div className="card-body text-center text-muted py-4">
            No overdue books found.
          </div>
        </div>
      ) : (
        <div className="card shadow-sm">
          <div className="card-header bg-white d-flex justify-content-between">
            <span className="fw-semibold">Overdue Books</span>
            <span className="text-muted small">{overdueBooks.length} records</span>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle bg-white mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Member Name</th>
                    <th>Email</th>
                    <th>Book Title</th>
                    <th>ISBN</th>
                    <th>Borrow Date</th>
                    <th>Due Date</th>
                    <th>Days Overdue</th>
                    <th>Fine Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map(record => (
                    <tr key={record.borrowId} className={record.fineIsPaid ? '' : 'table-warning'}>
                      <td className="fw-semibold">{record.memberName}</td>
                      <td>{record.email}</td>
                      <td>{record.bookTitle}</td>
                      <td><small className="text-muted">{record.isbn}</small></td>
                      <td>{new Date(record.borrowDate).toLocaleDateString()}</td>
                      <td>{new Date(record.dueDate).toLocaleDateString()}</td>
                      <td>
                        <span className="badge bg-danger">{record.daysOverdue}</span>
                      </td>
                      <td className="fw-semibold text-danger">{formatCurrency(record.fineAmount)}</td>
                      <td>
                        <span className={`badge ${record.fineIsPaid ? 'bg-success' : 'bg-danger'}`}>
                          {record.fineIsPaid ? 'Paid' : 'Unpaid'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="card-footer bg-white">
            <Pagination currentPage={page} totalPages={pagination.totalPages} onPageChange={setPage} />
          </div>
        </div>
      )}
    </div>
  );
}