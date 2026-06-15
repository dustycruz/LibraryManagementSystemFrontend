import { formatDate, formatCurrency, getStatusBadge } from '../../utils/helpers';
import { useAuth } from '../../context/useAuth';

export default function BorrowTable({ borrows, onReturn, loading }) {
  const { isAdminOrLibrarian } = useAuth();

  if (loading) return (
    <div className="text-center p-4">
      <div className="spinner-border text-primary" />
    </div>
  );

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle bg-white">
        <thead className="table-light">
          <tr>
            <th>#</th>
            {isAdminOrLibrarian() && <th>Member</th>}
            <th>Book</th>
            <th>Borrowed</th>
            <th>Due Date</th>
            <th>Status</th>
            <th>Fine</th>
            {isAdminOrLibrarian() && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {borrows.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center text-muted py-4">
                No records found.
              </td>
            </tr>
          ) : borrows.map(b => (
            <tr key={b.borrowId}>
              <td><small>{b.borrowId}</small></td>

              {isAdminOrLibrarian() && (
                <td>
                  <div className="fw-semibold">{b.memberName}</div>
                  <small className="text-muted">{b.memberEmail}</small>
                </td>
              )}

              <td>
                <div className="fw-semibold">{b.bookTitle}</div>
                <small className="text-muted">{b.bookISBN}</small>
              </td>

              <td>{formatDate(b.borrowDate)}</td>

              <td>
                <span className={b.daysOverdue > 0 && b.status !== 'Returned' ? 'text-danger fw-bold' : ''}>
                  {formatDate(b.dueDate)}
                </span>
                {b.daysOverdue > 0 && b.status !== 'Returned' && (
                  <div>
                    <small className="text-danger">{b.daysOverdue} days overdue</small>
                  </div>
                )}
              </td>

              <td>
                <span className={`badge ${getStatusBadge(b.status)}`}>
                  {b.status}
                </span>
              </td>

              <td>
                {b.fineAmount > 0 ? (
                  <span className={b.fineIsPaid ? 'text-success' : 'text-danger'}>
                    {formatCurrency(b.fineAmount)}
                    {b.fineIsPaid ? ' ✓' : ' ✗'}
                  </span>
                ) : '-'}
              </td>

              {isAdminOrLibrarian() && (
                <td>
                  {b.status !== 'Returned' ? (
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => {
                        if (window.confirm(`Return "${b.bookTitle}"?`)) {
                          onReturn(b.borrowId);
                        }
                      }}
                    >
                      Return
                    </button>
                  ) : (
                    <span className="text-muted small">—</span>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}