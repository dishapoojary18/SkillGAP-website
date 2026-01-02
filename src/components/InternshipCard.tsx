import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar, DollarSign, Building2, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

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
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
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
                onClick={() => setIsOpen(true)}
              >
                View Details
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-4 mb-2">
              <div className="w-16 h-16 rounded-xl bg-secondary flex items-center justify-center shrink-0 overflow-hidden">
                {logo ? (
                  <img src={logo} alt={company} className="w-full h-full object-cover" />
                ) : (
                  <Building2 className="w-8 h-8 text-primary" />
                )}
              </div>
              <div>
                <DialogTitle className="text-left">{title}</DialogTitle>
                <DialogDescription className="text-left">{company}</DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-secondary/50">
                <p className="text-xs text-muted-foreground mb-1">Location</p>
                <p className="font-medium text-foreground flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-primary" />
                  {location}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/50">
                <p className="text-xs text-muted-foreground mb-1">Duration</p>
                <p className="font-medium text-foreground flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-primary" />
                  {duration}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/50">
                <p className="text-xs text-muted-foreground mb-1">Stipend</p>
                <p className="font-medium text-foreground flex items-center gap-1">
                  <DollarSign className="w-4 h-4 text-primary" />
                  {stipend}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/50">
                <p className="text-xs text-muted-foreground mb-1">Work Type</p>
                <p className="font-medium text-foreground">{type}</p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-secondary/50">
              <p className="text-xs text-muted-foreground mb-1">About this role</p>
              <p className="text-sm text-foreground">
                Join {company} as a {title}. This is a {duration} {type.toLowerCase()} position 
                based in {location}. You'll gain hands-on experience working with industry experts 
                and contribute to real projects.
              </p>
            </div>

            <div className="flex gap-3">
              <Button className="flex-1 gap-2" onClick={() => setIsOpen(false)}>
                <ExternalLink className="w-4 h-4" />
                Apply Now
              </Button>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InternshipCard;
