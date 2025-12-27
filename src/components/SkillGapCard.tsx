import { motion } from "framer-motion";
import { TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";

interface SkillGapCardProps {
  skill: string;
  currentLevel: number;
  requiredLevel: number;
  priority: "high" | "medium" | "low";
  index: number;
}

const SkillGapCard = ({
  skill,
  currentLevel,
  requiredLevel,
  priority,
  index,
}: SkillGapCardProps) => {
  const gap = requiredLevel - currentLevel;
  const gapPercentage = Math.max(0, Math.min(100, gap * 20));

  const priorityConfig = {
    high: {
      color: "text-destructive",
      bg: "bg-destructive/10",
      icon: AlertCircle,
      label: "High Priority",
    },
    medium: {
      color: "text-yellow-600",
      bg: "bg-yellow-500/10",
      icon: TrendingUp,
      label: "Medium Priority",
    },
    low: {
      color: "text-primary",
      bg: "bg-primary/10",
      icon: CheckCircle2,
      label: "Low Priority",
    },
  };

  const config = priorityConfig[priority];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="glass-card p-4 hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-foreground">{skill}</h4>
          <span
            className={`inline-flex items-center gap-1 text-xs font-medium ${config.color} mt-1`}
          >
            <Icon className="w-3 h-3" />
            {config.label}
          </span>
        </div>
        <div
          className={`px-2 py-1 rounded-lg ${config.bg} ${config.color} text-xs font-medium`}
        >
          Gap: {gap}/5
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Current: {currentLevel}/5</span>
          <span>Required: {requiredLevel}/5</span>
        </div>
        <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(currentLevel / 5) * 100}%` }}
            transition={{ delay: index * 0.05 + 0.2, duration: 0.5 }}
            className="absolute left-0 top-0 h-full bg-primary rounded-full"
          />
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(requiredLevel / 5) * 100}%` }}
            transition={{ delay: index * 0.05 + 0.3, duration: 0.5 }}
            className="absolute left-0 top-0 h-full border-2 border-primary/50 rounded-full"
            style={{ backgroundColor: "transparent" }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default SkillGapCard;
