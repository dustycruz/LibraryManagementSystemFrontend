import { Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { getAvailabilityBadge } from '../../utils/helpers';

export default function BookTable({ books, onDelete, onBorrow, loading }) {
  const { isAdminOrLibrarian } = useAuth();

  if (loading) return <div className="text-center p-4"><div className="spinner-border text-primary" /></div>;

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle bg-white">
        <thead className="table-light">
          <tr>
            <th>ISBN</th>
            <th>Title</th>
            <th>Author</th>
            <th>Category</th>
            <th>Available</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.length === 0 ? (
            <tr><td colSpan={6} className="text-center text-muted py-4">No books found.</td></tr>
          ) : books.map(book => (
            <tr key={book.bookId}>
              <td><small className="text-muted">{book.isbn}</small></td>
              <td>
                <div className="fw-semibold">{book.title}</div>
                {book.publisher && <small className="text-muted">{book.publisher}</small>}
              </td>
              <td>{book.author}</td>
              <td><span className="badge bg-secondary">{book.categoryName}</span></td>
              <td>
                <span className={`badge ${getAvailabilityBadge(book.availableCopies)}`}>
                  {book.availableCopies}/{book.totalCopies}
                </span>
              </td>
              <td>
                <div className="d-flex gap-1">
                  {book.availableCopies > 0 && (
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => onBorrow(book)}
                    >
                      Borrow
                    </button>
                  )}
                  {isAdminOrLibrarian() && (
                    <>
                      <Link to={`/books/edit/${book.bookId}`} className="btn btn-sm btn-outline-warning">
                        Edit
                      </Link>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => onDelete(book.bookId)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}