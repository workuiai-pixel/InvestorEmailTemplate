import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  Copy, 
  Check, 
  RefreshCw, 
  User, 
  MapPin, 
  Globe, 
  Linkedin, 
  Mail, 
  Briefcase, 
  Heart, 
  Target, 
  ChevronRight,
  ChevronLeft,
  Sparkles
} from 'lucide-react';
import { generateOutreachEmail, parseLeadRow, LeadData } from './services/geminiService';

const INITIAL_LEAD_DATA: LeadData = {
  leadType: '',
  location: '',
  website: '',
  title: '',
  firstName: '',
  lastName: '',
  linkedIn: '',
  email1: '',
  title2: '',
  firstName2: '',
  lastName2: '',
  linkedIn2: '',
  email2: '',
  investmentThemes: '',
  impact: '',
  personalizationAngle: '',
  sources: '',
  status: ''
};

export default function App() {
  const [leadData, setLeadData] = useState<LeadData>(INITIAL_LEAD_DATA);
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [smartPasteText, setSmartPasteText] = useState('');
  const [showSmartPaste, setShowSmartPaste] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLeadData(prev => ({ ...prev, [name]: value }));
  };

  const handleSmartPaste = async () => {
    if (!smartPasteText.trim()) return;
    setIsParsing(true);
    try {
      const parsedData = await parseLeadRow(smartPasteText);
      setLeadData(prev => ({ ...prev, ...parsedData }));
      setSmartPasteText('');
      setShowSmartPaste(false);
      // Optional: move to next step if data is populated
    } catch (error) {
      console.error("Parsing error:", error);
    } finally {
      setIsParsing(false);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setResult(null);
    try {
      const output = await generateOutreachEmail(leadData);
      setResult(output || "Failed to generate email.");
    } catch (error) {
      console.error("Generation error:", error);
      setResult("An error occurred while generating the email. Please check your API key and try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const resetForm = () => {
    setLeadData(INITIAL_LEAD_DATA);
    setResult(null);
    setStep(1);
  };

  return (
    <div className="min-h-screen bg-[#f5f2ed] text-[#1a1a1a] font-sans selection:bg-[#5A5A40] selection:text-white">
      {/* Header */}
      <header className="border-b border-[#1a1a1a]/10 px-6 py-8 md:px-12 flex justify-between items-center">
        <div className="flex flex-col">
          <h1 className="text-2xl md:text-3xl font-serif tracking-tight uppercase">Tai Nuare</h1>
          <span className="text-[10px] uppercase tracking-[0.2em] opacity-60 font-medium">Outreach Specialist</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-[11px] uppercase tracking-widest font-semibold opacity-70">
          <span className="hover:opacity-100 cursor-pointer transition-opacity">Regenerative</span>
          <span className="hover:opacity-100 cursor-pointer transition-opacity">Stewardship</span>
          <span className="hover:opacity-100 cursor-pointer transition-opacity">Panama</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-5 space-y-12">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-serif font-light leading-tight">
                Craft the <span className="italic">perfect</span> introduction.
              </h2>
              <p className="text-[#1a1a1a]/60 text-lg max-w-md">
                Generate high-trust, personalized outreach for regenerative real estate and wellness.
              </p>
            </div>

            <div className="space-y-8">
              {/* Smart Paste Toggle */}
              <div className="flex justify-between items-center">
                <button 
                  onClick={() => setShowSmartPaste(!showSmartPaste)}
                  className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-[#5A5A40] hover:opacity-70 transition-opacity"
                >
                  <Sparkles size={12} />
                  {showSmartPaste ? 'Cancel Smart Paste' : 'Smart Paste Row'}
                </button>
                <div className="flex gap-2">
                  {[1, 2, 3].map((s) => (
                    <div 
                      key={s} 
                      className={`h-1 w-8 rounded-full transition-all duration-500 ${step >= s ? 'bg-[#5A5A40]' : 'bg-[#1a1a1a]/10'}`}
                    />
                  ))}
                </div>
              </div>

              <AnimatePresence mode="wait">
                {showSmartPaste ? (
                  <motion.div
                    key="smart-paste"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-white p-6 rounded-2xl border border-[#5A5A40]/20 space-y-4 shadow-xl shadow-[#5A5A40]/5"
                  >
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold opacity-50">Paste Spreadsheet Row</label>
                      <textarea 
                        value={smartPasteText}
                        onChange={(e) => setSmartPasteText(e.target.value)}
                        placeholder="Paste the entire row from Excel or Google Sheets here..."
                        className="w-full bg-[#f5f2ed]/50 border border-[#1a1a1a]/10 rounded-xl p-4 text-[13px] outline-none focus:border-[#5A5A40] transition-all min-h-[100px] resize-none"
                      />
                    </div>
                    <button 
                      onClick={handleSmartPaste}
                      disabled={isParsing || !smartPasteText.trim()}
                      className="w-full bg-[#5A5A40] text-white py-3 rounded-xl text-[11px] uppercase tracking-widest font-bold hover:bg-[#4a4a34] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isParsing ? <RefreshCw className="animate-spin" size={14} /> : <Sparkles size={14} />}
                      {isParsing ? 'Parsing Data...' : 'Auto-Fill Form'}
                    </button>
                  </motion.div>
                ) : (
                  <div key="form-steps">
                    {step === 1 && (
                  <motion.div 
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold opacity-50">Primary Contact</label>
                      <div className="grid grid-cols-2 gap-4">
                        <Input icon={<User size={14}/>} placeholder="First Name" name="firstName" value={leadData.firstName} onChange={handleInputChange} />
                        <Input placeholder="Last Name" name="lastName" value={leadData.lastName} onChange={handleInputChange} />
                      </div>
                      <Input icon={<Briefcase size={14}/>} placeholder="Title" name="title" value={leadData.title} onChange={handleInputChange} />
                      <Input icon={<Mail size={14}/>} placeholder="Email" name="email1" value={leadData.email1} onChange={handleInputChange} />
                      <Input icon={<Linkedin size={14}/>} placeholder="LinkedIn URL" name="linkedIn" value={leadData.linkedIn} onChange={handleInputChange} />
                    </div>
                    <div className="flex justify-end">
                      <button 
                        onClick={() => setStep(2)}
                        className="flex items-center gap-2 text-[11px] uppercase tracking-widest font-bold hover:gap-4 transition-all"
                      >
                        Context & Location <ChevronRight size={14} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div 
                    key="step2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold opacity-50">Organization Details</label>
                      <Input icon={<MapPin size={14}/>} placeholder="Location (e.g. San Francisco, CA)" name="location" value={leadData.location} onChange={handleInputChange} />
                      <Input icon={<Globe size={14}/>} placeholder="Website" name="website" value={leadData.website} onChange={handleInputChange} />
                      <Input icon={<Target size={14}/>} placeholder="Lead Type (e.g. Family Office)" name="leadType" value={leadData.leadType} onChange={handleInputChange} />
                    </div>
                    <div className="flex justify-between">
                      <button 
                        onClick={() => setStep(1)}
                        className="flex items-center gap-2 text-[11px] uppercase tracking-widest font-bold opacity-50 hover:opacity-100 transition-all"
                      >
                        <ChevronLeft size={14} /> Back
                      </button>
                      <button 
                        onClick={() => setStep(3)}
                        className="flex items-center gap-2 text-[11px] uppercase tracking-widest font-bold hover:gap-4 transition-all"
                      >
                        Personalization <ChevronRight size={14} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div 
                    key="step3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold opacity-50">Strategic Alignment</label>
                      <TextArea icon={<Sparkles size={14}/>} placeholder="Investment Themes or Prior Investments" name="investmentThemes" value={leadData.investmentThemes} onChange={handleInputChange} />
                      <TextArea icon={<Heart size={14}/>} placeholder="Impact or Philanthropy" name="impact" value={leadData.impact} onChange={handleInputChange} />
                      <TextArea icon={<Target size={14}/>} placeholder="Personalization Angle (Recent news, shared connection)" name="personalizationAngle" value={leadData.personalizationAngle} onChange={handleInputChange} />
                    </div>
                    <div className="flex justify-between">
                      <button 
                        onClick={() => setStep(2)}
                        className="flex items-center gap-2 text-[11px] uppercase tracking-widest font-bold opacity-50 hover:opacity-100 transition-all"
                      >
                        <ChevronLeft size={14} /> Back
                      </button>
                      <button 
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="bg-[#1a1a1a] text-white px-8 py-4 rounded-full text-[11px] uppercase tracking-widest font-bold hover:bg-[#5A5A40] transition-colors flex items-center gap-3 disabled:opacity-50"
                      >
                        {isGenerating ? <RefreshCw className="animate-spin" size={14} /> : <Send size={14} />}
                        {isGenerating ? 'Generating...' : 'Generate Outreach'}
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </AnimatePresence>
            </div>
          </div>

          {/* Right Column: Result */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-2xl shadow-black/5 min-h-[600px] flex flex-col border border-[#1a1a1a]/5">
              {!result && !isGenerating ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 opacity-30">
                  <div className="w-20 h-20 rounded-full border border-[#1a1a1a]/20 flex items-center justify-center">
                    <Send size={32} />
                  </div>
                  <p className="font-serif italic text-xl">Your generated outreach will appear here.</p>
                </div>
              ) : isGenerating ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full border-t-2 border-[#5A5A40] animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="text-[#5A5A40]" size={24} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="font-serif italic text-2xl">Synthesizing data...</p>
                    <p className="text-[10px] uppercase tracking-widest opacity-50">Applying high-trust outreach principles</p>
                  </div>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="flex-1 flex flex-col h-full"
                >
                  <div className="flex justify-between items-start mb-8">
                    <div className="space-y-1">
                      <h3 className="text-[10px] uppercase tracking-widest font-bold opacity-50">Generated Outreach</h3>
                      <p className="font-serif italic text-lg">Ready for review</p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={handleCopy}
                        className="p-3 rounded-full border border-[#1a1a1a]/10 hover:bg-[#f5f2ed] transition-colors relative group"
                        title="Copy to clipboard"
                      >
                        {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                        <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#1a1a1a] text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          {copied ? 'Copied!' : 'Copy'}
                        </span>
                      </button>
                      <button 
                        onClick={resetForm}
                        className="p-3 rounded-full border border-[#1a1a1a]/10 hover:bg-[#f5f2ed] transition-colors group"
                        title="Start over"
                      >
                        <RefreshCw size={16} className="group-hover:rotate-180 transition-transform duration-500" />
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-auto bg-[#f5f2ed]/30 rounded-2xl p-6 border border-[#1a1a1a]/5">
                    <pre className="whitespace-pre-wrap font-sans text-[15px] leading-relaxed text-[#1a1a1a]/80">
                      {result}
                    </pre>
                  </div>

                  <div className="mt-8 pt-8 border-t border-[#1a1a1a]/5 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#5A5A40] flex items-center justify-center text-white font-serif italic">
                        CN
                      </div>
                      <div className="text-[10px] uppercase tracking-widest font-bold">
                        <p>Chris Newberry</p>
                        <p className="opacity-50">Founder & Steward</p>
                      </div>
                    </div>
                    <div className="text-[10px] uppercase tracking-widest font-bold opacity-30">
                      Tai Nuare © 2026
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer Decoration */}
      <footer className="mt-20 border-t border-[#1a1a1a]/10 px-6 py-12 md:px-12 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex gap-12 text-[10px] uppercase tracking-[0.2em] font-bold opacity-40">
          <span>Panama</span>
          <span>Regenerative</span>
          <span>Wellness</span>
        </div>
        <div className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-20">
          Built for high-trust relationships
        </div>
      </footer>
    </div>
  );
}

function Input({ icon, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { icon?: React.ReactNode }) {
  return (
    <div className="relative group">
      {icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1a1a1a]/30 group-focus-within:text-[#5A5A40] transition-colors">
          {icon}
        </div>
      )}
      <input 
        className={`w-full bg-white border border-[#1a1a1a]/10 rounded-xl py-4 ${icon ? 'pl-12' : 'px-4'} pr-4 text-[14px] outline-none focus:border-[#5A5A40] focus:ring-1 focus:ring-[#5A5A40]/20 transition-all placeholder:text-[#1a1a1a]/20`}
        {...props}
      />
    </div>
  );
}

function TextArea({ icon, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { icon?: React.ReactNode }) {
  return (
    <div className="relative group">
      {icon && (
        <div className="absolute left-4 top-5 text-[#1a1a1a]/30 group-focus-within:text-[#5A5A40] transition-colors">
          {icon}
        </div>
      )}
      <textarea 
        rows={3}
        className={`w-full bg-white border border-[#1a1a1a]/10 rounded-xl py-4 ${icon ? 'pl-12' : 'px-4'} pr-4 text-[14px] outline-none focus:border-[#5A5A40] focus:ring-1 focus:ring-[#5A5A40]/20 transition-all placeholder:text-[#1a1a1a]/20 resize-none`}
        {...props}
      />
    </div>
  );
}
