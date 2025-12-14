import React from 'react';
import { Section } from './ui/Section';
import { Github, Zap, Layout, GitBranch, Share2, Clock } from 'lucide-react';

const features = [
  {
    title: "GitHub Integration",
    description: "Seamlessly connects to your repositories with one click OAuth flow.",
    icon: <Github className="w-6 h-6" />
  },
  {
    title: "AI Analysis",
    description: "Deep semantic understanding of your code logic using Gemini Pro.",
    icon: <Zap className="w-6 h-6" />
  },
  {
    title: "Smart Viewer",
    description: "Interactive documentation viewer with search and filtering.",
    icon: <Layout className="w-6 h-6" />
  },
  {
    title: "Commit Tracking",
    description: "Automatically updates docs when you push new commits.",
    icon: <GitBranch className="w-6 h-6" />
  },
  {
    title: "Instant Export",
    description: "Export to Markdown, PDF, HTML, or LaTeX instantly.",
    icon: <Share2 className="w-6 h-6" />
  },
  {
    title: "History Time Machine",
    description: "View documentation versions for any previous commit.",
    icon: <Clock className="w-6 h-6" />
  }
];

export const Features: React.FC = () => {
  return (
    <Section id="features" className="bg-darker">
      <div className="container mx-auto">
        <div className="mb-16">
          <h2 className="text-4xl font-bold mb-4">Built for Power Users</h2>
          <div className="h-1 w-20 bg-brand rounded"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="p-8 bg-white/5 border border-white/5 hover:border-brand/50 transition-colors rounded-xl group">
              <div className="mb-6 text-gray-400 group-hover:text-brand transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};