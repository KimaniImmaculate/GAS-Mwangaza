import React, { useState } from 'react';
import { 
  FileCode2, 
  Layers, 
  Database, 
  ShieldCheck, 
  Sparkles, 
  Check, 
  Copy, 
  Download, 
  Server, 
  Cpu, 
  Lock, 
  Terminal, 
  ArrowRight,
  Code2,
  Workflow,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { TECHNICAL_SPECIFICATION_DOCUMENT } from '../data/technicalSpecDoc';

export const ArchitectureSpecViewer: React.FC = () => {
  const spec = TECHNICAL_SPECIFICATION_DOCUMENT;
  const [activeSection, setActiveSection] = useState<'architecture' | 'modules' | 'database' | 'services' | 'blueprint'>('architecture');
  const [selectedCollection, setSelectedCollection] = useState<string>('resources');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Security Rule Test Simulator
  const [simulatedRole, setSimulatedRole] = useState<'student' | 'faculty' | 'admin'>('student');
  const [simulatedAction, setSimulatedAction] = useState<string>('publish_official');

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const getSimulatedRuleOutcome = () => {
    switch (simulatedAction) {
      case 'publish_official':
        return simulatedRole === 'faculty' || simulatedRole === 'admin'
          ? { allowed: true, msg: 'ALLOW: Faculty & Admin credentials permit immediate status="approved" resource creation.' }
          : { allowed: false, msg: 'DENIED: Students cannot set status="approved". Only "pending_moderation" permitted.' };
      case 'delete_resource':
        return simulatedRole === 'admin'
          ? { allowed: true, msg: 'ALLOW: Super Administrator role holds global resource revocation privileges.' }
          : { allowed: false, msg: 'DENIED: Only admin role matches delete rule authorization.' };
      case 'edit_timetable':
        return simulatedRole === 'faculty' || simulatedRole === 'admin'
          ? { allowed: true, msg: 'ALLOW: Lecturers and Registry maintain master campus timetable.' }
          : { allowed: false, msg: 'DENIED: Read-only access enforced for students on /timetables/{slotId}.' };
      case 'verify_solution':
        return simulatedRole === 'faculty' || simulatedRole === 'admin'
          ? { allowed: true, msg: 'ALLOW: Faculty authority required to attach isFacultyVerified endorsement.' }
          : { allowed: false, msg: 'DENIED: Peer students cannot endorse official answers.' };
      default:
        return { allowed: true, msg: 'ALLOW' };
    }
  };

  const currentOutcome = getSimulatedRuleOutcome();

  const handleExportFullSpecMarkdown = () => {
    const md = `# ${spec.title}
**Organization:** ${spec.organization}
**Version:** ${spec.version} | **Date:** ${spec.date}
**Lead Architect:** ${spec.leadArchitect}

---

## 1. SYSTEM ARCHITECTURE & TECH STACK
${spec.sections.systemArchitecture.summary}

### Tech Stack Details:
- **Frontend Framework:** ${spec.sections.systemArchitecture.frontend.framework}
- **Bundler & Build Tool:** ${spec.sections.systemArchitecture.frontend.bundler}
- **CSS Engine:** ${spec.sections.systemArchitecture.frontend.styling}
- **Database:** ${spec.sections.systemArchitecture.backendAndDatabase.database}
- **Authentication:** ${spec.sections.systemArchitecture.backendAndDatabase.auth}
- **Cloud Storage:** ${spec.sections.systemArchitecture.backendAndDatabase.storage}
- **Cognitive AI Model:** ${spec.sections.systemArchitecture.backendAndDatabase.aiEngine}

---

## 2. CORE FUNCTIONAL MODULES & RBAC MATRIX
${spec.sections.functionalRequirements.modules.map(m => `### ${m.moduleName}\n**Objective:** ${m.objective}\nFeatures:\n${m.features.map(f => `- ${f}`).join('\n')}\n`).join('\n')}

---

## 3. DATABASE SCHEMA DESIGN & FIRESTORE SECURITY RULES
### Firestore Collections:
${spec.sections.databaseSchema.collections.map(c => `#### Collection: ${c.collection} (${c.path})\n\`\`\`json\n${c.schemaJson}\n\`\`\`\n`).join('\n')}

### Production Firestore Security Rules:
\`\`\`javascript
${spec.sections.databaseSchema.firestoreRules}
\`\`\`

---

## 4. API & SERVICE INTEGRATION LAYER
${spec.sections.apiAndServices.expressProxyPipeline}

### Endpoints:
${spec.sections.apiAndServices.endpoints.map(e => `#### [${e.method}] ${e.path}\n${e.purpose}\nRequest:\n\`\`\`json\n${e.requestPayload}\n\`\`\`\nResponse:\n\`\`\`json\n${e.responsePayload}\n\`\`\`\n`).join('\n')}

---

## 5. STARTER CODE BLUEPRINT & IMPLEMENTATION PROMPT
${spec.sections.starterBlueprint.engineeringPrompt}

### Firebase Connector:
\`\`\`typescript
${spec.sections.starterBlueprint.boilerplateCode.firebaseConnectorSnippet}
\`\`\`

### Resource Service:
\`\`\`typescript
${spec.sections.starterBlueprint.boilerplateCode.resourceServiceSnippet}
\`\`\`
`;

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Mwangaza_School_Student_Resource_Hub_Technical_Specification.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      {/* Executive Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                {spec.classification}
              </span>
              <span className="text-xs text-slate-400">
                Version {spec.version} • {spec.organization}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {spec.title}
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
              Complete production architectural blueprint for Mwangaza School, covering cloud infrastructure topology, RBAC matrix, Firestore schemas, security rules, and Gemini 3.8 Flash pipeline.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-shrink-0">
            <button
              onClick={handleExportFullSpecMarkdown}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Download Full Spec (.MD)
            </button>
          </div>
        </div>

        {/* Ambient background grid */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10 bg-[radial-gradient(#818cf8_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
      </div>

      {/* 5-Section Navigation Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {[
          { id: 'architecture', num: '1', title: 'System Architecture', icon: Server },
          { id: 'modules', num: '2', title: 'Functional & RBAC', icon: Layers },
          { id: 'database', num: '3', title: 'Firestore & Rules', icon: Database },
          { id: 'services', num: '4', title: 'API & Gemini Proxy', icon: Cpu },
          { id: 'blueprint', num: '5', title: 'Starter Blueprint', icon: Terminal },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isActive
                  ? 'bg-indigo-950/60 border-indigo-500 text-white shadow-lg shadow-indigo-950/50'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded font-mono ${isActive ? 'bg-indigo-500/30 text-indigo-300' : 'bg-slate-800 text-slate-500'}`}>
                  Section {tab.num}
                </span>
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
              </div>
              <span className="text-xs font-bold leading-tight line-clamp-1">
                {tab.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* SECTION 1: System Architecture */}
      {activeSection === 'architecture' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Architecture Overview Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">
              <Workflow className="w-4 h-4" />
              1.1 Architectural Philosophy & System Topology
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              {spec.sections.systemArchitecture.summary}
            </p>

            {/* Interactive Visual Topology Flow */}
            <div className="mt-6 bg-slate-950 p-5 rounded-2xl border border-slate-800/80">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 block mb-4">
                End-to-End Cloud Service Topology
              </span>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="bg-slate-900/90 border border-blue-500/30 p-4 rounded-xl">
                  <div className="text-[10px] font-bold text-blue-400 uppercase mb-1">Tier 1: Client Edge</div>
                  <h4 className="font-bold text-white text-xs">React 19 + Vite SPA</h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                    Zero-runtime Tailwind CSS v4 styling, local IndexedDB caching, and instant responsive filtering.
                  </p>
                </div>

                <div className="bg-slate-900/90 border border-purple-500/30 p-4 rounded-xl">
                  <div className="text-[10px] font-bold text-purple-400 uppercase mb-1">Tier 2: AI Gateway</div>
                  <h4 className="font-bold text-white text-xs">Express Server Proxy</h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                    Secure GEMINI_API_KEY mediation, rate-limiting, and curriculum JSON schema enforcement.
                  </p>
                </div>

                <div className="bg-slate-900/90 border border-emerald-500/30 p-4 rounded-xl">
                  <div className="text-[10px] font-bold text-emerald-400 uppercase mb-1">Tier 3: Auth & Store</div>
                  <h4 className="font-bold text-white text-xs">Firebase Cloud Firestore</h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                    Sub-100ms multi-region reads, real-time snapshot listeners, and granular RBAC security rules.
                  </p>
                </div>

                <div className="bg-slate-900/90 border border-amber-500/30 p-4 rounded-xl">
                  <div className="text-[10px] font-bold text-amber-400 uppercase mb-1">Tier 4: Assets & AI</div>
                  <h4 className="font-bold text-white text-xs">Cloud Storage & Gemini</h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                    GCP buckets for past papers, signed download URLs, and Gemini 3.8 Flash auto-summarization.
                  </p>
                </div>
              </div>
            </div>

            {/* Tech Stack Specs Table */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-blue-400" />
                  Frontend Engineering Stack
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                    <span className="text-slate-400">Framework</span>
                    <span className="font-semibold text-slate-200">{spec.sections.systemArchitecture.frontend.framework}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                    <span className="text-slate-400">Bundler</span>
                    <span className="font-semibold text-slate-200">{spec.sections.systemArchitecture.frontend.bundler}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                    <span className="text-slate-400">CSS Architecture</span>
                    <span className="font-semibold text-slate-200">{spec.sections.systemArchitecture.frontend.styling}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">State Layer</span>
                    <span className="font-semibold text-slate-200">{spec.sections.systemArchitecture.frontend.stateManagement}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-400" />
                  Backend, Database & AI Stack
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                    <span className="text-slate-400">Database</span>
                    <span className="font-semibold text-slate-200">Google Cloud Firestore</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                    <span className="text-slate-400">Authentication</span>
                    <span className="font-semibold text-slate-200">Firebase Auth (Google SSO + RBAC)</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                    <span className="text-slate-400">Blob Storage</span>
                    <span className="font-semibold text-slate-200">Firebase Storage (Cloud Buckets)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Cognitive AI</span>
                    <span className="font-semibold text-slate-200">Gemini 3.8 Flash (Server SDK)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Non-Functional Requirements Matrix */}
            <div className="mt-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Non-Functional Requirements (NFR) Benchmarks
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {spec.sections.systemArchitecture.nonFunctionalRequirements.map((nfr, idx) => (
                  <div key={idx} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-indigo-400 block font-bold uppercase">
                      {nfr.metric}
                    </span>
                    <p className="text-xs text-slate-300 mt-1 leading-snug">
                      {nfr.target}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: Core Functional Requirements & Feature Modules */}
      {activeSection === 'modules' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Modules List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {spec.sections.functionalRequirements.modules.map((mod, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-mono font-bold">
                    {idx + 1}
                  </span>
                  <h3 className="font-bold text-white text-sm">
                    {mod.moduleName}
                  </h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800/60">
                  {mod.objective}
                </p>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block mb-1.5">
                    Engineered Features:
                  </span>
                  <ul className="space-y-1">
                    {mod.features.map((f, i) => (
                      <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 mt-0.5 flex-shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* RBAC Matrix Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm overflow-x-auto">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-3">
              <ShieldCheck className="w-4 h-4" />
              Role-Based Access Control (RBAC) Governance Matrix
            </div>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                  <th className="py-2.5 px-3">System Capability & Access Gate</th>
                  <th className="py-2.5 px-3 text-center">Student Role</th>
                  <th className="py-2.5 px-3 text-center">Faculty / Lecturer</th>
                  <th className="py-2.5 px-3 text-center">Academic Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {spec.sections.functionalRequirements.rbacMatrix.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-950/50">
                    <td className="py-2.5 px-3 font-medium text-slate-200">{row.capability}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        row.student === 'Allowed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {row.student}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                        {row.faculty}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                        {row.admin}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 3: Database Schema Design & Security Rules */}
      {activeSection === 'database' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Firestore Schema Explorer */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
                <Database className="w-4 h-4" />
                Firestore Document Collection Schemas
              </div>

              {/* Collection selector */}
              <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                {spec.sections.databaseSchema.collections.map(c => (
                  <button
                    key={c.collection}
                    onClick={() => setSelectedCollection(c.collection)}
                    className={`px-3 py-1.5 rounded-lg font-mono font-semibold transition-colors cursor-pointer ${
                      selectedCollection === c.collection
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    /{c.collection}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Collection Card */}
            {(() => {
              const col = spec.sections.databaseSchema.collections.find(c => c.collection === selectedCollection) || spec.sections.databaseSchema.collections[0];
              return (
                <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono font-bold text-blue-400">{col.path}</span>
                      <p className="text-xs text-slate-400 mt-0.5">{col.description}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(col.schemaJson, col.collection)}
                      className="px-2.5 py-1 rounded-lg text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {copiedKey === col.collection ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedKey === col.collection ? 'Copied' : 'Copy Schema'}
                    </button>
                  </div>
                  <pre className="p-3 bg-slate-900 rounded-lg text-xs font-mono text-emerald-300 overflow-x-auto border border-slate-800 leading-relaxed">
                    {col.schemaJson}
                  </pre>
                </div>
              );
            })()}
          </div>

          {/* Firestore Security Rules & Interactive Rule Simulator */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Rules Code Viewer */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
                  <Lock className="w-4 h-4" />
                  Production firestore.rules
                </div>
                <button
                  onClick={() => copyToClipboard(spec.sections.databaseSchema.firestoreRules, 'firestore-rules')}
                  className="px-3 py-1.5 rounded-lg text-xs bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedKey === 'firestore-rules' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedKey === 'firestore-rules' ? 'Copied Rules' : 'Copy firestore.rules'}
                </button>
              </div>

              <pre className="p-4 bg-slate-950 rounded-xl text-xs font-mono text-slate-300 overflow-x-auto border border-slate-800 max-h-[460px] leading-relaxed">
                {spec.sections.databaseSchema.firestoreRules}
              </pre>
            </div>

            {/* Interactive Rule Simulator */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
                  <ShieldCheck className="w-4 h-4" />
                  Security Rules Test Harness
                </div>
                <p className="text-xs text-slate-400 mb-4">
                  Test authorization outcomes against live permission boundaries.
                </p>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Simulate User Role:</label>
                    <select
                      value={simulatedRole}
                      onChange={e => setSimulatedRole(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 capitalize"
                    >
                      <option value="student">Student (Amara)</option>
                      <option value="faculty">Faculty (Dr. Kwame)</option>
                      <option value="admin">Administrator (Registry)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Attempt Action on Firestore:</label>
                    <select
                      value={simulatedAction}
                      onChange={e => setSimulatedAction(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200"
                    >
                      <option value="publish_official">Create Official Approved Past Paper</option>
                      <option value="delete_resource">Permanently Delete Resource Document</option>
                      <option value="edit_timetable">Update Master Class Schedule Slot</option>
                      <option value="verify_solution">Attach Faculty Verified Endorsement</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Outcome Box */}
              <div className={`mt-5 p-4 rounded-xl border text-xs ${
                currentOutcome.allowed
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                  : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
              }`}>
                <div className="font-bold flex items-center gap-1.5 mb-1">
                  {currentOutcome.allowed ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>RULE EVALUATION: ALLOW</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-rose-400" />
                      <span>RULE EVALUATION: DENIED</span>
                    </>
                  )}
                </div>
                <p className="leading-relaxed opacity-90">
                  {currentOutcome.msg}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: API & Service Integration Layer */}
      {activeSection === 'services' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Architecture Rationale Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">
              <Cpu className="w-4 h-4" />
              4.1 Secure Server-Side Gemini Mediation Architecture
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              {spec.sections.apiAndServices.expressProxyPipeline}
            </p>

            {/* Endpoints specification */}
            <div className="mt-5 space-y-4">
              {spec.sections.apiAndServices.endpoints.map((ep, idx) => (
                <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold ${
                      ep.method === 'POST' ? 'bg-blue-600/30 text-blue-400 border border-blue-500/40' : 'bg-emerald-600/30 text-emerald-400 border border-emerald-500/40'
                    }`}>
                      {ep.method}
                    </span>
                    <span className="font-mono text-xs font-bold text-white">{ep.path}</span>
                    <span className="text-xs text-slate-400 hidden sm:inline">• {ep.purpose}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    {ep.requestPayload && (
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Request Payload</span>
                        <pre className="p-3 bg-slate-900 rounded-lg font-mono text-slate-300 border border-slate-800 overflow-x-auto">
                          {ep.requestPayload}
                        </pre>
                      </div>
                    )}
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Response Contract</span>
                      <pre className="p-3 bg-slate-900 rounded-lg font-mono text-emerald-300 border border-slate-800 overflow-x-auto">
                        {ep.responsePayload}
                      </pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Gemini Pipeline Code */}
            <div className="mt-6 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-purple-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Gemini 3.8 Flash TypeScript SDK Ingestion Controller
                </span>
                <button
                  onClick={() => copyToClipboard(spec.sections.apiAndServices.geminiPipelineCode, 'gemini-pipeline')}
                  className="px-2.5 py-1 rounded text-xs bg-slate-800 text-slate-300 hover:text-white flex items-center gap-1.5"
                >
                  {copiedKey === 'gemini-pipeline' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  Copy Code
                </button>
              </div>
              <pre className="p-4 bg-slate-950 rounded-xl text-xs font-mono text-purple-200 border border-slate-800 overflow-x-auto leading-relaxed">
                {spec.sections.apiAndServices.geminiPipelineCode}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: Implementation Prompt & Starter Blueprint */}
      {activeSection === 'blueprint' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Engineering Prompt Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
                <Terminal className="w-4 h-4" />
                Production Engineering Prompt for Full-Stack Developers
              </div>
              <button
                onClick={() => copyToClipboard(spec.sections.starterBlueprint.engineeringPrompt, 'eng-prompt')}
                className="px-3 py-1.5 rounded-lg text-xs bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5 hover:bg-indigo-600/30 transition-colors"
              >
                {copiedKey === 'eng-prompt' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                Copy Execution Prompt
              </button>
            </div>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed font-mono whitespace-pre-line">
              {spec.sections.starterBlueprint.engineeringPrompt}
            </div>
          </div>

          {/* Boilerplate Snippets */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Snippet 1: Firebase Connector */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">src/services/firebaseConnector.ts</h4>
                  <p className="text-[11px] text-slate-400">Singleton Web SDK initialization</p>
                </div>
                <button
                  onClick={() => copyToClipboard(spec.sections.starterBlueprint.boilerplateCode.firebaseConnectorSnippet, 'connector-snippet')}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                  title="Copy snippet"
                >
                  {copiedKey === 'connector-snippet' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <pre className="p-3.5 bg-slate-950 rounded-xl text-xs font-mono text-blue-300 border border-slate-800 max-h-[360px] overflow-y-auto leading-relaxed">
                {spec.sections.starterBlueprint.boilerplateCode.firebaseConnectorSnippet}
              </pre>
            </div>

            {/* Snippet 2: Resource Service */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">src/services/resourceService.ts</h4>
                  <p className="text-[11px] text-slate-400">Firestore CRUD & Storage upload pipeline</p>
                </div>
                <button
                  onClick={() => copyToClipboard(spec.sections.starterBlueprint.boilerplateCode.resourceServiceSnippet, 'service-snippet')}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                  title="Copy snippet"
                >
                  {copiedKey === 'service-snippet' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <pre className="p-3.5 bg-slate-950 rounded-xl text-xs font-mono text-emerald-300 border border-slate-800 max-h-[360px] overflow-y-auto leading-relaxed">
                {spec.sections.starterBlueprint.boilerplateCode.resourceServiceSnippet}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
