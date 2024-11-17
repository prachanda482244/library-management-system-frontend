import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { singleOrder } from "../../config/AxiosInstance";
import toast from "react-hot-toast";
import { statusStyles } from "../../constants/constants";

const DashboardOrderDetails = () => {
  const { id } = useParams();
  const [userOrder, setUserOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSingleDetails = async () => {
    setIsLoading(true);
    try {
      const { data } = await singleOrder(id);
      if (data?.statusCode === 200) {
        setUserOrder(data?.data);
        toast.success(data?.message);
      } else {
        toast.error("Failed to fetch order details");
      }
    } catch (error) {
      toast.error("No order available");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSingleDetails();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!userOrder) {
    return (
      <div className="text-center text-gray-600 mt-10">
        No order details available.
      </div>
    );
  }

  const currentStatus = statusStyles[userOrder.status] || {
    text: "Unknown",
    bgColor: "bg-gray-200",
    textColor: "text-gray-700",
  };

  return (
    <div className="container mx-auto p-6 bg-white shadow-xl rounded-lg">
      {/* Order Header */}
      <div className="flex justify-between items-center border-b pb-6 mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-semibold text-gray-800">Order Details</h2>
          <div className="flex items-center gap-2">
            <span className="text-lg text-purple-600">Order #</span>
            <span className="text-lg text-purple-400 font-bold">
              {userOrder._id?.slice(17)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <img
            className="h-12 w-12 object-cover rounded-full"
            src={userOrder.imageUrl}
            alt={userOrder.name}
          />
          <div className="text-lg text-gray-700 font-bold">
            Total: <span className="text-xl text-blue-600">Rs {userOrder.totalAmount}</span>
          </div>
        </div>
      </div>

      {/* General Information */}
      <div className="grid md:grid-cols-2 gap-8 mb-6">
        <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">General Information</h3>
          <div className="text-gray-700 mb-2">
            <span className="font-semibold">Date Created:</span> 
            <span className="text-gray-500">{new Date(userOrder.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="text-gray-700 mb-2">
            <span className="font-semibold">Payment Method:</span> 
            <span className="text-gray-500">{userOrder.paymentMethod}</span>
          </div>
          <div className="text-gray-700 mb-2">
            <span className="font-semibold">Payment Status:</span> 
            <span className={`text-${currentStatus.textColor} bg-${currentStatus.bgColor} py-1 px-3 rounded-md`}>
              {currentStatus.text}
            </span>
          </div>
        </div>

        {/* Shipping Info */}
        <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Shipping Information</h3>
          <div className="text-gray-700 mb-2">
            <span className="font-semibold">Address:</span>
            <span className="text-gray-500">{userOrder.address}</span>
          </div>
          <div className="text-gray-700 mb-2">
            <span className="font-semibold">Phone:</span>
            <span className="text-gray-500">{userOrder.phone}</span>
          </div>
        </div>
      </div>

      {/* Customer Info */}
      <div className="bg-gray-100 p-6 rounded-lg shadow-sm mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer Information</h3>
        <div className="flex justify-between text-gray-700">
          <div>
            <span className="font-semibold">Name:</span>
            <span className="text-gray-500">{userOrder.name}</span>
          </div>
          <div>
            <span className="font-semibold">Email:</span>
            <span className="text-gray-500">{userOrder.email}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="bg-gray-100 p-6 rounded-lg shadow-sm mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Notes</h3>
        <p className="text-gray-700">{userOrder.notes || "No additional notes."}</p>
      </div>

      {/* Product Details */}
      <div>
        <h4 className="text-xl font-semibold text-gray-800 mb-4">Product Details</h4>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userOrder.product?.map((item, index) => (
            <div
              key={index}
              className="border rounded-lg shadow-md hover:shadow-lg p-4 cursor-pointer transition-transform transform hover:scale-105"
            >
              <div className="w-full mb-4">
                <img
                  className="w-full h-40 object-cover rounded-lg"
                  src={item.bookImage}
                  alt={item.bookTitle}
                />
              </div>
              <div className="flex flex-col text-gray-700">
                <h5 className="text-lg font-semibold text-blue-600">{item.bookTitle}</h5>
                <p className="text-sm text-gray-600">{item.bookDescription.slice(0, 50)}...</p>
                <div className="mt-2 flex justify-between text-gray-700">
                  <div className="flex items-center">
                    <span className="font-semibold">Rs:</span>
                    <span>{item.bookPrice}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold">Quantity:</span>
                    <span>{item.bookQuantity}</span>
                  </div>
                </div>
                <div className="mt-2 flex justify-between text-gray-700">
                  <div className="flex items-center">
                    <span className="font-semibold">Total:</span>
                    <span>{item.bookPrice * item.bookQuantity}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardOrderDetails;
