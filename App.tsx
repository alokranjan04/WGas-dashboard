import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { 
  BarChart3, 
  ShieldAlert, 
  Phone, 
  TrendingUp, 
  Users, 
  FileText, 
  CheckCircle2, 
  Flame, 
  DollarSign,
  Activity,
  Menu,
  X,
  ChevronRight,
  ArrowRight,
  Zap,
  Map as MapIcon,
  Clock,
  LayoutDashboard,
  BrainCircuit,
  Loader2,
  Search,
  AlertTriangle,
  Download,
  Calendar,
  AlertCircle,
  Repeat,
  Bot,
  Workflow,
  TrendingDown,
  ArrowUpRight,
  Timer,
  Briefcase,
  Target
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  Legend,
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar,
  LineChart,
  Line
} from 'recharts';

// --- Types ---

interface CallTranscript {
  id: string;
  caller: string;
  type: string;
  duration: string;
  date: string;
  fullText: string;
}

interface AIAnalysisResult {
  summary: string;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  esrCompliance: number; // 0-100
  keyEntities: {
    address?: string;
    accountNumber?: string;
    intent?: string;
  };
  recommendation: string;
}

// --- Data: The 4 Transcripts provided ---

const TRANSCRIPTS: CallTranscript[] = [
  {
    id: "EMG-001",
    caller: "Daniel Fromkin",
    type: "Emergency - Gas Odor",
    duration: "06:12",
    date: "Oct 24, 2023 10:45 AM",
    fullText: `AGENT: as a gas emergency line my name is charles please state the nature of your emergency...` 
  },
  {
    id: "BILL-042",
    caller: "Simone Weiss",
    type: "Billing & Collections",
    duration: "14:23",
    date: "Oct 24, 2023 11:02 AM",
    fullText: `AGENT: thank you for calling washington gas collections department this is daniela...`
  },
  {
    id: "EMG-002",
    caller: "Michelle Dean",
    type: "Emergency - Inside Odor",
    duration: "03:45",
    date: "Oct 24, 2023 12:30 PM",
    fullText: `CUSTOMER: it's. AGENT: i'm calling league my name is greg please state the new...`
  },
  {
    id: "SVC-003",
    caller: "Brian Kirsh",
    type: "Service - No Gas/Pressure",
    duration: "08:10",
    date: "Oct 24, 2023 02:15 PM",
    fullText: `AGENT: as emergency leak my name is tina please state the nature of your emergency...`
  }
];

// --- Modal Component ---

