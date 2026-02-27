import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  User, 
  Users, 
  FileText, 
  Sparkles, 
  Copy, 
  Check, 
  Loader2, 
  ArrowRight,
  Info
} from 'lucide-react';
import { LeadData, GenerationResult } from './types';
import { generateEmails } from './services/geminiService';

const INITIAL_DATA: LeadData = {
  title1: '',
  firstName1: '',
  lastName1: '',
  linkedIn1: '',
  email1: '',
  title2: '',
  firstName2: '',
  lastName2: '',
  linkedIn2: '',
  email2: '',
  investmentThemes: '',
  impactPhilanthropy: '',
  personalizationAngle: '',
  sources: '',
};

export default function App() {
  const [data, setData] = useState<LeadData>(INITIAL_DATA);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await generateEmails(data);
      setResult(res);
    } catch (error) {
      alert('Failed to generate emails. Please check your API key and try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-[#141414] font-sans selection:bg-[#5A5A40] selection:text-white">
      {/* Header */}
      <header className="border-b border-[#141414]/10 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#5A5A40] rounded-full flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h1 className="font-serif italic text-xl tracking-tight">Tai Nuare Outreach</h1>
          </div>
          <div className="text-xs uppercase tracking-widest opacity-50 font-semibold">
            Investor Relations Portal
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Input Section */}
          <div className="lg:col-span-5 space-y-8">
            <section className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-[#141414]/10">
                <User className="w-4 h-4 opacity-50" />
                <h2 className="font-serif italic text-lg">Lead 1 Details</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Title" name="title1" value={data.title1} onChange={handleInputChange} placeholder="e.g. Managing Director" />
                <Input label="First Name" name="firstName1" value={data.firstName1} onChange={handleInputChange} />
                <Input label="Last Name" name="lastName1" value={data.lastName1} onChange={handleInputChange} />
                <Input label="Email" name="email1" value={data.email1} onChange={handleInputChange} />
                <div className="col-span-2">
                  <Input label="LinkedIn URL" name="linkedIn1" value={data.linkedIn1} onChange={handleInputChange} />
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-[#141414]/10">
                <Users className="w-4 h-4 opacity-50" />
                <h2 className="font-serif italic text-lg">Lead 2 Details (Optional)</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Title" name="title2" value={data.title2} onChange={handleInputChange} />
                <Input label="First Name" name="firstName2" value={data.firstName2} onChange={handleInputChange} />
                <Input label="Last Name" name="lastName2" value={data.lastName2} onChange={handleInputChange} />
                <Input label="Email" name="email2" value={data.email2} onChange={handleInputChange} />
                <div className="col-span-2">
                  <Input label="LinkedIn URL" name="linkedIn2" value={data.linkedIn2} onChange={handleInputChange} />
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-[#141414]/10">
                <FileText className="w-4 h-4 opacity-50" />
                <h2 className="font-serif italic text-lg">Context & Personalization</h2>
              </div>
              <div className="space-y-4">
                <TextArea 
                  label="Investment Themes / Prior Investments" 
                  name="investmentThemes" 
                  value={data.investmentThemes} 
                  onChange={handleInputChange} 
                  placeholder="What have they invested in before?"
                />
                <TextArea 
                  label="Impact / Philanthropy" 
                  name="impactPhilanthropy" 
                  value={data.impactPhilanthropy} 
                  onChange={handleInputChange} 
                  placeholder="What causes do they support?"
                />
                <TextArea 
                  label="Personalization Angle" 
                  name="personalizationAngle" 
                  value={data.personalizationAngle} 
                  onChange={handleInputChange} 
                  placeholder="Specific connection or shared interest"
                />
                <Input 
                  label="Sources" 
                  name="sources" 
                  value={data.sources} 
                  onChange={handleInputChange} 
                  placeholder="LinkedIn, News, etc."
                />
              </div>
            </section>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-4 bg-[#5A5A40] text-white rounded-full font-medium flex items-center justify-center gap-2 hover:bg-[#4A4A30] transition-all disabled:opacity-50 disabled:cursor-not-allowed group shadow-lg shadow-[#5A5A40]/20"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Generate Outreach Emails
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>

          {/* Output Section */}
          <div className="lg:col-span-7">
            <div className="sticky top-28 space-y-6">
              <div className="flex items-center justify-between pb-2 border-b border-[#141414]/10">
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4 opacity-50" />
                  <h2 className="font-serif italic text-lg">Generated Drafts</h2>
                </div>
                {result && (
                  <span className="text-[10px] uppercase tracking-widest font-bold text-[#5A5A40] bg-[#5A5A40]/10 px-2 py-1 rounded">
                    Ready to Review
                  </span>
                )}
              </div>

              <AnimatePresence mode="wait">
                {!result && !loading ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-[600px] border-2 border-dashed border-[#141414]/10 rounded-3xl flex flex-col items-center justify-center text-center p-12 space-y-4"
                  >
                    <div className="w-16 h-16 bg-[#141414]/5 rounded-full flex items-center justify-center mb-2">
                      <Sparkles className="w-8 h-8 opacity-20" />
                    </div>
                    <h3 className="font-serif italic text-xl">Waiting for Input</h3>
                    <p className="text-sm opacity-50 max-w-xs">
                      Fill in the lead details and personalization context to generate high-trust outreach drafts.
                    </p>
                  </motion.div>
                ) : loading ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-[600px] bg-white rounded-3xl shadow-xl shadow-[#141414]/5 flex flex-col items-center justify-center p-12 space-y-6"
                  >
                    <div className="relative">
                      <div className="w-20 h-20 border-4 border-[#5A5A40]/10 border-t-[#5A5A40] rounded-full animate-spin" />
                      <Sparkles className="w-6 h-6 text-[#5A5A40] absolute inset-0 m-auto animate-pulse" />
                    </div>
                    <div className="text-center space-y-2">
                      <h3 className="font-serif italic text-xl">Crafting Outreach...</h3>
                      <p className="text-sm opacity-50">Analyzing lead data and aligning with Tai Nuare's vision.</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8 pb-12"
                  >
                    {result?.lead_1 && (
                      <EmailCard 
                        title={`Lead 1: ${data.firstName1} ${data.lastName1}`}
                        email={result.lead_1} 
                        onCopy={(text) => copyToClipboard(text, 'lead1')}
                        isCopied={copied === 'lead1'}
                      />
                    )}
                    {result?.lead_2 && result.lead_2.email && (
                      <EmailCard 
                        title={`Lead 2: ${data.firstName2} ${data.lastName2}`}
                        email={result.lead_2} 
                        onCopy={(text) => copyToClipboard(text, 'lead2')}
                        isCopied={copied === 'lead2'}
                      />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-[#141414]/10">
        <div className="flex flex-col md:flex-row gap-8 justify-between items-start opacity-50 text-xs">
          <div className="max-w-md space-y-2">
            <div className="flex items-center gap-2 font-bold uppercase tracking-widest mb-2">
              <Info className="w-3 h-3" />
              Guidelines Applied
            </div>
            <p>Emails are generated following high-trust, low-pressure principles. No promotional adjectives, no capital structure mentions, and strictly personalized first paragraphs.</p>
          </div>
          <div className="text-right">
            <p>© 2026 Tai Nuare Project</p>
            <p>Regenerative Island Real Estate & Wellness</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Input({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] uppercase tracking-widest font-bold opacity-50 ml-1">{label}</label>
      <input 
        {...props}
        className="w-full px-4 py-3 bg-white border border-[#141414]/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/20 focus:border-[#5A5A40] transition-all text-sm placeholder:opacity-30"
      />
    </div>
  );
}

function TextArea({ label, ...props }: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] uppercase tracking-widest font-bold opacity-50 ml-1">{label}</label>
      <textarea 
        {...props}
        rows={3}
        className="w-full px-4 py-3 bg-white border border-[#141414]/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/20 focus:border-[#5A5A40] transition-all text-sm placeholder:opacity-30 resize-none"
      />
    </div>
  );
}

function EmailCard({ title, email, onCopy, isCopied }: { title: string, email: { subject: string, email: string }, onCopy: (text: string) => void, isCopied: boolean }) {
  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-[#141414]/5 overflow-hidden border border-[#141414]/5">
      <div className="px-6 py-4 bg-[#F9F9F7] border-b border-[#141414]/5 flex items-center justify-between">
        <h3 className="font-serif italic text-base">{title}</h3>
        <button 
          onClick={() => onCopy(`Subject: ${email.subject}\n\n${email.email}`)}
          className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-[#5A5A40] hover:opacity-70 transition-opacity"
        >
          {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {isCopied ? 'Copied' : 'Copy All'}
        </button>
      </div>
      <div className="p-8 space-y-6">
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-widest font-bold opacity-30">Subject Line</label>
          <p className="text-sm font-medium">{email.subject}</p>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-widest font-bold opacity-30">Message Body</label>
          <div className="text-sm leading-relaxed whitespace-pre-wrap text-[#141414]/80">
            {email.email}
          </div>
        </div>
      </div>
    </div>
  );
}
