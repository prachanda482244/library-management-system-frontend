import { useEffect, useState } from "react";
import { FaPaperPlane, FaPlus, FaMinus, FaEdit, FaTrash } from "react-icons/fa";
import {
  postReview,
  getNestedReviews,
  editReview,
  deleteReview,
} from "../config/AxiosInstance";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const Review = ({ reviews, bookId }) => {
  const [allReviews, setAllReviews] = useState(reviews);
  const [nestedReview, setNestedReview] = useState({});
  const [replyContent, setReplyContent] = useState({});

  const [editMode, setEditMode] = useState({
    active: false,
    reviewId: null,
    content: "",
  });
  const { userData } = useSelector((state) => state.user);
  useEffect(() => {
    setAllReviews(reviews);
  }, [reviews]);

  const fetchNestedReviews = async (reviewId, forceFetch = false) => {
    if (!nestedReview[reviewId] || forceFetch) {
      const { data } = await getNestedReviews(reviewId);
      setNestedReview((prev) => ({
        ...prev,
        [reviewId]: data?.data?.replies || [],
      }));
    } else {
      setNestedReview((prev) => {
        const { [reviewId]: removed, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleReplyChange = (e, reviewId) => {
    setReplyContent((prev) => ({
      ...prev,
      [reviewId]: e.target.value,
    }));
  };

  const handleSubmitReply = async (parentReviewId) => {
    const replyText = replyContent[parentReviewId]?.trim();
    if (!replyText) return;

    try {
      const { data } = await postReview({
        bookId,
        content: replyText,
        parentReviewId,
      });
      if (data?.data) {
        setAllReviews(reviews);
        setReplyContent((prev) => ({
          ...prev,
          [parentReviewId]: "",
        }));
        fetchNestedReviews(parentReviewId, true);
      }
    } catch (error) {
      console.error("Error adding reply");
    }
  };

  const handleEditClick = (review) => {
    setEditMode({
      active: true,
      reviewId: review._id,
      content: review.content,
    });
  };

  const handleSaveEdit = async () => {
    try {
      const { data } = await editReview({
        reviewId: editMode.reviewId,
        content: editMode.content,
      });

      if (data?.data) {
        setAllReviews((prevReviews) => {
          return prevReviews.map((review) =>
            review._id === editMode.reviewId
              ? { ...review, content: editMode.content }
              : review
          );
        });

        setEditMode({ active: false, reviewId: null, content: "" });
        toast.success(data?.message);
      }
    } catch (error) {
      console.error("Error editing review:", error);
      toast.error("Error editing review");
    }
  };

  const handleDeleteClick = async (reviewId) => {
    try {
      const { data } = await deleteReview(reviewId);
      if (data?.statusCode === 200) {
        toast.success(data.message);

        setAllReviews((prevReviews) => {
          const updatedReviews = prevReviews.filter(
            (review) => review._id !== reviewId
          );
          return updatedReviews;
        });
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Error deleting review");
    }
  };

  const handleKeyDown = (e, parentReviewId) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmitReply(parentReviewId);
    }
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(seconds / 3600);
    const days = Math.floor(seconds / 86400);

    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    return `${minutes}m`;
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      {allReviews?.map((review) => (
        <div key={review._id} className="relative mb-2">
          <motion.div
            className="bg-white border border-gray-300 rounded-lg p-3 shadow-sm"
            initial={{ opacity: 0, translateY: -10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <img
                  src={review?.userId.avatar}
                  alt={review?.userId.username}
                  className="w-10 h-10 rounded-full border border-gray-200"
                />
                <div className="ml-2 flex items-center">
                  <p className="text-sm font-semibold text-gray-800">
                    {review?.userId.username}
                  </p>
                  <p className="text-xs text-gray-500 ml-2">
                    {timeAgo(review.createdAt)}
                  </p>

                  {review?.hasReplies && (
                    <button
                      className="text-gray-500 hover:text-blue-500 ml-2 text-xs"
                      onClick={() => fetchNestedReviews(review._id)}
                    >
                      {nestedReview[review._id] ? (
                        <FaMinus size={10} />
                      ) : (
                        <span className="flex items-center justify-center border-2 px-[2px] rounded-lg font-semibold ">
                          <FaPlus size={10} />
                          {review.replyCount}
                        </span>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Always visible buttons */}
              <div className="flex space-x-2">
                {userData?._id === review?.userId._id && (
                  <>
                    <button
                      className="text-gray-500 hover:text-blue-500"
                      onClick={() => handleEditClick(review)}
                    >
                      <FaEdit size={12} />
                    </button>
                    <button
                      className="text-gray-500 hover:text-red-500"
                      onClick={() => handleDeleteClick(review._id)}
                    >
                      <FaTrash size={12} />
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="text-sm text-gray-700 mb-2">{review.content}</div>

            {/* Nested reviews */}
            <motion.div
              initial={
                nestedReview[review._id]
                  ? { opacity: 1, height: "auto" }
                  : { opacity: 0, height: 0 }
              }
              animate={
                nestedReview[review._id]
                  ? { opacity: 1, height: "auto" }
                  : { opacity: 0, height: 0 }
              }
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
              className="overflow-hidden ml-4 mt-2 border-l-2 border-gray-200 pl-2"
            >
              {nestedReview[review._id] && (
                <Review reviews={nestedReview[review._id]} bookId={bookId} />
              )}
            </motion.div>

            {/* Reply input */}
            <div className="flex mt-2">
              <input
                type="text"
                value={replyContent[review._id] || ""}
                onChange={(e) => handleReplyChange(e, review._id)}
                onKeyDown={(e) => handleKeyDown(e, review._id)}
                placeholder="Write a reply..."
                className="flex-1 p-1 border border-gray-300 rounded focus:outline-none text-sm"
              />
              <button
                onClick={() => handleSubmitReply(review._id)}
                className="ml-2 bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-sm"
              >
                <FaPaperPlane />
              </button>
            </div>
          </motion.div>
        </div>
      ))}

      {editMode.active && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Edit Review</h3>
            <textarea
              value={editMode.content}
              onChange={(e) =>
                setEditMode({ ...editMode, content: e.target.value })
              }
              rows={3}
              className="w-full border border-gray-300 rounded p-2 mb-4"
            />
            <div className="flex justify-end">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={handleSaveEdit}
              >
                Save
              </button>
              <button
                className="ml-2 text-gray-600"
                onClick={() =>
                  setEditMode({ active: false, reviewId: null, content: "" })
                }
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Review;
