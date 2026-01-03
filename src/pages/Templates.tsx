import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileText, Download, Eye, Briefcase, File } from "lucide-react";
import { toast } from "sonner";

interface Template {
  id: number;
  name: string;
  description: string;
  image: string;
  downloads: string;
  category: "resume" | "internship";
  content: string;
}

const templates: Template[] = [
  // Resume Templates
  {
    id: 1,
    name: "Modern Professional",
    description: "Clean and modern design perfect for tech roles",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=500&fit=crop",
    downloads: "15K+",
    category: "resume",
    content: `RESUME TEMPLATE - Modern Professional

[YOUR NAME]
[Your Email] | [Your Phone] | [LinkedIn URL] | [Portfolio URL]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PROFESSIONAL SUMMARY
────────────────────
[2-3 sentences highlighting your key skills, experience, and career objectives]

EDUCATION
─────────
[Degree Name] | [University Name] | [Graduation Year]
• GPA: [X.XX/4.0]
• Relevant Coursework: [Course 1], [Course 2], [Course 3]

EXPERIENCE
──────────
[Job Title] | [Company Name] | [Start Date - End Date]
• [Achievement/responsibility with quantifiable results]
• [Achievement/responsibility with quantifiable results]
• [Achievement/responsibility with quantifiable results]

PROJECTS
────────
[Project Name] | [Technologies Used]
• [Brief description of project and your role]
• [Key achievement or impact]

SKILLS
──────
Languages: [Python, JavaScript, Java, etc.]
Frameworks: [React, Node.js, Django, etc.]
Tools: [Git, Docker, AWS, etc.]

CERTIFICATIONS
──────────────
• [Certification Name] - [Issuing Organization] - [Year]
`,
  },
  {
    id: 2,
    name: "Creative Designer",
    description: "Stand out with this creative and unique layout",
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&h=500&fit=crop",
    downloads: "12K+",
    category: "resume",
    content: `✦ CREATIVE RESUME TEMPLATE ✦

╔══════════════════════════════════════════╗
║              [YOUR NAME]                  ║
║     Creative Professional & Designer      ║
╚══════════════════════════════════════════╝

◈ CONTACT
  📧 [email@example.com]
  📱 [+91 XXXXX XXXXX]
  🔗 [portfolio.com]
  💼 [linkedin.com/in/yourname]

◈ ABOUT ME
  [A creative introduction about yourself, your passions, 
   and what drives your work - 2-3 sentences]

◈ EXPERIENCE
  ┌─────────────────────────────────────────┐
  │ [Role] @ [Company]                      │
  │ [Duration]                               │
  ├─────────────────────────────────────────┤
  │ • [Creative achievement]                 │
  │ • [Project highlight]                    │
  │ • [Impact statement]                     │
  └─────────────────────────────────────────┘

◈ EDUCATION
  🎓 [Degree] - [University] - [Year]

◈ SKILLS
  ▸ Design: Figma, Adobe XD, Photoshop
  ▸ Development: HTML, CSS, JavaScript
  ▸ Tools: Git, Notion, Slack

◈ PORTFOLIO HIGHLIGHTS
  ★ [Project 1] - [Brief description]
  ★ [Project 2] - [Brief description]
`,
  },
  {
    id: 3,
    name: "Executive Classic",
    description: "Traditional format preferred by Fortune 500 companies",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=500&fit=crop",
    downloads: "20K+",
    category: "resume",
    content: `EXECUTIVE RESUME

[FULL NAME]
[Address] | [Phone] | [Email] | [LinkedIn]

═══════════════════════════════════════════════════════════

EXECUTIVE SUMMARY
A results-driven professional with [X] years of experience in 
[industry/field]. Proven track record of [key achievement]. 
Seeking to leverage expertise in [skill areas] to drive growth at [target company type].

PROFESSIONAL EXPERIENCE

[COMPANY NAME] — [Location]
[Job Title]                                    [Start - End Date]

• Led [initiative] resulting in [X]% improvement in [metric]
• Managed team of [X] professionals across [departments/regions]
• Developed and implemented [strategy] generating [$ amount] in revenue
• Collaborated with C-suite executives on [strategic initiatives]

EDUCATION

[DEGREE] in [Field]
[University Name], [Location]                         [Year]

CERTIFICATIONS & AFFILIATIONS

• [Professional Certification]
• Member, [Professional Organization]

CORE COMPETENCIES

Strategic Planning | Team Leadership | P&L Management
Business Development | Stakeholder Relations | Change Management
`,
  },
  {
    id: 4,
    name: "Minimalist",
    description: "Simple and elegant design focusing on content",
    image: "https://images.unsplash.com/photo-1586282391129-76a6df230234?w=400&h=500&fit=crop",
    downloads: "18K+",
    category: "resume",
    content: `[Your Name]
[email] · [phone] · [location]


About
─────
[One paragraph summary of your professional background]


Experience
──────────
[Title] · [Company] · [Dates]
[Brief description of role and achievements]

[Title] · [Company] · [Dates]
[Brief description of role and achievements]


Education
─────────
[Degree] · [University] · [Year]


Skills
──────
[Skill 1] · [Skill 2] · [Skill 3] · [Skill 4]
`,
  },
  // Internship Templates
  {
    id: 5,
    name: "Internship Cover Letter",
    description: "Professional cover letter template for internship applications",
    image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400&h=500&fit=crop",
    downloads: "25K+",
    category: "internship",
    content: `INTERNSHIP COVER LETTER TEMPLATE

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Your Name]
[Your Address]
[City, State, PIN]
[Your Email]
[Your Phone Number]
[Date]

[Hiring Manager's Name]
[Company Name]
[Company Address]
[City, State, PIN]

Dear [Hiring Manager's Name / Hiring Team],

I am writing to express my strong interest in the [Internship Position] at [Company Name], as advertised on [where you found the position]. As a [Year] year student pursuing [Degree] at [University Name], I am eager to apply my academic knowledge and contribute to your team.

WHAT EXCITES ME ABOUT THIS OPPORTUNITY:
• [Specific reason related to company's work/mission]
• [How the role aligns with your career goals]
• [What you admire about the company]

WHAT I BRING TO THE TABLE:
• [Relevant skill/experience #1 with brief example]
• [Relevant skill/experience #2 with brief example]
• [Academic achievement or project relevant to the role]

I am particularly drawn to [Company Name]'s commitment to [specific company value/project/initiative]. My coursework in [relevant subjects] and hands-on experience with [relevant projects/technologies] have prepared me to make meaningful contributions to your team.

I would welcome the opportunity to discuss how my skills and enthusiasm can benefit [Company Name]. Thank you for considering my application. I look forward to hearing from you.

Sincerely,
[Your Name]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TIPS FOR CUSTOMIZATION:
✓ Research the company thoroughly before writing
✓ Mention specific projects or values that resonate with you
✓ Quantify achievements where possible
✓ Keep it to one page
✓ Proofread multiple times
`,
  },
  {
    id: 6,
    name: "Internship Application Email",
    description: "Email template for reaching out to companies for internships",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=500&fit=crop",
    downloads: "30K+",
    category: "internship",
    content: `INTERNSHIP APPLICATION EMAIL TEMPLATE

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SUBJECT LINE OPTIONS:
• Application for [Position] Internship - [Your Name]
• [University Name] Student Interested in [Role] Internship
• Referred by [Name]: [Position] Internship Application

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EMAIL BODY:

Dear [Hiring Manager's Name],

I hope this email finds you well. I am [Your Name], a [Year] year [Degree] student at [University], and I am writing to inquire about internship opportunities in [Department/Team] at [Company Name].

WHY [COMPANY NAME]:
I have been following [Company Name]'s work in [specific area], and I am particularly impressed by [recent project/achievement/news]. Your commitment to [company value] aligns perfectly with my career aspirations.

MY BACKGROUND:
• Currently pursuing [Degree] with focus on [relevant subjects]
• Completed projects in [relevant area] including [specific project]
• Proficient in [relevant skills/technologies]
• [Any relevant experience, competitions, or achievements]

I have attached my resume for your review. I would be grateful for the opportunity to discuss how I can contribute to your team, even if there are no formal openings at this time.

Thank you for your time and consideration. I look forward to the possibility of connecting.

Best regards,
[Your Name]
[Phone Number]
[LinkedIn Profile URL]
[Portfolio URL (if applicable)]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ATTACHMENTS TO INCLUDE:
📎 Resume (PDF format)
📎 Portfolio link (if applicable)
📎 Relevant project documentation (optional)
`,
  },
  {
    id: 7,
    name: "Internship Resume (Fresher)",
    description: "Resume template designed specifically for students with no experience",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop",
    downloads: "35K+",
    category: "internship",
    content: `FRESHER INTERNSHIP RESUME

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[YOUR FULL NAME]
[Email] | [Phone] | [LinkedIn] | [GitHub/Portfolio]
[City, State]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

OBJECTIVE
─────────
Enthusiastic [Year] year [Degree] student at [University] seeking a 
[Duration] internship in [Field/Role]. Eager to apply classroom 
knowledge in a real-world setting while contributing fresh perspectives 
to the team.

EDUCATION
─────────
[Degree Name]
[University Name] | Expected Graduation: [Month Year]
• CGPA: [X.XX] / 10
• Relevant Coursework: [Course 1], [Course 2], [Course 3], [Course 4]
• Academic Achievements: [Dean's List, Scholarships, etc.]

PROJECTS
────────
[Project Name 1] | [Technologies Used] | [Date]
• [What the project does - one line]
• [Your specific contribution]
• [Impact/Result - e.g., "Used by 100+ students" or "Achieved 95% accuracy"]
• GitHub: [link]

[Project Name 2] | [Technologies Used] | [Date]
• [Brief description and your role]
• [Key achievement or learning]

TECHNICAL SKILLS
────────────────
Languages:     [Python, Java, JavaScript, C++]
Frameworks:    [React, Node.js, Django, Flask]
Databases:     [MySQL, MongoDB, PostgreSQL]
Tools:         [Git, Docker, VS Code, Postman]
Platforms:     [Linux, AWS, Heroku]

EXTRACURRICULAR ACTIVITIES
──────────────────────────
• [Club/Organization] - [Role] | [Duration]
  - [Key responsibility or achievement]
  
• [Competition/Hackathon] - [Position/Achievement] | [Date]
  - [Brief description of what you built/achieved]

CERTIFICATIONS
──────────────
• [Certification Name] - [Platform] | [Date]
• [Certification Name] - [Platform] | [Date]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TIPS FOR FRESHERS:
✓ Lead with your strongest projects
✓ Include GitHub links for all technical projects
✓ Highlight transferable skills from extracurriculars
✓ Tailor this resume for each application
✓ Keep it to one page
`,
  },
  {
    id: 8,
    name: "Thank You Email (Post-Interview)",
    description: "Follow-up email template after internship interview",
    image: "https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?w=400&h=500&fit=crop",
    downloads: "18K+",
    category: "internship",
    content: `POST-INTERVIEW THANK YOU EMAIL

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SUBJECT: Thank You - [Position] Interview | [Your Name]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Dear [Interviewer's Name],

Thank you for taking the time to meet with me today to discuss the [Position] internship at [Company Name]. I truly enjoyed learning more about the role and your team's work on [specific project/initiative discussed].

KEY TAKEAWAYS FROM OUR CONVERSATION:
Our discussion about [specific topic] was particularly exciting. I was especially intrigued by [something specific the interviewer mentioned about the role or company].

WHY I'M EXCITED:
After our conversation, I am even more enthusiastic about the opportunity to contribute to [Company Name]. My experience with [relevant skill/project] aligns well with the team's goals, and I am confident I can make a meaningful impact.

FOLLOW-UP ON DISCUSSION:
[If applicable: "As we discussed, I'm attaching [additional materials/portfolio piece/solution to a problem discussed]."]

Thank you again for this opportunity. Please don't hesitate to reach out if you need any additional information from me. I look forward to hearing about the next steps.

Best regards,
[Your Name]
[Phone Number]
[Email]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TIMING TIPS:
⏰ Send within 24 hours of the interview
⏰ If you interviewed with multiple people, send personalized emails to each
⏰ Keep it brief but genuine
`,
  },
  {
    id: 9,
    name: "LinkedIn Message Template",
    description: "Cold outreach template for connecting with recruiters/hiring managers",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=500&fit=crop",
    downloads: "22K+",
    category: "internship",
    content: `LINKEDIN OUTREACH TEMPLATES

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TEMPLATE 1: CONNECTION REQUEST NOTE (300 characters max)

Hi [Name], I'm a [Year] year [Degree] student at [University] passionate about [field]. I've been following [Company]'s work in [area] and would love to connect and learn more about opportunities on your team. Thank you!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TEMPLATE 2: FOLLOW-UP MESSAGE (After Connection Accepted)

Hi [Name],

Thank you for connecting! I'm currently a [Year] year student at [University] studying [Major], and I'm actively seeking internship opportunities in [field].

I noticed [Company] is working on [specific project/product], which aligns perfectly with my interests in [relevant area]. I've been developing my skills in [relevant skills] through [projects/coursework].

Would you be open to a brief 15-minute call to share insights about your experience at [Company] and any advice for aspiring interns?

Thank you for your time!
[Your Name]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TEMPLATE 3: INFORMATIONAL INTERVIEW REQUEST

Subject: Quick Question from [University] Student

Hi [Name],

I hope this message finds you well. I'm [Your Name], a [Major] student at [University], and I came across your profile while researching [Company/Industry].

Your journey from [their background] to [current role] is inspiring. I'm particularly curious about [specific aspect of their career].

Would you be willing to spare 15-20 minutes for a virtual coffee chat? I'd love to hear your insights on breaking into [industry/role].

No worries if you're too busy - I understand! Either way, thank you for your time.

Best,
[Your Name]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DOS AND DON'TS:
✓ Personalize every message
✓ Keep it concise and respectful
✓ Mention specific things about them/company
✗ Don't send generic copy-paste messages
✗ Don't ask for a job directly in first message
✗ Don't attach your resume unsolicited
`,
  },
  {
    id: 10,
    name: "Internship Acceptance Letter",
    description: "Template for formally accepting an internship offer",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=500&fit=crop",
    downloads: "12K+",
    category: "internship",
    content: `INTERNSHIP OFFER ACCEPTANCE LETTER

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Your Name]
[Your Address]
[City, State, PIN]
[Your Email]
[Your Phone]
[Date]

[HR Manager's Name]
[Company Name]
[Company Address]
[City, State, PIN]

Subject: Acceptance of Internship Offer - [Position Title]

Dear [HR Manager's Name],

I am thrilled to formally accept the offer for the [Position Title] internship at [Company Name]. Thank you for this incredible opportunity to join your team.

CONFIRMATION OF TERMS:
• Position: [Internship Title]
• Start Date: [Date]
• Duration: [X months]
• Stipend: ₹[Amount] per month
• Location: [Office Location / Remote]
• Reporting Manager: [Name, if known]

I am excited to contribute to [specific project/team/department mentioned during interviews] and am committed to making the most of this learning opportunity. The work that [Company Name] is doing in [area] aligns perfectly with my career goals.

PRE-JOINING REQUIREMENTS:
I will complete all necessary documentation and formalities before the start date. Please let me know if you need any additional information or documents from my end.

Thank you once again for believing in my potential. I look forward to joining [Company Name] on [Start Date] and contributing to the team's success.

Warm regards,
[Your Full Name]
[Phone Number]
[Email Address]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CHECKLIST BEFORE SENDING:
☐ Verify all details (dates, stipend, position) match the offer letter
☐ Proofread for errors
☐ Send within the acceptance deadline
☐ Keep a copy for your records
`,
  },
];

