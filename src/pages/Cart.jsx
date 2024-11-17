import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  fetchCartData,
  removeFromCart,
  updateCart,
} from "../store/slices/cartSlice";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cartItems, message } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(false);
  // Create a local state to manage quantities
  const [localQuantities, setLocalQuantities] = useState({});

  useEffect(() => {
    const quantities = cartItems.books?.reduce((acc, book) => {
      acc[book.book._id] = book.quantity || 1; // Default to 1 if undefined
      return acc;
    }, {});
    setLocalQuantities(quantities);
    dispatch(fetchCartData());
  }, [cartItems]);

  const handleClearCart = () => {
    const result = confirm("Are you sure you want to clear the cart..?");
    if (!result) return;
    // dispatch(clearCart());
    toast.success("Cart cleared");
    setRefresh(!refresh);
  };

  const handleRemove = (bookId) => {
    dispatch(removeFromCart(bookId));
    setRefresh(!refresh);
  };

  const handleIncrement = (bookId) => {
    setLocalQuantities((prevQuantities) => {
      const newQuantity = (prevQuantities[bookId] || 0) + 1; // Default to 0 if undefined
      dispatch(updateCart({ bookId, quantity: newQuantity }));
      return {
        ...prevQuantities,
        [bookId]: newQuantity,
      };
    });
    toast.success("Product quantity increased by 1");
  };

  const handleDecrement = (bookId) => {
    setLocalQuantities((prevQuantities) => {
      const newQuantity = (prevQuantities[bookId] || 1) - 1; // Default to 1 if undefined
      if (newQuantity >= 1) {
        dispatch(updateCart({ bookId, quantity: newQuantity }));
        toast.success("Product quantity decreased by 1");
        return {
          ...prevQuantities,
          [bookId]: newQuantity,
        };
      }
      return prevQuantities; // Do nothing if the quantity is less than 1
    });
  };

  const totalPrice = cartItems?.books?.reduce((total, book) => {
    const quantity = localQuantities[book?.book?._id] || 0;
    const price = book.book?.price || 0; 
    return total + price * quantity;
  }, 0);

  const handleCheckOut = () => {
    if (cartItems.length === 0 || cartItems?.books.length === 0) {
      toast.error("No item in cart to order");
    } else {
      navigate("/order");
    }
  };

  return (
    <div className="flex font-light pt-10 w-[80%] mx-auto p-3 flex-col">
      <div className="flex gap-16 ">
        <div className="w-2/3">
          <h1 className="text-xl border-b pb-2 font-semibold">My Cart</h1>
          {cartItems.books && cartItems?.books?.length !== 0 ? (
            cartItems?.books?.map((books) => (
              <div key={books.book._id} className="flex py-3 justify-between px-5">
                <div>
                  <div className="flex gap-4 w-72">
                    <div className="bg-[#f5f5f0] py-10 px-5">
                      <img
                        src={books?.book?.coverImage && books.book?.coverImage}
                        alt="Cart item"
                        className="h-14 w-14 object-cover rounded-sm"
                      />
                    </div>
                    <div className="flex py-2 flex-col justify-between text-sm font-light">
                      <div className="flex flex-col gap-2">
                        <p className="text-lg tracking-wider">{books.book?.title}</p>
                        <p className="text-sm">Rs: {books.book?.price ? books.book.price : "200"}</p>
                      </div>
                      <p>In stock</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex border border-black items-center w-28 justify-between p-1">
                    <button
                      className="text-5xl text-slate-900"
                      onClick={() => handleDecrement(books.book._id)}
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                        <path fillRule="evenodd" d="M20,12 L20,13 L5,13 L5,12 L20,12 Z"></path>
                      </svg>
                    </button>
                    <div>
                      <span className="text-black text-lg">
                        {localQuantities[books.book._id]}
                      </span>
                    </div>
                    <button
                      className="text-black"
                      onClick={() => handleIncrement(books.book._id)}
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                        <path fillRule="evenodd" d="M13,5 L13,12 L20,12 L20,13 L13,13 L13,20 L12,20 L11.999,13 L5,13 L5,12 L12,12 L12,5 L13,5 Z"></path>
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2 justify-between">
                  <p className="text-lg">
                    Rs: {localQuantities[books.book._id] * books.book?.price}.00
                  </p>
                </div>
                <div>
                  <button onClick={() => handleRemove(books?.book._id)}>
                    <svg
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      width="30"
                      height="30"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M11.5,3 C12.327,3 13,3.673 13,4.5 L13,4.5 L13,5 L16,5 L16,6 L15,6 L15,14.5 C15,15.878 13.878,17 12.5,17 L12.5,17 L7.5,17 C6.122,17 5,15.878 5,14.5 L5,14.5 L5,6 L4,6 L4,5 L7,5 L7,4.5 C7,3.673 7.673,3 8.5,3 L8.5,3 Z M14,6 L6,6 L6,14.5 C6,15.327 6.673,16 7.5,16 L7.5,16 L12.5,16 C13.327,16 14,15.327 14,14.5 L14,14.5 L14,6 Z M9,8 L9,14 L8,14 L8,8 L9,8 Z M12,8.001 L12,14 L11,14 L11,8.001 L12,8.001 Z M11.5,4 L8.5,4 C8.224,4 8,4.224 8,4.5 L8,4.5 L8,5 L12,5 L12,4.5 C12,4.224 11.776,4 11.5,4 L11.5,4 Z"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="mt-2 text-lg">
              No items in the cart{" "}
              <button onClick={() => navigate("/books")} className="text-blue-400">
                Shop now
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-5 w-1/3 mx-auto ">
          <h1 className="text-xl font-light border-b pb-2">Order Summary</h1>
          <div className="flex py-2 justify-between border-b-[2px]">
            <p>Total</p>
            <p>{totalPrice}</p>
          </div>
          <div className="flex py-2 justify-between border-b-[2px]">
            <p>Total order</p>
            <p>{cartItems.books?.length}</p>
          </div>
          <div>
            <button
              onClick={handleCheckOut}
              className="bg-[#5e5e4a] disabled:bg-[#636331] text-white py-2 w-full px-6"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
