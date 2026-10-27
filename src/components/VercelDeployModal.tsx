import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink } from 'lucide-react';

interface VercelDeployModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VercelDeployModal: React.FC<VercelDeployModalProps> = ({ isOpen, onClose }) => {
  const [copiedCmd, setCopiedCmd] = useState(false);

  if (!isOpen) return null;

  const gitCommands = [
    'git init',
    'git add .',
    'git commit -m "feat: Thaath Maath Restaurant & Banquet Nikol website"',
    'git branch -M main',
    'git remote add origin https://github.com/YOUR_USERNAME/thaath-maath-restaurant.git',
    'git push -u origin main',
  ].join('\n');

  const handleCopyCommands = () => {
    navigator.clipboard.writeText(gitCommands);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-[2px]">
      <div
        className="w-full max-w-2xl bg-[#FAF8F5] text-[#141413] border border-[#E5E0D8] rounded-xl overflow-hidden shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="vercel-deploy-title"
      >
        <div className="px-6 py-5 border-b border-[#E5E0D8] flex items-center justify-between bg-[#F2EFE9]">
          <div>
            <h2 id="vercel-deploy-title" className="font-display text-2xl font-bold text-[#141413]">
              GitHub to Vercel Deployment Guide
            </h2>
            <p className="text-xs text-[#5C5852] mt-0.5">
              Pre-configured with <span className="font-mono-num">vercel.json</span>, Vite build pipeline, and SEO metadata
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#5C5852] hover:text-[#141413] rounded-lg hover:bg-[#E5E0D8]/50 transition-colors cursor-pointer"
            aria-label="Close deployment guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-[#141413]">
              01. Push Repository to GitHub
            </h3>
            <p className="text-xs text-[#5C5852] leading-relaxed">
              Export or clone this project, create a new repository on GitHub (for example, <span className="font-mono-num text-[#141413]">thaath-maath-restaurant</span>), and run these commands in your terminal:
            </p>
            <div className="relative bg-[#141413] text-[#FAF8F5] rounded-lg p-4">
              <pre className="text-xs font-mono-num overflow-x-auto leading-relaxed">
                {gitCommands}
              </pre>
              <button
                type="button"
                onClick={handleCopyCommands}
                className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium bg-[#FAF8F5]/15 hover:bg-[#FAF8F5]/25 text-white rounded-md transition-colors cursor-pointer"
              >
                {copiedCmd ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedCmd ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-[#141413]">
              02. Import Repository in Vercel Dashboard
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 bg-[#F2EFE9] border border-[#E5E0D8] rounded-lg">
                <div className="text-[#5C5852]">Framework Preset</div>
                <div className="font-mono-num font-semibold text-[#141413] mt-1">Vite</div>
              </div>
              <div className="p-3.5 bg-[#F2EFE9] border border-[#E5E0D8] rounded-lg">
                <div className="text-[#5C5852]">Build Command</div>
                <div className="font-mono-num font-semibold text-[#141413] mt-1">npm run build</div>
              </div>
              <div className="p-3.5 bg-[#F2EFE9] border border-[#E5E0D8] rounded-lg">
                <div className="text-[#5C5852]">Output Directory</div>
                <div className="font-mono-num font-semibold text-[#141413] mt-1">dist</div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-[#141413]">
              03. Automatic <span className="font-mono-num">vercel.json</span> SPA Routing
            </h3>
            <p className="text-xs text-[#5C5852] leading-relaxed">
              We have already included <span className="font-mono-num text-[#141413]">/vercel.json</span> at the project root. Zero environment variables or API keys are required for this static restaurant & banquet booking application—just click <strong>Deploy</strong> on Vercel and your live URL will be ready in ~35 seconds.
            </p>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-[#E5E0D8] bg-[#F2EFE9] flex items-center justify-between">
          <a
            href="https://vercel.com/new"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#9E2A2B] hover:underline"
          >
            Open Vercel Import Page
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-[#141413] text-white rounded-lg hover:bg-[#2C2A28] transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