const Templates = () => {
  const [activeCategory, setActiveCategory] = useState<"all" | "resume" | "internship">("all");
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  const filteredTemplates = activeCategory === "all" 
    ? templates 
    : templates.filter(t => t.category === activeCategory);

  const handleDownload = (template: Template) => {
    const blob = new Blob([template.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${template.name.replace(/\s+/g, "-").toLowerCase()}-template.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded: ${template.name}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-28 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-display font-bold text-foreground mb-4">
              Templates Library
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Professional templates for resumes, cover letters, and internship applications
            </p>
          </motion.div>

          {/* Category Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex justify-center gap-2 mb-8"
          >
            {[
              { id: "all", label: "All Templates", icon: FileText },
              { id: "resume", label: "Resume Templates", icon: File },
              { id: "internship", label: "Internship Templates", icon: Briefcase },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id as typeof activeCategory)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  activeCategory === tab.id
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </motion.div>

          {/* Templates Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group glass-card overflow-hidden"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={template.image}
                    alt={template.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      template.category === "internship" 
                        ? "bg-accent/90 text-accent-foreground" 
                        : "bg-primary/90 text-primary-foreground"
                    }`}>
                      {template.category === "internship" ? "Internship" : "Resume"}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                      <Button
                        variant="glass"
                        size="sm"
                        className="flex-1 gap-2"
                        onClick={() => setPreviewTemplate(template)}
                      >
                        <Eye className="w-4 h-4" />
                        Preview
                      </Button>
                      <Button
                        variant="hero"
                        size="sm"
                        className="flex-1 gap-2"
                        onClick={() => handleDownload(template)}
                      >
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
                      <Download className="w-3 h-3" />
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

      {/* Preview Dialog */}
      <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {previewTemplate?.category === "internship" ? (
                <Briefcase className="w-5 h-5 text-accent" />
              ) : (
                <FileText className="w-5 h-5 text-primary" />
              )}
              {previewTemplate?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto bg-secondary/30 rounded-lg p-6">
            <pre className="whitespace-pre-wrap text-sm text-foreground font-mono leading-relaxed">
              {previewTemplate?.content}
            </pre>
          </div>
          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="hero"
              className="flex-1 gap-2"
              onClick={() => {
                if (previewTemplate) {
                  handleDownload(previewTemplate);
                }
              }}
            >
              <Download className="w-4 h-4" />
              Download Template
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                if (previewTemplate) {
                  navigator.clipboard.writeText(previewTemplate.content);
                  toast.success("Copied to clipboard!");
                }
              }}
            >
              Copy to Clipboard
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Templates;
