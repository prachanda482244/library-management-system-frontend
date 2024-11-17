import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
  timeout: 120000,
});

const loginUSER = (data) => {
  return apiClient.post("/users/login", data);
};

const getRecommendations = (userId) => {
  return apiClient.get(`/recommendation/collaborative/${userId}`);
};
const getGenreBasedRecommendations = (userId) => {
  return apiClient.get(`/recommendation/genre/${userId}`);
};
const getCurrentUser = () => {
  return apiClient.get("/users/current-user");
};
const registerUSER = (data) => {
  return apiClient.post("/users/register", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const logoutUSER = () => {
  return apiClient.post("/users/logout");
};

const getAvailableUsers = () => {
  return apiClient.get("/chats/users");
};

const getUserChats = () => {
  return apiClient.get(`/chats`);
};

const createUserChat = (receiverId) => {
  return apiClient.post(`/chats/c/${receiverId}`);
};

const createGroupChat = (data) => {
  return apiClient.post(`/chats/group`, data);
};

const getGroupInfo = (chatId) => {
  return apiClient.get(`/chats/group/${chatId}`);
};

const updateGroupName = (chatId, name) => {
  return apiClient.patch(`/chats/group/${chatId}`, { name });
};

const deleteGroup = (chatId) => {
  return apiClient.delete(`/chats/group/${chatId}`);
};

const deleteOneOnOneChat = (chatId) => {
  return apiClient.delete(`/chats/remove/${chatId}`);
};

const addParticipantToGroup = (chatId, participantId) => {
  return apiClient.post(`/chats/group/${chatId}/${participantId}`);
};

const removeParticipantFromGroup = (chatId, participantId) => {
  return apiClient.delete(`/chats/group/${chatId}/${participantId}`);
};

const getChatMessages = (chatId) => {
  return apiClient.get(`/chat/messages/${chatId}`);
};

const sendMessage = (chatId, content) => {
  return apiClient.post(`/chat/messages/${chatId}`, { content });
};

const deleteMessage = (chatId, messageId) => {
  return apiClient.delete(`/chat/messages/${chatId}/${messageId}`);
};
const getNotification = () => {
  return apiClient.get("/notification/get-notification");
};

const returnBook = (id) => {
  return apiClient.post(`/borrow/books/${id}/return`, {});
};
const borrowBook = (bookId) => {
  return apiClient.post(`/borrow/books/${bookId}/borrow`, {});
};

const updateUser = ({ username, oldPassword, newPassword }) => {
  return apiClient.patch(`/users/update-account-details`, {
    username,
    oldPassword,
    newPassword,
  });
};
const getAllBooks = () => {
  return apiClient.get("/books/get-all-books");
};
const adminGetALlUser = () => {
  return apiClient.get("/admin/get-all-users");
};
const adminGetAllBook = () => {
  return apiClient.get("/admin/get-all-books");
};
const adminDeleteUser = (id) => {
  return apiClient.delete(`/admin/delete-user/${id}`);
};
const adminUpdateRole = (id, newRole) => {
  return apiClient.put(`/admin/update-user-role/${id}`, {
    role: newRole,
  });
};
const adminDeleteBook = (id) => {
  return apiClient.delete(`/books/delete-book/${id}`);
};

const requestApproval = ({bookId,status}) => {
  return apiClient.put("/admin/request-approval/", {
    bookId,
    status
  });
};

const fetchBookCart = ()=>{
  return apiClient.get("/cart")
}

const addBookToCart = ({bookId,book})=>{
  return apiClient.post(
    `/cart/add-to-cart/${bookId}`,
    { book, quantity: 1 },
    { withCredentials: true }
  );
}

const removeBookFromCart = ({bookId})=>{
  return apiClient.delete(
    `/cart/delete-cart/${bookId}`,
    {}
  )
}

const updateBookToCart = ({bookId,quantity})=>{
  return apiClient.put(
    `/cart/update-cart/${bookId}`,
    { quantity: parseInt(quantity) },
  );
}
const clearBookToCart = ()=>{
  return apiClient.delete("/cart/clear-cart",{} );
}
const getSingleBook = (id) => {
  return apiClient.get(`/books/get-single-book/${id}`);
};
const createBook = (data) => {
  return apiClient.post("/books/add-book", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
const allOrders= ()=>{
  return apiClient.get("/order/get-all-order",{})
}
const searchQuery = (params) => {
  return apiClient.get("/search/query", { params });
};
const getCategory = () => {
  return apiClient.get("/search/get-category");
};

const editBook = (id, data) => {
  return apiClient.patch(`/books/update-book/${id}`, data);
};

const createOrder = (order)=>{
  return apiClient.post("/order/create-order",order)
}
const getAdminStatictics = () => {
  return apiClient.get("/admin/get-statistics");
};
const getOtherUser = (userId) => {
  return apiClient.get(`/users/get-other-user/${userId}`);
};
const fetchReview = ({ bookId, page, limit }) => {
  return apiClient.get(
    `/review/get-review/${bookId}?page=${page}&limit=${limit}`
  );
};
const postReview = ({ bookId, content, parentReviewId }) => {
  return apiClient.post("review/add-review", {
    bookId,
    content,
    parentReviewId,
  });
};
const deleteReview = (reviewId) => {
  return apiClient.delete(`/review/update-review/`, {
    data: {
      reviewId,
    },
  });
};

const editReview = ({ reviewId, content }) => {
  return apiClient.patch(`/review/update-review/`, { reviewId, content });
};
const getNestedReviews = (reviewId) => {
  return apiClient.get(`/review/get-nested-review/${reviewId}`);
};

const deleteOrder = (id)=>{
  return apiClient.delete(`/order/delete-order/${id}`)
}
const forgotPassword = ({ email }) => {
  return apiClient.post("/users/forgot-password", { email });
};
const updateStatus=(id,status)=>{
  return apiClient.patch(`/order/${id}/update-status`, {
    status
  });
}
const singleOrder = (id)=>{
  return apiClient.get(`/order/get-single-order/${id}`)
}
export {
  singleOrder,
  updateStatus,
  deleteOrder,
  adminGetALlUser,
  forgotPassword,
  getNestedReviews,
  fetchReview,
  postReview,
  getRecommendations,
  getSingleBook,
  getGenreBasedRecommendations,
  adminDeleteUser,
  createOrder,
addBookToCart,
removeBookFromCart,
updateBookToCart,
clearBookToCart,
fetchBookCart,
  editReview,
  deleteReview,
  adminUpdateRole,
  adminGetAllBook,
  adminDeleteBook,
  getAdminStatictics,
  searchQuery,
  getOtherUser,
  getCategory,
  createBook,
  editBook,
  addParticipantToGroup,
  createGroupChat,
  createUserChat,
  deleteGroup,
  deleteOneOnOneChat,
  getCurrentUser,
  getAvailableUsers,
  getChatMessages,
  getGroupInfo,
  allOrders,
  updateUser,
  requestApproval,
  getUserChats,
  loginUSER,
  logoutUSER,
  registerUSER,
  getNotification,
  removeParticipantFromGroup,
  sendMessage,
  updateGroupName,
  deleteMessage,
  returnBook,
  getAllBooks,
  borrowBook,
};
