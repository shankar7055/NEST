"use client";

import { useState, useEffect, useMemo } from "react";
import { ShieldCheck, Lock, User, Activity, AlertCircle, CheckCircle2, ChevronRight, FileText, LayoutDashboard, LogOut, Search, Filter, Mail, Globe, Clock, ArrowLeft, Calendar, UserCheck, Stethoscope, Copy, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";

// --- Types ---
type Screen = "login" | "dashboard" | "detail" | "follow-up" | "success";

interface AuditEntry {
  id: string;
  action: string;
  timestamp: string;
  status: "pending" | "completed";
}

interface Case {
  id: string;
  risk: "low" | "medium" | "high";
  status: "Pending" | "Completed";
  region: string;
  date: string;
  patientInitials: string;
  adverseEvent: string;
  auditTrail: AuditEntry[];
}

const INITIAL_CASES: Case[] = [
  { 
    id: "PV-2024-001", 
    risk: "high", 
    status: "Pending", 
    region: "North America", 
    date: "2024-05-15", 
    patientInitials: "JS", 
    adverseEvent: "Severe Rash",
    auditTrail: [
      { id: "1", action: "Initial report received", timestamp: "May 15, 2024 • 09:42 AM", status: "completed" }
    ]
  },
  { 
    id: "PV-2024-002", 
    risk: "medium", 
    status: "Completed", 
    region: "Europe", 
    date: "2024-05-14", 
    patientInitials: "ML", 
    adverseEvent: "Dizziness",
    auditTrail: [
      { id: "1", action: "Initial report received", timestamp: "May 14, 2024 • 11:20 AM", status: "completed" },
      { id: "2", action: "Follow-up submitted by physician", timestamp: "May 15, 2024 • 02:15 PM", status: "completed" }
    ]
  },
  { id: "PV-2024-003", risk: "low", status: "Pending", region: "Asia Pacific", date: "2024-05-13", patientInitials: "AK", adverseEvent: "Nausea", auditTrail: [{ id: "1", action: "Initial report received", timestamp: "May 13, 2024 • 04:00 PM", status: "completed" }] },
  { id: "PV-2024-004", risk: "high", status: "Pending", region: "Latin America", date: "2024-05-12", patientInitials: "RB", adverseEvent: "Tachycardia", auditTrail: [{ id: "1", action: "Initial report received", timestamp: "May 12, 2024 • 10:15 AM", status: "completed" }] },
  { id: "PV-2024-005", risk: "medium", status: "Pending", region: "Middle East", date: "2024-05-11", patientInitials: "OH", adverseEvent: "Headache", auditTrail: [{ id: "1", action: "Initial report received", timestamp: "May 11, 2024 • 01:30 PM", status: "completed" }] },
];

// --- Sub-components ---

const RiskBadge = ({ risk }: { risk: Case["risk"] }) => {
  const colors = {
    low: "bg-emerald-50 text-emerald-700 border-emerald-200",
    medium: "bg-amber-50 text-amber-700 border-amber-200",
    high: "bg-rose-50 text-rose-700 border-rose-200",
  };
  return (
    <Badge variant="outline" className={`${colors[risk]} capitalize font-medium px-2.5 py-0.5`}>
      {risk}
    </Badge>
  );
};

const StatusBadge = ({ status }: { status: Case["status"] }) => {
  return (
    <Badge variant="secondary" className={status === "Completed" ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-600"}>
      {status}
    </Badge>
  );
};

const Toast = ({ message, type, onClose }: { message: string, type: 'success' | 'error' | 'info', onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50, x: "-50%" }}
      animate={{ opacity: 1, y: 0, x: "-50%" }}
      exit={{ opacity: 0, y: 20, x: "-50%" }}
      className="fixed bottom-8 left-1/2 z-[100] bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 text-sm font-medium"
    >
      {type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
      {type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400" />}
      {type === 'info' && <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />}
      {message}
    </motion.div>
  );
};

// --- Screen Components ---

const LoginScreen = ({ onLogin }: { onLogin: (user: string) => void }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Please enter all fields");
      return;
    }
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      if (username === "admin" && password === "password") {
        onLogin("Dr. Sarah Johnson");
      } else {
        setError("Invalid credentials. Try admin/password.");
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-blue-200">
            <Activity className="text-white w-7 h-7" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">FU-Smart</h1>
          <p className="text-slate-500 mt-2 font-medium">Pharmacovigilance Management</p>
        </div>

        <Card className="border-slate-200/60 shadow-xl shadow-slate-200/50 overflow-hidden bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-6 border-b border-slate-50">
            <CardTitle className="text-xl">PV Team Access</CardTitle>
            <CardDescription>
              Enter your credentials to manage safety reports.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="pt-8 space-y-4">
              <AnimatePresence>
                {error && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-3 rounded-lg bg-rose-50 text-rose-600 text-xs font-medium flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="space-y-2">
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username" 
                    className="pl-10 h-11 border-slate-200 focus-visible:ring-blue-500" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password" 
                    className="pl-10 h-11 border-slate-200 focus-visible:ring-blue-500" 
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 pb-8">
              <Button type="submit" disabled={isLoading} className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium text-base transition-all active:scale-[0.98]">
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
              </Button>
              <div className="flex items-center gap-2 text-xs text-slate-400 justify-center">
                <ShieldCheck className="h-3 w-3" />
                <span>Authorized access only. All activity is logged.</span>
              </div>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

const DashboardScreen = ({ cases, onViewCase, onLogout, userName }: { cases: Case[], onViewCase: (id: string) => void; onLogout: () => void, userName: string }) => {
  const [riskFilter, setRiskFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCases = useMemo(() => {
    return cases.filter(c => {
      const matchesRisk = riskFilter === "all" || c.risk === riskFilter;
      const matchesStatus = statusFilter === "all" || c.status === statusFilter;
      const matchesSearch = c.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           c.adverseEvent.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           c.patientInitials.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesRisk && matchesStatus && matchesSearch;
    });
  }, [cases, riskFilter, statusFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans">
      <nav className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="text-blue-600 w-6 h-6" />
            <span className="font-bold text-xl tracking-tight text-slate-900">FU-Smart</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                <User className="w-4 h-4 text-slate-600" />
              </div>
              <span className="text-sm font-medium text-slate-700">{userName}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={onLogout} className="text-slate-500 hover:text-rose-600 gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Follow-Up Dashboard</h2>
            <p className="text-slate-500">Monitor and manage pending adverse event clarifications.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Cases..." 
                className="pl-9 bg-white border-slate-200" 
              />
            </div>
            <Select value={riskFilter} onValueChange={setRiskFilter}>
              <SelectTrigger className="w-[140px] bg-white border-slate-200">
                <Filter className="w-4 h-4 mr-2 text-slate-400" />
                <SelectValue placeholder="Risk Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risks</SelectItem>
                <SelectItem value="high">High Risk</SelectItem>
                <SelectItem value="medium">Medium Risk</SelectItem>
                <SelectItem value="low">Low Risk</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] bg-white border-slate-200">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="w-[140px] font-semibold text-slate-700">Case ID</TableHead>
                <TableHead className="font-semibold text-slate-700">Event</TableHead>
                <TableHead className="font-semibold text-slate-700">Risk Level</TableHead>
                <TableHead className="font-semibold text-slate-700">Status</TableHead>
                <TableHead className="font-semibold text-slate-700">Region</TableHead>
                <TableHead className="text-right font-semibold text-slate-700">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {filteredCases.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-slate-400">
                      No matching cases found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCases.map((item) => (
                    <TableRow key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                      <TableCell className="font-mono text-sm font-medium">{item.id}</TableCell>
                      <TableCell className="font-medium text-slate-900">{item.adverseEvent}</TableCell>
                      <TableCell><RiskBadge risk={item.risk} /></TableCell>
                      <TableCell><StatusBadge status={item.status} /></TableCell>
                      <TableCell className="text-slate-600 text-sm">{item.region}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => onViewCase(item.id)} className="h-8 text-blue-600 border-blue-100 hover:bg-blue-50 hover:border-blue-200">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </AnimatePresence>
            </TableBody>
          </Table>
        </Card>
      </main>
    </div>
  );
};

const CaseDetailScreen = ({ cases, caseId, onBack, onGenerateLink, onSimulateForm }: { cases: Case[], caseId: string; onBack: () => void, onGenerateLink: (id: string) => void, onSimulateForm: (id: string) => void }) => {
  const selectedCase = cases.find(c => c.id === caseId) || cases[0];
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      onGenerateLink(caseId);
      setIsGenerating(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans">
      <nav className="h-16 border-b border-slate-200 bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto h-full px-6 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="text-slate-500">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-bold text-lg text-slate-900">Case Details: {caseId}</h1>
          <div className="ml-auto">
            <RiskBadge risk={selectedCase.risk} />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-slate-200 bg-white">
              <CardHeader className="border-b border-slate-50 pb-4">
                <div className="flex items-center gap-2 text-slate-900">
                  <FileText className="w-5 h-5 text-blue-500" />
                  <CardTitle className="text-lg">Adverse Event Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-y-6 gap-x-12">
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Patient Initials</p>
                    <p className="text-slate-900 font-medium">{selectedCase.patientInitials}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Report Date</p>
                    <p className="text-slate-900 font-medium">{selectedCase.date}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Event Description</p>
                    <p className="text-slate-700 leading-relaxed">
                      Patient reported {selectedCase.adverseEvent.toLowerCase()} after 3 days of administration. 
                      Symptoms persisted for 48 hours. Medical intervention was required. 
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white">
              <CardHeader className="border-b border-slate-50 pb-4">
                <div className="flex items-center gap-2 text-slate-900">
                  <Clock className="w-5 h-5 text-slate-400" />
                  <CardTitle className="text-lg">Audit Trail</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                  {selectedCase.auditTrail.map((entry, idx) => (
                    <div key={entry.id} className="flex gap-4 relative">
                      <div className={`w-6 h-6 rounded-full border-4 border-white flex items-center justify-center z-10 ${idx === 0 ? 'bg-blue-100 ring-1 ring-blue-500' : 'bg-slate-100 ring-1 ring-slate-200'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${idx === 0 ? 'bg-blue-600' : 'bg-slate-400'}`} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{entry.action}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{entry.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-blue-100 bg-blue-50/30">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-slate-900">Follow-Up Action</CardTitle>
                <CardDescription>Generate a secure link to collect missing information.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={handleGenerate} disabled={isGenerating || selectedCase.status === 'Completed'} className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2 h-11">
                  {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                  Generate Follow-Up Link
                </Button>
                
                {selectedCase.auditTrail.some(a => a.action.includes("Link generated")) && (
                  <div className="space-y-3 pt-2">
                    <div className="p-3 bg-white border border-slate-200 rounded-lg flex items-center justify-between group">
                      <span className="text-xs font-mono text-slate-500 truncate mr-2">fu-smart.com/secure/{caseId}</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => {
                        navigator.clipboard.writeText(`https://fu-smart.com/secure/${caseId}`);
                      }}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <Button variant="outline" className="w-full gap-2 text-xs h-9" onClick={() => onSimulateForm(caseId)}>
                      <ExternalLink className="w-3 h-3" />
                      Simulate Patient View
                    </Button>
                  </div>
                )}
                
                <p className="text-[11px] text-center text-slate-500 italic">
                  Links are valid for 72 hours and comply with GDPR/HIPAA standards.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-tight">Status Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">Current Status</span>
                  <StatusBadge status={selectedCase.status} />
                </div>
                <div className="flex justify-between items-center text-sm pt-3 border-t border-slate-50">
                  <span className="text-slate-600">Last Action</span>
                  <span className="text-slate-500 text-xs">{selectedCase.auditTrail[0]?.action}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

const FollowUpFormScreen = ({ caseId, onSubmit }: { caseId: string, onSubmit: (id: string, data: any) => void }) => {
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const [formData, setFormData] = useState({ date: "", otherMeds: "", history: "", details: "" });

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
    else onSubmit(caseId, formData);
  };

  return (
    <div className="min-h-screen bg-white md:bg-[#F8FAFC] font-sans flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-xl">
        <div className="flex flex-col items-center mb-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <ShieldCheck className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-lg text-slate-800 tracking-tight">FU-Smart Secure</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 text-center">Official Follow-Up Request</h2>
          <p className="text-slate-500 text-sm mt-2 font-medium">Case Reference: {caseId}</p>
        </div>

        <Card className="border-0 md:border md:border-slate-200 md:shadow-xl md:shadow-slate-200/40 bg-white overflow-hidden">
          <div className="h-1.5 w-full bg-slate-100">
            <motion.div initial={{ width: "0%" }} animate={{ width: `${(step / totalSteps) * 100}%` }} className="h-full bg-emerald-500 transition-all duration-500" />
          </div>
          <CardContent className="p-8 md:p-12">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <h3 className="text-xl font-bold text-slate-900 leading-tight">When did you notice the symptoms?</h3>
                  <div className="space-y-4">
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                      <Input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="pl-10 h-12 border-slate-200" />
                    </div>
                  </div>
                </motion.div>
              )}
              {step === 2 && (
                <motion.div key="2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <h3 className="text-xl font-bold text-slate-900 leading-tight">Taking any other medications?</h3>
                  <Select value={formData.otherMeds} onValueChange={val => setFormData({...formData, otherMeds: val})}>
                    <SelectTrigger className="h-12"><SelectValue placeholder="Select one..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>
              )}
              {step === 3 && (
                <motion.div key="3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <h3 className="text-xl font-bold text-slate-900 leading-tight">Previous history of these symptoms?</h3>
                  <div className="grid gap-3">
                    {['Frequent', 'Occasional', 'None'].map(opt => (
                      <button key={opt} onClick={() => setFormData({...formData, history: opt})} className={`p-4 rounded-xl border-2 text-left transition-all ${formData.history === opt ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-100 hover:border-emerald-200'}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
              {step === 4 && (
                <motion.div key="4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <h3 className="text-xl font-bold text-slate-900 leading-tight">Additional Details</h3>
                  <textarea 
                    className="w-full min-h-[120px] p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                    placeholder="Provide any other relevant info..."
                    value={formData.details}
                    onChange={e => setFormData({...formData, details: e.target.value})}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-12 flex items-center justify-between">
              {step > 1 && <Button variant="ghost" onClick={() => setStep(step - 1)}>Back</Button>}
              <Button onClick={nextStep} disabled={step === 1 && !formData.date || step === 2 && !formData.otherMeds || step === 3 && !formData.history} className={`h-12 px-8 ${step === 1 ? 'w-full' : 'ml-auto'} bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl`}>
                {step === totalSteps ? "Submit" : "Continue"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const SuccessScreen = ({ onReset }: { onReset: () => void }) => (
  <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full bg-white p-12 rounded-[2rem] shadow-xl text-center border border-slate-100">
      <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8">
        <CheckCircle2 className="w-10 h-10 text-emerald-600" />
      </div>
      <h2 className="text-3xl font-bold text-slate-900 mb-4 text-balance">Information Submitted</h2>
      <p className="text-slate-600 mb-8">Your contribution helps us ensure the safety of medical products globally. No further action is required.</p>
      <Button variant="outline" onClick={onReset} className="w-full">Back to Portal</Button>
    </motion.div>
  </div>
);

// --- Main App Component ---

export default function App() {
  const [screen, setScreen] = useState<Screen>("login");
  const [user, setUser] = useState<string | null>(null);
  const [cases, setCases] = useState<Case[]>(INITIAL_CASES);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error' | 'info'} | null>(null);

  const handleLogin = (userName: string) => {
    setUser(userName);
    setScreen("dashboard");
    setToast({ message: `Welcome back, ${userName.split(' ')[0]}`, type: 'success' });
  };

  const handleLogout = () => {
    setUser(null);
    setScreen("login");
    setToast({ message: "Logged out successfully", type: 'success' });
  };

  const handleGenerateLink = (id: string) => {
    const now = new Date().toLocaleString();
    setCases(prev => prev.map(c => c.id === id ? {
      ...c,
      auditTrail: [
        { id: Math.random().toString(), action: "Follow-up link generated", timestamp: now, status: "completed" },
        ...c.auditTrail
      ]
    } : c));
    setToast({ message: "Follow-up link generated and copied to clipboard", type: 'success' });
    navigator.clipboard.writeText(`https://fu-smart.com/secure/${id}`);
  };

  const handleSubmitForm = (id: string, data: any) => {
    const now = new Date().toLocaleString();
    setCases(prev => prev.map(c => c.id === id ? {
      ...c,
      status: "Completed",
      auditTrail: [
        { id: Math.random().toString(), action: "Follow-up submitted by user", timestamp: now, status: "completed" },
        ...c.auditTrail
      ]
    } : c));
    setScreen("success");
  };

  return (
    <div className="min-h-screen select-none">
      <AnimatePresence mode="wait">
        {screen === "login" && <LoginScreen onLogin={handleLogin} />}
        {screen === "dashboard" && user && (
          <DashboardScreen 
            cases={cases} 
            userName={user}
            onLogout={handleLogout}
            onViewCase={(id) => { setSelectedCaseId(id); setScreen("detail"); }}
          />
        )}
        {screen === "detail" && selectedCaseId && (
          <CaseDetailScreen 
            cases={cases} 
            caseId={selectedCaseId} 
            onBack={() => setScreen("dashboard")}
            onGenerateLink={handleGenerateLink}
            onSimulateForm={(id) => { setSelectedCaseId(id); setScreen("follow-up"); }}
          />
        )}
        {screen === "follow-up" && selectedCaseId && (
          <FollowUpFormScreen 
            caseId={selectedCaseId} 
            onSubmit={handleSubmitForm}
          />
        )}
        {screen === "success" && <SuccessScreen onReset={() => setScreen("login")} />}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(null)} 
          />
        )}
      </AnimatePresence>

      {/* Demo Switcher - Retained but more subtle as per 'demo is good' feedback */}
      <div className="fixed bottom-4 right-4 z-[90] opacity-0 hover:opacity-100 transition-opacity">
        <div className="bg-white/80 backdrop-blur p-2 border rounded-xl shadow-lg scale-75 origin-bottom-right flex flex-col gap-1">
          <button onClick={() => setScreen("login")} className="text-[10px] px-2 py-1 hover:bg-slate-100 rounded text-slate-500">Reset</button>
        </div>
      </div>
    </div>
  );
}
