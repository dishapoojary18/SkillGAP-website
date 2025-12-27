import { motion } from "framer-motion";
import { ExternalLink, Star, Clock, Users } from "lucide-react";
import { Button } from "./ui/button";

interface CourseCardProps {
  title: string;
  provider: string;
  rating: number;
  duration: string;
  students: string;
  image: string;
  url: string;
  skill: string;
  index: number;
}

const CourseCard = ({
  title,
  provider,
  rating,
  duration,
  students,
  image,
  url,
  skill,
  index,
}: CourseCardProps) => {
  const providerColors: Record<string, string> = {
    Udemy: "bg-purple-500",
    Coursera: "bg-blue-500",
    "LinkedIn Learning": "bg-sky-600",
    edX: "bg-red-500",
    Pluralsight: "bg-pink-600",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="group glass-card overflow-hidden hover:shadow-lg transition-all duration-300"
    >
      <div className="relative h-40 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
        <div
          className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium text-primary-foreground ${
            providerColors[provider] || "bg-primary"
          }`}
        >
          {provider}
        </div>
        <div className="absolute bottom-3 left-3 px-2 py-1 rounded-lg bg-background/90 text-xs font-medium text-primary">
          {skill}
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-foreground line-clamp-2 mb-3 group-hover:text-primary transition-colors">
          {title}
        </h3>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span>{rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{students}</span>
          </div>
        </div>

        <Button
          variant="soft"
          size="sm"
          className="w-full gap-2"
          onClick={() => window.open(url, "_blank")}
        >
          View Course
          <ExternalLink className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export default CourseCard;
