import React, { useEffect, useState, useCallback } from "react";
import { adminDeleteBook, adminGetAllBook } from "../../config/AxiosInstance";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { FiSettings } from "react-icons/fi"; // Importing settings icon

const DashboardBook = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProduct] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const { search } = useSelector((state) => state.search);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await adminGetAllBook();
      if (data?.data) {
        setProducts(data.data);
        setFilteredProduct(data?.data);
      }
    } catch (error) {
      console.error("Failed to fetch products", error);
      toast.error("Failed to fetch products");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDelete = async (id) => {
    console.log(id);
    const deleteProduct = confirm("Are you sure you want to delete this book?");
    if (deleteProduct) {
      try {
        const { data } = await adminDeleteBook(id);
        if (data.statusCode === 200) {
          toast.success(data.message);
          setRefresh(!refresh);
        } else {
          toast.error("Failed to delete product");
        }
      } catch (error) {
        console.error("Failed to delete book", error);
        toast.error("Failed to delete book");
      }
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [refresh]);

  const filteredProductItem = filteredProducts.filter((product) =>
    product.title.toLowerCase().includes(search?.toLowerCase())
  );

  useEffect(() => {
    if (search.trim() === "") {
      setFilteredProduct(products);
    } else {
      setFilteredProduct(filteredProductItem);
    }
  }, [search]);

  if (isLoading) {
    return (
      <div className="flex items-center text-2xl font-bold justify-center animate-pulse">
        Loading books...
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-gray-50">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Books</h1>
        <Link
          to="/dashboard/book/create"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow-md"
        >
          Add New Book
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts && filteredProducts.length !== 0 ? (
          filteredProducts.map((book) => (
            <div
              key={book._id}
              className="relative border border-gray-200 rounded-lg overflow-hidden shadow-lg bg-white transition hover:shadow-xl"
            >
              <Link
                to="/dashboard/books/setting"
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-100"
              >
                <FiSettings className="text-gray-600" />
              </Link>
              {book.coverImage && (
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-full h-40 object-cover"
                />
              )}
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800 truncate">
                  {book.title}
                </h2>
                <p className="text-gray-500 mb-1 truncate">
                  {book.author ? `Author: ${book.author}` : "No Author"}
                </p>
                <p className="text-sm text-green-600 font-medium">
                  {book.availability ? "Available" : "Not Available"}
                </p>
                <div className="flex justify-between mt-4">
                  <Link
                    to={`/dashboard/book/edit/${book._id}`}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg text-sm font-medium"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(book._id)}
                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-xl text-gray-500">
            No books found.
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardBook;
