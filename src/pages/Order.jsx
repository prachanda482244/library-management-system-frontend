import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import FormikInput from "../formik/FormikInput";
import { orderValidationSchema } from "../constants/constants";
import FormikTextarea from "../formik/FormikTextArea";
import { useDispatch, useSelector } from "react-redux";

import { clearBookToCart, createOrder } from "../config/AxiosInstance";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Order = () => {
  const { userData } = useSelector((state) => state.user);
  const { cartItems } = useSelector((state) => state.cart);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const initialValues = {
    name: userData.username,
    email: userData.email,
    phone: "",
    street: "",
    city: "",
    paymentMethod: "cash_on_delivery",
  };

  const handleSubmit = async (values, { resetForm }) => {
    const { name, email, phone, street, city, notes, paymentMethod } = values;
    const books = cartItems.books;
    const orders = {
      name,
      email,
      phone,
      street,
      city,
      notes,
      paymentMethod,
      books: [...books],
    };

    try {
      const { data } = await createOrder(orders);
      console.log(data)
      if (data.statusCode !== 201) return;
      toast.success(data?.message);
      resetForm();

      const { data: cart } = await clearBookToCart();
      if (cart.statusCode === 200) {
        navigate("/cart");
      }
    } catch (error) {
      toast.error("Failed to place your order");
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={orderValidationSchema}
      onSubmit={handleSubmit}
      enableReinitialize={true}
    >
      {({}) => (
        <Form>
          <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 space-y-6">
            <h1 className="text-2xl font-semibold text-gray-700 text-center">
              Complete Your Order
            </h1>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="w-full">
                <FormikInput label="Name" type="text" name="name" required={true} />
              </div>
              <div className="w-full">
                <FormikInput label="Email" type="email" name="email" required={true} />
              </div>
            </div>

            {/* Shipping Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="w-full">
                <FormikInput label="Phone" type="text" name="phone" required={true} />
              </div>
              <div className="w-full">
                <FormikInput label="Street Address" type="text" name="street" required={true} />
              </div>
              <div className="w-full">
                <FormikInput label="City" type="text" name="city" required={true} />
              </div>
            </div>

            {/* Additional Notes */}
            <div className="w-full">
              <FormikTextarea
                label="Order Notes (Optional)"
                name="notes"
                required={false}
                rows={4}
                placeholder="Any special instructions for your order?"
              />
            </div>

            {/* Payment Method */}
            <div className="w-full">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Payment Method
              </label>
              <div className="relative">
                <select
                  name="paymentMethod"
                  className="w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="cash_on_delivery" className="text-xl bg-white">
                    Cash on Delivery
                  </option>
                  {/* Add more payment options if needed */}
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-blue-600 py-3 px-10 w-1/3 rounded-lg text-white text-lg font-medium hover:bg-blue-700 focus:outline-none transition duration-200"
              >
                Place Order
              </button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default Order;
