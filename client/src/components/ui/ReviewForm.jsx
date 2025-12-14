import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Star, MessageSquare, Send } from "lucide-react";
import { addReview } from "../../store/slices/productsSlice";

const ReviewForm = ({ productId, onReviewAdded }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { isLoading } = useSelector(state => state.products);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (rating === 0) {
      newErrors.rating = "Please select a rating";
    }

    if (!comment.trim()) {
      newErrors.comment = "Please write a review comment";
    } else if (comment.trim().length < 10) {
      newErrors.comment = "Review comment must be at least 10 characters";
    } else if (comment.trim().length > 1000) {
      newErrors.comment = "Review comment must be less than 1000 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const result = await dispatch(
        addReview({
          productId,
          rating,
          comment: comment.trim(),
        })
      ).unwrap();

      // Reset form
      setRating(0);
      setHoverRating(0);
      setComment("");
      setErrors({});

      // Notify parent component
      if (onReviewAdded) {
        onReviewAdded(result);
      }
    } catch (error) {
      console.error("Failed to add review:", error);
      setErrors({ submit: error });
    }
  };

  const handleRatingClick = value => {
    setRating(value);
    // Clear rating error when user selects rating
    if (errors.rating) {
      setErrors(prev => ({ ...prev, rating: "" }));
    }
  };

  const handleCommentChange = e => {
    setComment(e.target.value);
    // Clear comment error when user starts typing
    if (errors.comment) {
      setErrors(prev => ({ ...prev, comment: "" }));
    }
  };

  if (!user) {
    return (
      <div className="bg-white/50 rounded-kawaii p-6 shadow-kawaii-soft">
        <div className="text-center">
          <MessageSquare className="w-12 h-12 text-bubblegum/70 mx-auto mb-4" />
          <p className="text-dark-slate/70 mb-4">
            Please log in to write a review
          </p>
          <a
            href="/login"
            className="inline-flex items-center px-6 py-2 bg-bubblegum text-white rounded-kawaii hover:bg-bubblegum/90 transition-colors"
          >
            Login to Review
          </a>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/50 rounded-kawaii p-6 shadow-kawaii-soft"
    >
      <h3 className="text-xl font-heading text-dark-slate mb-6 flex items-center gap-2">
        <MessageSquare className="w-5 h-5" />
        Write a Review
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Star Rating */}
        <div>
          <label className="block text-sm font-medium text-dark-slate mb-3">
            Rating *
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingClick(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition-colors duration-200"
              >
                <Star
                  className={`w-8 h-8 transition-colors ${
                    star <= (hoverRating || rating)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
          {errors.rating && (
            <p className="text-red-500 text-sm mt-1">{errors.rating}</p>
          )}
          <p className="text-xs text-dark-slate/70 mt-1">
            {rating > 0 && (
              <span>
                You selected {rating} star{rating !== 1 ? "s" : ""}
              </span>
            )}
          </p>
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-medium text-dark-slate mb-2">
            Review Comment *
          </label>
          <textarea
            value={comment}
            onChange={handleCommentChange}
            rows={4}
            className={`w-full px-4 py-3 bg-white/80 border rounded-kawaii focus:outline-none focus:ring-2 focus:ring-bubblegum resize-none ${
              errors.comment ? "border-red-500" : "border-white/50"
            }`}
            placeholder="Share your thoughts about this product..."
            maxLength={1000}
          />
          <div className="flex justify-between items-center mt-1">
            {errors.comment && (
              <p className="text-red-500 text-sm">{errors.comment}</p>
            )}
            <p className="text-xs text-dark-slate/70 ml-auto">
              {comment.length}/1000 characters
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading || rating === 0 || !comment.trim()}
            className="px-6 py-3 bg-gradient-to-r from-bubblegum to-electric-teal text-white rounded-kawaii hover:from-bubblegum/90 hover:to-electric-teal/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            {isLoading ? "Submitting..." : "Submit Review"}
          </button>
        </div>

        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-kawaii p-4">
            <p className="text-red-600 text-sm">{errors.submit}</p>
          </div>
        )}
      </form>
    </motion.div>
  );
};

export default ReviewForm;
