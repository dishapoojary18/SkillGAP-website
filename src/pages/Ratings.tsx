import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Star, ThumbsUp, MessageSquare } from "lucide-react";

const reviews = [
  {
    id: 1,
    name: "Arjun Verma",
    role: "Computer Science Student",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    rating: 5,
    date: "2 days ago",
    review:
      "SkillGAP completely transformed my job search! The AI analysis accurately identified gaps in my React and TypeScript skills. After completing the recommended courses, I landed my dream internship at a top tech company.",
    helpful: 45,
  },
  {
    id: 2,
    name: "Priya Sharma",
    role: "Data Science Aspirant",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    rating: 5,
    date: "1 week ago",
    review:
      "As someone transitioning to data science, I had no idea what skills I was missing. SkillGAP gave me a clear roadmap. The course recommendations were spot-on, and I'm now much more confident in my abilities.",
    helpful: 38,
  },
  {
    id: 3,
    name: "Rahul Patel",
    role: "Final Year Engineering",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    rating: 4,
    date: "2 weeks ago",
    review:
      "Great platform for students! The internship filter by location was super helpful. Found multiple opportunities in my city. Would love to see more companies listed though.",
    helpful: 29,
  },
  {
    id: 4,
    name: "Sneha Reddy",
    role: "Backend Developer Intern",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    rating: 5,
    date: "3 weeks ago",
    review:
      "The skill gap analysis was eye-opening! I thought I was ready for backend roles, but SkillGAP showed me I needed to work on system design. The recommended courses helped me ace my interviews.",
    helpful: 52,
  },
  {
    id: 5,
    name: "Vikram Singh",
    role: "ML Enthusiast",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    rating: 4,
    date: "1 month ago",
    review:
      "Good platform overall. The AI analysis is accurate and the interface is beautiful. My only feedback would be to add more ML/AI specific internships. Otherwise, highly recommended!",
    helpful: 23,
  },
];

const Ratings = () => {
  const [sortBy, setSortBy] = useState<"recent" | "helpful">("recent");

  const averageRating =
    reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((r) => r.rating === rating).length,
    percentage:
      (reviews.filter((r) => r.rating === rating).length / reviews.length) *
      100,
  }));

  const sortedReviews = [...reviews].sort((a, b) =>
    sortBy === "recent"
      ? 0 // Keep original order for "recent"
      : b.helpful - a.helpful
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-28 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-display font-bold text-foreground mb-4">
              User Ratings & Reviews
            </h1>
            <p className="text-lg text-muted-foreground">
              See what our users have to say about SkillGAP
            </p>
          </motion.div>

          {/* Rating Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-8 mb-8"
          >
            <div className="flex flex-col md:flex-row gap-8 items-center">
              {/* Average Rating */}
              <div className="text-center">
                <div className="text-5xl font-display font-bold text-foreground mb-2">
                  {averageRating.toFixed(1)}
                </div>
                <div className="flex justify-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.round(averageRating)
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Based on {reviews.length} reviews
                </p>
              </div>

              {/* Rating Distribution */}
              <div className="flex-1 w-full">
                {ratingDistribution.map((item) => (
                  <div key={item.rating} className="flex items-center gap-3 mb-2">
                    <span className="text-sm text-muted-foreground w-4">
                      {item.rating}
                    </span>
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percentage}%` }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="h-full bg-primary rounded-full"
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-8">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Sort Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-end mb-6"
          >
            <div className="flex gap-2 p-1 bg-secondary/50 rounded-lg">
              <button
                onClick={() => setSortBy("recent")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  sortBy === "recent"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground"
                }`}
              >
                Most Recent
              </button>
              <button
                onClick={() => setSortBy("helpful")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  sortBy === "helpful"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground"
                }`}
              >
                Most Helpful
              </button>
            </div>
          </motion.div>

          {/* Reviews */}
          <div className="space-y-4">
            {sortedReviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                className="glass-card p-6"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {review.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {review.role}
                        </p>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {review.date}
                      </span>
                    </div>

                    <div className="flex mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>

                    <p className="text-muted-foreground mb-4">{review.review}</p>

                    <div className="flex items-center gap-4">
                      <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                        <ThumbsUp className="w-4 h-4" />
                        Helpful ({review.helpful})
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                        <MessageSquare className="w-4 h-4" />
                        Reply
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ratings;
