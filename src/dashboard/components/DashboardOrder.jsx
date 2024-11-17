import React, { useEffect, useState } from "react";
import { allOrders, deleteOrder, updateStatus } from "../../config/AxiosInstance";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { CiCircleChevDown } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import toast from "react-hot-toast";
import { options, statusStyles } from "../../constants/constants";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const DashboardOrder = () => {
  const { search } = useSelector((state) => state.search);
  const [orders, setOrders] = useState([]);
  const [filteredOrder, setFilteredOrder] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);  
  const [ordersPerPage] = useState(10); 
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();

  const getAllOrder = async () => {
    const { data } = await allOrders();
    if (data.statusCode !== 200) return;
    setOrders(data?.data);
    setFilteredOrder(data?.data);
  };

  const handleDeleteOrder = async (id) => {
    const confirmDelete = confirm("Are you sure you want to delete this order?");
    if (!confirmDelete) return;
    try {
      const { data } = await deleteOrder(id);
      if (data?.statusCode !== 200) return;
      toast.success(data?.message);
      setRefresh(!refresh);
    } catch (error) {
      toast.error("Failed to delete the order");
    }
  };

  const handleChange = async (id, e) => {
    const { data } = await updateStatus(id,e.target.value);
    if (data?.statusCode !== 200) return;
    setRefresh(!refresh);
    toast.success(data?.message);
  };

  useEffect(() => {
    getAllOrder();
  }, [refresh]);

  useEffect(() => {
    if (search.trim() === "") {
      setFilteredOrder(orders);
    } else {
      const filteredOrdersArr = orders.filter(
        (order) =>
          order.name.toLowerCase().includes(search.toLowerCase()) ||
          order.address.join(" ").toLowerCase().includes(search.toLowerCase())
      );
      setFilteredOrder(filteredOrdersArr);
    }
  }, [search, orders]);

  const getStatusTextAndStyles = (status) =>
    statusStyles[status] || {
      text: "Unknown",
      bgColor: "bg-gray-200",
      textColor: "text-gray-700",
    };

  // Get current orders to display based on pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrder.slice(indexOfFirstOrder, indexOfLastOrder);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden mx-4 my-6 p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">All Orders</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Order ID</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Address</th>
              <th className="px-4 py-2 text-left">
                <div className="flex items-center">
                  Date
                  <FaCaretDown className="ml-1" />
                </div>
              </th>
              <th className="px-4 py-2 text-left">
                <div className="flex items-center">
                  Price <FaCaretUp className="ml-1" />
                </div>
              </th>
              <th className="px-4 py-2 text-left">Payment</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.length ? (
              currentOrders.map((order) => {
                const paymentStatusStyles = getStatusTextAndStyles(order.paymentStatus);
                const orderStatusStyles = getStatusTextAndStyles(order.status);

                return (
                  <tr key={order._id} className="border-b hover:bg-gray-50 transition-all">
                    <td className="px-4 py-2 cursor-pointer text-blue-600" onClick={() => navigate(`/dashboard/order/${order._id}`)}>
                      #{order._id.slice(17)}
                    </td>
                    <td className="px-4 py-2">{order.name}</td>
                    <td className="px-4 py-2">
                      {order.address[0]}, <span className="font-light">{order.address[1].toUpperCase()}</span>
                    </td>
                    <td className="px-4 py-2">{new Date(order.date).toLocaleDateString()}</td>
                    <td className="px-4 py-2">Rs:{order.totalPrice}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 ${paymentStatusStyles.bgColor} ${paymentStatusStyles.textColor} rounded-full`}>
                        {paymentStatusStyles.text}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 ${orderStatusStyles.bgColor} ${orderStatusStyles.textColor} rounded-full flex items-center gap-2`}>
                        <CiCircleChevDown size={18} />
                        {orderStatusStyles.text}
                      </span>
                    </td>
                    <td className="px-4 py-2 flex items-center gap-3">
                      <select
                        onChange={(e) => handleChange(order._id, e)}
                        className="outline-none border rounded-lg p-2 cursor-pointer"
                        defaultValue={order.status}
                      >
                        {options.map((option) => (
                          <option key={option.id} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleDeleteOrder(order._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <MdDelete className="text-xl" />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" className="text-center text-gray-500 py-4">No orders found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 mx-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm text-gray-600 py-2">
          Page {currentPage} of {Math.ceil(filteredOrder.length / ordersPerPage)}
        </span>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === Math.ceil(filteredOrder.length / ordersPerPage)}
          className="px-4 py-2 mx-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DashboardOrder;
