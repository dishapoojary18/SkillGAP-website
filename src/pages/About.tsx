import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { Users, Target, Award, Heart } from "lucide-react";

const About = () => {
  const team = [
    {
      name: "Rahul Sharma",
      role: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    },
    {
      name: "Priya Patel",
      role: "CTO",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    },
    {
      name: "Amit Kumar",
      role: "Head of AI",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
    },
    {
      name: "Sneha Reddy",
      role: "Product Lead",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
    },
  ];

  const values = [
    {
      icon: Target,
      title: "Mission Driven",
      description: "We're on a mission to democratize career guidance and make skill development accessible to everyone.",
    },
    {
      icon: Users,
      title: "Student First",
      description: "Every decision we make is centered around helping students succeed in their career journey.",
    },
    {
      icon: Award,
      title: "Excellence",
      description: "We strive for excellence in everything we do, from our AI algorithms to our user experience.",
    },
    {
      icon: Heart,
      title: "Empathy",
      description: "We understand the challenges students face and build solutions that truly address their needs.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-28 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              About <span className="gradient-text">SkillGAP</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're building the future of career development by combining AI
              technology with personalized learning paths.
            </p>
          </motion.div>

          {/* Story */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-8 md:p-12 mb-16"
          >
            <h2 className="text-2xl font-display font-bold text-foreground mb-4">
              Our Story
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                SkillGAP was born from a simple observation: countless talented
                students struggle to bridge the gap between their academic
                knowledge and industry requirements. Our founders, having
                experienced this challenge firsthand, decided to create a
                solution.
              </p>
              <p>
                Founded in 2023, we've already helped over 10,000 students
                identify their skill gaps and chart a clear path to their dream
                careers. Our AI-powered platform analyzes resumes, maps skills
                to industry requirements, and recommends personalized learning
                paths.
              </p>
              <p>
                Today, we partner with leading educational platforms and
                companies to provide students with the most relevant courses and
                internship opportunities. Our mission is to ensure no student is
                left behind in the rapidly evolving job market.
              </p>
            </div>
          </motion.div>

          {/* Values */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-display font-bold text-foreground mb-8 text-center">
              Our Values
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="glass-card p-6 text-center"
                >
                  <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <value.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {value.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Team */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-display font-bold text-foreground mb-8 text-center">
              Meet the Team
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="glass-card p-6 text-center group"
                >
                  <div className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-4 ring-4 ring-primary/20 group-hover:ring-primary/40 transition-all">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-foreground">
                    {member.name}
                  </h3>
                  <p className="text-sm text-primary">{member.role}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default About;
