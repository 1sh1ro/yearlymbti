import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";

const XIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-4 h-4"
    fill="currentColor"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const SocialLinks = () => {
  return (
    <div className="fixed top-4 left-4 z-50 flex gap-2">
      <Button
        variant="ghost"
        size="sm"
        asChild
        className="bg-card/90 backdrop-blur-md border border-border/50 hover:bg-card hover:border-primary/40 shadow-sm hover:shadow-md transition-all duration-300 rounded-xl"
      >
        <a
          href="https://x.com/xulaswa/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="X (Twitter)"
        >
          <XIcon />
        </a>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        asChild
        className="bg-card/90 backdrop-blur-md border border-border/50 hover:bg-card hover:border-primary/40 shadow-sm hover:shadow-md transition-all duration-300 rounded-xl"
      >
        <a
          href="https://github.com/xulaswa"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
        >
          <Github className="w-4 h-4" />
        </a>
      </Button>
    </div>
  );
};

export default SocialLinks;
