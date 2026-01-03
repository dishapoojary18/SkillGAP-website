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
  applyUrl?: string;
}

// Generate career page URL for known companies
const getCompanyCareerUrl = (company: string, role: string): string => {
  const companyUrls: Record<string, string> = {
    "Google": "https://careers.google.com/jobs/results/?q=intern",
    "Microsoft": "https://careers.microsoft.com/students/us/en/search-results?keywords=intern",
    "Amazon": "https://www.amazon.jobs/en/search?base_query=intern",
    "Meta": "https://www.metacareers.com/jobs?q=intern",
    "Apple": "https://jobs.apple.com/en-us/search?search=intern",
    "Flipkart": "https://www.flipkartcareers.com/#!/joblist",
    "Swiggy": "https://careers.swiggy.com/",
    "Zomato": "https://www.zomato.com/careers",
    "TCS": "https://www.tcs.com/careers",
    "Infosys": "https://www.infosys.com/careers.html",
    "Wipro": "https://careers.wipro.com/",
    "Accenture": "https://www.accenture.com/in-en/careers",
    "Paytm": "https://paytm.com/careers/",
    "Razorpay": "https://razorpay.com/jobs/",
    "PhonePe": "https://www.phonepe.com/careers/",
    "Myntra": "https://www.myntra.com/careers",
    "Ola": "https://www.olacabs.com/careers",
    "BYJU'S": "https://byjus.com/careers/",
    "Uber": "https://www.uber.com/in/en/careers/",
    "Netflix": "https://jobs.netflix.com/",
    "Spotify": "https://www.lifeatspotify.com/jobs",
    "Adobe": "https://www.adobe.com/careers.html",
    "Salesforce": "https://www.salesforce.com/company/careers/",
    "IBM": "https://www.ibm.com/careers",
    "Oracle": "https://www.oracle.com/corporate/careers/",
    "SAP": "https://www.sap.com/about/careers.html",
    "Deloitte": "https://www2.deloitte.com/in/en/careers.html",
    "EY": "https://www.ey.com/en_in/careers",
    "KPMG": "https://home.kpmg/in/en/home/careers.html",
    "PwC": "https://www.pwc.in/careers.html",
  };
  
  const normalizedCompany = company.trim();
  if (companyUrls[normalizedCompany]) {
    return companyUrls[normalizedCompany];
  }
  
  // Fallback: Search on LinkedIn Jobs
  const searchQuery = encodeURIComponent(`${role} intern ${company}`);
  return `https://www.linkedin.com/jobs/search/?keywords=${searchQuery}`;
};

const InternshipCard = ({
  title,
  company,
  location,
  duration,
  stipend,
  logo,
  type,
  index,
  applyUrl,
}: InternshipCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleApply = () => {
    const url = applyUrl || getCompanyCareerUrl(company, title);
    window.open(url, "_blank", "noopener,noreferrer");
  };

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

            <div className="flex items-center justify-between mt-3 gap-2">
              <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                {type}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="default"
                  size="sm"
                  className="text-xs gap-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleApply();
                  }}
                >
                  <ExternalLink className="w-3 h-3" />
                  Apply
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                  onClick={() => setIsOpen(true)}
                >
                  Details
                </Button>
              </div>
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
              <Button className="flex-1 gap-2" onClick={handleApply}>
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
