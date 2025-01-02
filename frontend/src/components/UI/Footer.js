import React from "react";
import { Link } from "react-router-dom";
import { Camera, Linkedin, Github, Mail } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Project Info */}
          <div>
            <Link to="/" className="flex items-center mb-4">
              <Camera className="h-6 w-6 text-blue-400" />
              <span className="ml-2 text-lg font-bold">SafeCam</span>
            </Link>
            <p className="text-gray-400 text-sm">
              Real-time security monitoring system project
            </p>
          </div>

          {/* Contact & Links */}
          <div className="flex flex-col md:items-end">
            <h4 className="font-semibold mb-4">Contact & Links</h4>
            <div className="flex space-x-4">
              <a
                href="https://www.linkedin.com/in/jeon-jiwon"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://github.com/Jeonjiw"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="mailto:j.jeon@uleth.ca"
                className="text-gray-400 hover:text-white"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-6 pt-6 text-sm text-center text-gray-400">
          <p>© {new Date().getFullYear()} Jiwon Jeon - Personal Project</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
