import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import { ChevronDown, Search } from "lucide-react";

const faqs = [
  {
    category: "Getting Started",
    questions: [
      {
        q: "How does SkillGAP analyze my resume?",
        a: "Our AI-powered system uses advanced natural language processing to extract skills, experience, and qualifications from your resume. It then compares these against industry-standard requirements for your target role to identify gaps.",
      },
      {
        q: "What file formats are supported for resume upload?",
        a: "We support PDF, DOC, and DOCX formats. Make sure your file is under 5MB for optimal processing.",
      },
      {
        q: "How accurate is the skill gap analysis?",
        a: "Our analysis is based on data from thousands of job postings and has an accuracy rate of over 90%. We continuously update our algorithms to reflect current industry trends.",
      },
    ],
  },
  {
    category: "Courses & Learning",
    questions: [
      {
        q: "How are courses recommended?",
        a: "Courses are recommended based on your identified skill gaps, the priority of each skill for your target role, and the quality ratings of available courses across platforms like Udemy, Coursera, and LinkedIn Learning.",
      },
      {
        q: "Are the courses free?",
        a: "We partner with various platforms that offer both free and paid courses. You can filter by price range to find courses that fit your budget.",
      },
      {
        q: "Can I track my learning progress?",
        a: "Yes! Once you create an account, you can track which courses you've completed and see how your skill profile improves over time.",
      },
    ],
  },
  {
    category: "Internships",
    questions: [
      {
        q: "How do you find internship opportunities?",
        a: "We aggregate internship listings from multiple sources including company career pages, job boards, and our direct partnerships with employers.",
      },
      {
        q: "Can I filter internships by location?",
        a: "Yes! You can filter by city, type (remote/on-site/hybrid), duration, and stipend range to find opportunities that match your preferences.",
      },
      {
        q: "Does SkillGAP guarantee internship placement?",
        a: "While we don't guarantee placement, we help you identify skill gaps and prepare you for opportunities. Our users have a significantly higher success rate in landing internships.",
      },
    ],
  },
  {
    category: "Account & Privacy",
    questions: [
      {
        q: "Is my resume data secure?",
        a: "Absolutely. We use industry-standard encryption and never share your personal data with third parties without your explicit consent.",
      },
      {
        q: "Can I delete my account and data?",
        a: "Yes, you can delete your account at any time from your profile settings. All your data will be permanently removed within 30 days.",
      },
    ],
  },
];

const QA = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const filteredFaqs = faqs
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (q) =>
          q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.a.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((category) => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-28 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-display font-bold text-foreground mb-4">
              Questions & Answers
            </h1>
            <p className="text-lg text-muted-foreground">
              Find answers to commonly asked questions about SkillGAP
            </p>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </motion.div>

          {/* FAQ Categories */}
          <div className="space-y-8">
            {filteredFaqs.map((category, categoryIndex) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + categoryIndex * 0.05 }}
              >
                <h2 className="text-xl font-display font-semibold text-foreground mb-4">
                  {category.category}
                </h2>
                <div className="space-y-3">
                  {category.questions.map((faq, index) => {
                    const itemId = `${category.category}-${index}`;
                    const isOpen = openItems.includes(itemId);

                    return (
                      <motion.div
                        key={itemId}
                        className="glass-card overflow-hidden"
                      >
                        <button
                          onClick={() => toggleItem(itemId)}
                          className="w-full p-4 text-left flex items-center justify-between gap-4"
                        >
                          <span className="font-medium text-foreground">
                            {faq.q}
                          </span>
                          <ChevronDown
                            className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <p className="px-4 pb-4 text-muted-foreground">
                                {faq.a}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>

          {filteredFaqs.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-muted-foreground">
                No questions found matching your search.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QA;
