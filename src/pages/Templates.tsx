import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { FileText, Download, Eye } from "lucide-react";

const templates = [
  {
    id: 1,
    name: "Modern Professional",
    description: "Clean and modern design perfect for tech roles",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=500&fit=crop",
    downloads: "15K+",
  },
  {
    id: 2,
    name: "Creative Designer",
    description: "Stand out with this creative and unique layout",
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&h=500&fit=crop",
    downloads: "12K+",
  },
  {
    id: 3,
    name: "Executive Classic",
    description: "Traditional format preferred by Fortune 500 companies",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=500&fit=crop",
    downloads: "20K+",
  },
  {
    id: 4,
    name: "Minimalist",
    description: "Simple and elegant design focusing on content",
    image: "https://images.unsplash.com/photo-1586282391129-76a6df230234?w=400&h=500&fit=crop",
    downloads: "18K+",
  },
  {
    id: 5,
    name: "Tech Startup",
    description: "Perfect for startup culture and tech enthusiasts",
    image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400&h=500&fit=crop",
    downloads: "10K+",
  },
  {
    id: 6,
    name: "Academic CV",
    description: "Ideal for research positions and academia",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=500&fit=crop",
    downloads: "8K+",
  },
];

const Templates = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-28 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-display font-bold text-foreground mb-4">
              Resume Templates
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose from our professionally designed resume templates to make a
              lasting impression
            </p>
          </motion.div>

          {/* Templates Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group glass-card overflow-hidden"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={template.image}
                    alt={template.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                      <Button variant="glass" size="sm" className="flex-1 gap-2">
                        <Eye className="w-4 h-4" />
                        Preview
                      </Button>
                      <Button variant="hero" size="sm" className="flex-1 gap-2">
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-foreground">
                      {template.name}
                    </h3>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      {template.downloads}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {template.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Templates;