const Modal = ({ isOpen, onClose, title, children, size = 'md' }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode, size?: 'md' | 'lg' | 'xl' }) => {
  if (!isOpen) return null;
  
  const sizeClasses = {
    md: 'sm:max-w-lg',
    lg: 'sm:max-w-4xl',
    xl: 'sm:max-w-6xl'
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity backdrop-blur-sm" 
          aria-hidden="true" 
          onClick={onClose}
        ></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className={`inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle w-full ${sizeClasses[size]}`}>
          <div className="bg-white px-6 pt-6 pb-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-xl leading-6 font-bold text-gray-900" id="modal-title">{title}</h3>
            <button type="button" className="bg-gray-50 rounded-full p-2 hover:bg-gray-200 transition-colors focus:outline-none" onClick={onClose}>
              <span className="sr-only">Close</span>
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          <div className="bg-gray-50 px-6 py-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Navbar ---

const Navbar: React.FC<{ onReportClick: () => void }> = ({ onReportClick }) => {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center gap-3">
              <div className="w-10 h-10 bg-wgBlue rounded-lg flex items-center justify-center shadow-md">
                <Flame className="text-white h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-wgBlue tracking-tight">Washington Gas</span>
                <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Q3 Executive Review</span>
              </div>
            </div>
            <div className="hidden md:ml-12 md:flex md:space-x-8">
              <a href="#dashboard" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-wgBlue text-sm font-medium">Value Realization</a>
              <a href="#hub" className="text-gray-500 hover:text-wgBlue inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium">Root Cause Analysis</a>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-right hidden lg:block">
               <div className="text-xs text-gray-400 font-medium">TOTAL SAVINGS IDENTIFIED</div>
               <div className="text-lg font-bold text-green-600">$1,245,000</div>
            </div>
            <div className="h-8 w-px bg-gray-200 mx-2"></div>
            <button 
              onClick={onReportClick}
              className="bg-wgBlue text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-blue-800 transition-colors shadow-lg shadow-blue-900/20 flex items-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Download QBR
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

// --- Value Card Component ---
const ValueCard = ({ 
  title, 
  primaryMetric, 
  metricLabel,
  secondaryMetric,
  secondaryLabel,
  icon: Icon, 
  onClick,
  color = "blue"
}: { 
  title: string, 
  primaryMetric: string, 
  metricLabel: string,
  secondaryMetric: string, 
  secondaryLabel: string,
  icon: any, 
  onClick: () => void,
  color?: "blue" | "green" | "red" | "orange" | "purple" | "indigo"
}) => {
  const colorStyles = {
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    green: "bg-green-50 text-green-700 border-green-100",
    red: "bg-red-50 text-red-700 border-red-100",
    orange: "bg-orange-50 text-orange-700 border-orange-100",
    purple: "bg-purple-50 text-purple-700 border-purple-100",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-100",
  };

  return (
    <button onClick={onClick} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left w-full group relative overflow-hidden">
      <div className="flex justify-between items-start mb-6">
        <div className={`p-3 rounded-lg ${colorStyles[color]} border`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="bg-gray-50 rounded-full px-3 py-1 flex items-center">
            <span className="text-xs font-bold text-gray-500 group-hover:text-wgBlue transition-colors uppercase">View Detail</span>
            <ArrowRight className="w-3 h-3 ml-1 text-gray-400 group-hover:text-wgBlue" />
        </div>
      </div>
      
      <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">{title}</h3>
      
      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-3xl font-extrabold text-gray-900 tracking-tight">{primaryMetric}</span>
      </div>
      <div className="text-sm text-gray-500 mb-6 font-medium">{metricLabel}</div>
      
      <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
         <div className="flex flex-col">
            <span className={`text-sm font-bold ${color === 'red' ? 'text-red-600' : 'text-green-600'}`}>{secondaryMetric}</span>
            <span className="text-[10px] text-gray-400 uppercase">{secondaryLabel}</span>
         </div>
         {color === 'green' || color === 'indigo' || color === 'purple' ? (
           <TrendingUp className="w-5 h-5 text-gray-300 group-hover:text-green-500 transition-colors" />
         ) : (
           <AlertTriangle className="w-5 h-5 text-gray-300 group-hover:text-red-500 transition-colors" />
         )}
      </div>
    </button>
  );
};

// --- Executive Dashboard (The Core Feature) ---

const ExecutiveDashboard: React.FC<{ openModal: (type: string) => void }> = ({ openModal }) => {
  return (
    <div id="dashboard" className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900">Operational Value Delivered</h2>
          <p className="mt-3 text-lg text-gray-500 max-w-3xl">
            This week, our intelligence engine identified 6 critical opportunities to reduce cost and mitigate risk. 
            Total potential impact: <span className="font-bold text-gray-900">$1.24M annualized.</span>
          </p>
        </div>

        {/* The 6 Value Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          
          {/* 1. Safety - Critical */}
          <ValueCard 
            title="Risk Mitigation"
            primaryMetric="14"
            metricLabel="High-Risk Odor Clusters"
            secondaryMetric="$250k"
            secondaryLabel="Liability Avoidance"
            icon={MapIcon}
            color="red"
            onClick={() => openModal('safety')}
          />

          {/* 2. Automation - Savings */}
          <ValueCard 
            title="Cost Reduction"
            primaryMetric="$450k"
            metricLabel="Annualized Deflection Savings"
            secondaryMetric="32%"
            secondaryLabel="Target Automation Rate"
            icon={Bot}
            color="indigo"
            onClick={() => openModal('automation')}
          />

           {/* 3. Revenue - Recovery */}
           <ValueCard 
            title="Revenue Assurance"
            primaryMetric="$142.5k"
            metricLabel="At-Risk Monthly Revenue Identified"
            secondaryMetric="1,240"
            secondaryLabel="High-Value Accts Retained"
            icon={DollarSign}
            color="green"
            onClick={() => openModal('revenue')}
          />

          {/* 4. Bottlenecks - Efficiency */}
          <ValueCard 
            title="Operational Efficiency"
            primaryMetric="18.5%"
            metricLabel="Reduction in Repeat Calls (Scheduling)"
            secondaryMetric="$125k"
            secondaryLabel="Wasted Truck Roll Savings"
            icon={Workflow}
            color="purple"
            onClick={() => openModal('bottleneck')}
          />

          {/* 5. Compliance - Brand Safety */}
          <ValueCard 
            title="Regulatory Compliance"
            primaryMetric="98.2%"
            metricLabel="Post-Intervention ESR Adherence"
            secondaryMetric="-12%"
            secondaryLabel="Training Hours Required"
            icon={ShieldAlert}
            color="orange"
            onClick={() => openModal('compliance')}
          />

           {/* 6. CX - Retention */}
           <ValueCard 
            title="Customer Retention"
            primaryMetric="+15pts"
            metricLabel="Projected NPS Gain (Wait Time Fix)"
            secondaryMetric="4,500"
            secondaryLabel="Customers Impacted/Mo"
            icon={Users}
            color="blue"
            onClick={() => openModal('cx')}
          />
        </div>
      </div>
    </div>
  );
};

// --- Functional Component: Live Intelligence Hub ---

const LiveIntelligenceHub: React.FC = () => {
  const [selectedTranscript, setSelectedTranscript] = useState<CallTranscript>(TRANSCRIPTS[0]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setAnalysis(null);
  }, [selectedTranscript]);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const prompt = `Analyze this call transcript for Washington Gas. 
      Determine the following:
      1. Summary (2 sentences max)
      2. Sentiment (Positive, Neutral, Negative)
      3. Risk Level (Low, Medium, High, Critical) - Critical if gas leak/odor is mentioned.
      4. ESR (Emergency Service Request) Compliance Score (0-100) based on safety questions asked.
      5. Key Entities: Address, Account Number (if any), User Intent.
      6. Strategic Recommendation for Washington Gas.

      Transcript:
      ${selectedTranscript.fullText}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              sentiment: { type: Type.STRING, enum: ['Positive', 'Neutral', 'Negative'] },
              riskLevel: { type: Type.STRING, enum: ['Low', 'Medium', 'High', 'Critical'] },
              esrCompliance: { type: Type.NUMBER },
              keyEntities: { 
                type: Type.OBJECT,
                properties: {
                  address: { type: Type.STRING },
                  accountNumber: { type: Type.STRING },
                  intent: { type: Type.STRING }
                }
              },
              recommendation: { type: Type.STRING }
            }
          }
        }
      });

      if (response.text) {
        setAnalysis(JSON.parse(response.text));
      }

    } catch (e) {
      console.error("Analysis Error", e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRiskColor = (level?: string) => {
    switch(level) {
      case 'Critical': return 'bg-red-600 text-white animate-pulse';
      case 'High': return 'bg-orange-500 text-white';
      case 'Medium': return 'bg-yellow-400 text-gray-900';
      default: return 'bg-green-500 text-white';
    }
  };

  const filteredTranscripts = TRANSCRIPTS.filter(t => 
    t.caller.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="hub" className="py-16 bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Real-Time Intelligence Hub</h2>
            <p className="mt-1 text-gray-500 text-sm">
              Validating our insights by processing live streams from the contact center.
            </p>
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
             <div className="flex items-center bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-100">
                <Activity className="w-3 h-3 mr-1" />
                System Active
             </div>
             <div className="text-xs text-gray-400">Processing 412 calls/hr</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[500px]">
          
          {/* List of Calls */}
          <div className="lg:col-span-1 bg-gray-50 rounded-xl border border-gray-200 overflow-hidden flex flex-col shadow-inner">
            <div className="p-3 border-b border-gray-200 bg-white sticky top-0 z-10">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Search stream..." 
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-wgBlue focus:border-transparent outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {filteredTranscripts.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTranscript(t)}
                  className={`w-full text-left p-4 border-b border-gray-200 hover:bg-white transition-colors flex justify-between items-center group ${selectedTranscript.id === t.id ? 'bg-white border-l-4 border-l-wgBlue shadow-sm' : ''}`}
                >
                  <div className="overflow-hidden">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-gray-900 text-sm truncate">{t.caller}</span>
                    </div>
                    <div className="text-xs font-medium text-wgBlue mb-1">{t.type}</div>
                    <div className="text-[10px] text-gray-500 flex items-center">
                      <Clock className="w-3 h-3 mr-1" /> {t.duration} • {t.date}
                    </div>
                  </div>
                  {selectedTranscript.id === t.id ? <div className="w-2 h-2 rounded-full bg-wgBlue"></div> : <ChevronRight className="w-4 h-4 text-gray-300" />}
                </button>
              ))}
            </div>
          </div>

          {/* AI Analysis Output */}
          <div className="lg:col-span-2 flex flex-col h-full bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
             <div className="bg-wgBlue p-4 flex justify-between items-center text-white">
                <div className="flex items-center gap-2">
                   <BrainCircuit className="w-5 h-5" />
                   <h3 className="font-bold text-sm tracking-wide">GEMINI ANALYSIS ENGINE</h3>
                </div>
                {analysis ? (
                   <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-medium">Analysis Complete</span>
                ) : (
                   <span className="text-[10px] bg-white/10 text-white/70 px-2 py-0.5 rounded-full font-medium">Ready</span>
                )}
             </div>
             
             <div className="flex-1 overflow-y-auto p-6 relative flex flex-col justify-center bg-slate-50">
              {!analysis && !isAnalyzing && (
                <div className="text-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                     <Target className="w-8 h-8 text-wgBlue" />
                  </div>
                  <h4 className="text-gray-900 font-bold mb-2">Spot the Problem Live</h4>
                  <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">Select a transcript to see how our AI identifies risk, compliance gaps, and revenue opportunities in seconds.</p>
                  <button 
                    onClick={handleAnalyze}
                    className="bg-wgBlue hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-lg shadow-md text-sm transition-all"
                  >
                    Analyze Transcript
                  </button>
                </div>
              )}

              {isAnalyzing && (
                <div className="flex flex-col items-center justify-center">
                   <Loader2 className="w-10 h-10 text-wgBlue animate-spin mb-4" />
                   <p className="text-gray-800 font-bold text-sm">Processing Intelligence...</p>
                </div>
              )}

              {analysis && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-bold text-gray-800 text-lg">Key Findings</h4>
                      <div className={`px-3 py-1 rounded text-xs font-bold uppercase ${getRiskColor(analysis.riskLevel)}`}>
                          Risk: {analysis.riskLevel}
                      </div>
                    </div>
                    <div className="space-y-4">
                       <div>
                          <div className="text-xs text-gray-500 uppercase font-bold mb-1">Executive Summary</div>
                          <p className="text-sm text-gray-800">{analysis.summary}</p>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gray-50 p-3 rounded-lg">
                             <div className="text-xs text-gray-500 uppercase font-bold mb-1">Customer Intent</div>
                             <div className="text-sm font-semibold text-wgBlue">{analysis.keyEntities.intent}</div>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                             <div className="text-xs text-gray-500 uppercase font-bold mb-1">ESR Score</div>
                             <div className="flex items-center">
                                <div className="text-sm font-bold text-gray-900 mr-2">{analysis.esrCompliance}/100</div>
                                <div className="h-1.5 flex-1 bg-gray-200 rounded-full">
                                   <div className={`h-1.5 rounded-full ${analysis.esrCompliance > 90 ? 'bg-green-500' : 'bg-red-500'}`} style={{width: `${analysis.esrCompliance}%`}}></div>
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>
                  </div>

                  <div className="border-l-4 border-wgBlue bg-white p-4 rounded-r-xl shadow-sm">
                     <div className="flex items-start">
                        <Briefcase className="w-5 h-5 text-wgBlue mr-3 mt-0.5" />
                        <div>
                           <div className="text-xs font-bold text-wgBlue uppercase mb-1">Operational Value Add</div>
                           <p className="text-sm text-gray-700">"{analysis.recommendation}"</p>
                        </div>
                     </div>
                  </div>
                  
                  <div className="text-center pt-2">
                    <button onClick={handleAnalyze} className="text-wgBlue text-xs font-bold hover:underline">Analyze Another Call</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

const App: React.FC = () => {
  const [modalState, setModalState] = useState<{ type: string }>({ type: 'none' });

  const closeModal = () => setModalState({ type: 'none' });
  const openModal = (type: string) => setModalState({ type });

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-gray-50">
      <Navbar onReportClick={() => openModal('report')} />
      <main className="flex-grow">
        <ExecutiveDashboard openModal={openModal} />
        <LiveIntelligenceHub />
      </main>
      
      {/* --- DRILL DOWN MODALS (ROI Focused) --- */}

      {/* 1. Safety Hotspots Modal */}
      <Modal isOpen={modalState.type === 'safety'} onClose={closeModal} title="Risk Mitigation: Geographic Hotspots" size="lg">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
               <h4 className="font-bold text-gray-800 text-sm mb-4 uppercase tracking-wide">The Problem: High-Risk Clustering</h4>
               <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                  Our algorithm detected a +300% spike in "faint odor" reports in ZIP 20002. While individually non-critical, the pattern indicates a potential infrastructure failure (Cast Iron main).
               </p>
               
               <div className="bg-red-50 border border-red-100 rounded-xl p-6 mb-6">
                  <div className="flex items-center mb-4">
                     <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
                     <span className="text-lg font-bold text-red-900">Incident Prevented</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <div className="text-sm text-gray-500">Reports Analyzed</div>
                        <div className="text-xl font-bold text-gray-900">412 Calls</div>
                     </div>
                     <div>
                        <div className="text-sm text-gray-500">Leak Confirmed</div>
                        <div className="text-xl font-bold text-red-600">Yes (Grade 2)</div>
                     </div>
                  </div>
               </div>

               <div className="space-y-3">
                  <h5 className="font-bold text-gray-800 text-xs uppercase">Value Delivered</h5>
                  <div className="flex items-center">
                     <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                     <span className="text-sm text-gray-700">Proactive dispatch before public report</span>
                  </div>
                  <div className="flex items-center">
                     <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                     <span className="text-sm text-gray-700">Avoided emergency services escalation</span>
                  </div>
               </div>
            </div>

            <div className="bg-gray-100 rounded-xl overflow-hidden relative min-h-[300px]">
               {/* Mock Map */}
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-full bg-slate-200 relative opacity-50">
                     {/* Abstract streets */}
                     <div className="absolute top-1/2 left-0 right-0 h-2 bg-white transform -rotate-12"></div>
                     <div className="absolute top-0 bottom-0 left-1/3 w-2 bg-white"></div>
                  </div>
                  <div className="absolute top-1/2 left-1/3">
                     <div className="w-32 h-32 bg-red-500 rounded-full opacity-20 animate-pulse absolute -top-16 -left-16"></div>
                     <div className="w-4 h-4 bg-red-600 rounded-full border-2 border-white shadow-lg relative z-10"></div>
                     <div className="bg-white px-3 py-1 rounded shadow-lg absolute top-6 -left-12 text-xs font-bold whitespace-nowrap">ZIP 20002</div>
                  </div>
               </div>
            </div>
         </div>
      </Modal>

      {/* 2. Revenue Modal */}
      <Modal isOpen={modalState.type === 'revenue'} onClose={closeModal} title="Revenue Assurance: Billing Confusion" size="lg">
         <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                  <div className="text-sm text-green-800 font-semibold mb-1">Revenue Recovered</div>
                  <div className="text-3xl font-bold text-green-700">$142,500</div>
                  <div className="text-xs text-green-600 mt-2">Monthly recurring revenue stabilized</div>
               </div>
               <div className="bg-white p-6 rounded-xl border border-gray-200">
                   <div className="text-sm text-gray-500 font-semibold mb-1">Accounts Saved</div>
                   <div className="text-3xl font-bold text-gray-900">1,240</div>
                   <div className="text-xs text-gray-400 mt-2">High-value commercial accounts</div>
               </div>
               <div className="bg-white p-6 rounded-xl border border-gray-200">
                   <div className="text-sm text-gray-500 font-semibold mb-1">Deflection ROI</div>
                   <div className="text-3xl font-bold text-gray-900">4.5x</div>
                   <div className="text-xs text-gray-400 mt-2">Return on SMS campaign cost</div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div>
                  <h4 className="font-bold text-gray-800 text-sm mb-4 uppercase tracking-wide">Root Cause Identified</h4>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 italic text-gray-600 mb-4">
                     "I'm not sure if the deadline has passed... I just wanted to find out the total... I set up a payment arrangement last month."
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                     Analysis of 1,200+ calls showed confusion regarding <strong>Installment Plan Expiry Dates</strong>. Customers were calling simply to check status, driving up cost and risking late fees.
                  </p>
               </div>
               <div>
                  <h4 className="font-bold text-gray-800 text-sm mb-4 uppercase tracking-wide">The Fix (Implemented)</h4>
                  <ul className="space-y-4">
                     <li className="flex items-start">
                        <div className="bg-green-100 p-1 rounded mr-3 mt-1"><CheckCircle2 className="w-4 h-4 text-green-600"/></div>
                        <div className="text-sm">
                           <span className="font-bold block text-gray-900">Proactive SMS Alerts</span>
                           <span className="text-gray-600">Sent 3 days prior to plan expiration.</span>
                        </div>
                     </li>
                     <li className="flex items-start">
                        <div className="bg-green-100 p-1 rounded mr-3 mt-1"><CheckCircle2 className="w-4 h-4 text-green-600"/></div>
                        <div className="text-sm">
                           <span className="font-bold block text-gray-900">IVR Status Check</span>
                           <span className="text-gray-600">Added "Check Plan Status" to main menu.</span>
                        </div>
                     </li>
                  </ul>
               </div>
            </div>
         </div>
      </Modal>

      {/* 3. Automation Modal */}
      <Modal isOpen={modalState.type === 'automation'} onClose={closeModal} title="Cost Reduction: Automation Opportunities" size="lg">
         <div className="text-center mb-10">
            <h3 className="text-4xl font-extrabold text-gray-900 mb-2">$450,000</h3>
            <p className="text-lg text-gray-500">Annualized Savings Identified via Intent Analysis</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
               <h4 className="font-bold text-gray-800 text-sm mb-6 uppercase tracking-wide">Top 3 Deflection Targets</h4>
               <div className="space-y-4">
                  <div className="group">
                     <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-gray-700">Balance Inquiry</span>
                        <span className="text-sm text-gray-500">12,000 calls/mo</span>
                     </div>
                     <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-indigo-500 h-2 rounded-full" style={{width: '85%'}}></div>
                     </div>
                     <p className="text-xs text-gray-400 mt-1">Status: <span className="text-green-600 font-bold">Bot Ready</span></p>
                  </div>
                  
                  <div className="group">
                     <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-gray-700">Payment Confirmation</span>
                        <span className="text-sm text-gray-500">8,500 calls/mo</span>
                     </div>
                     <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-indigo-400 h-2 rounded-full" style={{width: '65%'}}></div>
                     </div>
                     <p className="text-xs text-gray-400 mt-1">Status: <span className="text-orange-500 font-bold">API Integration Req</span></p>
                  </div>

                  <div className="group">
                     <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-gray-700">Technician ETA</span>
                        <span className="text-sm text-gray-500">5,200 calls/mo</span>
                     </div>
                     <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-indigo-300 h-2 rounded-full" style={{width: '45%'}}></div>
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-indigo-50 rounded-xl p-8 border border-indigo-100">
               <h4 className="font-bold text-indigo-900 text-lg mb-4">Strategic Recommendation</h4>
               <p className="text-indigo-800 text-sm mb-6 leading-relaxed">
                  Deploying a Generative AI Voice Bot for these top 3 intents will reduce live agent volume by <strong>32%</strong>.
               </p>
               <div className="flex justify-between items-center border-t border-indigo-200 pt-4">
                  <div>
                     <div className="text-xs text-indigo-500 uppercase font-bold">Implementation Time</div>
                     <div className="font-bold text-indigo-900">4 Weeks</div>
                  </div>
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg hover:bg-indigo-700 transition-colors">
                     Approve Pilot
                  </button>
               </div>
            </div>
         </div>
      </Modal>

      {/* 4. Bottleneck Modal */}
      <Modal isOpen={modalState.type === 'bottleneck'} onClose={closeModal} title="Efficiency: Service Scheduling" size="lg">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
               <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
                  <div className="flex items-center mb-4">
                     <Workflow className="w-6 h-6 text-purple-600 mr-3" />
                     <h3 className="text-xl font-bold text-gray-900">The "No-Show" Loop</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                     Identified a process failure where missed appointments (8pm-10pm window) result in an average of <strong>3.2 callback attempts</strong> per customer.
                  </p>
                  <div className="flex items-baseline gap-2">
                     <span className="text-3xl font-bold text-purple-700">18.5%</span>
                     <span className="text-sm text-gray-500">Repeat Call Rate</span>
                  </div>
               </div>
               
               <div className="space-y-2">
                  <div className="flex justify-between text-sm border-b border-gray-100 py-2">
                     <span className="text-gray-600">Wasted Truck Rolls</span>
                     <span className="font-bold text-gray-900">42 / week</span>
                  </div>
                  <div className="flex justify-between text-sm border-b border-gray-100 py-2">
                     <span className="text-gray-600">Agent Handling Cost</span>
                     <span className="font-bold text-gray-900">$12,500 / mo</span>
                  </div>
                  <div className="flex justify-between text-sm py-2">
                     <span className="text-gray-600">Total Efficiency Loss</span>
                     <span className="font-bold text-red-600">$125,000 / yr</span>
                  </div>
               </div>
            </div>

            <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
               <h4 className="font-bold text-purple-900 text-sm uppercase mb-4">Implemented Solution</h4>
               <ul className="space-y-6">
                  <li className="flex">
                     <div className="bg-white p-2 rounded-full shadow-sm mr-4 h-10 w-10 flex items-center justify-center text-purple-600 font-bold">1</div>
                     <div>
                        <h5 className="font-bold text-gray-900 text-sm">Automated Rescheduling</h5>
                        <p className="text-xs text-gray-600 mt-1">System now auto-triggers an SMS option to reschedule if tech is >30 mins late.</p>
                     </div>
                  </li>
                  <li className="flex">
                     <div className="bg-white p-2 rounded-full shadow-sm mr-4 h-10 w-10 flex items-center justify-center text-purple-600 font-bold">2</div>
                     <div>
                        <h5 className="font-bold text-gray-900 text-sm">GPS Tracking Link</h5>
                        <p className="text-xs text-gray-600 mt-1">"Uber-style" tracking link sent to customer 1 hour before window.</p>
                     </div>
                  </li>
               </ul>
            </div>
         </div>
      </Modal>

      {/* 5. Compliance Modal */}
      <Modal isOpen={modalState.type === 'compliance'} onClose={closeModal} title="Brand Safety: Compliance" size="md">
          <div className="text-center py-6">
             <div className="relative inline-block mb-4">
                <svg className="w-32 h-32" viewBox="0 0 36 36">
                   <path className="text-gray-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                   <path className="text-orange-500" strokeDasharray="98, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                   <span className="text-3xl font-bold text-gray-900">98.2%</span>
                   <span className="text-[10px] text-gray-400 uppercase tracking-widest">Compliance</span>
                </div>
             </div>
             <p className="text-gray-600 mb-6 px-8">
                Targeted coaching based on our AI analysis has reduced "Safety Question Skips" to near zero.
             </p>
             <div className="bg-orange-50 rounded-lg p-4 text-left">
                <h4 className="font-bold text-orange-900 text-xs uppercase mb-2">Value Delivered</h4>
                <div className="flex justify-between items-center text-sm mb-1">
                   <span className="text-orange-800">Regulatory Fine Risk</span>
                   <span className="font-bold text-green-600">Eliminated</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                   <span className="text-orange-800">Training Time Saved</span>
                   <span className="font-bold text-green-600">120 Hours</span>
                </div>
             </div>
          </div>
      </Modal>

      {/* 6. CX Modal */}
      <Modal isOpen={modalState.type === 'cx'} onClose={closeModal} title="Customer Retention: NPS Growth" size="lg">
         <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
               <div className="bg-blue-50 p-6 rounded-xl">
                  <h4 className="text-blue-900 font-bold mb-2">Before Optimization</h4>
                  <div className="text-3xl font-bold text-gray-400">32</div>
                  <div className="text-xs text-gray-500">NPS Score (Evening Shift)</div>
               </div>
               <div className="bg-blue-600 p-6 rounded-xl shadow-lg">
                  <h4 className="text-white font-bold mb-2">After Optimization</h4>
                  <div className="text-3xl font-bold text-white">47</div>
                  <div className="text-xs text-blue-100">NPS Score (Current)</div>
               </div>
            </div>
            
            <div className="bg-white border border-gray-200 p-6 rounded-xl">
               <h4 className="font-bold text-gray-900 text-sm mb-4">Insight & Action</h4>
               <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  Correlated a <strong>-15 point NPS drop</strong> specifically with wait times >8 minutes between 4pm-6pm.
               </p>
               <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                     <Users className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                     <span className="font-bold text-gray-900 text-sm block">Shift Re-alignment</span>
                     <span className="text-sm text-gray-600">Moved 4 FTEs from morning to evening overlap. Zero cost impact, +15 NPS gain.</span>
                  </div>
               </div>
            </div>
         </div>
      </Modal>

    </div>
  );
};

export default App;