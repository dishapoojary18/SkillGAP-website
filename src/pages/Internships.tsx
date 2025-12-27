import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import InternshipCard from "@/components/InternshipCard";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Filter, X } from "lucide-react";

const allInternships = [
  {
    id: "1",
    title: "Frontend Developer Intern",
    company: "Google",
    location: "Bangalore",
    duration: "6 months",
    stipend: "₹50,000/mo",
    logo: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=100&h=100&fit=crop",
    type: "Remote",
  },
  {
    id: "2",
    title: "Software Engineer Intern",
    company: "Microsoft",
    location: "Hyderabad",
    duration: "3 months",
    stipend: "₹45,000/mo",
    logo: "https://images.unsplash.com/photo-1633419461186-7d40a38105ec?w=100&h=100&fit=crop",
    type: "On-site",
  },
  {
    id: "3",
    title: "Data Science Intern",
    company: "Amazon",
    location: "Chennai",
    duration: "6 months",
    stipend: "₹60,000/mo",
    logo: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=100&h=100&fit=crop",
    type: "Hybrid",
  },
  {
    id: "4",
    title: "Backend Developer Intern",
    company: "Flipkart",
    location: "Bangalore",
    duration: "4 months",
    stipend: "₹40,000/mo",
    logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100&h=100&fit=crop",
    type: "Remote",
  },
  {
    id: "5",
    title: "ML Engineer Intern",
    company: "Swiggy",
    location: "Mumbai",
    duration: "6 months",
    stipend: "₹55,000/mo",
    logo: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=100&h=100&fit=crop",
    type: "Hybrid",
  },
  {
    id: "6",
    title: "Full Stack Intern",
    company: "Razorpay",
    location: "Bangalore",
    duration: "5 months",
    stipend: "₹48,000/mo",
    logo: "https://images.unsplash.com/photo-1560472355-536de3962603?w=100&h=100&fit=crop",
    type: "On-site",
  },
  {
    id: "7",
    title: "DevOps Intern",
    company: "Zomato",
    location: "Delhi",
    duration: "3 months",
    stipend: "₹35,000/mo",
    logo: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=100&h=100&fit=crop",
    type: "Remote",
  },
  {
    id: "8",
    title: "UI/UX Design Intern",
    company: "Paytm",
    location: "Noida",
    duration: "4 months",
    stipend: "₹30,000/mo",
    logo: "https://images.unsplash.com/photo-1622675363311-3e1904dc1885?w=100&h=100&fit=crop",
    type: "Hybrid",
  },
];

const locations = [
  "All Locations",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Mumbai",
  "Delhi",
  "Noida",
  "Pune",
];

const types = ["All Types", "Remote", "On-site", "Hybrid"];

const Internships = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedType, setSelectedType] = useState("All Types");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredInternships = allInternships.filter((internship) => {
    const matchesSearch =
      internship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      internship.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation =
      selectedLocation === "All Locations" ||
      internship.location === selectedLocation;
    const matchesType =
      selectedType === "All Types" || internship.type === selectedType;
    return matchesSearch && matchesLocation && matchesType;
  });

  const clearFilters = () => {
    setSelectedLocation("All Locations");
    setSelectedType("All Types");
    setSearchQuery("");
  };

  const hasActiveFilters =
    selectedLocation !== "All Locations" ||
    selectedType !== "All Types" ||
    searchQuery !== "";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-28 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-display font-bold text-foreground mb-2">
              Internship Opportunities
            </h1>
            <p className="text-muted-foreground">
              Discover {filteredInternships.length} internships matching your
              skills
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search internships..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground placeholder:text-muted-foreground"
                />
              </div>

              {/* Filter Toggle (Mobile) */}
              <Button
                variant="outline"
                className="md:hidden gap-2"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <Filter className="w-4 h-4" />
                Filters
              </Button>

              {/* Desktop Filters */}
              <div className="hidden md:flex gap-4">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="pl-10 pr-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary outline-none appearance-none cursor-pointer min-w-[180px] text-foreground"
                  >
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary outline-none appearance-none cursor-pointer min-w-[140px] text-foreground"
                >
                  {types.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>

                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="gap-1"
                  >
                    <X className="w-4 h-4" />
                    Clear
                  </Button>
                )}
              </div>
            </div>

            {/* Mobile Filters */}
            {isFilterOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden mt-4 p-4 glass-card"
              >
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Location
                    </label>
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary outline-none text-foreground"
                    >
                      {locations.map((loc) => (
                        <option key={loc} value={loc}>
                          {loc}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Type
                    </label>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary outline-none text-foreground"
                    >
                      {types.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  {hasActiveFilters && (
                    <Button
                      variant="soft"
                      className="w-full"
                      onClick={clearFilters}
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Results */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredInternships.map((internship, index) => (
              <InternshipCard key={internship.id} {...internship} index={index} />
            ))}
          </div>

          {filteredInternships.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <p className="text-muted-foreground text-lg">
                No internships found matching your criteria
              </p>
              <Button
                variant="soft"
                className="mt-4"
                onClick={clearFilters}
              >
                Clear Filters
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Internships;
