import React, { useEffect, useState } from 'react';
import { adminGetAllBook, requestApproval } from '../../config/AxiosInstance';
import toast from 'react-hot-toast';

const GetRequestApproval = () => {
  const [bookDetails, setBookDetails] = useState([]);
  const [statusUpdate, setStatusUpdate] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(10);

  // Fetch books on component mount
  const getBooks = async () => {
    const { data } = await adminGetAllBook();
    console.log(data, "BOOKS");
    if (data.statusCode !== 200) return;
    setBookDetails(data?.data);
  };

  // Handle status change and log bookId and userId
  const handleStatusChange = async (bookId,  newStatus) => {
    // Update the local state for the status
    setStatusUpdate((prev) => ({
      ...prev,
      [bookId]: newStatus,
    }));

    // Log selected status, bookId, and userId for debugging
    console.log('Selected Status:', newStatus);
    console.log('Book ID:', bookId);

    const {data} = await requestApproval({bookId,status:newStatus})
    console.log(data)
    if(data?.statusCode!==200) return
    toast.success(data?.message)

    // Here, you would send the updated status to the backend API
    // Example API call:
    // await updateBookStatus(bookId, userId, newStatus);
  };

  useEffect(() => {
    getBooks();
  }, [statusUpdate,bookDetails]);

  // Pagination logic
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = bookDetails.slice(indexOfFirstBook, indexOfLastBook);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Total pages calculation
  const totalPages = Math.ceil(bookDetails.length / booksPerPage);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold text-gray-900">Book Requests Pending Approval</h2>
          <span className="text-sm text-gray-500">
            Showing {currentBooks.length} out of {bookDetails.length} items
          </span>
        </div>
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 text-left text-sm font-medium text-gray-600">SN</th>
                <th className="px-3 py-2 text-left text-sm font-medium text-gray-600">Cover</th>
                <th className="px-3 py-2 text-left text-sm font-medium text-gray-600">Title & Genre</th>
                <th className="px-3 py-2 text-left text-sm font-medium text-gray-600">Requested by</th>
                <th className="px-3 py-2 text-left text-sm font-medium text-gray-600">Status</th>
                <th className="px-3 py-2 text-left text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentBooks.map((book, index) => (
                <tr key={book._id} className="border-b hover:bg-gray-50">
                  <td className="px-3 py-2 text-sm text-gray-800">{index + 1}</td> {/* Serial Number */}
                  <td className="px-3 py-2">
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-16 h-20 object-cover rounded-lg"
                    />
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-800">
                    <div>{book.title}</div>
                    <div className="text-gray-500 text-xs">{book.genre}</div>
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-500">{book?.borrowedBy?.username ? book.borrowedBy.username : "No request yet"}</td>
                  <td className="px-3 py-2 text-sm text-gray-600">
                    <div
                      className={`inline-block rounded-full px-4 py-2 text-xs font-semibold ${
                        book.borrowApprovalStatus === 'pending'
                          ? 'bg-yellow-200 text-yellow-800'
                          : book.borrowApprovalStatus === 'approved'
                          ? 'bg-green-200 text-green-800'
                          : 'bg-red-200 text-red-800'
                      }`}
                    >
                      {book.borrowApprovalStatus}
                    </div>
                  </td>
                  <td className="px-3 py-2 text-sm">
                    <select
                      className="px-3 py-1 text-sm border border-gray-300 rounded-lg"
                      value={statusUpdate[book._id] || book.borrowApprovalStatus}
                      onChange={(e) =>
                        handleStatusChange(book._id, e.target.value)
                      }
                    >
                      <option value="pending" >Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex justify-center">
          <button
            className="px-3 py-1 mx-2 text-sm text-gray-700 bg-gray-200 rounded-lg disabled:opacity-50"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          {/* Page Numbers */}
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
            <button
              key={pageNumber}
              className={`px-3 py-1 mx-1 text-sm rounded-lg ${
                pageNumber === currentPage
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
              onClick={() => handlePageChange(pageNumber)}
            >
              {pageNumber}
            </button>
          ))}
          <button
            className="px-3 py-1 mx-2 text-sm text-gray-700 bg-gray-200 rounded-lg disabled:opacity-50"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default GetRequestApproval;
