import { motion } from "framer-motion";
import { ExternalLink, Star, Clock, Users } from "lucide-react";
import { Button } from "./ui/button";

// Import local platform logos
import logoUdemy from "@/assets/logo-udemy.png";
import logoCoursera from "@/assets/logo-coursera.png";
import logoLinkedIn from "@/assets/logo-linkedin.png";
import logoEdx from "@/assets/logo-edx.png";
import logoPluralsight from "@/assets/logo-pluralsight.png";
import logoSkillshare from "@/assets/logo-skillshare.png";

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
    Skillshare: "bg-teal-500",
    Udacity: "bg-blue-600",
  };

  const providerLogos: Record<string, string> = {
    Udemy: logoUdemy,
    Coursera: logoCoursera,
    "LinkedIn Learning": logoLinkedIn,
    edX: logoEdx,
    Pluralsight: logoPluralsight,
    Skillshare: logoSkillshare,
  };

  const logo = providerLogos[provider];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="group glass-card overflow-hidden hover:shadow-lg transition-all duration-300"
    >
      <div className="relative h-40 overflow-hidden bg-gradient-to-br from-muted/50 to-muted">
        {/* Platform logo as background */}
        <div className="absolute inset-0 flex items-center justify-center">
          {logo ? (
            <img
              src={logo}
              alt={`${provider} logo`}
              className="w-20 h-20 object-contain opacity-30"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-3xl font-bold text-primary/30">
                {provider.charAt(0)}
              </span>
            </div>
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
        <div
          className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium text-primary-foreground flex items-center gap-2 ${
            providerColors[provider] || "bg-primary"
          }`}
        >
          {logo && (
            <img
              src={logo}
              alt=""
              className="w-4 h-4 object-contain brightness-0 invert"
            />
          )}
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
            <span>{typeof rating === 'number' ? rating.toFixed(1) : rating}</span>
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
