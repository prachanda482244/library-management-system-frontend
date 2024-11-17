import { AiFillBank } from "react-icons/ai";
import { CgProductHunt } from "react-icons/cg";
import {
    FaRegUser,
    FaFacebook,
    FaTwitter,
    FaInstagram,
    FaLinkedin,
    FaUserFriends,
    FaBloggerB,
    FaChartBar,
    FaJediOrder,
} from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { GiShoppingBag } from "react-icons/gi";
import {
    MdOutlineInventory2,
    MdPreview,
    MdProductionQuantityLimits,
} from "react-icons/md";

import * as yup from "yup";

export const registrationValidationSchema = yup.object({
    username: yup
        .string()
        .min(4, "Username is not less than 4 character")
        .required("User name is required"),
    email: yup
        .string()
        .email("Provide valid email address")
        .required("Email address is required"),
    password: yup
        .string()
        .min(6, "Password must be 6 character long")
        .required("Password is required"),
    avatar: yup.mixed().required("avatar is required"),
});

export const loginValidationSchema = yup.object({
    email: yup
        .string()
        .email("Invalid email address")
        .required("Email is required"),
    password: yup
        .string()
        .min(6, "Password must be 6 character long")
        .required("Password is required"),
});

// constants/constants.js
export const pages = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Login", path: "/sign-in" },
];

export const loggedInPages = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Books", path: "/books" },
    { name: "Cart", path: "/cart" },
];

export const settings = ["Profile", "Dashboard", "Logout"];

export const dashSidebar = [{
        id: 1,
        name: "Chart",
        icon: FaChartBar,
        link: "/dashboard/charts"
    },
    {
        id: 2,
        name: "Users",
        icon: FaUserFriends,
        link: "/dashboard/customers",
    },
    {
        id: 3,
        name: "Books",
        icon: AiFillBank,
        link: "/dashboard/books",
    },
    {
        id:4,
        name:"Request",
        icon:MdPreview,
        link:"/dashboard/request-approval"
    },
    {
        id:5,
        name:"Orders",
        icon:AiFillBank,
        link:"/dashboard/order"
    }

    // {
    //     id: 5,
    //     name: "Inventory",
    //     icon: MdOutlineInventory2,
    //     link: "/dashboard/inventory",
    // },
];

export const bookValidationSchema = yup.object({
    title: yup
        .string()
        .min(3, "Title should be more than 3 character")
        .required("This field is required"),
    author: yup.string().required("This field is required"),
    genre: yup.string().required("This field is required"),
    description: yup.string().required("This field is required"),
    publicationYear: yup.number().required("This field is required"),
    isbn: yup.number().required("This field is required"),
    price: yup.number().required("This field is required"),
    avatar: yup.mixed().required("This field is required"),
});

export const orderValidationSchema = yup.object().shape({
    name: yup
      .string()
      .min(3, "Name should be more than 3 characters")
      .required("Name is required"),
    email: yup
      .string()
      .email("Enter a valid email")
      .required("Email is required"),
    phone: yup
      .string()
      .matches(/^\d{10}$/, "Phone number must be exactly 10 digits long")
      .required("Phone number is required"),
    street: yup.string().required("Street is required"),
    city: yup.string().required("City is required"),
    notes: yup.string().optional(),
    cashondelivery: yup
      .string()
      .oneOf(["cashondelivery"], "Invalid payment option"),
  });


  export const options = [
    {
      id: 0,
      label: "Pending",
      value: "pending",
    },
    {
      id: 1,
      label: "Processing",
      value: "processing",
    },
    {
      id: 2,
      label: "Delivered",
      value: "delivered",
    },
    {
      id: 3,
      label: "Cancelled",
      value: "cancelled",
    },
  ];
  
  export const statusStyles = {
    pending: {
      text: "Pending",
      bgColor: "bg-yellow-200",
      textColor: "text-yellow-700",
    },
    processing: {
      text: "Processing",
      bgColor: "bg-blue-200",
      textColor: "text-blue-700",
    },
    delivered: {
      text: "Delivered",
      bgColor: "bg-green-200",
      textColor: "text-green-700",
    },
    cancelled: {
      text: "Cancelled",
      bgColor: "bg-red-200",
      textColor: "text-red-700",
    },
    unpaid: {
      text: "Unpaid",
      bgColor: "bg-purple-100",
      textColor: "text-purple-500",
    },
    paid: {
      text: "Paid",
      bgColor: "bg-green-100",
      textColor: "text-green-500",
    },
  };