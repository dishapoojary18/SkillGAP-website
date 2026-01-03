import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import InternshipCard from "@/components/InternshipCard";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Filter, X } from "lucide-react";

const allInternships = [
  {
    id: "2",
    title: "Software Engineering Intern",
    company: "Microsoft",
    location: "Hyderabad",
    duration: "May - Jul 2025",
    stipend: "₹1,25,000/mo",
    logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/microsoft.svg",
    type: "Hybrid",
    applyUrl: "https://careers.microsoft.com/",
  },
  {
    id: "3",
    title: "SDE Intern",
    company: "Amazon",
    location: "Bangalore",
    duration: "Jan - Jun 2025",
    stipend: "₹1,00,000/mo",
    logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/amazon.svg",
    type: "On-site",
    applyUrl: "https://www.amazon.jobs/en/",
  },
  {
    id: "4",
    title: "Product Engineering Intern",
    company: "Flipkart",
    location: "Bangalore",
    duration: "Jan - Jun 2025",
    stipend: "₹80,000/mo",
    logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/flipkart.svg",
    type: "On-site",
    applyUrl: "https://www.flipkartcareers.com/",
  },
  {
    id: "5",
    title: "Data Science Intern",
    company: "Swiggy",
    location: "Bangalore",
    duration: "Feb - Jul 2025",
    stipend: "₹60,000/mo",
    logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/swiggy.svg",
    type: "Hybrid",
    applyUrl: "https://careers.swiggy.com/",
  },
  {
    id: "6",
    title: "Backend Engineering Intern",
    company: "Razorpay",
    location: "Bangalore",
    duration: "Jan - Jun 2025",
    stipend: "₹75,000/mo",
    logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/razorpay.svg",
    type: "On-site",
    applyUrl: "https://razorpay.com/jobs/",
  },
  {
    id: "7",
    title: "Technology Analyst Intern",
    company: "Goldman Sachs",
    location: "Bangalore",
    duration: "May - Jul 2025",
    stipend: "₹1,30,000/mo",
    logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/goldmansachs.svg",
    type: "On-site",
    applyUrl: "https://www.goldmansachs.com/careers/",
  },
  {
    id: "8",
    title: "Software Development Intern",
    company: "Atlassian",
    location: "Bangalore",
    duration: "May - Aug 2025",
    stipend: "₹1,20,000/mo",
    logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/atlassian.svg",
    type: "Hybrid",
    applyUrl: "https://www.atlassian.com/company/careers/all-jobs",
  },
  {
    id: "9",
    title: "ML Engineering Intern",
    company: "Uber",
    location: "Hyderabad",
    duration: "Jan - Jun 2025",
    stipend: "₹90,000/mo",
    logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/uber.svg",
    type: "On-site",
    applyUrl: "https://www.uber.com/in/en/careers/",
  },
  {
    id: "10",
    title: "Platform Engineering Intern",
    company: "PhonePe",
    location: "Bangalore",
    duration: "Feb - Jul 2025",
    stipend: "₹70,000/mo",
    logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/phonepe.svg",
    type: "Hybrid",
    applyUrl: "https://www.phonepe.com/careers/",
  },
  {
    id: "11",
    title: "Research Intern",
    company: "Adobe",
    location: "Noida",
    duration: "May - Aug 2025",
    stipend: "₹1,10,000/mo",
    logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/adobe.svg",
    type: "On-site",
    applyUrl: "https://www.adobe.com/careers.html",
  },
  {
    id: "12",
    title: "UI/UX Design Intern",
    company: "Zomato",
    location: "Gurugram",
    duration: "Jan - Apr 2025",
    stipend: "₹50,000/mo",
    logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/zomato.svg",
    type: "Hybrid",
    applyUrl: "https://www.zomato.com/careers",
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
