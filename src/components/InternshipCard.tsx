import { motion } from "framer-motion";
import { MapPin, Calendar, DollarSign, Building2 } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

interface InternshipCardProps {
  id: string;
  title: string;
  company: string;
  location: string;
  duration: string;
  stipend: string;
  logo: string;
  type: string;
  index: number;
}

const InternshipCard = ({
  id,
  title,
  company,
  location,
  duration,
  stipend,
  logo,
  type,
  index,
}: InternshipCardProps) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="glass-card p-4 hover:shadow-lg transition-all duration-300 group"
    >
      <div className="flex gap-4">
        <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center shrink-0 overflow-hidden">
          {logo ? (
            <img src={logo} alt={company} className="w-full h-full object-cover" />
          ) : (
            <Building2 className="w-6 h-6 text-primary" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
            {title}
          </h4>
          <p className="text-sm text-muted-foreground">{company}</p>

          <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {location}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {duration}
            </span>
            <span className="flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              {stipend}
            </span>
          </div>

          <div className="flex items-center justify-between mt-3">
            <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
              {type}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={() => navigate(`/internships/${id}`)}
            >
              View Details
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default InternshipCard;
