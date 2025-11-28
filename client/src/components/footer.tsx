import type React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="site-container shadow-md bg-surface text-secondary-var py-6 w-full">
      <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-6 w-full">
        <div className="flex flex-col gap-2 font-light">
          <p>tel: +250 788 123 456</p>
          <p>
            email: <a href="mailto:teteajamii@gm.com" className="text-accent hover:underline">teteajamii@gm.com</a>
          </p>
        </div>

        <div className="flex flex-row gap-4 items-center justify-start md:justify-end">
          <a
            href="https://www.facebook.com/teteajamii"
            target="_blank"
            rel="noopener noreferrer"
            className="text-secondary-var hover-text-accent transition-colors"
            aria-label="Facebook"
          >
            Facebook
          </a>
          <a
            href="https://www.twitter.com/teteajamii"
            target="_blank"
            rel="noopener noreferrer"
            className="text-secondary-var hover-text-accent transition-colors"
            aria-label="Twitter"
          >
            Twitter
          </a>
          <a
            href="https://www.instagram.com/teteajamii"
            target="_blank"
            rel="noopener noreferrer"
            className="text-secondary-var hover-text-accent transition-colors"
            aria-label="Instagram"
          >
            Instagram
          </a>
          <a
            href="https://www.linkedin.com/company/teteajamii"
            target="_blank"
            rel="noopener noreferrer"
            className="text-secondary-var hover-text-accent transition-colors"
            aria-label="LinkedIn"
          >
            LinkedIn
          </a>
        </div>
      </div>

      <div className="text-center text-sm text-secondary-var">
        &copy; {new Date().getFullYear()} Tetea Jami. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
