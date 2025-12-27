import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Search } from "lucide-react";

const roles = [
  { id: "frontend", name: "Frontend Developer", icon: "💻" },
  { id: "backend", name: "Backend Developer", icon: "⚙️" },
  { id: "fullstack", name: "Full Stack Developer", icon: "🚀" },
  { id: "data-scientist", name: "Data Scientist", icon: "📊" },
  { id: "ml-engineer", name: "ML Engineer", icon: "🤖" },
  { id: "devops", name: "DevOps Engineer", icon: "🔧" },
  { id: "mobile", name: "Mobile Developer", icon: "📱" },
  { id: "ui-ux", name: "UI/UX Designer", icon: "🎨" },
  { id: "product-manager", name: "Product Manager", icon: "📋" },
  { id: "qa", name: "QA Engineer", icon: "🔍" },
  { id: "cloud", name: "Cloud Architect", icon: "☁️" },
  { id: "security", name: "Security Engineer", icon: "🔐" },
];

interface RoleSelectorProps {
  selectedRole: string | null;
  onSelect: (role: string) => void;
}

const RoleSelector = ({ selectedRole, onSelect }: RoleSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search roles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground placeholder:text-muted-foreground"
        />
      </div>

      {/* Roles Grid */}
      <motion.div
        layout
        className="grid grid-cols-2 md:grid-cols-3 gap-3"
      >
        {filteredRoles.map((role) => (
          <motion.button
            key={role.id}
            layout
            onClick={() => onSelect(role.id)}
            className={`relative p-4 rounded-xl border-2 transition-all duration-200 text-left ${
              selectedRole === role.id
                ? "border-primary bg-primary/5 shadow-md"
                : "border-border hover:border-primary/50 hover:bg-secondary/50"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{role.icon}</span>
              <span className="font-medium text-sm text-foreground">
                {role.name}
              </span>
            </div>
            {selectedRole === role.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
              >
                <Check className="w-3 h-3 text-primary-foreground" />
              </motion.div>
            )}
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
};

export default RoleSelector;
