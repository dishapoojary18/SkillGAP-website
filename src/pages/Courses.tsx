import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import CourseCard from "@/components/CourseCard";
import { useState } from "react";
import { Search } from "lucide-react";

const allCourses = [
  {
    title: "React - The Complete Guide 2026",
    provider: "Udemy",
    rating: 4.8,
    duration: "40 hours",
    students: "500K+",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=200&fit=crop",
    url: "https://udemy.com",
    skill: "React.js",
  },
  {
    title: "TypeScript for Professionals",
    provider: "Coursera",
    rating: 4.7,
    duration: "25 hours",
    students: "200K+",
    image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=200&fit=crop",
    url: "https://coursera.org",
    skill: "TypeScript",
  },
  {
    title: "Node.js Complete Bootcamp",
    provider: "Udemy",
    rating: 4.9,
    duration: "35 hours",
    students: "300K+",
    image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=200&fit=crop",
    url: "https://udemy.com",
    skill: "Node.js",
  },
  {
    title: "System Design Fundamentals",
    provider: "LinkedIn Learning",
    rating: 4.6,
    duration: "15 hours",
    students: "150K+",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop",
    url: "https://linkedin.com/learning",
    skill: "System Design",
  },
  {
    title: "Python for Data Science",
    provider: "Coursera",
    rating: 4.8,
    duration: "30 hours",
    students: "400K+",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=200&fit=crop",
    url: "https://coursera.org",
    skill: "Python",
  },
  {
    title: "AWS Cloud Practitioner",
    provider: "Pluralsight",
    rating: 4.7,
    duration: "20 hours",
    students: "180K+",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=200&fit=crop",
    url: "https://pluralsight.com",
    skill: "AWS",
  },
  {
    title: "Docker & Kubernetes Mastery",
    provider: "Udemy",
    rating: 4.8,
    duration: "22 hours",
    students: "250K+",
    image: "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=400&h=200&fit=crop",
    url: "https://udemy.com",
    skill: "DevOps",
  },
  {
    title: "Machine Learning A-Z",
    provider: "edX",
    rating: 4.9,
    duration: "45 hours",
    students: "350K+",
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=200&fit=crop",
    url: "https://edx.org",
    skill: "Machine Learning",
  },
];

const skills = ["All", "React.js", "TypeScript", "Node.js", "Python", "AWS", "DevOps", "Machine Learning", "System Design"];

const Courses = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("All");

  const filteredCourses = allCourses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.provider.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSkill = selectedSkill === "All" || course.skill === selectedSkill;
    return matchesSearch && matchesSkill;
  });

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
              Certificate Courses
            </h1>
            <p className="text-muted-foreground">
              Curated courses from top platforms to upskill yourself
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 space-y-4"
          >
            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {/* Skill Filters */}
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <button
                  key={skill}
                  onClick={() => setSelectedSkill(skill)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedSkill === skill
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-primary/10"
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Courses Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredCourses.map((course, index) => (
              <CourseCard key={course.title} {...course} index={index} />
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <p className="text-muted-foreground text-lg">
                No courses found matching your criteria
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Courses;
