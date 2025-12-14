import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Star, MessageSquare, Trash2, User, Calendar } from "lucide-react";
import { deleteReview } from "../../store/slices/productsSlice";

const ReviewList = ({ reviews = [], rating = { average: 0, count: 0 } }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { isLoading } = useSelector(state => state.products);
  const [deletingId, setDeletingId] = useState(null);

  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderStars = (rating, size = "w-4 h-4") => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={`${size} ${
              star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const handleDeleteReview = async (productId, reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) {
      return;
    }

    setDeletingId(reviewId);
    try {
      await dispatch(
        deleteReview({
          productId,
          reviewId,
        })
      ).unwrap();
    } catch (error) {
      console.error("Failed to delete review:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const isAdmin = user?.role === "admin";

  if (reviews.length === 0) {
    return (
      <div className="bg-white/50 rounded-kawaii p-6 shadow-kawaii-soft">
        <div className="text-center">
          <MessageSquare className="w-12 h-12 text-bubblegum/70 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-dark-slate mb-2">
            No Reviews Yet
          </h3>
          <p className="text-dark-slate/70">
            Be the first to review this product!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/50 rounded-kawaii p-6 shadow-kawaii-soft">
      {/* Header with rating summary */}
      <div className="mb-6">
        <h3 className="text-xl font-heading text-dark-slate mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Customer Reviews
        </h3>

        {/* Rating Summary */}
        <div className="flex items-center gap-6 p-4 bg-white/50 rounded-kawaii">
          <div className="text-center">
            <div className="text-3xl font-bold text-bubblegum mb-1">
              {rating.average.toFixed(1)}
            </div>
            <div className="mb-2">
              {renderStars(Math.round(rating.average), "w-5 h-5")}
            </div>
            <p className="text-sm text-dark-slate/70">
              {rating.count} review{rating.count !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Rating breakdown */}
          <div className="flex-1">
            {[5, 4, 3, 2, 1].map(stars => {
              const count = reviews.filter(r => r.rating === stars).length;
              const percentage =
                rating.count > 0 ? (count / rating.count) * 100 : 0;

              return (
                <div key={stars} className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-dark-slate w-8">{stars}</span>
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-bubblegum h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-dark-slate/70 w-8 text-right">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        <AnimatePresence>
          {reviews.map((review, index) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/50 rounded-kawaii p-4 border border-white/30"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-bubblegum/20 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-bubblegum" />
                  </div>
                  <div>
                    <p className="font-medium text-dark-slate">
                      {review.user?.username || "Anonymous"}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-dark-slate/70">
                      <Calendar className="w-3 h-3" />
                      {formatDate(review.createdAt)}
                    </div>
                  </div>
                </div>

                {/* Rating and Admin Actions */}
                <div className="flex items-center gap-2">
                  {renderStars(review.rating, "w-4 h-4")}
                  {isAdmin && (
                    <button
                      onClick={() =>
                        handleDeleteReview(
                          review.productId || review.product?._id,
                          review._id
                        )
                      }
                      disabled={deletingId === review._id || isLoading}
                      className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                      title="Delete Review"
                    >
                      {deletingId === review._id ? (
                        <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Review Comment */}
              <div className="text-dark-slate leading-relaxed">
                {review.comment}
              </div>

              {/* Review metadata */}
              {review.isApproved === false && (
                <div className="mt-2">
                  <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                    Pending Approval
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Load More (Future enhancement) */}
      {reviews.length > 10 && (
        <div className="text-center mt-6">
          <button className="px-6 py-2 bg-bubblegum/10 text-bubblegum rounded-kawaii hover:bg-bubblegum hover:text-white transition-colors">
            Load More Reviews
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewList;
