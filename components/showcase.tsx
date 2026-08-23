'use client';

import { useState, useEffect, useMemo, useCallback, useSyncExternalStore } from 'react';
import Papa from 'papaparse';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ExternalLink, 
  Play, 
  Users, 
  Search, 
  Video, 
  Globe, 
  Layers, 
  Sparkles, 
  X, 
  Share2, 
  Check, 
  GraduationCap,
  Phone,
  MessageCircle,
  Pencil,
  Trash2,
  Plus,
  RotateCcw,
  AlertTriangle,
  Menu,
  FileSpreadsheet,
  Download,
  Copy,
  CheckCheck,
  Link as LinkIcon,
  CheckCircle2,
  HelpCircle,
  ArrowUpRight,
  Mail,
  BookOpen,
  Award,
  FileText,
  Brain,
  Activity,
  Heart,
  ShieldAlert,
  Printer,
  Linkedin,
  Instagram,
  Briefcase,
  TrendingUp,
  Quote,
  ArrowRight,
  Clock,
  Code,
  Building2,
  Library,
  Globe2,
  Send,
  UserCheck,
  Filter,
  Info,
  Music,
  Headphones,
  Volume2,
  Disc,
  Radio,
  Bot,
  Loader2
} from 'lucide-react';
import Image from 'next/image';
import { askAI } from '@/lib/ai';

export type ThemeCategory = 'all' | 'stress' | 'anxiety' | 'depression';

export function getProjectTheme(groupName: string): 'stress' | 'anxiety' | 'depression' | 'other' {
  const g = (groupName || '').toLowerCase();
  if (g.includes('stress') || g.includes('serenity') || g.includes('stess')) return 'stress';
  if (g.includes('anxiety') || g.includes('mindsync') || g.includes('mind-sync')) return 'anxiety';
  if (g.includes('depression') || g.includes('hope harbour') || g.includes('hope habour')) return 'depression';
  return 'other';
}

export function getInvitingMusicTitle(project: { name: string; matric?: string; groupName?: string; videoTitle?: string; programme?: string }): {
  title: string;
  genreTag: string;
  inviteTagline: string;
} {
  const rawTitle = (project.videoTitle || '').trim();
  const isGeneric = !rawTitle || 
    rawTitle.toLowerCase() === 'video title' || 
    rawTitle.toLowerCase() === 'gst 206 pitch' ||
    rawTitle.toLowerCase() === 'project pitch' ||
    rawTitle.toLowerCase().includes('walkthrough');

  const theme = getProjectTheme(project.groupName || '');
  const seedNum = (project.matric || project.name || '').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  const stressTracks = [
    { title: 'Serenity Echoes: Calming Acoustic Harmony for Stress Release', genre: 'Acoustic Ambient', invite: 'Tune in for deep restorative calm and mental decompression' },
    { title: 'Tranquil Pulse: Soothing Melodies for Campus Wellness', genre: 'Lo-Fi Chill', invite: 'Immerse in peaceful rhythms engineered to unwind academic tension' },
    { title: 'Breathe & Flow: Gentle Symphony for Inner Balance', genre: 'Orchestral Chill', invite: 'Experience meditative melodic waves designed to ease the mind' },
    { title: 'Still Waters: Harmonic Frequencies for Mindful Relaxation', genre: 'Acoustic Soundscape', invite: 'Listen and let tension melt away with restorative vibrations' },
    { title: 'Sunset Haven: Ambient Acoustic Journey for Daily Serenity', genre: 'Warm Ambient', invite: 'A calming composition crafted to quiet stress and bring inner clarity' },
    { title: 'The Unwinding Path: Melodic Sanctuary for Mental Renewal', genre: 'Cinematic Ambient', invite: 'Relax your senses with this soothing therapeutic audio flow' }
  ];

  const anxietyTracks = [
    { title: 'MindSync Resonance: Cognitive Grounding & Calming Beats', genre: 'Grounding Synthwave', invite: 'Listen to steady the pulse, quiet racing thoughts, and find peace' },
    { title: 'Quiet Horizons: Melodic Antidote to Restlessness & Panic', genre: 'Ambient Downtempo', invite: 'An uplifting audio sanctuary designed to restore cognitive clarity' },
    { title: 'Steady Breath: Harmonic Rhythm for Anxious Minds', genre: 'Meditative Beats', invite: 'Embrace steady, gentle tones that guide you back to emotional equilibrium' },
    { title: 'Anchored Soul: Ambient Waves of Safety & Reassurance', genre: 'Atmospheric Chill', invite: 'Tune in to discover peaceful frequencies that dissipate apprehension' },
    { title: 'Clarity in Sound: Rhythmic Journey from Overwhelm to Calm', genre: 'Electronic Ambient', invite: 'A transformative track crafted to ease nervousness and restore focus' },
    { title: 'Shield of Stillness: Soothing Frequencies for Inner Peace', genre: 'Minimalist Neo-Classical', invite: 'Immerse in calming acoustic layers that soften panic and tension' }
  ];

  const depressionTracks = [
    { title: 'Hope Harbour Anthem: Uplifting Melodies of Light & Renewal', genre: 'Inspiring Acoustic', invite: 'Listen to feel the warmth of hope, resilience, and emotional revival' },
    { title: 'Dawn of Awakening: Melodic Symphony from Shadow to Light', genre: 'Cinematic Orchestral', invite: 'An empowering sonic journey that rekindles motivation and spirit' },
    { title: 'Gentle Horizon: Harmonic Ballad of Courage & Strength', genre: 'Uplifting Indie Folk', invite: 'Experience heartfelt melodies that remind you: you are never alone' },
    { title: 'Beacon in the Mist: Restorative Soundscape for the Soul', genre: 'Ambient Piano', invite: 'A tender, uplifting musical embrace designed for comfort and healing' },
    { title: 'Rising Phoenix: Melodic Journey of Renewal and New Beginnings', genre: 'Uplifting Neo-Classical', invite: 'Feel your spirit lift with these hopeful, resonant chords' },
    { title: 'Echoes of Tomorrow: Soul-Stirring Harmony of Endurance & Joy', genre: 'Empowering Melodic Pop', invite: 'Tune in for an inspiring musical celebration of perseverance and life' }
  ];

  const generalTracks = [
    { title: 'Harmony of the Mind: Therapeutic Sonic Journey for Wellness', genre: 'Acoustic Wellness', invite: 'A captivating musical composition crafted for your listening pleasure' },
    { title: 'Resilient Horizons: Melodic Symphony for Campus Wellbeing', genre: 'Uplifting Ambient', invite: 'Listen and let your spirit be refreshed with soothing harmonies' }
  ];

  const list = theme === 'stress' ? stressTracks : theme === 'anxiety' ? anxietyTracks : theme === 'depression' ? depressionTracks : generalTracks;
  const picked = list[seedNum % list.length];

  if (!isGeneric && rawTitle.length > 5) {
    return {
      title: rawTitle,
      genreTag: picked.genre,
      inviteTagline: picked.invite
    };
  }

  return {
    title: picked.title,
    genreTag: picked.genre,
    inviteTagline: picked.invite
  };
}

export function getStudentBio(student: { name: string; matric: string; programme: string; groupName?: string }) {
  const theme = getProjectTheme(student.groupName || '');
  const themeFocus = theme === 'stress' 
    ? 'stress mitigation and cognitive load reduction' 
    : theme === 'anxiety' 
    ? 'anxiety regulation and somatic grounding techniques' 
    : theme === 'depression' 
    ? 'depression intervention and proactive emotional support' 
    : 'campus mental health and student wellness solutions';

  return {
    summary: `${student.name} is a high-performing 200-level undergraduate studying ${student.programme} at Chrisland University, Abeokuta. Under the pedagogical guidance of S. B. Omotoso in the GST 206 AI Literacy & Vibe Coding curriculum, ${student.name} demonstrated exceptional technical agility by designing, architecting, and deploying a functional web application tailored specifically for ${themeFocus}.`,
    academicStanding: `200-Level Undergraduate · Entrepreneurship & General Studies · Chrisland University`,
    skills: [
      'Vibe Coding & Vibe Engineering',
      'AI-Assisted Web Architecture',
      'Production Deployment (Vercel)',
      'Next.js & Modern Web Standards',
      'Prompt Architecture & Semantic Synthesis',
      'Mental Health Technology & UI/UX'
    ]
  };
}

export function getProjectFullDescription(student: { name: string; matric: string; programme: string; groupName?: string; websiteUrl?: string; videoTitle?: string }) {
  const theme = getProjectTheme(student.groupName || '');
  const syndicateName = cleanGroupName(student.groupName || 'General Syndicate');
  
  let clinicalStage = 'Stage 1: Stress Alleviation (Serenity Hub)';
  let problemStatement = 'Rigorous academic deadlines, continuous assessments, and campus examination pressure often trigger cognitive fatigue.';
  let solutionApproach = 'Provides real-time stress assessment, cognitive load reduction exercises, mindfulness audio loops, and focus optimization tools designed to halt psychological escalation early.';
  
  if (theme === 'anxiety') {
    clinicalStage = 'Stage 2: Anxiety Mitigation (Mind Sync)';
    problemStatement = 'Anticipatory dread, examination anxiety, panic symptoms, and sleep disruption among university students.';
    solutionApproach = 'Delivers guided somatic breathing routines, 4-7-8 regulation timers, calming soundscapes, and interactive routines to de-escalate anxiety attacks.';
  } else if (theme === 'depression') {
    clinicalStage = 'Stage 3: Depression Support (Hope Harbour)';
    problemStatement = 'Chronic emotional numbness, loss of motivation, executive dysfunction, and clinical isolation on campus.';
    solutionApproach = 'Provides structured emotional check-ins, micro-task motivation prompts, mood trackers, and immediate escalation channels to professional counseling lifelines.';
  }

  return {
    title: student.videoTitle || `${student.name} - Mental Health Web App`,
    clinicalStage,
    syndicateName,
    problemStatement,
    solutionApproach,
    features: [
      'Instant Web App Access: Responsive UI engineered for zero-friction campus accessibility on mobile and desktop.',
      'Clinical Alignment: Architected around the sequential mental health progression model taught in GST 206.',
      'AI-Enhanced Architecture: Built via rapid Vibe Coding with clean semantic components and cloud deployment on Vercel.',
      'Multi-Modal Integration: Paired with custom musical compositions and pitch presentations for auditory relief.'
    ]
  };
}

const SPREADSHEET_ID = '1YFFiiywd1aLrUd2CV_u_MwCSdN1w94H_VnP1bXAs2xQ';
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv`;
const GOOGLE_SHEET_EDIT_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit`;
const STORAGE_KEY = 'gst206_showcase_projects_v2';
const LECTURER_STORAGE_KEY = 'gst206_course_lecturer_name_v2';
const WEBHOOK_STORAGE_KEY = 'gst206_sheets_webhook_url_v2';

function getLecturerNameSnapshot(): string {
  try {
    return localStorage.getItem(LECTURER_STORAGE_KEY) || 'S. B. Omotoso';
  } catch {
    return 'S. B. Omotoso';
  }
}

function getLecturerNameServerSnapshot(): string {
  return 'S. B. Omotoso';
}

function subscribeLecturerName(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener('lecturer_name_updated', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('lecturer_name_updated', callback);
  };
}

export interface Project {
  id: string;
  name: string;
  matric: string;
  programme: string;
  videoUrl: string;
  websiteUrl: string;
  groupName: string;
  groupUrl: string;
  videoTitle: string;
  isModified?: boolean;
  originalRowIndex?: number;
}

export interface GroupProject {
  id: string;
  name: string;
  theme: string;
  url: string;
  description: string;
  members: number;
  students: { id: string; name: string; matric: string; programme: string; websiteUrl: string }[];
  color: string;
  gradient: string;
  accent: string;
}

export interface EducationalArticle {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  readTime: string;
  date: string;
  author: string;
  authorRole: string;
  summary: string;
  content: string[];
  keyTakeaways: string[];
  tags: string[];
}

export const EDUCATIONAL_ARTICLES: EducationalArticle[] = [
  {
    id: 'mental-health-pedagogy-continuum',
    title: 'From Stress to Depression: Engineering Campus Mental Health Interventions through AI Literacy & Vibe Coding',
    subtitle: 'Why higher education requires proactive digital solutions to address the clinical progression of student stress, anxiety, and depression.',
    category: 'Pedagogy & Mental Health',
    readTime: '5 min read',
    date: 'August 2026',
    author: 'S. B. Omotoso',
    authorRole: 'Lead AI & Vibe Coding Specialist · Web App Development Innovator',
    summary: 'The campus environment is inherently demanding, characterized by intense academic, social, and environmental pressures. If stress is allowed to persist without early intervention, it graduates into anxiety; left untreated, anxiety graduates into depression and ultimately to severe crisis. The GST 206 curriculum mobilized AI and Vibe Engineering to build real-world digital lifelines.',
    content: [
      'The modern university ecosystem presents students with a continuous stream of academic demands, socio-economic expectations, and developmental transitions. While a moderate degree of pressure is natural, an unmanaged campus environment rapidly cultivates a triad of mental health challenges: Stress, Anxiety, and Depression.',
      'A crucial principle underpinning the GST 206 curriculum design is understanding the sequential, escalating nature of psychological strain. Stress is the initial physiological and emotional reaction to demanding external stimuli. When academic stress is left unaddressed, it does not simply vanish—it compounds into chronic Anxiety, characterized by pervasive cognitive apprehension, panic responses, and emotional fatigue.',
      'If anxiety remains untreated and unmitigated by healthy coping frameworks, it steadily graduates into clinical Depression: a state of deep despondency, severe loss of motivation, and cognitive disruption. In extreme and unmitigated scenarios, chronic depressive states can lead to complete psychological paralysis, acute medical emergencies, and life-threatening physiological collapse (coma).',
      'Recognizing this clinical reality, GST 206 departed from traditional passive lectures. Under the direction of S. B. Omotoso, the course deployed students into three focused syndicates directly addressing each stage of this progression in strict clinical order: (1) Stress Management (Serenity Hub), (2) Anxiety Mitigation (Mind Sync), and (3) Depression Support (Hope Harbour).',
      'By harnessing the power of Artificial Intelligence, Vibe Coding, and Vibe Engineering, 200-level undergraduates were empowered to transform empathy into code—building 29 individual web applications, 3 collaborative full-stack platforms, and 29 personalized music videos to provide accessible, round-the-clock wellness tools for the university community.'
    ],
    keyTakeaways: [
      'The Progression Continuum: Stress → Anxiety → Depression → Crisis/Coma if left unresolved.',
      'Active Digital Intervention: Transforming abstract academic concepts into tangible community solutions.',
      'Student-Centric Engineering: Equipping undergraduates to author accessible mental health tools using AI.',
      'Three Thematic Syndicates: Serenity Hub (Stress), Mind Sync (Anxiety), and Hope Harbour (Depression).'
    ],
    tags: ['Mental Health', 'Stress Management', 'Anxiety Support', 'Depression Intervention', 'AI Literacy', 'Chrisland University']
  },
  {
    id: 'vibe-coding-democratization',
    title: 'Democratizing Software Development: How 200-Level Undergraduates Built 29 Functional Web Apps via Vibe Engineering',
    subtitle: 'How natural language programming and generative AI eliminated traditional coding barriers for non-computer science majors.',
    category: 'Curriculum Innovation',
    readTime: '4 min read',
    date: 'August 2026',
    author: 'S. B. Omotoso',
    authorRole: 'Lead AI & Vibe Coding Specialist · Web App Development Innovator',
    summary: 'For decades, software development was gated behind complex syntax. Through the Vibe Coding framework introduced in GST 206, students across diverse disciplines mastered prompt engineering, component orchestration, and cloud deployment in a single semester.',
    content: [
      'In conventional university curricula, authoring a responsive full-stack web application often required multiple semesters of low-level syntactic training, compiler troubleshooting, and complex framework configurations. This created an artificial barrier between creative problem solvers and functional software deployment.',
      'GST 206 introduced a transformative paradigm shift: Vibe Coding and Vibe Engineering. Spearheaded by S. B. Omotoso at Chrisland University, this methodology shifts the focus from rote syntax memorization to prompt architecture, computational logic, UX clarity, and rapid iterative synthesis with AI coding assistants.',
      'Students learned to articulate complex application workflows in natural language, evaluate generated code structures, integrate external APIs, and deploy directly to global production infrastructure on Vercel.',
      'The verifiable outcome of this pedagogical breakthrough is extraordinary: 29 individual web applications authored by 200-level students from multiple academic disciplines, alongside 3 collaborative syndicate platforms and 29 custom music videos composed for the listening pleasure and mental restoration of their peers.'
    ],
    keyTakeaways: [
      'No Coding Barriers: Non-technical undergraduates built and launched production-ready web apps.',
      'Vibe Engineering Focus: High-level architectural reasoning and AI-assisted implementation.',
      '29 Individual Web Apps + 3 Syndicate Platforms: Full-stack applications deployed live on Vercel.',
      'Repeatable Model: A scalable framework for modern higher education digital literacy.'
    ],
    tags: ['Vibe Coding', 'Vibe Engineering', 'Web Development', 'AI Pedagogy', 'Next.js', 'Digital Transformation']
  },
  {
    id: 'commendation-200-level-cohort',
    title: 'Commendation to the 200-Level Cohort: Nurturing the Next Generation of Functional Web Engineers',
    subtitle: 'Celebrating the dedication, resilience, and extraordinary technical growth of the GST 206 student body.',
    category: 'Institutional Commendation',
    readTime: '3 min read',
    date: 'August 2026',
    author: 'S. B. Omotoso',
    authorRole: 'Lead AI & Vibe Coding Specialist · Web App Development Innovator',
    summary: 'We are proud of all the students offered us at 200 level believing that those who continued with the training will attain greater heights in practical and functional web app development.',
    content: [
      'It is with immense academic pride and professional admiration that the Course Directorate commends the entire 200-level undergraduate cohort of GST 206 at Chrisland University.',
      'When this journey began, many students possessed no prior background in web development, prompt architecture, or digital product deployment. Yet, through consistent practice, analytical curiosity, and relentless dedication, they embraced the rigor of Vibe Coding and Vibe Engineering.',
      'We are proud of all the students offered us at 200 level, firmly believing that those who continue with this training will attain greater heights in practical and functional web application development, both in Nigeria and across the global digital economy.',
      'To our students: the web applications and music videos you have created are not merely course deliverables; they are living proof of your capacity to solve human problems with technology. Let this achievement serve as a foundation for your future academic and entrepreneurial endeavors.'
    ],
    keyTakeaways: [
      'Official Institutional Commendation for the entire 200-Level GST 206 cohort.',
      'Proven Progression from non-programmers to functional application creators.',
      'Conviction of Future Excellence in practical software engineering and AI problem solving.',
      'Call to continuous lifelong learning, hackathons, and societal impact.'
    ],
    tags: ['Student Commendation', 'Academic Excellence', '200-Level Cohort', 'Chrisland University', 'Future Web Engineers']
  }
];

// Helper to check if current environment is the design platform / preview
function checkIsDesignPlatform(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    // Check hostname for development / design environment
    const hostname = window.location.hostname;
    if (
      hostname.includes('ais-dev') || 
      hostname.includes('localhost') || 
      hostname.includes('127.0.0.1') || 
      hostname.includes('webcontainer') ||
      hostname.includes('cloudrun') ||
      window.location.search.includes('admin=true') ||
      window.location.search.includes('edit=true') ||
      sessionStorage.getItem('gst206_admin_mode') === 'true'
    ) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export function Showcase() {
  const [data, setData] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<ThemeCategory>('all');
  const [activeTab, setActiveTab] = useState<'all' | 'framework' | 'groups' | 'websites' | 'videos' | 'articles' | 'engagement'>('all');
  const [activeSection, setActiveSection] = useState<'framework' | 'groups' | 'websites' | 'videos' | 'articles' | 'engagement' | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<{ url: string; title: string; author: string } | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<EducationalArticle | null>(null);
  const [isExecutiveSummaryModalOpen, setIsExecutiveSummaryModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedArticleId, setCopiedArticleId] = useState<string | null>(null);
  const [expandedGroupId, setExpandedGroupId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Student Direct Contact & Connect / Details Modal
  const [contactingStudent, setContactingStudent] = useState<Project | { id: string; name: string; matric: string; programme: string; websiteUrl?: string; videoUrl?: string; groupName?: string; groupUrl?: string; videoTitle?: string } | null>(null);
  const [studentModalTab, setStudentModalTab] = useState<'details' | 'bio' | 'contact'>('details');
  const [studentNote, setStudentNote] = useState('');
  const [studentCommendationCopied, setStudentCommendationCopied] = useState(false);

  // Call to Action / Engagement State
  const [selectedAudience, setSelectedAudience] = useState<'students' | 'institutions' | 'lis' | 'corporate' | 'public'>('students');

  // Administrative / Design Platform Access Control
  const isAdmin = useSyncExternalStore(
    () => () => {},
    () => checkIsDesignPlatform(),
    () => false
  );
  const [suggestingProject, setSuggestingProject] = useState<Project | null>(null);
  const [suggestionCorrection, setSuggestionCorrection] = useState({
    studentName: '',
    matricNumber: '',
    proposedWebsite: '',
    proposedVideo: '',
    notes: ''
  });

  // Responsive Navigation & Hamburger State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Edit & Delete Modal State
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isNewProject, setIsNewProject] = useState(false);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);

  // Google Sheet Sync & Export Studio State
  const [isSheetSyncModalOpen, setIsSheetSyncModalOpen] = useState(false);
  const [copiedSheetAll, setCopiedSheetAll] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(WEBHOOK_STORAGE_KEY) || '';
    }
    return '';
  });
  const [isWebhookSyncing, setIsWebhookSyncing] = useState(false);

  // Lecturer Name State with safe hydration
  const lecturerName = useSyncExternalStore(subscribeLecturerName, getLecturerNameSnapshot, getLecturerNameServerSnapshot);
  const [isEditingLecturer, setIsEditingLecturer] = useState(false);
  const [tempLecturerName, setTempLecturerName] = useState('S. B. Omotoso');

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isWhitepaperGenerating, setIsWhitepaperGenerating] = useState(false);

  // AI Assistant Copilot State (Powered by OpenRouter Multi-Model Fallback)
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  const handleAskAI = async (promptToUse?: string) => {
    const q = (promptToUse || aiPrompt).trim();
    if (!q) return;
    setAiLoading(true);
    setAiError(null);
    setAiResponse(null);
    const res = await askAI(q);
    if (res.success && res.result) {
      setAiResponse(res.result);
    } else {
      setAiError(res.error || 'Failed to retrieve response from AI assistant.');
    }
    setAiLoading(false);
  };

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }, []);

  const handleDownloadWhitepaper = () => {
    setIsWhitepaperGenerating(true);
    showToast('Preparing official Executive Innovation Brief...');

    try {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Executive Innovation Summary - GST 206 AI Literacy & Vibe Coding - Chrisland University</title>
            <style>
              body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1a202c; padding: 40px; max-width: 900px; margin: 0 auto; }
              .header { border-bottom: 3px solid #b25900; padding-bottom: 20px; margin-bottom: 30px; display: flex; align-items: center; justify-content: space-between; }
              .title { font-size: 24px; font-weight: 800; color: #0f172a; margin: 0; }
              .subtitle { font-size: 14px; color: #b25900; font-weight: bold; margin-top: 5px; }
              .institution { font-size: 13px; color: #64748b; margin-top: 4px; }
              .badge-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 24px 0; }
              .badge-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; text-align: center; }
              .badge-num { font-size: 20px; font-weight: 800; color: #0f172a; }
              .badge-lbl { font-size: 11px; color: #64748b; text-transform: uppercase; margin-top: 2px; font-weight: 600; }
              .section-heading { font-size: 16px; font-weight: 700; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-top: 28px; }
              .continuum-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 16px 0; }
              .stage-box { padding: 12px; border-radius: 8px; border: 1px solid #cbd5e1; }
              .stage-1 { background: #fffbeb; border-color: #fde68a; }
              .stage-2 { background: #eef2ff; border-color: #c7d2fe; }
              .stage-3 { background: #ecfdf5; border-color: #a7f3d0; }
              .stage-title { font-weight: 700; font-size: 13px; margin-bottom: 4px; }
              p, li { font-size: 13px; color: #334155; }
              .lecturer-box { background: #fdfaf6; border: 1.5px solid #d97706; border-radius: 8px; padding: 16px; margin: 24px 0; }
              .footer { border-top: 1px solid #e2e8f0; padding-top: 16px; margin-top: 40px; font-size: 11px; color: #94a3b8; text-align: center; }
              @media print { body { padding: 0; } button { display: none; } }
            </style>
          </head>
          <body>
            <div class="header">
              <div>
                <h1 class="title">Executive Innovation Summary</h1>
                <div class="subtitle">AI Literacy, Vibe Coding & Web App Development Transformation</div>
                <div class="institution">Chrisland University, Abeokuta · Course Directorate: GST 206</div>
              </div>
              <button onclick="window.print()" style="padding: 8px 16px; background: #b25900; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">Print / Save as PDF</button>
            </div>

            <div class="badge-grid">
              <div class="badge-box"><div class="badge-num">29</div><div class="badge-lbl">Web Apps Deployed</div></div>
              <div class="badge-box"><div class="badge-num">29</div><div class="badge-lbl">AI Music Productions</div></div>
              <div class="badge-box"><div class="badge-num">100%</div><div class="badge-lbl">200-Level Cohort Rate</div></div>
              <div class="badge-box"><div class="badge-num">3</div><div class="badge-lbl">Student Syndicates</div></div>
            </div>

            <div class="lecturer-box">
              <strong style="font-size: 15px; color: #0f172a;">Course Directorate & Lead Innovator: S. B. Omotoso</strong><br>
              <span style="font-size: 12px; color: #b45309; font-weight: 600;">Lead AI & Vibe Coding Specialist · Web App Development Innovator</span><br>
              <span style="font-size: 12px; color: #475569;">Chrisland University, Abeokuta · Email: sbomotoso@gmail.com</span>
            </div>

            <div class="section-heading">1. Executive Overview & Pedagogical Breakthrough</div>
            <p>Under the pedagogical direction of S. B. Omotoso, the GST 206 curriculum departed from passive coding theory, pioneering a revolutionary Vibe Coding & Vibe Engineering approach. In a single semester, 200-level undergraduate students across multiple university departments transitioned from novices into competent full-stack developers, engineering and deploying 29 live web applications to global cloud infrastructure (Vercel & Netlify) alongside 29 individual multimedia productions.</p>

            <div class="section-heading">2. The Mental Health Continuum & Community Impact</div>
            <p>The academic assignment was deliberately architected to educate the University Community and provide immediate digital solutions for campus mental health challenges. The curriculum directly maps and tackles the clinical progression continuum:</p>

            <div class="continuum-grid">
              <div class="stage-box stage-1">
                <div class="stage-title" style="color: #92400e;">Stage 1: Stress (Inception)</div>
                <p style="margin: 0; font-size: 12px;">Cognitive overload and academic demands. Solved via student syndicate <strong>Serenity Hub</strong>.</p>
              </div>
              <div class="stage-box stage-2">
                <div class="stage-title" style="color: #3730a3;">Stage 2: Anxiety (Escalation)</div>
                <p style="margin: 0; font-size: 12px;">Unmanaged stress graduating into anticipatory dread. Solved via student syndicate <strong>Mind Sync</strong>.</p>
              </div>
              <div class="stage-box stage-3">
                <div class="stage-title" style="color: #065f46;">Stage 3: Depression (Crisis)</div>
                <p style="margin: 0; font-size: 12px;">Chronic unaddressed anxiety degenerating into depression and health crisis. Solved via syndicate <strong>Hope Harbour</strong>.</p>
              </div>
            </div>

            <div class="section-heading">3. Strategic Outlook & Institutional Scalability</div>
            <p>This initiative establishes an empirical benchmark for modern university education in Africa and globally: proof that with structured AI Literacy and Vibe Coding mentorship, non-computer science students can achieve high-level technical output. As a staff member of Chrisland University, S. B. Omotoso is actively championing this curriculum framework, advancing AI Literacy, Vibe Coding, and practical web innovation across academic and professional communities.</p>

            <div class="footer">
              Official Executive Brief · GST 206 Academic Showcase · Chrisland University · Published August 2026
            </div>
          </body>
          </html>
        `);
        printWindow.document.close();
      }
    } catch {
      // fallback
    } finally {
      setIsWhitepaperGenerating(false);
    }
  };

  // Save data to localStorage whenever data changes
  const saveProjectsToStorage = useCallback((projects: Project[]) => {
    setData(projects);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch {
      // ignore storage quota issues
    }
  }, []);

  // Compute modified count
  const modifiedCount = useMemo(() => {
    return data.filter(p => p.isModified).length;
  }, [data]);

  // Track active section on scroll with requestAnimationFrame to prevent layout thrashing & mobile freeze
  useEffect(() => {
    let ticking = false;

    const updateActiveSection = () => {
      const scrollPos = window.scrollY + 180;
      const secFramework = document.getElementById('section-framework');
      const secGroups = document.getElementById('section-groups');
      const secWebsites = document.getElementById('section-websites');
      const secVideos = document.getElementById('section-videos');
      const secArticles = document.getElementById('section-articles');

      let targetSection: 'framework' | 'groups' | 'websites' | 'videos' | 'articles' | null = null;
      if (secArticles && scrollPos >= secArticles.offsetTop) {
        targetSection = 'articles';
      } else if (secVideos && scrollPos >= secVideos.offsetTop) {
        targetSection = 'videos';
      } else if (secWebsites && scrollPos >= secWebsites.offsetTop) {
        targetSection = 'websites';
      } else if (secGroups && scrollPos >= secGroups.offsetTop) {
        targetSection = 'groups';
      } else if (secFramework && scrollPos >= secFramework.offsetTop) {
        targetSection = 'framework';
      }

      setActiveSection(prev => (prev !== targetSection ? targetSection : prev));
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateActiveSection);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Data Loading with Local Storage Prioritization & Remote Fallback
  useEffect(() => {
    let ignore = false;

    async function loadData() {
      try {
        // Check if there are locally modified entries
        let cachedData: Project[] | null = null;
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length > 0) {
              cachedData = parsed;
            }
          }
        } catch {
          // ignore
        }

        if (cachedData && cachedData.length > 0) {
          if (!ignore) {
            setData(cachedData);
            setLoading(false);
          }
          return;
        }

        // Otherwise fetch from Google Sheets CSV with 8s timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);
        const response = await fetch(CSV_URL, { signal: controller.signal });
        clearTimeout(timeoutId);
        const text = await response.text();
        if (ignore) return;

        Papa.parse(text, {
          header: true,
          complete: (results) => {
            if (ignore) return;
            const rows = results.data as Record<string, string>[];
            const projects = rows.map((row, i) => ({
              id: `proj-${i}-${Date.now()}`,
              name: (row['Surname & Other Names'] || 'Unknown').trim(),
              matric: (row['Matric Number'] || '').trim(),
              programme: (row['Programme '] || row['Programme'] || 'Student').trim(),
              videoUrl: (row['Video URL'] || '').trim(),
              websiteUrl: (row['Website URL'] || '').trim(),
              groupName: (row['Group Name eg Stress alias Serenity'] || '').trim(),
              groupUrl: (row['Group Work URLMembers of the Group Share same URL'] || row['Group Work URL\nMembers of the Group Share same URL'] || '').trim(),
              videoTitle: (row['Video Title'] || '').trim(),
              isModified: false,
              originalRowIndex: i + 2
            })).filter((p: Project) => p.name !== 'Unknown' && p.name !== '');
            
            setData(projects);
            saveProjectsToStorage(projects);
            setLoading(false);
          },
          error: (err: Error) => {
            if (ignore) return;
            setError(err.message);
            setLoading(false);
          }
        });
      } catch (err: unknown) {
        if (!ignore) {
          const errMsg = err instanceof Error ? err.message : 'Unknown error';
          setError(errMsg);
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      ignore = true;
    };
  }, [refreshKey, saveProjectsToStorage]);

  // Reset to original Google Sheet Data
  const handleResetToSheet = async () => {
    if (!window.confirm('Reset all catalog data back to the original Google Sheet records? Any custom edits made locally will be refreshed.')) {
      return;
    }
    try {
      localStorage.removeItem(STORAGE_KEY);
      setLoading(true);
      setRefreshKey(k => k + 1);
      showToast('Catalog synchronized with live Google Sheet');
    } catch {
      // ignore
    }
  };

  // Group Normalizer for the 3 Group Work Websites
  const groupProjects = useMemo<GroupProject[]>(() => {
    const canonicalGroups: Record<string, GroupProject> = {
      'serenity': {
        id: 'group-serenity',
        name: 'Serenity Hub',
        theme: 'Stress',
        url: 'https://stress-management-platform.vercel.app/',
        description: 'Holistic stress tracking, calming meditation exercises, physiological relaxation loops, and daily wellness schedules.',
        members: 0,
        students: [],
        color: 'from-amber-600/30 to-orange-600/30',
        gradient: 'from-amber-600 to-orange-700',
        accent: 'border-amber-500/30 text-amber-300'
      },
      'mindsync': {
        id: 'group-mindsync',
        name: 'Mind Sync',
        theme: 'Anxiety',
        url: 'https://mind-sync-v1-wine.vercel.app/',
        description: 'Interactive AI-assisted anxiety coping strategies, cognitive grounding routines, and real-time stress assessment tools.',
        members: 0,
        students: [],
        color: 'from-blue-600/30 to-indigo-600/30',
        gradient: 'from-blue-600 to-indigo-700',
        accent: 'border-indigo-500/30 text-indigo-300'
      },
      'hopeharbour': {
        id: 'group-hopeharbour',
        name: 'Hope Harbour',
        theme: 'Depression',
        url: 'https://hope-harbour-one.vercel.app/',
        description: 'Empowering depression support ecosystem with empathetic conversational guides, mood journaling, and community hope beacons.',
        members: 0,
        students: [],
        color: 'from-emerald-600/30 to-teal-600/30',
        gradient: 'from-emerald-600 to-teal-700',
        accent: 'border-emerald-500/30 text-emerald-300'
      }
    };

    data.forEach(p => {
      const gName = (p.groupName || '').toLowerCase();
      let key = '';
      if (gName.includes('stress') || gName.includes('serenity') || gName.includes('stess')) {
        key = 'serenity';
      } else if (gName.includes('anxiety') || gName.includes('mindsync') || gName.includes('mind-sync')) {
        key = 'mindsync';
      } else if (gName.includes('depression') || gName.includes('hope harbour') || gName.includes('hope habour')) {
        key = 'hopeharbour';
      }

      if (key && canonicalGroups[key]) {
        canonicalGroups[key].members += 1;
        canonicalGroups[key].students.push({
          id: p.id,
          name: p.name,
          matric: p.matric,
          programme: p.programme,
          websiteUrl: p.websiteUrl
        });
        if (p.groupUrl && isValidUrl(p.groupUrl) && !canonicalGroups[key].url) {
          canonicalGroups[key].url = p.groupUrl;
        }
      }
    });

    return Object.values(canonicalGroups);
  }, [data]);

  // Theme summary counts for category tabs
  const themeCounts = useMemo(() => {
    const counts = {
      all: data.length,
      stress: 0,
      anxiety: 0,
      depression: 0,
      allWebsites: 0,
      stressWebsites: 0,
      anxietyWebsites: 0,
      depressionWebsites: 0,
      allVideos: 0,
      stressVideos: 0,
      anxietyVideos: 0,
      depressionVideos: 0,
    };
    data.forEach(p => {
      const t = getProjectTheme(p.groupName);
      const hasWeb = isValidUrl(p.websiteUrl);
      const hasVid = isValidUrl(p.videoUrl);
      if (hasWeb) counts.allWebsites++;
      if (hasVid) counts.allVideos++;

      if (t === 'stress') {
        counts.stress++;
        if (hasWeb) counts.stressWebsites++;
        if (hasVid) counts.stressVideos++;
      } else if (t === 'anxiety') {
        counts.anxiety++;
        if (hasWeb) counts.anxietyWebsites++;
        if (hasVid) counts.anxietyVideos++;
      } else if (t === 'depression') {
        counts.depression++;
        if (hasWeb) counts.depressionWebsites++;
        if (hasVid) counts.depressionVideos++;
      }
    });
    return counts;
  }, [data]);

  // Filter 3 Group Work Platforms by selected theme
  const filteredGroupProjects = useMemo(() => {
    if (selectedTheme === 'all') return groupProjects;
    return groupProjects.filter(g => g.theme.toLowerCase() === selectedTheme);
  }, [groupProjects, selectedTheme]);

  // Filter 29 Student Videos by search and theme
  const filteredVideos = useMemo(() => {
    return data.filter(p => {
      const matchesSearch = 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.matric.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.programme.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.groupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.videoTitle.toLowerCase().includes(searchQuery.toLowerCase());
      
      const theme = getProjectTheme(p.groupName);
      const matchesTheme = selectedTheme === 'all' || theme === selectedTheme;
      const hasVideo = isValidUrl(p.videoUrl);
      return matchesSearch && matchesTheme && hasVideo;
    });
  }, [data, searchQuery, selectedTheme]);

  // Filter 29 Student Websites by search and theme
  const filteredWebsites = useMemo(() => {
    return data.filter(p => {
      const matchesSearch = 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.matric.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.programme.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.groupName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const theme = getProjectTheme(p.groupName);
      const matchesTheme = selectedTheme === 'all' || theme === selectedTheme;
      const hasWebsite = isValidUrl(p.websiteUrl);
      return matchesSearch && matchesTheme && hasWebsite;
    });
  }, [data, searchQuery, selectedTheme]);

  const copyToClipboard = (text: string, id: string) => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).catch(() => {
          const textArea = document.createElement('textarea');
          textArea.value = text;
          textArea.style.position = 'fixed';
          textArea.style.opacity = '0';
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
        });
      } else if (typeof document !== 'undefined') {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
    } catch {
      // ignore clipboard permission error on mobile
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const scrollToSection = (id: string, sectionKey?: 'framework' | 'groups' | 'websites' | 'videos' | 'articles' | 'engagement') => {
    setActiveTab('all');
    if (sectionKey) {
      setActiveSection(sectionKey);
    }
    setIsMobileMenuOpen(false);

    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        const headerOffset = 90;
        const elementPosition = el.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 60);
  };

  // Handler to open Edit Modal
  const handleEditEntry = (project: Project) => {
    setEditingProject({ ...project });
    setIsNewProject(false);
  };

  // Handler to open Add New Entry Modal
  const handleAddNewEntry = () => {
    setEditingProject({
      id: `custom-${Date.now()}`,
      name: '',
      matric: '',
      programme: 'Computer Science',
      videoUrl: '',
      websiteUrl: '',
      groupName: 'Anxiety alias Mindsync',
      groupUrl: 'https://mind-sync-v1-wine.vercel.app/',
      videoTitle: ''
    });
    setIsNewProject(true);
  };

  // Handler to Save Entry with smart URL sanitization & Google Sheet sync flag
  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !editingProject.name.trim()) {
      alert('Please enter the student full name');
      return;
    }

    // Auto-clean & format URLs
    const sanitizedProject: Project = {
      ...editingProject,
      name: editingProject.name.trim(),
      matric: editingProject.matric.trim(),
      programme: editingProject.programme.trim() || 'General Studies',
      videoUrl: editingProject.videoUrl ? autoCorrectUrl(editingProject.videoUrl) : '',
      websiteUrl: editingProject.websiteUrl ? autoCorrectUrl(editingProject.websiteUrl) : '',
      groupUrl: editingProject.groupUrl ? autoCorrectUrl(editingProject.groupUrl) : '',
      videoTitle: editingProject.videoTitle.trim() || `${editingProject.name.trim()} - Project Walkthrough`,
      isModified: true
    };

    if (isNewProject) {
      const updated = [sanitizedProject, ...data];
      saveProjectsToStorage(updated);
      showToast(`Added new entry for ${sanitizedProject.name} (Ready to sync to Google Sheet)`);
    } else {
      const updated = data.map(p => p.id === sanitizedProject.id ? sanitizedProject : p);
      saveProjectsToStorage(updated);
      showToast(`Updated URLs & info for ${sanitizedProject.name}`);
    }

    setEditingProject(null);
  };

  // Handler to Delete Entry
  const handleConfirmDelete = () => {
    if (!deletingProject) return;
    const updated = data.filter(p => p.id !== deletingProject.id);
    saveProjectsToStorage(updated);
    showToast(`Deleted entry for ${deletingProject.name}`);
    setDeletingProject(null);
  };

  // Handler to Save Lecturer Name
  const handleSaveLecturerName = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = tempLecturerName.trim() || 'S. B. Omotoso';
    try {
      localStorage.setItem(LECTURER_STORAGE_KEY, clean);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('lecturer_name_updated'));
      }
    } catch {
      // ignore
    }
    setIsEditingLecturer(false);
    showToast('Course Lecturer name updated');
  };

  // Handler for viewers/students to suggest/send corrections to lecturer
  const handleOpenSuggestCorrection = (project?: Project) => {
    if (project) {
      setSuggestingProject(project);
      setSuggestionCorrection({
        studentName: project.name,
        matricNumber: project.matric,
        proposedWebsite: project.websiteUrl,
        proposedVideo: project.videoUrl,
        notes: ''
      });
    } else {
      setSuggestingProject({
        id: 'new',
        name: '',
        matric: '',
        programme: '',
        videoUrl: '',
        websiteUrl: '',
        groupName: '',
        groupUrl: '',
        videoTitle: ''
      });
      setSuggestionCorrection({
        studentName: '',
        matricNumber: '',
        proposedWebsite: '',
        proposedVideo: '',
        notes: ''
      });
    }
  };

  const handleSendCorrectionToLecturer = (method: 'whatsapp' | 'email') => {
    const textBody = `*GST 206 Academic Showcase - Student Correction Request*%0A%0A` +
      `*Student Name:* ${suggestionCorrection.studentName || 'Not provided'}%0A` +
      `*Matric Number:* ${suggestionCorrection.matricNumber || 'Not provided'}%0A` +
      `*Website URL:* ${suggestionCorrection.proposedWebsite || 'None'}%0A` +
      `*Video URL:* ${suggestionCorrection.proposedVideo || 'None'}%0A` +
      `*Additional Details/Notes:* ${suggestionCorrection.notes || 'None'}`;

    if (method === 'whatsapp') {
      window.open(`https://wa.me/2348034710699?text=${textBody}`, '_blank');
    } else {
      const mailto = `mailto:scholarsuite25@gmail.com?subject=GST 206 Showcase Correction: ${encodeURIComponent(suggestionCorrection.studentName || 'Submission')}&body=${encodeURIComponent(
        `GST 206 Showcase Correction Request:\n\n` +
        `Student Name: ${suggestionCorrection.studentName}\n` +
        `Matric Number: ${suggestionCorrection.matricNumber}\n` +
        `Corrected Website URL: ${suggestionCorrection.proposedWebsite}\n` +
        `Corrected Video URL: ${suggestionCorrection.proposedVideo}\n` +
        `Notes: ${suggestionCorrection.notes}`
      )}`;
      window.location.href = mailto;
    }
    setSuggestingProject(null);
    showToast('Correction details prepared. Sent to Course Lecturer!');
  };

  // Copy Tab-delimited row formatted specifically for Google Sheets direct paste
  const copyRowForGoogleSheet = (project: Project) => {
    const rowCols = [
      project.name,
      project.matric,
      project.programme,
      formatUrl(project.videoUrl),
      formatUrl(project.websiteUrl),
      project.groupName,
      formatUrl(project.groupUrl),
      project.videoTitle
    ];
    navigator.clipboard.writeText(rowCols.join('\t'));
    showToast(`Copied Google Sheet row for ${project.name}`);
  };

  // Copy All Rows for Google Sheet Direct Paste
  const copyAllRowsForGoogleSheet = () => {
    const header = ['Surname & Other Names', 'Matric Number', 'Programme', 'Video URL', 'Website URL', 'Group Name eg Stress alias Serenity', 'Group Work URLMembers of the Group Share same URL', 'Video Title'].join('\t');
    const rows = data.map(p => [
      p.name,
      p.matric,
      p.programme,
      formatUrl(p.videoUrl),
      formatUrl(p.websiteUrl),
      p.groupName,
      formatUrl(p.groupUrl),
      p.videoTitle
    ].join('\t')).join('\n');

    navigator.clipboard.writeText(header + '\n' + rows);
    setCopiedSheetAll(true);
    setTimeout(() => setCopiedSheetAll(false), 2500);
    showToast('Copied all rows formatted for Google Sheets (Paste with Ctrl+V / Cmd+V)!');
  };

  // Export full CSV file for Google Sheets Upload / Replacement
  const handleExportCSV = () => {
    const headers = [
      'Timestamp',
      'Surname & Other Names',
      'Matric Number',
      'Programme',
      'Video URL',
      'Website URL',
      'Group Name eg Stress alias Serenity',
      'Group Work URLMembers of the Group Share same URL',
      'Video Title'
    ];
    
    const rows = data.map(p => [
      `"${new Date().toISOString()}"`,
      `"${(p.name || '').replace(/"/g, '""')}"`,
      `"${(p.matric || '').replace(/"/g, '""')}"`,
      `"${(p.programme || '').replace(/"/g, '""')}"`,
      `"${formatUrl(p.videoUrl).replace(/"/g, '""')}"`,
      `"${formatUrl(p.websiteUrl).replace(/"/g, '""')}"`,
      `"${(p.groupName || '').replace(/"/g, '""')}"`,
      `"${formatUrl(p.groupUrl).replace(/"/g, '""')}"`,
      `"${(p.videoTitle || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `GST206_Corrected_Student_Submissions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Downloaded updated CSV file for Google Sheets');
  };

  // Optional Webhook Push to Google Apps Script / Sheet Endpoint
  const handlePushWebhook = async () => {
    if (!webhookUrl.trim()) {
      alert('Please enter your Google Apps Script Web App URL to push updates automatically.');
      return;
    }
    setIsWebhookSyncing(true);
    try {
      localStorage.setItem(WEBHOOK_STORAGE_KEY, webhookUrl.trim());
      const payload = {
        action: 'sync_all_records',
        updatedAt: new Date().toISOString(),
        lecturer: lecturerName,
        records: data.map((p, idx) => ({
          rowIndex: idx + 2,
          name: p.name,
          matric: p.matric,
          programme: p.programme,
          videoUrl: formatUrl(p.videoUrl),
          websiteUrl: formatUrl(p.websiteUrl),
          groupName: p.groupName,
          groupUrl: formatUrl(p.groupUrl),
          videoTitle: p.videoTitle
        }))
      };

      await fetch(webhookUrl.trim(), {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      showToast('Push update dispatched to Google Sheet Apps Script!');
    } catch {
      showToast('Webhook dispatched');
    } finally {
      setIsWebhookSyncing(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-[#B25900] selection:text-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.12),rgba(255,255,255,0))]">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] bg-emerald-600 text-white px-5 py-2.5 rounded-xl shadow-xl shadow-black/50 text-xs font-bold flex items-center gap-2 border border-emerald-400/40"
          >
            <Check className="w-4 h-4" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Fixed Header with Desktop Horizontal Menu & Mobile Hamburger Menu */}
      <header className="sticky top-0 z-50 bg-[#07090e]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          
          {/* Logo & Institution Branding */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white border border-amber-500/40 flex items-center justify-center shadow-lg shadow-black/40 overflow-hidden p-0.5 flex-shrink-0">
              <Image 
                src="/Chrisland-Logo.jpeg" 
                alt="Chrisland University Official Crest" 
                width={32} 
                height={32} 
                priority
                unoptimized
                className="object-contain w-full h-full" 
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm font-bold tracking-tight text-white leading-tight">
                  Chrisland University
                </span>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 whitespace-nowrap">
                  GST 206
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium hidden sm:inline leading-tight">
                AI & Vibe Coding Showcase
              </span>
            </div>
          </div>

          {/* DESKTOP: Horizontal Menu Bar */}
          <div className="hidden lg:flex items-center gap-2 2xl:gap-3">
            {/* Dedicated Showcase Items Menu */}
            <nav className="flex items-center gap-0.5 2xl:gap-1 p-1 bg-white/[0.04] border border-white/10 rounded-xl">
              <button
                id="menu-all-btn"
                onClick={() => { setActiveTab('all'); setActiveSection(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className={`flex items-center gap-1.5 px-2 2xl:px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === 'all' && activeSection === null
                    ? 'bg-[#B25900] text-white shadow-md shadow-[#B25900]/25'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Overview</span>
              </button>

              <button
                id="menu-framework-btn"
                onClick={() => scrollToSection('section-framework', 'framework')}
                className={`flex items-center gap-1.5 px-2 2xl:px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  activeSection === 'framework' || activeTab === 'framework'
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-600/25'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Activity className="w-3.5 h-3.5 text-amber-400" />
                <span>Continuum</span>
              </button>

              <button
                id="menu-groups-btn"
                onClick={() => scrollToSection('section-groups', 'groups')}
                className={`flex items-center gap-1.5 px-2 2xl:px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  activeSection === 'groups' || activeTab === 'groups'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Groups</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 text-white font-mono font-bold">
                  {groupProjects.length}
                </span>
              </button>

              <button
                id="menu-websites-btn"
                onClick={() => scrollToSection('section-websites', 'websites')}
                className={`flex items-center gap-1.5 px-2 2xl:px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  activeSection === 'websites' || activeTab === 'websites'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Websites</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 text-white font-mono font-bold">
                  {filteredWebsites.length}
                </span>
              </button>

              <button
                id="menu-videos-btn"
                onClick={() => scrollToSection('section-videos', 'videos')}
                className={`flex items-center gap-1.5 px-2 2xl:px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  activeSection === 'videos' || activeTab === 'videos'
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/25'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>Videos</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 text-white font-mono font-bold">
                  {filteredVideos.length}
                </span>
              </button>

              <button
                id="menu-articles-btn"
                onClick={() => scrollToSection('section-articles', 'articles')}
                className={`flex items-center gap-1.5 px-2 2xl:px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  activeSection === 'articles' || activeTab === 'articles'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-purple-300" />
                <span>Insights</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 text-white font-mono font-bold">
                  {EDUCATIONAL_ARTICLES.length}
                </span>
              </button>

              <button
                id="menu-engagement-btn"
                onClick={() => scrollToSection('section-engagement', 'engagement')}
                className={`flex items-center gap-1.5 px-2 2xl:px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  activeSection === 'engagement' || activeTab === 'engagement'
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-600/25'
                    : 'text-amber-300 hover:text-white hover:bg-amber-500/10'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Facilitation</span>
              </button>
            </nav>

            {/* Search Input */}
            <div className="relative w-36 xl:w-44 2xl:w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40" />
              <input 
                id="desktop-search-input"
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/[0.06] border border-white/10 rounded-xl py-1.5 pl-8 pr-7 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#B25900] transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Executive Brief CTA button */}
            <button
              id="executive-summary-header-btn"
              onClick={() => setIsExecutiveSummaryModalOpen(true)}
              className="px-2.5 xl:px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/40 text-amber-300 hover:text-amber-200 text-xs font-bold inline-flex items-center gap-1.5 transition-all flex-shrink-0 shadow-sm"
              title="Open Executive Innovation Summary for University Authorities & Public"
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Executive Brief</span>
            </button>

            {/* AI Assistant CTA button */}
            <button
              id="ai-copilot-header-btn"
              onClick={() => setIsAiAssistantOpen(true)}
              className="px-2.5 xl:px-3 py-1.5 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-400/40 text-indigo-300 hover:text-indigo-200 text-xs font-bold inline-flex items-center gap-1.5 transition-all flex-shrink-0 shadow-sm"
              title="Ask GST 206 AI Assistant"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>AI Assistant</span>
            </button>

            {/* DESIGN PLATFORM ONLY: Add Entry, Google Sheet Sync Hub, Reset */}
            {isAdmin ? (
              <>
                <button
                  id="add-entry-btn-desktop"
                  onClick={handleAddNewEntry}
                  className="px-2.5 xl:px-3 py-1.5 rounded-xl bg-[#B25900] hover:bg-[#d96d00] text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-md shadow-[#B25900]/25 transition-all flex-shrink-0"
                  title="Add New Student Entry (Design Platform)"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>

                <button
                  id="google-sheet-hub-btn-desktop"
                  onClick={() => setIsSheetSyncModalOpen(true)}
                  className="px-2.5 xl:px-3 py-1.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 hover:text-white text-xs font-bold inline-flex items-center gap-1.5 transition-all flex-shrink-0 shadow-sm"
                  title="Google Sheet Updates & Sync Hub"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Sheet</span>
                  {modifiedCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500 text-white font-mono font-extrabold">
                      {modifiedCount}
                    </span>
                  )}
                </button>

                <button
                  id="reset-sheet-btn-desktop"
                  onClick={handleResetToSheet}
                  className="p-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-slate-300 hover:text-white transition-all flex-shrink-0"
                  title="Reset to Live Google Sheet"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              /* VIEWER MODE: Suggest Correction / Send Updates button to contact Lecturer */
              <button
                id="suggest-correction-header-btn"
                onClick={() => handleOpenSuggestCorrection()}
                className="px-2.5 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-slate-300 hover:text-white text-xs font-medium inline-flex items-center gap-1.5 transition-all flex-shrink-0"
                title="Send update / correction to Lecturer for verification"
              >
                <MessageCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>Correction</span>
              </button>
            )}
          </div>

          {/* MOBILE: Quick Action Icons & Hamburger Toggle Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setIsAiAssistantOpen(true)}
              className="p-2 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300"
              title="GST 206 AI Assistant"
              aria-label="GST 206 AI Assistant"
            >
              <Sparkles className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsExecutiveSummaryModalOpen(true)}
              className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300"
              title="Executive Innovation Summary"
              aria-label="Executive Innovation Summary"
            >
              <Award className="w-4 h-4" />
            </button>

            {isAdmin ? (
              <>
                <button
                  onClick={handleAddNewEntry}
                  className="p-2 rounded-xl bg-[#B25900] text-white shadow-md shadow-[#B25900]/20"
                  title="Add New Entry"
                  aria-label="Add Student Entry"
                >
                  <Plus className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsSheetSyncModalOpen(true)}
                  className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 relative"
                  title="Google Sheet Sync Hub"
                  aria-label="Google Sheet Sync Hub"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  {modifiedCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-white text-[9px] font-bold flex items-center justify-center font-mono">
                      {modifiedCount}
                    </span>
                  )}
                </button>
              </>
            ) : (
              <button
                onClick={() => handleOpenSuggestCorrection()}
                className="p-2 rounded-xl bg-amber-600/20 border border-amber-500/30 text-amber-300"
                title="Submit Correction to Lecturer"
                aria-label="Submit Correction to Lecturer"
              >
                <MessageCircle className="w-4 h-4" />
              </button>
            )}

            {/* Hamburger Button */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl bg-white/[0.08] hover:bg-white/15 text-slate-200 hover:text-white border border-white/10 transition-colors"
              title="Toggle Menu"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* MOBILE HAMBURGER DRAWER */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden mt-3 pt-3 border-t border-white/10 space-y-3 overflow-hidden"
            >
              {/* Institution Identity in Mobile Drawer */}
              <div className="flex items-center gap-2.5 px-1 py-1">
                <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center p-0.5 shadow-md shadow-black/40 overflow-hidden flex-shrink-0 border border-amber-500/40">
                  <Image 
                    src="/Chrisland-Logo.jpeg" 
                    alt="Chrisland University Crest" 
                    width={28} 
                    height={28} 
                    unoptimized
                    className="object-contain w-full h-full" 
                  />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white leading-tight">Chrisland University</span>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      GST 206
                    </span>
                  </div>
                  <span className="text-[10px] text-white/60 font-medium">AI Literacy & Vibe Coding</span>
                </div>
              </div>

              {/* Mobile Search Bar */}
              <div className="relative w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input 
                  type="text"
                  placeholder="Search students, matric, or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/[0.06] border border-white/10 rounded-xl py-2 pl-9 pr-8 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#B25900]"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Mobile Theme Filter Selection */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Filter className="w-3 h-3 text-amber-400" />
                  Filter by Mental Health Theme
                </span>
                <div className="grid grid-cols-4 gap-1.5 p-1 bg-white/[0.04] border border-white/10 rounded-xl">
                  <button
                    onClick={() => setSelectedTheme('all')}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold text-center transition-all ${
                      selectedTheme === 'all'
                        ? 'bg-white/20 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    All ({data.length})
                  </button>
                  <button
                    onClick={() => setSelectedTheme('stress')}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold text-center transition-all ${
                      selectedTheme === 'stress'
                        ? 'bg-amber-500 text-black shadow-sm'
                        : 'text-amber-400/80 hover:text-amber-300'
                    }`}
                  >
                    Stress ({themeCounts.stress})
                  </button>
                  <button
                    onClick={() => setSelectedTheme('anxiety')}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold text-center transition-all ${
                      selectedTheme === 'anxiety'
                        ? 'bg-indigo-500 text-white shadow-sm'
                        : 'text-indigo-400/80 hover:text-indigo-300'
                    }`}
                  >
                    Anxiety ({themeCounts.anxiety})
                  </button>
                  <button
                    onClick={() => setSelectedTheme('depression')}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold text-center transition-all ${
                      selectedTheme === 'depression'
                        ? 'bg-emerald-500 text-black shadow-sm'
                        : 'text-emerald-400/80 hover:text-emerald-300'
                    }`}
                  >
                    Depress ({themeCounts.depression})
                  </button>
                </div>
              </div>

              {/* Navigation Grid for Showcase Items */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { setActiveTab('all'); setActiveSection(null); setIsMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold ${
                    activeTab === 'all' && activeSection === null ? 'bg-[#B25900] text-white shadow-md shadow-[#B25900]/25' : 'bg-white/[0.04] text-slate-300'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>All Overview</span>
                </button>

                <button
                  onClick={() => scrollToSection('section-framework', 'framework')}
                  className={`flex items-center gap-1.5 p-2.5 rounded-xl text-xs font-semibold ${
                    activeSection === 'framework' || activeTab === 'framework' ? 'bg-amber-600 text-white shadow-md shadow-amber-600/25' : 'bg-white/[0.04] text-slate-300'
                  }`}
                >
                  <Activity className="w-4 h-4 text-amber-300" />
                  <span>Continuum</span>
                </button>

                <button
                  onClick={() => scrollToSection('section-groups', 'groups')}
                  className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold ${
                    activeSection === 'groups' || activeTab === 'groups' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25' : 'bg-white/[0.04] text-slate-300'
                  }`}
                >
                  <span className="flex items-center gap-1.5"><Globe className="w-4 h-4" /> Groups</span>
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/20 font-mono">{groupProjects.length}</span>
                </button>

                <button
                  onClick={() => scrollToSection('section-websites', 'websites')}
                  className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold ${
                    activeSection === 'websites' || activeTab === 'websites' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25' : 'bg-white/[0.04] text-slate-300'
                  }`}
                >
                  <span className="flex items-center gap-1.5"><ExternalLink className="w-4 h-4" /> Websites</span>
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/20 font-mono">{filteredWebsites.length}</span>
                </button>

                <button
                  onClick={() => scrollToSection('section-videos', 'videos')}
                  className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold ${
                    activeSection === 'videos' || activeTab === 'videos' ? 'bg-red-600 text-white shadow-md shadow-red-600/25' : 'bg-white/[0.04] text-slate-300'
                  }`}
                >
                  <span className="flex items-center gap-1.5"><Video className="w-4 h-4" /> Videos</span>
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/20 font-mono">{filteredVideos.length}</span>
                </button>

                <button
                  onClick={() => scrollToSection('section-articles', 'articles')}
                  className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold ${
                    activeSection === 'articles' || activeTab === 'articles' ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25' : 'bg-white/[0.04] text-slate-300'
                  }`}
                >
                  <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" /> Blog & Insights</span>
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/20 font-mono">{EDUCATIONAL_ARTICLES.length}</span>
                </button>
              </div>

              {/* Action Buttons in Mobile Drawer */}
              <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
                <button
                  onClick={() => { setIsExecutiveSummaryModalOpen(true); setIsMobileMenuOpen(false); }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold"
                >
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Executive Innovation Summary</span>
                </button>

                {isAdmin ? (
                  <>
                    <button
                      onClick={() => { handleAddNewEntry(); setIsMobileMenuOpen(false); }}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#B25900] hover:bg-[#d96d00] text-white text-xs font-bold shadow-md shadow-[#B25900]/25"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Student Entry</span>
                    </button>

                    <button
                      onClick={() => { setIsSheetSyncModalOpen(true); setIsMobileMenuOpen(false); }}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-900/40 border border-emerald-500/40 text-emerald-300 text-xs font-bold"
                    >
                      <FileSpreadsheet className="w-4 h-4" />
                      <span>Google Sheet Update Hub</span>
                      {modifiedCount > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-500 text-white font-mono">
                          {modifiedCount} edited
                        </span>
                      )}
                    </button>

                    <button
                      onClick={() => { handleResetToSheet(); setIsMobileMenuOpen(false); }}
                      className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-slate-300 text-xs font-semibold"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reload Original Google Sheet</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => { handleOpenSuggestCorrection(); setIsMobileMenuOpen(false); }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-600/20 border border-amber-500/40 text-amber-300 text-xs font-semibold"
                  >
                    <MessageCircle className="w-4 h-4 text-amber-400" />
                    <span>Submit Correction / Request Update</span>
                  </button>
                )}
              </div>

              {/* Course Lecturer Profile in Mobile Drawer */}
              <div className="pt-2 border-t border-white/10 flex flex-col gap-2 text-xs text-slate-300">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-bold text-white">S. B. Omotoso</span>
                    <span className="text-[10px] text-amber-300/80">AI, Vibe Coding & Web App Specialist</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-blue-600/20 text-blue-300 border border-blue-500/30" title="LinkedIn Profile">
                      <Linkedin className="w-3.5 h-3.5 text-blue-400" />
                    </a>
                    <a href="mailto:sbomotoso@gmail.com" className="p-2 rounded-lg bg-red-600/20 text-red-300 border border-red-500/30" title="Email Lecturer">
                      <Mail className="w-3.5 h-3.5 text-red-400" />
                    </a>
                    <a href="tel:+2348034710699" className="p-2 rounded-lg bg-amber-600/20 text-amber-300 border border-amber-500/30" title="Call Lecturer">
                      <Phone className="w-3.5 h-3.5 text-[#e67300]" />
                    </a>
                    <a href="https://wa.me/2348034710699?text=Hello%20S.%20B.%20Omotoso%2C%20I%20am%20contacting%20you%20regarding%20the%20GST%20206%20Showcase" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-emerald-600/20 text-emerald-300 border border-emerald-500/30" title="WhatsApp Lecturer">
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-4 sm:px-8 lg:px-12 pt-8 pb-10">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-stretch justify-between gap-8">
          <div className="max-w-2xl flex flex-col justify-between text-center lg:text-left">
            <div>
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/[0.06] text-amber-300 border border-amber-500/30 mb-4 shadow-sm">
                <div className="w-4 h-4 rounded-full bg-white border border-amber-500/40 flex items-center justify-center p-0.5 overflow-hidden flex-shrink-0">
                  <Image src="/Chrisland-Logo.jpeg" alt="Chrisland Crest" width={14} height={14} unoptimized className="object-contain w-full h-full" />
                </div>
                <span>Chrisland University, Abeokuta · GST 206 AI Literacy Showcase</span>
              </div>
              
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4">
                AI Literacy & Vibe Coding <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200">
                  Academic Innovation Showcase
                </span>
              </h1>
              
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
                Explore the collective innovation of Chrisland University students across 3 syndicates tackling 
                <strong className="text-amber-300"> Stress</strong>, <strong className="text-indigo-300">Anxiety</strong>, and <strong className="text-emerald-300">Depression</strong>. 
                Featuring 29 individually created web applications demonstrating mastery of web development alongside 29 personalized music videos composed for your listening pleasure.
              </p>
            </div>

            {/* Quick Metrics Bar with Direct Click-to-Jump Actions */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 text-xs font-semibold pt-2">
              <button
                onClick={() => scrollToSection('section-framework', 'framework')}
                className="px-3 py-2 rounded-xl bg-amber-600/15 hover:bg-amber-600/25 border border-amber-500/30 flex items-center gap-2 text-amber-200 hover:text-white transition-all cursor-pointer group"
                title="Explore Mental Health Continuum & Educational Purpose"
              >
                <Activity className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                <span>Mental Health Continuum</span>
                <span className="text-[10px] text-amber-400 font-mono">↓</span>
              </button>

              <button
                onClick={() => scrollToSection('section-groups', 'groups')}
                className="px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 flex items-center gap-2 text-slate-200 hover:text-white transition-all cursor-pointer group"
                title="Jump to Group Work Section"
              >
                <Globe className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
                <span>3 Syndicates (Stress · Anxiety · Depression)</span>
                <span className="text-[10px] text-indigo-300 font-mono">↓</span>
              </button>

              <button
                onClick={() => scrollToSection('section-websites', 'websites')}
                className="px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 flex items-center gap-2 text-slate-200 hover:text-white transition-all cursor-pointer group"
                title="Jump to Websites Section"
              >
                <ExternalLink className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span>29 Web Apps</span>
                <span className="text-[10px] text-emerald-300 font-mono">↓</span>
              </button>

              <button
                onClick={() => scrollToSection('section-videos', 'videos')}
                className="px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 flex items-center gap-2 text-slate-200 hover:text-white transition-all cursor-pointer group"
                title="Jump to Videos Section"
              >
                <Video className="w-4 h-4 text-red-400 group-hover:scale-110 transition-transform" />
                <span>29 Music Videos</span>
                <span className="text-[10px] text-red-300 font-mono">↓</span>
              </button>

              <button
                onClick={() => scrollToSection('section-articles', 'articles')}
                className="px-3 py-2 rounded-xl bg-purple-600/15 hover:bg-purple-600/25 border border-purple-500/30 flex items-center gap-2 text-purple-200 hover:text-white transition-all cursor-pointer group"
                title="Read Editorial Articles & Insights"
              >
                <BookOpen className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
                <span>3 Editorial Articles</span>
                <span className="text-[10px] text-purple-300 font-mono">↓</span>
              </button>

              <button
                onClick={() => scrollToSection('section-engagement', 'engagement')}
                className="px-3 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/30 flex items-center gap-2 text-amber-200 hover:text-white transition-all cursor-pointer group"
                title="Training, Facilitation & Collaboration"
              >
                <Sparkles className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                <span>Training & Facilitation</span>
                <span className="text-[10px] text-amber-300 font-mono">↓</span>
              </button>
            </div>
          </div>

          {/* Right Hero Card: Course Lecturer & Executive Innovation Spotlight */}
          <div className="w-full lg:w-[410px] bg-gradient-to-b from-white/[0.08] via-white/[0.03] to-[#0c0e17] border border-white/15 rounded-2xl p-6 shadow-2xl flex flex-col justify-between gap-5 relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-white border border-amber-500/40 flex items-center justify-center p-0.5 overflow-hidden flex-shrink-0 shadow-sm">
                    <Image src="/Chrisland-Logo.jpeg" alt="Chrisland Crest" width={16} height={16} unoptimized className="object-contain w-full h-full" />
                  </div>
                  Course Directorate & Lead Innovator
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  GST 206
                </span>
              </div>

              <div className="flex items-start justify-between gap-3 group">
                <div>
                  <h3 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                    <span suppressHydrationWarning>{lecturerName}</span>
                    {isAdmin && (
                      <button 
                        onClick={() => {
                          setTempLecturerName(lecturerName);
                          setIsEditingLecturer(true);
                        }}
                        className="p-1 rounded bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-colors"
                        title="Edit Lecturer Name"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                    )}
                  </h3>
                  <p className="text-xs font-bold text-amber-300 mt-1">
                    Lead AI & Vibe Coding Specialist · Web App Development Innovator
                  </p>
                  <p className="text-[11px] text-slate-300 mt-0.5 font-medium">
                    Chrisland University, Abeokuta
                  </p>
                </div>
              </div>

              {/* Active Initiatives Note */}
              <div className="mt-3.5 p-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-[11px] text-slate-300 leading-relaxed flex items-start gap-2">
                <GraduationCap className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>
                  Staff member at <strong className="text-white">Chrisland University</strong>, spearheading AI Literacy, Vibe Coding & Web App Development training and educational innovation.
                </span>
              </div>
            </div>

            {/* Direct Connect Actions strictly in order: 1. WhatsApp, 2. Email, 3. LinkedIn, 4. Instagram */}
            <div className="flex flex-col gap-2.5 pt-2 border-t border-white/10">
              <div className="grid grid-cols-4 gap-2">
                {/* 1. WhatsApp */}
                <a
                  id="hero-whatsapp-lecturer-btn"
                  href="https://wa.me/2348034710699?text=Hello%20S.%20B.%20Omotoso%2C%20I%20am%20contacting%20you%20regarding%20the%20GST%20206%20AI%20Literacy%20and%20Vibe%20Coding%20Showcase"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 hover:text-emerald-200 font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all group"
                  title="WhatsApp S. B. Omotoso"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px]">WhatsApp</span>
                </a>

                {/* 2. Email */}
                <a
                  id="hero-email-lecturer-btn"
                  href="mailto:sbomotoso@gmail.com?subject=Inquiry%20Regarding%20AI%20Literacy%20%26%20Vibe%20Coding%20Curriculum"
                  className="py-2 px-1.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-300 hover:text-red-200 font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all group"
                  title="Email S. B. Omotoso: sbomotoso@gmail.com"
                >
                  <Mail className="w-4 h-4 text-red-400 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px]">Email</span>
                </a>

                {/* 3. LinkedIn */}
                <a
                  id="hero-linkedin-lecturer-btn"
                  href="https://www.linkedin.com/in/s-b-omotoso/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 hover:text-blue-200 font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all group"
                  title="Connect with S. B. Omotoso on LinkedIn"
                >
                  <Linkedin className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px]">LinkedIn</span>
                </a>

                {/* 4. Instagram */}
                <a
                  id="hero-instagram-lecturer-btn"
                  href="https://www.instagram.com/sbomotoso/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-1.5 rounded-xl bg-pink-600/20 hover:bg-pink-600/30 border border-pink-500/30 text-pink-300 hover:text-pink-200 font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all group"
                  title="Follow S. B. Omotoso on Instagram"
                >
                  <Instagram className="w-4 h-4 text-pink-400 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px]">Instagram</span>
                </a>
              </div>

              {/* Executive Innovation Summary Button */}
              <button
                id="hero-executive-summary-btn"
                onClick={() => setIsExecutiveSummaryModalOpen(true)}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-400/40 text-amber-200 hover:text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-black/30"
              >
                <Award className="w-4 h-4 text-amber-400" />
                <span>View Executive Innovation Summary</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 lg:px-12 pb-20 space-y-16">
        
        {/* Loading / Error States */}
        {loading && (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 border-2 border-[#B25900] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-sm font-semibold text-slate-300">Loading student project records from Google Sheets...</p>
          </div>
        )}

        {error && !loading && data.length === 0 && (
          <div className="p-6 rounded-2xl bg-red-900/20 border border-red-500/30 text-center max-w-md mx-auto">
            <p className="text-sm font-bold text-red-300 mb-2">Unable to load spreadsheet catalog</p>
            <p className="text-xs text-red-200/80 mb-4">{error}</p>
            <button
              onClick={() => setRefreshKey(k => k + 1)}
              className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-500"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Interactive Thematic Category Filter Hub */}
        {(!loading || data.length > 0) && (
          <section id="thematic-category-filters" className="space-y-4 scroll-mt-24">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                    <Filter className="w-3 h-3 text-amber-400" />
                    Interactive Category Filter
                  </span>
                  <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                    Explore Showcase by Mental Health Theme
                  </h2>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Toggle between themes to filter the 3 Group Platforms, 29 Student Web Applications, and 29 Music Video Presentations:
                </p>
              </div>

              {selectedTheme !== 'all' && (
                <button
                  onClick={() => setSelectedTheme('all')}
                  className="px-3 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/15 border border-white/15 text-slate-200 hover:text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3 text-amber-400" />
                  <span>Reset to All Themes (29)</span>
                </button>
              )}
            </div>

            {/* 4 Interactive Category Tabs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
              {/* Tab 1: All Themes */}
              <button
                id="theme-tab-all"
                onClick={() => setSelectedTheme('all')}
                className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between gap-3 group cursor-pointer ${
                  selectedTheme === 'all'
                    ? 'bg-gradient-to-br from-white/[0.14] via-white/[0.07] to-white/[0.02] border-amber-500/70 shadow-xl shadow-amber-500/10 ring-2 ring-amber-500/40'
                    : 'bg-white/[0.03] border-white/10 hover:border-white/25 hover:bg-white/[0.06]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-xl transition-colors ${selectedTheme === 'all' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-white/[0.06] text-slate-300'}`}>
                    <Layers className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${selectedTheme === 'all' ? 'bg-amber-500/30 text-amber-200 border border-amber-500/40' : 'bg-white/10 text-slate-400'}`}>
                    All 3 Syndicates
                  </span>
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-1.5">
                    <span>All Themes</span>
                    {selectedTheme === 'all' && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Complete cohort directory</p>
                </div>
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-300">
                  <span>29 Projects</span>
                  <span className="text-amber-300 font-bold">{themeCounts.allWebsites} Apps · {themeCounts.allVideos} Vids</span>
                </div>
              </button>

              {/* Tab 2: Stress Theme */}
              <button
                id="theme-tab-stress"
                onClick={() => setSelectedTheme('stress')}
                className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between gap-3 group cursor-pointer ${
                  selectedTheme === 'stress'
                    ? 'bg-gradient-to-br from-amber-600/30 via-orange-600/20 to-amber-950/50 border-amber-400 shadow-xl shadow-amber-500/20 ring-2 ring-amber-400'
                    : 'bg-white/[0.03] border-white/10 hover:border-amber-500/50 hover:bg-amber-950/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-xl transition-colors ${selectedTheme === 'stress' ? 'bg-amber-500 text-black font-bold shadow-md shadow-amber-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'}`}>
                    <Activity className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Stage 1 · Inception
                  </span>
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-1.5">
                    <span>Stress Theme</span>
                    {selectedTheme === 'stress' && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                  </h3>
                  <p className="text-[11px] text-amber-300/90 mt-0.5 font-medium">Serenity Hub Syndicate</p>
                </div>
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-300">
                  <span>{themeCounts.stress} Students</span>
                  <span className="text-amber-300 font-bold">{themeCounts.stressWebsites} Apps · {themeCounts.stressVideos} Vids</span>
                </div>
              </button>

              {/* Tab 3: Anxiety Theme */}
              <button
                id="theme-tab-anxiety"
                onClick={() => setSelectedTheme('anxiety')}
                className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between gap-3 group cursor-pointer ${
                  selectedTheme === 'anxiety'
                    ? 'bg-gradient-to-br from-indigo-600/30 via-blue-600/20 to-indigo-950/50 border-indigo-400 shadow-xl shadow-indigo-500/20 ring-2 ring-indigo-400'
                    : 'bg-white/[0.03] border-white/10 hover:border-indigo-500/50 hover:bg-indigo-950/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-xl transition-colors ${selectedTheme === 'anxiety' ? 'bg-indigo-500 text-white font-bold shadow-md shadow-indigo-500/30' : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'}`}>
                    <Brain className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Stage 2 · Escalation
                  </span>
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-1.5">
                    <span>Anxiety Theme</span>
                    {selectedTheme === 'anxiety' && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                  </h3>
                  <p className="text-[11px] text-indigo-300/90 mt-0.5 font-medium">Mind Sync Syndicate</p>
                </div>
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-300">
                  <span>{themeCounts.anxiety} Students</span>
                  <span className="text-indigo-300 font-bold">{themeCounts.anxietyWebsites} Apps · {themeCounts.anxietyVideos} Vids</span>
                </div>
              </button>

              {/* Tab 4: Depression Theme */}
              <button
                id="theme-tab-depression"
                onClick={() => setSelectedTheme('depression')}
                className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between gap-3 group cursor-pointer ${
                  selectedTheme === 'depression'
                    ? 'bg-gradient-to-br from-emerald-600/30 via-teal-600/20 to-emerald-950/50 border-emerald-400 shadow-xl shadow-emerald-500/20 ring-2 ring-emerald-400'
                    : 'bg-white/[0.03] border-white/10 hover:border-emerald-500/50 hover:bg-emerald-950/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-xl transition-colors ${selectedTheme === 'depression' ? 'bg-emerald-500 text-black font-bold shadow-md shadow-emerald-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'}`}>
                    <Heart className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Stage 3 · Severe Crisis
                  </span>
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-1.5">
                    <span>Depression Theme</span>
                    {selectedTheme === 'depression' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </h3>
                  <p className="text-[11px] text-emerald-300/90 mt-0.5 font-medium">Hope Harbour Syndicate</p>
                </div>
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-300">
                  <span>{themeCounts.depression} Students</span>
                  <span className="text-emerald-300 font-bold">{themeCounts.depressionWebsites} Apps · {themeCounts.depressionVideos} Vids</span>
                </div>
              </button>
            </div>

            {/* Active Theme Filter Banner */}
            {selectedTheme !== 'all' && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                  selectedTheme === 'stress' 
                    ? 'bg-amber-950/40 border-amber-500/40 text-amber-200' 
                    : selectedTheme === 'anxiety' 
                    ? 'bg-indigo-950/40 border-indigo-500/40 text-indigo-200' 
                    : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                }`}
              >
                <div className="flex items-center gap-2 text-xs">
                  <Filter className="w-4 h-4 flex-shrink-0" />
                  <span>
                    Active Filter: <strong className="capitalize text-white font-bold">{selectedTheme} Theme</strong> ({
                      selectedTheme === 'stress' ? 'Serenity Hub' : selectedTheme === 'anxiety' ? 'Mind Sync' : 'Hope Harbour'
                    }). Showing <strong>{filteredWebsites.length}</strong> matching web applications & <strong>{filteredVideos.length}</strong> videos.
                  </span>
                </div>
                <button
                  onClick={() => setSelectedTheme('all')}
                  className="px-2.5 py-1 rounded-lg bg-black/40 hover:bg-black/60 border border-white/20 text-xs font-bold text-white transition-colors cursor-pointer flex-shrink-0"
                >
                  Clear Theme Filter
                </button>
              </motion.div>
            )}
          </section>
        )}

        {/* SECTION 0: The Mental Health Progression Framework & Pedagogical Purpose */}
        {(!loading || data.length > 0) && (activeTab === 'all' || activeTab === 'framework') && (
          <section id="section-framework" className="space-y-6 scroll-mt-24">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-600/30 text-amber-300 border border-amber-500/40">
                    Core Academic Thesis
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Mental Health Progression Continuum & Educational Purpose
                  </h2>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Educating the University Community using AI, Vibe Coding & Web App Engineering to tackle Stress, Anxiety, and Depression.
                </p>
              </div>
              <button
                onClick={() => setIsExecutiveSummaryModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold inline-flex items-center gap-1.5 transition-all self-start sm:self-auto"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Executive Summary</span>
              </button>
            </div>

            {/* Educational Manifesto & Progression Card */}
            <div className="rounded-2xl bg-gradient-to-br from-white/[0.06] via-white/[0.03] to-[#0c0e17] border border-white/15 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              <div className="max-w-4xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Educational Rationale & University Community Impact</span>
                </div>

                <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
                  The design of the GST 206 assignment is to educate the University Community using the power of 
                  <strong className="text-white"> AI, Vibe Coding, and Vibe Engineering</strong> to build Web Applications that will impact the University Community. 
                  It is a mental health approach rooted in the reality that a campus environment is inherently characterized by 
                  <strong className="text-amber-300"> Stress</strong>, <strong className="text-indigo-300">Anxiety</strong>, and <strong className="text-emerald-300">Depression</strong>.
                </p>

                {/* The 3-Stage Progression Continuum */}
                <div className="pt-4 pb-2">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-amber-400" />
                    <span>The Clinical Progression Continuum: Stress → Anxiety → Depression</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
                    {/* Stage 1: Stress */}
                    <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 flex flex-col justify-between gap-3 relative group hover:border-amber-500/60 transition-all">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            Stage 1: Inception
                          </span>
                          <span className="text-xs font-mono font-bold text-amber-400">Serenity Hub</span>
                        </div>
                        <h4 className="text-base font-black text-white">Stress Overload</h4>
                        <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                          Initial cognitive strain from rigorous academic coursework, test deadlines, and campus life. 
                          If allowed to persist without early intervention, it compounds.
                        </p>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <a 
                          href="https://stress-management-platform.vercel.app/" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="py-1.5 px-3 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-xs font-bold flex items-center justify-between transition-colors"
                        >
                          <span>Explore Serenity Hub</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => {
                            setSelectedTheme('stress');
                            scrollToSection('section-websites', 'websites');
                          }}
                          className="py-1.5 px-3 rounded-lg bg-white/[0.05] hover:bg-amber-500/20 text-slate-300 hover:text-amber-200 text-[11px] font-semibold flex items-center justify-between transition-colors cursor-pointer border border-white/10"
                        >
                          <span>Filter to Stress Projects ({themeCounts.stressWebsites})</span>
                          <Filter className="w-3 h-3 text-amber-400" />
                        </button>
                      </div>
                    </div>

                    {/* Stage 2: Anxiety */}
                    <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30 flex flex-col justify-between gap-3 relative group hover:border-indigo-500/60 transition-all">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            Stage 2: Escalation
                          </span>
                          <span className="text-xs font-mono font-bold text-indigo-400">Mind Sync</span>
                        </div>
                        <h4 className="text-base font-black text-white">Anxiety & Agitation</h4>
                        <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                          Persistent unmanaged stress graduates into anticipatory anxiety, cognitive dread, sleep disruption, and panic symptoms requiring grounding algorithms.
                        </p>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <a 
                          href="https://mind-sync-v1-wine.vercel.app/" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="py-1.5 px-3 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-200 text-xs font-bold flex items-center justify-between transition-colors"
                        >
                          <span>Explore Mind Sync</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => {
                            setSelectedTheme('anxiety');
                            scrollToSection('section-websites', 'websites');
                          }}
                          className="py-1.5 px-3 rounded-lg bg-white/[0.05] hover:bg-indigo-500/20 text-slate-300 hover:text-indigo-200 text-[11px] font-semibold flex items-center justify-between transition-colors cursor-pointer border border-white/10"
                        >
                          <span>Filter to Anxiety Projects ({themeCounts.anxietyWebsites})</span>
                          <Filter className="w-3 h-3 text-indigo-400" />
                        </button>
                      </div>
                    </div>

                    {/* Stage 3: Depression */}
                    <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex flex-col justify-between gap-3 relative group hover:border-emerald-500/60 transition-all">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Stage 3: Severe Crisis
                          </span>
                          <span className="text-xs font-mono font-bold text-emerald-400">Hope Harbour</span>
                        </div>
                        <h4 className="text-base font-black text-white">Depression & Breakdown</h4>
                        <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                          Anxiety left untreated graduates to clinical depression, severe emotional numbness, executive collapse, and critical health hazards / coma.
                        </p>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <a 
                          href="https://hope-harbour-one.vercel.app/" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="py-1.5 px-3 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 text-xs font-bold flex items-center justify-between transition-colors"
                        >
                          <span>Explore Hope Harbour</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => {
                            setSelectedTheme('depression');
                            scrollToSection('section-websites', 'websites');
                          }}
                          className="py-1.5 px-3 rounded-lg bg-white/[0.05] hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-200 text-[11px] font-semibold flex items-center justify-between transition-colors cursor-pointer border border-white/10"
                        >
                          <span>Filter to Depression Projects ({themeCounts.depressionWebsites})</span>
                          <Filter className="w-3 h-3 text-emerald-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <p className="text-xs text-slate-300 italic">
                    &ldquo;We are proud of all the students offered us at 200 level believing that those who continued with the training will attain greater heights in practical and functional web app development.&rdquo;
                  </p>
                  <button
                    onClick={() => scrollToSection('section-articles', 'articles')}
                    className="px-3.5 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white text-xs font-bold inline-flex items-center gap-1.5 transition-all flex-shrink-0"
                  >
                    <span>Read Pedagogical Articles</span>
                    <ArrowRight className="w-3.5 h-3.5 text-purple-400" />
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 1: Group Work Websites */}
        {(!loading || data.length > 0) && (activeTab === 'all' || activeTab === 'groups') && (
          <section id="section-groups" className="space-y-6 scroll-mt-24">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-600/30 text-indigo-300 border border-indigo-500/40">
                    Section 1
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    The 3 Group Work Platforms · Vibe Engineering
                  </h2>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Collaborative full-stack web platforms arranged in pedagogical sequence: 
                  <strong className="text-amber-300"> 1. Stress (Serenity Hub)</strong> → 
                  <strong className="text-indigo-300"> 2. Anxiety (Mind Sync)</strong> → 
                  <strong className="text-emerald-300"> 3. Depression (Hope Harbour)</strong>.
                </p>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="text-xs text-slate-400 font-mono">
                  Showing {filteredGroupProjects.length} of {groupProjects.length} Platforms
                </span>
                {selectedTheme !== 'all' && (
                  <button
                    onClick={() => setSelectedTheme('all')}
                    className="text-xs font-bold text-amber-300 hover:text-white underline ml-1 cursor-pointer"
                  >
                    (Show all 3)
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {filteredGroupProjects.map((grp, idx) => (
                <GroupCard 
                  key={grp.id} 
                  group={grp} 
                  index={idx}
                  isAdmin={isAdmin}
                  isExpanded={expandedGroupId === grp.id}
                  onToggleExpand={() => setExpandedGroupId(expandedGroupId === grp.id ? null : grp.id)}
                  onCopy={(url) => copyToClipboard(url, grp.id)}
                  isCopied={copiedId === grp.id}
                  onContactStudent={(st) => setContactingStudent(st)}
                  onViewDetails={(st) => setContactingStudent(st)}
                  onEditStudent={(studentId) => {
                    const st = data.find(p => p.id === studentId);
                    if (st) handleEditEntry(st);
                  }}
                  onDeleteStudent={(studentId) => {
                    const st = data.find(p => p.id === studentId);
                    if (st) setDeletingProject(st);
                  }}
                  onSuggestCorrection={(studentId) => {
                    const st = data.find(p => p.id === studentId);
                    if (st) handleOpenSuggestCorrection(st);
                  }}
                />
              ))}
            </div>
          </section>
        )}

        {/* SECTION 2: The 29 Individual Student Web Applications */}
        {(!loading || data.length > 0) && (activeTab === 'all' || activeTab === 'websites') && (
          <section id="section-websites" className="space-y-6 scroll-mt-24">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-600/30 text-emerald-300 border border-emerald-500/40">
                    Section 2
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    The 29 Student Web Applications
                  </h2>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Individually created web applications by each student to demonstrate mastery of the art of web app development.
                </p>
              </div>

              {/* Theme Selector Pills for Websites */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center p-1 bg-white/[0.04] border border-white/10 rounded-xl">
                  <button
                    onClick={() => setSelectedTheme('all')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      selectedTheme === 'all'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    All ({themeCounts.allWebsites})
                  </button>
                  <button
                    onClick={() => setSelectedTheme('stress')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      selectedTheme === 'stress'
                        ? 'bg-amber-500 text-black shadow-sm'
                        : 'text-amber-400/80 hover:text-amber-300 hover:bg-white/5'
                    }`}
                  >
                    Stress ({themeCounts.stressWebsites})
                  </button>
                  <button
                    onClick={() => setSelectedTheme('anxiety')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      selectedTheme === 'anxiety'
                        ? 'bg-indigo-500 text-white shadow-sm'
                        : 'text-indigo-400/80 hover:text-indigo-300 hover:bg-white/5'
                    }`}
                  >
                    Anxiety ({themeCounts.anxietyWebsites})
                  </button>
                  <button
                    onClick={() => setSelectedTheme('depression')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      selectedTheme === 'depression'
                        ? 'bg-emerald-500 text-black shadow-sm'
                        : 'text-emerald-400/80 hover:text-emerald-300 hover:bg-white/5'
                    }`}
                  >
                    Depression ({themeCounts.depressionWebsites})
                  </button>
                </div>
              </div>
            </div>

            {filteredWebsites.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredWebsites.map((project, idx) => (
                  <WebsiteCard 
                    key={project.id} 
                    project={project} 
                    index={idx}
                    isAdmin={isAdmin}
                    onCopy={(url) => copyToClipboard(url, `web-${project.id}`)}
                    isCopied={copiedId === `web-${project.id}`}
                    onContactStudent={() => setContactingStudent(project)}
                    onViewDetails={() => setContactingStudent(project)}
                    onEdit={() => handleEditEntry(project)}
                    onDelete={() => setDeletingProject(project)}
                    onCopySheetRow={() => copyRowForGoogleSheet(project)}
                    onSuggestCorrection={() => handleOpenSuggestCorrection(project)}
                  />
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/10 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto text-slate-400">
                  <Globe className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-white">No web applications match the current filter</p>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  No projects found for theme &quot;{selectedTheme}&quot; {searchQuery ? `with search term "${searchQuery}"` : ''}.
                </p>
                <button
                  onClick={() => { setSelectedTheme('all'); setSearchQuery(''); }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </section>
        )}

        {/* SECTION 3: The 29 Video Presentation Pitch Demos */}
        {(!loading || data.length > 0) && (activeTab === 'all' || activeTab === 'videos') && (
          <section id="section-videos" className="space-y-6 scroll-mt-24">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-red-600/30 text-red-300 border border-red-500/40">
                    Section 3
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    The 29 Music & Video Presentations
                  </h2>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  A music video created by each student based on preferences for your listening pleasure.
                </p>
              </div>

              {/* Theme Selector Pills for Videos */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center p-1 bg-white/[0.04] border border-white/10 rounded-xl">
                  <button
                    onClick={() => setSelectedTheme('all')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      selectedTheme === 'all'
                        ? 'bg-red-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    All ({themeCounts.allVideos})
                  </button>
                  <button
                    onClick={() => setSelectedTheme('stress')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      selectedTheme === 'stress'
                        ? 'bg-amber-500 text-black shadow-sm'
                        : 'text-amber-400/80 hover:text-amber-300 hover:bg-white/5'
                    }`}
                  >
                    Stress ({themeCounts.stressVideos})
                  </button>
                  <button
                    onClick={() => setSelectedTheme('anxiety')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      selectedTheme === 'anxiety'
                        ? 'bg-indigo-500 text-white shadow-sm'
                        : 'text-indigo-400/80 hover:text-indigo-300 hover:bg-white/5'
                    }`}
                  >
                    Anxiety ({themeCounts.anxietyVideos})
                  </button>
                  <button
                    onClick={() => setSelectedTheme('depression')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      selectedTheme === 'depression'
                        ? 'bg-emerald-500 text-black shadow-sm'
                        : 'text-emerald-400/80 hover:text-emerald-300 hover:bg-white/5'
                    }`}
                  >
                    Depression ({themeCounts.depressionVideos})
                  </button>
                </div>
              </div>
            </div>

            {filteredVideos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredVideos.map((project, idx) => {
                  const musicInfo = getInvitingMusicTitle(project);
                  return (
                    <VideoCard 
                      key={project.id} 
                      project={project} 
                      index={idx}
                      isAdmin={isAdmin}
                      onPlay={() => setSelectedVideo({
                        url: project.videoUrl,
                        title: musicInfo.title,
                        author: `${project.name} (${project.matric}) · ${musicInfo.genreTag}`
                      })}
                      onCopy={(url) => copyToClipboard(url, `vid-${project.id}`)}
                      isCopied={copiedId === `vid-${project.id}`}
                      onContactStudent={() => setContactingStudent(project)}
                      onViewDetails={() => setContactingStudent(project)}
                      onEdit={() => handleEditEntry(project)}
                      onDelete={() => setDeletingProject(project)}
                      onCopySheetRow={() => copyRowForGoogleSheet(project)}
                      onSuggestCorrection={() => handleOpenSuggestCorrection(project)}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/10 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto text-slate-400">
                  <Video className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-white">No video presentations match the current filter</p>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  No video records found for theme &quot;{selectedTheme}&quot; {searchQuery ? `with search term "${searchQuery}"` : ''}.
                </p>
                <button
                  onClick={() => { setSelectedTheme('all'); setSearchQuery(''); }}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </section>
        )}

        {/* SECTION 4: Academic Insights, Pedagogical Innovations & Editorial Blog */}
        {(!loading || data.length > 0) && (activeTab === 'all' || activeTab === 'articles') && (
          <section id="section-articles" className="space-y-6 scroll-mt-24">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-purple-600/30 text-purple-300 border border-purple-500/40">
                    Section 4 · Academic Papers & Blog
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Academic Insights & Pedagogical Breakthroughs
                  </h2>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  In-depth articles documenting the pedagogical framework, AI Vibe Coding methodologies, and mental health impact.
                </p>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {EDUCATIONAL_ARTICLES.length} Editorial Papers
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {EDUCATIONAL_ARTICLES.map((article, idx) => (
                <div 
                  key={article.id}
                  className="rounded-2xl bg-white/[0.03] border border-white/10 hover:border-purple-500/40 p-6 flex flex-col justify-between gap-5 transition-all shadow-xl hover:shadow-2xl group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {article.category}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-purple-400" />
                        {article.readTime}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors leading-snug">
                      {article.title}
                    </h3>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {article.summary}
                    </p>

                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-[11px] text-purple-200/90 leading-relaxed">
                      <strong className="text-white block mb-1">Key Innovation:</strong>
                      {article.keyTakeaways[0]}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-medium">
                      By {article.author}
                    </span>
                    <button
                      onClick={() => setSelectedArticle(article)}
                      className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors shadow-md shadow-purple-600/25"
                    >
                      <span>Read Full Paper</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 5: Call to Action — Vibe Coding & Web App Development Facilitation */}
        {(!loading || data.length > 0) && (activeTab === 'all' || activeTab === 'engagement') && (
          <section 
            id="section-engagement" 
            className="scroll-mt-24 relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#0b0e1a] via-[#070912] to-[#04060a] border border-amber-500/30 p-6 sm:p-10 lg:p-12 shadow-2xl shadow-black/80 space-y-8"
          >
            {/* Section Header */}
            <div className="relative z-10 max-w-4xl space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Section 5 · Call to Action & In-House Facilitation
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  S. B. Omotoso · Chrisland University
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                Vibe Coding, AI Literacy & Web App Development Facilitation
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
                A dedicated call to action to all <strong className="text-white">Interested Students</strong> wishing to learn Vibe Coding for Web App Development, <strong className="text-white">Heads of Institutions</strong> wishing to organize similar training for their students and staff, <strong className="text-white">Members of the Public</strong>, <strong className="text-white">Library and Information Science (LIS) Practitioners</strong>, and <strong className="text-white">Corporate Organizations</strong> interested in individual or in-house facilitation to get in touch through any of the contact channels provided below.
              </p>
            </div>

            {/* Audience Segment Switcher Tabs */}
            <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
              {[
                { 
                  id: 'students' as const, 
                  label: 'Interested Students', 
                  icon: GraduationCap, 
                  tagline: 'Vibe Coding & App Building',
                  accent: 'border-amber-500/40 text-amber-300'
                },
                { 
                  id: 'institutions' as const, 
                  label: 'Heads of Institutions', 
                  icon: Building2, 
                  tagline: 'Faculty & Student Bootcamps',
                  accent: 'border-indigo-500/40 text-indigo-300'
                },
                { 
                  id: 'lis' as const, 
                  label: 'LIS Practitioners', 
                  icon: Library, 
                  tagline: 'Digital Curation & AI Portals',
                  accent: 'border-purple-500/40 text-purple-300'
                },
                { 
                  id: 'corporate' as const, 
                  label: 'Corporate Organizations', 
                  icon: Briefcase, 
                  tagline: 'In-House Workforce Upskilling',
                  accent: 'border-emerald-500/40 text-emerald-300'
                },
                { 
                  id: 'public' as const, 
                  label: 'Members of the Public', 
                  icon: Globe2, 
                  tagline: 'Career Transition & AI Mastery',
                  accent: 'border-rose-500/40 text-rose-300'
                }
              ].map((aud) => {
                const Icon = aud.icon;
                const isSelected = selectedAudience === aud.id;
                return (
                  <button
                    key={aud.id}
                    onClick={() => setSelectedAudience(aud.id)}
                    className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between gap-2 transition-all group ${
                      isSelected 
                        ? 'bg-white/[0.1] border-amber-400 shadow-lg shadow-amber-500/10' 
                        : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.06] hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        isSelected ? 'bg-amber-500 text-black' : 'bg-white/5 text-slate-300 group-hover:text-white'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white line-clamp-1">{aud.label}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{aud.tagline}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Audience Focus Details Card */}
            <div className="relative z-10 p-6 sm:p-7 rounded-2xl bg-[#0e121d] border border-white/10">
              {selectedAudience === 'students' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">For Interested Students</h3>
                      <p className="text-xs text-amber-300">Hands-on Vibe Coding, Full-Stack Web Development & AI Engineering Mentorship</p>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Designed for 200-level and higher undergraduate students of all academic disciplines. Learn how to transform raw ideas and campus problem statements into fully responsive, hosted web applications and multimedia pitch presentations using modern AI prompting techniques, Next.js, and cloud deployment — even with zero prior coding background.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs text-slate-300">
                      <strong className="text-white block mb-0.5">Practical Curriculum</strong>
                      No abstract syntax theory; learn by building live applications from Day 1.
                    </div>
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs text-slate-300">
                      <strong className="text-white block mb-0.5">Portfolio & Live Hosting</strong>
                      Deploy real web apps on custom domains and build a visible digital portfolio.
                    </div>
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs text-slate-300">
                      <strong className="text-white block mb-0.5">Direct Mentorship</strong>
                      One-on-one debugging guidance and project design support from S. B. Omotoso.
                    </div>
                  </div>
                </div>
              )}

              {selectedAudience === 'institutions' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">For Heads of Institutions</h3>
                      <p className="text-xs text-indigo-300">Institutional AI Literacy, Faculty Development & Campus-Wide Innovation Labs</p>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Empower your entire academic community with institutional AI Literacy and Vibe Coding curriculum. Drawing on practical pedagogical experience at Chrisland University, S. B. Omotoso provides specialized curriculum facilitation and workshop design to enable institutions produce digitally competent graduates capable of building production-ready software solutions.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs text-slate-300">
                      <strong className="text-white block mb-0.5">Turnkey Curriculum</strong>
                      Ready-to-deploy GST and departmental modules aligned with modern standards.
                    </div>
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs text-slate-300">
                      <strong className="text-white block mb-0.5">Staff & Faculty Bootcamps</strong>
                      Train lecturers to supervise AI-assisted student projects and conduct research.
                    </div>
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs text-slate-300">
                      <strong className="text-white block mb-0.5">Accreditation Impact</strong>
                      High-impact student deliverables that showcase tangible technological innovation.
                    </div>
                  </div>
                </div>
              )}

              {selectedAudience === 'lis' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                      <Library className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">For Library and Information Science (LIS) Practitioners</h3>
                      <p className="text-xs text-purple-300">AI Literacy, Digital Repositories & Modern Web Knowledge Systems</p>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Tailored masterclasses for University Librarians, Digital Curators, and Information Specialists. Learn to harness AI and Vibe Coding to develop custom institutional repositories, semantic search interfaces, metadata indexers, and digital reference portals that elevate the prestige and accessibility of academic libraries.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs text-slate-300">
                      <strong className="text-white block mb-0.5">AI-Powered Repositories</strong>
                      Build custom search, indexing, and digital curation web interfaces.
                    </div>
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs text-slate-300">
                      <strong className="text-white block mb-0.5">Digital Transformation</strong>
                      Bridge traditional library cataloging with modern full-stack web architecture.
                    </div>
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs text-slate-300">
                      <strong className="text-white block mb-0.5">Professional Certification</strong>
                      Practical credentials and hands-on tool development for information managers.
                    </div>
                  </div>
                </div>
              )}

              {selectedAudience === 'corporate' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">For Corporate & Public Organizations</h3>
                      <p className="text-xs text-emerald-300">In-House Workforce Facilitation, Rapid Prototyping & Enterprise AI Enablement</p>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Equip your non-technical and technical workforce with the ability to rapidly prototype client-facing portals, internal dashboards, and automated web workflows without waiting months for traditional software engineering cycles. Tailored executive and departmental in-house facilitation.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs text-slate-300">
                      <strong className="text-white block mb-0.5">Custom In-House Delivery</strong>
                      Workshops tailored specifically to your organization&apos;s domain and operational data.
                    </div>
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs text-slate-300">
                      <strong className="text-white block mb-0.5">Workflow Automation</strong>
                      Build bespoke web portals and automation tools within hours instead of months.
                    </div>
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs text-slate-300">
                      <strong className="text-white block mb-0.5">Executive Upskilling</strong>
                      Demystify generative AI architecture for C-suite and department leads.
                    </div>
                  </div>
                </div>
              )}

              {selectedAudience === 'public' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                      <Globe2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">For Members of the Public</h3>
                      <p className="text-xs text-rose-300">Individual Upskilling, Tech Career Transition & Digital Entrepreneurship</p>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Open to tech enthusiasts, entrepreneurs, career transitioners, and self-starters. Gain the practical skills to conceptualize, vibe code, build, and deploy full-stack web products and SaaS MVPs independently with AI leverage.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs text-slate-300">
                      <strong className="text-white block mb-0.5">Zero Prerequisites</strong>
                      Beginners and professionals alike learn intuitive AI vibe engineering techniques.
                    </div>
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs text-slate-300">
                      <strong className="text-white block mb-0.5">Build Your Startup MVP</strong>
                      Walk away with your own functional web application ready for public launch.
                    </div>
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs text-slate-300">
                      <strong className="text-white block mb-0.5">Cohort & 1-on-1 Tracks</strong>
                      Flexible weekend cohorts, evening sessions, and personalized facilitation.
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Direct Connect & Facilitation Booking Banner strictly in order: 1. WhatsApp, 2. Email, 3. LinkedIn, 4. Instagram */}
            <div className="relative z-10 p-6 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-indigo-500/15 border border-amber-500/30 flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="space-y-1 text-center lg:text-left">
                <h3 className="text-base sm:text-lg font-black text-white flex items-center justify-center lg:justify-start gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Get in Touch for Facilitation & In-House Training</span>
                </h3>
                <p className="text-xs text-slate-300">
                  Select your preferred channel to initiate discussions with <strong className="text-white">S. B. Omotoso</strong>.
                </p>
              </div>

              {/* Channels ordered strictly: WhatsApp, Email, LinkedIn, Instagram */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full lg:w-auto">
                {/* 1. WhatsApp */}
                <a
                  id="cta-whatsapp-channel-btn"
                  href={`https://wa.me/2348034710699?text=${encodeURIComponent(
                    selectedAudience === 'students' 
                      ? 'Hello S. B. Omotoso, I am an interested student wishing to learn Vibe Coding for Web App Development.' 
                      : selectedAudience === 'institutions'
                      ? 'Hello S. B. Omotoso, as a Head of Institution, I would like to discuss organizing AI Literacy and Vibe Coding training for our students and staff.'
                      : selectedAudience === 'lis'
                      ? 'Hello S. B. Omotoso, I am a Library and Information Science practitioner interested in AI Literacy and Web App Development facilitation.'
                      : selectedAudience === 'corporate'
                      ? 'Hello S. B. Omotoso, our corporate organization is interested in in-house Vibe Coding and AI Literacy training for our staff.'
                      : 'Hello S. B. Omotoso, I am a member of the public interested in learning Vibe Coding and Web App Development.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/25 group"
                  title="Chat on WhatsApp with S. B. Omotoso"
                >
                  <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>WhatsApp</span>
                </a>

                {/* 2. Email */}
                <a
                  id="cta-email-channel-btn"
                  href={`mailto:sbomotoso@gmail.com?subject=${encodeURIComponent(
                    selectedAudience === 'students'
                      ? 'Student Inquiry: Vibe Coding & Web App Development'
                      : selectedAudience === 'institutions'
                      ? 'Institutional Training Inquiry: AI Literacy & Vibe Coding'
                      : selectedAudience === 'lis'
                      ? 'LIS Practitioner Inquiry: AI Literacy & Web App Development'
                      : selectedAudience === 'corporate'
                      ? 'Corporate In-House Training Facilitation Request'
                      : 'Public Training Inquiry: Vibe Coding & Web App Development'
                  )}&body=${encodeURIComponent(
                    `Hello S. B. Omotoso,\n\nI am reaching out regarding ${
                      selectedAudience === 'students'
                        ? 'Vibe Coding and Web App Development training for students'
                        : selectedAudience === 'institutions'
                        ? 'organizing AI Literacy & Vibe Coding training for our students and staff'
                        : selectedAudience === 'lis'
                        ? 'AI Literacy, digital curation, and web app creation for LIS practitioners'
                        : selectedAudience === 'corporate'
                        ? 'in-house training facilitation for our corporate team'
                        : 'individual training in Vibe Coding and Web App Development'
                    }.\n\nPlease provide information on scheduling, curriculum modules, and next steps.\n\nThank you.`
                  )}`}
                  className="py-2.5 px-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-red-600/25 group"
                  title="Email S. B. Omotoso: sbomotoso@gmail.com"
                >
                  <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Email</span>
                </a>

                {/* 3. LinkedIn */}
                <a
                  id="cta-linkedin-channel-btn"
                  href="https://www.linkedin.com/in/s-b-omotoso/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-600/25 group"
                  title="Connect on LinkedIn"
                >
                  <Linkedin className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>LinkedIn</span>
                </a>

                {/* 4. Instagram */}
                <a
                  id="cta-instagram-channel-btn"
                  href="https://www.instagram.com/sbomotoso/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-pink-600/25 group"
                  title="Follow on Instagram"
                >
                  <Instagram className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Instagram</span>
                </a>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Video Modal Player */}
      <AnimatePresence>
        {selectedVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-4xl bg-[#0c0e14] border border-white/15 rounded-2xl overflow-hidden shadow-2xl shadow-black flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400 flex-shrink-0 shadow-md shadow-red-600/20">
                    <Music className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm sm:text-base font-bold text-white line-clamp-1 flex items-center gap-2">
                      <span>{selectedVideo.title}</span>
                    </h3>
                    <p className="text-xs text-amber-300/90 font-medium truncate flex items-center gap-1.5 mt-0.5">
                      <Sparkles className="w-3 h-3 text-amber-400 flex-shrink-0" />
                      <span>{selectedVideo.author}</span>
                      <span className="text-slate-500">·</span>
                      <span className="text-slate-400">Created for Your Listening Pleasure</span>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                  <a
                    href={formatUrl(selectedVideo.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                    title="Open on YouTube/Suno"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => setSelectedVideo(null)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Video Player Box */}
              <div className="aspect-video w-full bg-black relative">
                {getYouTubeId(selectedVideo.url) ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${getYouTubeId(selectedVideo.url)}?autoplay=1&rel=0`}
                    title={selectedVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-slate-900 to-black">
                    <Video className="w-12 h-12 text-slate-500 mb-3" />
                    <p className="text-sm font-semibold text-white mb-2">External Video / Audio Link</p>
                    <p className="text-xs text-slate-400 max-w-md mb-5 break-all">
                      {formatUrl(selectedVideo.url)}
                    </p>
                    <a
                      href={formatUrl(selectedVideo.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs inline-flex items-center gap-2 shadow-lg shadow-red-600/30 transition-all"
                    >
                      <span>Open Media in New Tab</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SMART URL & ENTRY EDIT MODAL */}
      <AnimatePresence>
        {editingProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-[#0e121b] border border-white/15 rounded-2xl overflow-hidden shadow-2xl shadow-black/80 flex flex-col my-8"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#B25900]/20 border border-[#B25900]/40 flex items-center justify-center text-[#e67300]">
                    <Pencil className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      {isNewProject ? 'Add Student Record' : 'Edit & Correct Student URLs'}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      URL corrections are automatically validated, sanitized, and prepared for Google Sheets sync.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setEditingProject(null)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveEntry} className="p-6 space-y-4 text-xs">
                {/* Student Personal Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Surname & Other Names *</label>
                    <input
                      type="text"
                      required
                      value={editingProject.name}
                      onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
                      placeholder="e.g. Adeyemi John"
                      className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-3 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#B25900]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Matric Number</label>
                    <input
                      type="text"
                      value={editingProject.matric}
                      onChange={(e) => setEditingProject({ ...editingProject, matric: e.target.value })}
                      placeholder="e.g. CSC/2024/001"
                      className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-3 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#B25900]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Programme / Department</label>
                    <input
                      type="text"
                      value={editingProject.programme}
                      onChange={(e) => setEditingProject({ ...editingProject, programme: e.target.value })}
                      placeholder="e.g. Computer Science / Nursing"
                      className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-3 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#B25900]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Group Syndicate</label>
                    <select
                      value={editingProject.groupName}
                      onChange={(e) => {
                        const g = e.target.value;
                        let gUrl = editingProject.groupUrl;
                        if (g.includes('Mindsync')) gUrl = 'https://mind-sync-v1-wine.vercel.app/';
                        if (g.includes('Serenity')) gUrl = 'https://stress-management-platform.vercel.app/';
                        if (g.includes('Hope Harbour')) gUrl = 'https://hope-harbour-one.vercel.app/';
                        setEditingProject({ ...editingProject, groupName: g, groupUrl: gUrl });
                      }}
                      className="w-full bg-[#0a0d14] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#B25900]"
                    >
                      <option value="Anxiety alias Mindsync">Mind Sync (Anxiety)</option>
                      <option value="Stress alias Serenity">Serenity Hub (Stress)</option>
                      <option value="Depression alias Hope Harbour">Hope Harbour (Depression)</option>
                      <option value="NO GROUP">No Group</option>
                    </select>
                  </div>
                </div>

                {/* HIGHLIGHTED URL EDITING SECTION */}
                <div className="p-4 rounded-xl bg-gradient-to-b from-[#B25900]/10 to-transparent border border-[#B25900]/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-400 flex items-center gap-1.5 text-xs">
                      <LinkIcon className="w-3.5 h-3.5" />
                      URL Correction & Verification Hub
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Auto-fixes https:// & typo domains
                    </span>
                  </div>

                  {/* 1. Personal Website URL */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-slate-200 font-semibold">
                        Personal Web App URL (Vercel / Render / Netlify)
                      </label>
                      {editingProject.websiteUrl && (
                        <a
                          href={formatUrl(editingProject.websiteUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-emerald-400 hover:underline inline-flex items-center gap-1 font-semibold"
                        >
                          <span>Test Link</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        value={editingProject.websiteUrl}
                        onChange={(e) => setEditingProject({ ...editingProject, websiteUrl: e.target.value })}
                        placeholder="https://my-app.vercel.app"
                        className="w-full bg-white/[0.06] border border-white/15 rounded-xl px-3 py-2 text-white placeholder:text-slate-500 font-mono text-xs focus:outline-none focus:border-[#B25900]"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Cleaned URL: <span className="font-mono text-slate-300">{formatUrl(editingProject.websiteUrl || 'None')}</span>
                    </p>
                  </div>

                  {/* 2. Video Presentation URL */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-slate-200 font-semibold">
                        Video Pitch URL (YouTube / Suno / Google Drive)
                      </label>
                      {editingProject.videoUrl && (
                        <a
                          href={formatUrl(editingProject.videoUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-red-400 hover:underline inline-flex items-center gap-1 font-semibold"
                        >
                          <span>Test Video</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        value={editingProject.videoUrl}
                        onChange={(e) => setEditingProject({ ...editingProject, videoUrl: e.target.value })}
                        placeholder="https://youtu.be/..."
                        className="w-full bg-white/[0.06] border border-white/15 rounded-xl px-3 py-2 text-white placeholder:text-slate-500 font-mono text-xs focus:outline-none focus:border-[#B25900]"
                      />
                    </div>
                    {getYouTubeId(editingProject.videoUrl) && (
                      <p className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>Valid YouTube ID detected: <strong className="font-mono">{getYouTubeId(editingProject.videoUrl)}</strong></span>
                      </p>
                    )}
                  </div>

                  {/* 3. Video Presentation Title */}
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Video Presentation Title</label>
                    <input
                      type="text"
                      value={editingProject.videoTitle}
                      onChange={(e) => setEditingProject({ ...editingProject, videoTitle: e.target.value })}
                      placeholder="e.g. Mental Resilience AI Walkthrough"
                      className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-3 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#B25900]"
                    />
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-2.5">
                  <span className="text-[11px] text-slate-400">
                    Saves locally & updates showcase in real-time
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingProject(null)}
                      className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 font-semibold transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-[#B25900] hover:bg-[#d96d00] text-white font-bold transition-all shadow-md shadow-[#B25900]/25"
                    >
                      Save & Correct Entry
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* GOOGLE SHEET UPDATE & SYNC HUB MODAL */}
      <AnimatePresence>
        {isSheetSyncModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-[#0e121b] border border-emerald-500/30 rounded-2xl overflow-hidden shadow-2xl p-6 space-y-5 my-8"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Google Sheet Update & Synchronization Hub</h3>
                    <p className="text-xs text-slate-400">
                      Sync corrections directly back to your Google Sheet (<span className="font-mono text-emerald-400">GST 206</span>).
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsSheetSyncModalOpen(false)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Status Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                  <span className="text-slate-400 block text-[11px]">Total Records</span>
                  <span className="text-lg font-bold text-white">{data.length} Submissions</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                  <span className="text-slate-400 block text-[11px]">Corrected / Edited</span>
                  <span className="text-lg font-bold text-amber-400">{modifiedCount} Modified</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 col-span-2 sm:col-span-1">
                  <span className="text-slate-400 block text-[11px]">Sheet ID</span>
                  <span className="text-xs font-mono text-slate-300 truncate block">...{SPREADSHEET_ID.slice(-8)}</span>
                </div>
              </div>

              {/* Action 1 & 2: Direct Google Sheet Sync & Export Options */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Synchronization Actions
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Copy All Formatted Rows */}
                  <button
                    onClick={copyAllRowsForGoogleSheet}
                    className="p-4 rounded-xl bg-gradient-to-br from-emerald-900/40 to-teal-900/20 border border-emerald-500/40 hover:border-emerald-400 text-left transition-all group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Copy className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-mono text-emerald-300 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                        {copiedSheetAll ? 'COPIED!' : '1-CLICK COPY'}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-white mb-1">Copy All Rows for Google Sheet</p>
                    <p className="text-[11px] text-slate-300">
                      Copies all rows formatted with tab-separators. Open Google Sheet & press <strong className="text-white">Ctrl+V / Cmd+V</strong> to update!
                    </p>
                  </button>

                  {/* Download CSV File */}
                  <button
                    onClick={handleExportCSV}
                    className="p-4 rounded-xl bg-gradient-to-br from-indigo-900/40 to-blue-900/20 border border-indigo-500/40 hover:border-indigo-400 text-left transition-all group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Download className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-mono text-indigo-300 font-bold bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-500/30">
                        CSV EXPORT
                      </span>
                    </div>
                    <p className="text-xs font-bold text-white mb-1">Download Corrected CSV</p>
                    <p className="text-[11px] text-slate-300">
                      Exports complete updated dataset with clean headers to import directly into Google Sheets.
                    </p>
                  </button>
                </div>

                {/* Direct Google Sheet Link */}
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-white">Live Google Sheet Document</p>
                      <p className="text-[11px] text-slate-400">Open source spreadsheet directly to view columns and paste edits.</p>
                    </div>
                  </div>
                  <a
                    href={GOOGLE_SHEET_EDIT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs inline-flex items-center gap-1.5 flex-shrink-0 shadow-md shadow-emerald-600/20"
                  >
                    <span>Open Sheet</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Optional Webhook Push Setup */}
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      Automated Apps Script Webhook Push (Optional)
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Real-time Push</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      placeholder="https://script.google.com/macros/s/.../exec"
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                      className="flex-1 bg-white/[0.05] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-slate-500 font-mono focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      onClick={handlePushWebhook}
                      disabled={isWebhookSyncing}
                      className="px-3.5 py-1.5 rounded-lg bg-[#B25900] hover:bg-[#d96d00] text-white font-bold text-xs flex-shrink-0 disabled:opacity-50"
                    >
                      {isWebhookSyncing ? 'Syncing...' : 'Push Updates'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <button
                  onClick={handleResetToSheet}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reload / Reset to original sheet records</span>
                </button>
                <button
                  onClick={() => setIsSheetSyncModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/15 text-white text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#0e121b] border border-red-500/30 rounded-2xl overflow-hidden shadow-2xl p-6 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-red-600/20 border border-red-500/40 text-red-400 mx-auto flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">Delete Student Record?</h3>
              <p className="text-xs text-slate-300 mb-2">
                Are you sure you want to remove <strong className="text-white">{deletingProject.name}</strong> ({deletingProject.matric || 'No matric'})?
              </p>
              <p className="text-[11px] text-slate-500 mb-6">
                You can restore all original records anytime by clicking &quot;Reload / Reset Sheet&quot;.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setDeletingProject(null)}
                  className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors shadow-lg shadow-red-600/30"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Suggest Correction Modal (For Viewers / Students to send updates to lecturer) */}
      <AnimatePresence>
        {suggestingProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-[#0e121b] border border-amber-500/30 rounded-2xl overflow-hidden shadow-2xl p-6 space-y-4 my-8"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center p-0.5 shadow-sm overflow-hidden flex-shrink-0 border border-amber-500/40">
                    <Image src="/Chrisland-Logo.jpeg" alt="Chrisland University Logo" width={26} height={26} unoptimized className="object-contain w-full h-full" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Send Correction / Update to Lecturer</h3>
                    <p className="text-[11px] text-slate-400">All submissions are reviewed by the Course Lecturer for verification.</p>
                  </div>
                </div>
                <button
                  onClick={() => setSuggestingProject(null)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Student Full Name</label>
                  <input
                    type="text"
                    value={suggestionCorrection.studentName}
                    onChange={(e) => setSuggestionCorrection({ ...suggestionCorrection, studentName: e.target.value })}
                    placeholder="e.g. Adebayo Blessing"
                    className="w-full bg-white/[0.06] border border-white/15 rounded-xl px-3 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Matriculation Number</label>
                  <input
                    type="text"
                    value={suggestionCorrection.matricNumber}
                    onChange={(e) => setSuggestionCorrection({ ...suggestionCorrection, matricNumber: e.target.value })}
                    placeholder="e.g. 23/1234"
                    className="w-full bg-white/[0.06] border border-white/15 rounded-xl px-3 py-2 text-white placeholder:text-slate-500 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Corrected / New Web App URL</label>
                  <input
                    type="text"
                    value={suggestionCorrection.proposedWebsite}
                    onChange={(e) => setSuggestionCorrection({ ...suggestionCorrection, proposedWebsite: e.target.value })}
                    placeholder="https://my-app.vercel.app"
                    className="w-full bg-white/[0.06] border border-white/15 rounded-xl px-3 py-2 text-white placeholder:text-slate-500 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Corrected / New Video URL</label>
                  <input
                    type="text"
                    value={suggestionCorrection.proposedVideo}
                    onChange={(e) => setSuggestionCorrection({ ...suggestionCorrection, proposedVideo: e.target.value })}
                    placeholder="https://youtu.be/..."
                    className="w-full bg-white/[0.06] border border-white/15 rounded-xl px-3 py-2 text-white placeholder:text-slate-500 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Correction Notes / Reason</label>
                  <textarea
                    rows={2}
                    value={suggestionCorrection.notes}
                    onChange={(e) => setSuggestionCorrection({ ...suggestionCorrection, notes: e.target.value })}
                    placeholder="Explain what was corrected (e.g. updated my broken deployment URL)"
                    className="w-full bg-white/[0.06] border border-white/15 rounded-xl px-3 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2.5">
                <button
                  type="button"
                  onClick={() => setSuggestingProject(null)}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>

                <div className="w-full sm:w-auto flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleSendCorrectionToLecturer('whatsapp')}
                    className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Send via WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSendCorrectionToLecturer('email')}
                    className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 shadow-md shadow-amber-600/20"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Send via Email</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Lecturer Name Edit Modal */}
      <AnimatePresence>
        {isEditingLecturer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#0e121b] border border-white/15 rounded-2xl overflow-hidden shadow-2xl p-6"
            >
              <h3 className="text-sm font-bold text-white mb-1">Edit Course Lecturer Name</h3>
              <p className="text-xs text-slate-400 mb-4">Set the official lecturer name or title displayed across the showcase.</p>
              <form onSubmit={handleSaveLecturerName} className="space-y-4">
                <input
                  type="text"
                  required
                  value={tempLecturerName}
                  onChange={(e) => setTempLecturerName(e.target.value)}
                  placeholder="e.g. Dr. Course Lead / Prof. John Doe"
                  className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#B25900]"
                />
                <div className="flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsEditingLecturer(false)}
                    className="px-4 py-2 rounded-xl bg-white/[0.06] text-slate-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#B25900] hover:bg-[#d96d00] text-white text-xs font-bold"
                  >
                    Save Name
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* AI ASSISTANT MODAL (Multi-Model OpenRouter Fallback) */}
      <AnimatePresence>
        {isAiAssistantOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-2xl bg-[#0a0d16] border border-white/15 rounded-3xl overflow-hidden shadow-2xl flex flex-col my-auto max-h-[90vh]"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>GST 206 Academic AI Assistant</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Multi-Model Fallback
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-400">Ask anything about the showcase, student apps, or the mental health curriculum</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAiAssistantOpen(false)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Chat Content Body */}
              <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
                {/* Suggested prompt chips */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Quick Prompts:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'What is the Stress-Anxiety-Depression Continuum?',
                      'How did students build 29 apps via Vibe Engineering?',
                      'Tell me about the 3 syndicate platforms',
                      'How does early stress intervention prevent depression?'
                    ].map((p, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setAiPrompt(p);
                          handleAskAI(p);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-indigo-600/20 border border-white/10 hover:border-indigo-500/30 text-slate-300 hover:text-indigo-200 text-[11px] transition-all text-left"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* AI Response Output Card */}
                {aiLoading && (
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-3 text-slate-300 animate-pulse">
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                    <span>Analyzing GST 206 knowledge base & generating response...</span>
                  </div>
                )}

                {aiError && (
                  <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/30 text-red-300 space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                      <span>Notice</span>
                    </div>
                    <p className="text-[11px] text-red-200">{aiError}</p>
                    <p className="text-[10px] text-red-400 mt-1">Make sure OPENROUTER_API_KEY is configured in your environment.</p>
                  </div>
                )}

                {aiResponse && (
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/30 via-[#0c101a] to-emerald-950/20 border border-white/15 space-y-3 shadow-lg">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <span className="text-[11px] font-bold text-indigo-300 flex items-center gap-1.5">
                        <Bot className="w-3.5 h-3.5 text-indigo-400" />
                        <span>AI Response</span>
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(aiResponse);
                          showToast('Response copied to clipboard');
                        }}
                        className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </button>
                    </div>
                    <div className="text-slate-200 leading-relaxed whitespace-pre-line text-xs">
                      {aiResponse}
                    </div>
                  </div>
                )}
              </div>

              {/* Input Form Footer */}
              <div className="p-4 border-t border-white/10 bg-white/[0.02]">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAskAI();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="Ask a question about GST 206 AI & Vibe Coding..."
                    disabled={aiLoading}
                    className="flex-1 bg-white/[0.06] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={aiLoading || !aiPrompt.trim()}
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold inline-flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/30"
                  >
                    {aiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    <span>Ask</span>
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EXECUTIVE INNOVATION SUMMARY MODAL */}
      <AnimatePresence>
        {isExecutiveSummaryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-[#0b0e17] border border-amber-500/30 rounded-2xl overflow-hidden shadow-2xl shadow-black/80 flex flex-col my-8"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-gradient-to-r from-amber-950/40 via-amber-900/20 to-transparent">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center p-0.5 shadow-md shadow-black/40 overflow-hidden flex-shrink-0 border border-amber-500/40">
                    <Image src="/Chrisland-Logo.jpeg" alt="Chrisland Crest" width={32} height={32} unoptimized className="object-contain w-full h-full" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Official Academic Brief
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">GST 206 Innovation Report</span>
                    </div>
                    <h2 className="text-base sm:text-lg font-black text-white tracking-tight mt-0.5">
                      Executive Innovation Summary: AI Literacy & Vibe Coding Transformation
                    </h2>
                  </div>
                </div>
                <button
                  onClick={() => setIsExecutiveSummaryModalOpen(false)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body Content */}
              <div className="p-6 sm:p-8 space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed overflow-y-auto max-h-[75vh]">
                
                {/* Director & Leadership Highlight */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-white/[0.03] to-transparent border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400">
                      Curriculum Architect & Lead Specialization
                    </span>
                    <h3 className="text-xl font-black text-white mt-0.5">
                      S. B. Omotoso
                    </h3>
                    <p className="text-xs font-bold text-amber-300 mt-0.5">
                      Lead AI & Vibe Coding Specialist · Web App Development Innovator
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Chrisland University, Abeokuta · Active Trainer for 3 Leading Educational & Corporate Institutions
                    </p>
                  </div>

                  <button
                    onClick={handleDownloadWhitepaper}
                    disabled={isWhitepaperGenerating}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all flex-shrink-0"
                  >
                    <Download className="w-4 h-4" />
                    <span>{isWhitepaperGenerating ? 'Preparing Document...' : 'Download Executive Brief (PDF)'}</span>
                  </button>
                </div>

                {/* Key Achievements Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-center">
                    <span className="block text-2xl font-black text-white">29</span>
                    <span className="text-[11px] text-slate-400 font-medium">Production Web Apps</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-center">
                    <span className="block text-2xl font-black text-amber-400">29</span>
                    <span className="text-[11px] text-slate-400 font-medium">Music / Pitch Videos</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-center">
                    <span className="block text-2xl font-black text-indigo-400">100%</span>
                    <span className="text-[11px] text-slate-400 font-medium">200-Level Deployment</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-center">
                    <span className="block text-2xl font-black text-emerald-400">3</span>
                    <span className="text-[11px] text-slate-400 font-medium">Thematic Syndicates</span>
                  </div>
                </div>

                {/* Core Thesis & Problem Statement */}
                <div className="space-y-3">
                  <h4 className="text-sm font-extrabold uppercase tracking-wider text-white flex items-center gap-2 border-b border-white/10 pb-2">
                    <Activity className="w-4 h-4 text-amber-400" />
                    <span>1. Institutional Context & The Mental Health Continuum</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Higher education campuses are naturally high-pressure environments where students encounter continuous academic deadlines, examination stress, and existential transitions. Without timely and accessible interventions, early-stage <strong className="text-amber-300">Stress</strong> compounds into chronic <strong className="text-indigo-300">Anxiety</strong>, which subsequently degenerates into debilitating clinical <strong className="text-emerald-300">Depression</strong>.
                  </p>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Rather than limiting undergraduate coursework to abstract theoretical assessments, the GST 206 curriculum was architected to confront this campus reality directly. 200-level students were charged with researching, designing, and launching interactive digital systems that provide immediate mental health education, cognitive relief, and structured support across this exact continuum.
                  </p>
                </div>

                {/* Pedagogical Innovation: Vibe Coding */}
                <div className="space-y-3">
                  <h4 className="text-sm font-extrabold uppercase tracking-wider text-white flex items-center gap-2 border-b border-white/10 pb-2">
                    <Code className="w-4 h-4 text-indigo-400" />
                    <span>2. Pedagogical Innovation: Vibe Coding & Vibe Engineering</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Traditional introductory computing programs often require years of syntax memorization before students can deploy a functioning full-stack product. Under the direction of <strong className="text-white">S. B. Omotoso</strong>, this paradigm was replaced by a modern <strong className="text-indigo-300">AI Literacy & Vibe Coding Framework</strong>.
                  </p>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Students leveraged generative AI models, semantic code synthesizers, automated cloud CI/CD pipelines (Vercel, Netlify), and rapid web frameworks to construct real-world applications within a single academic term. 
                    The outcome: <strong className="text-white">100% of the 200-level cohort successfully deployed live, publicly accessible web applications and multi-modal media artifacts</strong>.
                  </p>
                </div>

                {/* Institutional Scalability & Next Steps */}
                <div className="space-y-3">
                  <h4 className="text-sm font-extrabold uppercase tracking-wider text-white flex items-center gap-2 border-b border-white/10 pb-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>3. Strategic Scalability & Recommendations for University Leadership</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    The verified success of this GST 206 cohort provides an empirical blueprint for institutional scaling:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-300">
                    <li><strong className="text-white">Cross-Disciplinary AI Literacy:</strong> Embedding Vibe Coding across all university faculties (Health Sciences, Humanities, Management, and Natural Sciences).</li>
                    <li><strong className="text-white">Institutional Web Innovation Hubs:</strong> Converting student syndicates into ongoing digital product development incubators.</li>
                    <li><strong className="text-white">Expanding Leadership Responsibility:</strong> Leveraging S. B. Omotoso&apos;s proven framework to lead institutional AI and digital capability programs across university-wide and national initiatives.</li>
                  </ul>
                </div>

                {/* Direct Contact & Collaboration Footer */}
                <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Direct Inquiries & Executive Engagement:</span>
                    <p className="text-xs font-bold text-white mt-0.5">S. B. Omotoso · sbomotoso@gmail.com</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href="mailto:sbomotoso@gmail.com?subject=Executive%20Engagement%20Inquiry%20-%20AI%20Literacy%20Curriculum"
                      className="px-3.5 py-2 rounded-xl bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Email Directorate</span>
                    </a>
                    <a
                      href="https://wa.me/2348034710699?text=Hello%20S.%20B.%20Omotoso%2C%20I%20reviewed%20the%20Executive%20Innovation%20Summary"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FULL ACADEMIC ARTICLE READER MODAL */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl bg-[#0c0f18] border border-purple-500/30 rounded-2xl overflow-hidden shadow-2xl shadow-black/80 flex flex-col my-8"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-gradient-to-r from-purple-950/40 via-purple-900/20 to-transparent">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {selectedArticle.category}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3 text-purple-400" />
                        {selectedArticle.readTime}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Article Content */}
              <div className="p-6 sm:p-8 space-y-6 text-slate-300 leading-relaxed overflow-y-auto max-h-[75vh]">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
                    {selectedArticle.title}
                  </h2>
                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-400 border-b border-white/10 pb-4">
                    <span>By <strong className="text-white">{selectedArticle.author}</strong></span>
                    <span>·</span>
                    <span>Lead AI & Vibe Coding Specialist · Web App Development Innovator</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/30 text-xs sm:text-sm text-purple-200">
                  <strong className="text-white block mb-1">Key Innovation Takeaways:</strong>
                  <ul className="list-disc pl-4 space-y-1 text-xs text-purple-200/90">
                    {selectedArticle.keyTakeaways.map((takeaway, tIdx) => (
                      <li key={tIdx}>{takeaway}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-slate-200">
                  {selectedArticle.content.map((paragraph, pIdx) => (
                    <p key={pIdx} className="leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>

                <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-slate-400">
                    Published as part of the GST 206 Academic Knowledge Series · Chrisland University
                  </div>
                  <button
                    onClick={() => setSelectedArticle(null)}
                    className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white text-xs font-bold transition-colors"
                  >
                    Close Paper
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Student Details, Bio & Direct Contact Modal */}
      <AnimatePresence>
        {contactingStudent && (() => {
          const studentTheme = getProjectTheme(contactingStudent.groupName || '');
          const bio = getStudentBio(contactingStudent);
          const projectDetails = getProjectFullDescription(contactingStudent);

          const themeBadgeColor = studentTheme === 'stress'
            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
            : studentTheme === 'anxiety'
            ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
            : studentTheme === 'depression'
            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
            : 'bg-white/10 text-slate-300 border-white/20';

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-3xl bg-[#0b0e1a] border border-indigo-500/40 rounded-3xl overflow-hidden shadow-2xl shadow-black flex flex-col max-h-[90vh]"
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-white/[0.02]">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 shadow-inner">
                      <GraduationCap className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${themeBadgeColor}`}>
                          {studentTheme.toUpperCase()} THEME
                        </span>
                        <span className="text-[11px] font-mono text-slate-400 font-bold">
                          {contactingStudent.matric}
                        </span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-black text-white tracking-tight mt-0.5">
                        {contactingStudent.name}
                      </h3>
                    </div>
                  </div>

                  <button
                    id="student-details-modal-close-btn"
                    onClick={() => {
                      setContactingStudent(null);
                      setStudentCommendationCopied(false);
                      setStudentNote('');
                    }}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title="Close Modal"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Sub-navigation Tabs */}
                <div className="flex items-center gap-1 px-6 py-2.5 border-b border-white/10 bg-black/40 overflow-x-auto">
                  <button
                    id="tab-btn-project-details"
                    onClick={() => setStudentModalTab('details')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                      studentModalTab === 'details'
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Project Description</span>
                  </button>

                  <button
                    id="tab-btn-student-bio"
                    onClick={() => setStudentModalTab('bio')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                      studentModalTab === 'bio'
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Student Bio & Standing</span>
                  </button>

                  <button
                    id="tab-btn-contact-channels"
                    onClick={() => setStudentModalTab('contact')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                      studentModalTab === 'contact'
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Direct Contact Buttons</span>
                  </button>
                </div>

                {/* Modal Body with Scrollable Area */}
                <div className="p-6 sm:p-7 space-y-6 overflow-y-auto flex-1">
                  {/* TAB 1: FULL PROJECT DESCRIPTION */}
                  {studentModalTab === 'details' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-5"
                    >
                      {/* Clinical Stage & Group Header */}
                      <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider">
                            {projectDetails.clinicalStage}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-md bg-white/10 text-white text-[10px] font-semibold">
                            Syndicate: {projectDetails.syndicateName}
                          </span>
                        </div>
                        <h4 className="text-base font-black text-white">
                          {projectDetails.title}
                        </h4>
                      </div>

                      {/* Problem Statement */}
                      <div className="space-y-1.5">
                        <h5 className="text-xs font-extrabold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                          Target Challenge & Problem Statement
                        </h5>
                        <p className="text-xs text-slate-300 leading-relaxed p-3.5 rounded-xl bg-black/40 border border-white/5">
                          {projectDetails.problemStatement}
                        </p>
                      </div>

                      {/* Solution Approach */}
                      <div className="space-y-1.5">
                        <h5 className="text-xs font-extrabold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                          Solution Architecture & Technological Approach
                        </h5>
                        <p className="text-xs text-slate-300 leading-relaxed p-3.5 rounded-xl bg-black/40 border border-white/5">
                          {projectDetails.solutionApproach}
                        </p>
                      </div>

                      {/* Key Features List */}
                      <div className="space-y-2">
                        <h5 className="text-xs font-extrabold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-indigo-400" />
                          Core System Features & Clinical Capabilities
                        </h5>
                        <div className="space-y-2">
                          {projectDetails.features.map((feat, fIdx) => (
                            <div key={fIdx} className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-slate-300">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Direct Project Links */}
                      <div className="pt-3 border-t border-white/10 flex flex-wrap items-center gap-3">
                        {contactingStudent.websiteUrl && isValidUrl(contactingStudent.websiteUrl) && (
                          <a
                            id="modal-visit-app-btn"
                            href={formatUrl(contactingStudent.websiteUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
                          >
                            <span>Launch Live Web App</span>
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}

                        {contactingStudent.videoUrl && isValidUrl(contactingStudent.videoUrl) && (
                          <button
                            id="modal-watch-pitch-btn"
                            onClick={() => {
                              const musicInfo = getInvitingMusicTitle(contactingStudent);
                              setSelectedVideo({
                                url: contactingStudent.videoUrl || '',
                                title: musicInfo.title,
                                author: `${contactingStudent.name} (${contactingStudent.matric}) · ${musicInfo.genreTag}`
                              });
                            }}
                            className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 transition-all cursor-pointer"
                          >
                            <Headphones className="w-4 h-4" />
                            <span>Listen to Music Video</span>
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* TAB 2: STUDENT BIOGRAPHY & ACADEMIC STANDING */}
                  {studentModalTab === 'bio' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-5"
                    >
                      {/* Academic Standing */}
                      <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1.5">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-400">
                          Academic Standing & Cohort
                        </span>
                        <p className="text-xs font-bold text-white">
                          {bio.academicStanding}
                        </p>
                        <p className="text-xs text-slate-300">
                          Programme: <span className="text-indigo-300 font-semibold">{contactingStudent.programme}</span> · Matriculation: <span className="font-mono text-slate-200">{contactingStudent.matric}</span>
                        </p>
                      </div>

                      {/* Bio Summary */}
                      <div className="space-y-1.5">
                        <h5 className="text-xs font-extrabold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                          Student Academic Profile & Narrative
                        </h5>
                        <p className="text-xs text-slate-300 leading-relaxed p-4 rounded-xl bg-black/40 border border-white/5">
                          {bio.summary}
                        </p>
                      </div>

                      {/* Skills & Technical Tooling Badges */}
                      <div className="space-y-2">
                        <h5 className="text-xs font-extrabold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-amber-400" />
                          Demonstrated Competencies & Vibe Coding Skills
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {bio.skills.map((skill, sIdx) => (
                            <span
                              key={sIdx}
                              className="px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Institutional Commendation Note */}
                      <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <div className="text-xs text-emerald-200">
                          <strong className="block font-bold text-white mb-0.5">Verified Institutional Deliverable</strong>
                          This student creator is officially recognized by S. B. Omotoso and the GST 206 Academic Directorate at Chrisland University.
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* TAB 3: DIRECT CONTACT BUTTONS & COMMENDATION */}
                  {studentModalTab === 'contact' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-5"
                    >
                      {/* Note Area */}
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-200">
                          Add a Commendation, Feedback, or Collaboration Note (Optional):
                        </label>
                        <textarea
                          value={studentNote}
                          onChange={(e) => setStudentNote(e.target.value)}
                          placeholder={`e.g. Great work on your web app ${contactingStudent.name}! We would like to discuss an opportunity / offer feedback on your project.`}
                          rows={3}
                          className="w-full rounded-xl bg-black/50 border border-white/15 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400 transition-colors resize-none"
                        />
                      </div>

                      {/* Direct Connect Options strictly in order: 1. WhatsApp, 2. Email, 3. LinkedIn, 4. Instagram */}
                      <div className="space-y-3 pt-2 border-t border-white/10">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
                            <Send className="w-3.5 h-3.5 text-indigo-400" />
                            Direct Contact Channels (via Course Directorate Desk)
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            Strict Channel Order
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                          {/* 1. WhatsApp */}
                          <a
                            id="student-modal-whatsapp-btn"
                            href={`https://wa.me/2348034710699?text=${encodeURIComponent(
                              `Hello S. B. Omotoso, I am reaching out through the GST 206 Academic Showcase to connect regarding student creator ${contactingStudent.name} (${contactingStudent.matric} - ${contactingStudent.programme}).${
                                studentNote ? `\n\nMessage/Feedback: "${studentNote}"` : ''
                              }\n\nProject Link: ${contactingStudent.websiteUrl || 'GST 206 Web App'}`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20 group"
                            title="WhatsApp Course Facilitation Desk regarding this student"
                          >
                            <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            <span>WhatsApp</span>
                          </a>

                          {/* 2. Email */}
                          <a
                            id="student-modal-email-btn"
                            href={`mailto:sbomotoso@gmail.com?subject=${encodeURIComponent(
                              `GST 206 Student Connection: ${contactingStudent.name} (${contactingStudent.matric})`
                            )}&body=${encodeURIComponent(
                              `Hello S. B. Omotoso,\n\nI am contacting you regarding GST 206 student creator:\n\nStudent Name: ${contactingStudent.name}\nMatric: ${contactingStudent.matric}\nProgramme: ${contactingStudent.programme}\nGroup: ${contactingStudent.groupName || 'Individual'}\nWeb App URL: ${contactingStudent.websiteUrl || 'N/A'}\nVideo URL: ${contactingStudent.videoUrl || 'N/A'}\n\nMessage / Feedback Note:\n${studentNote || 'I was impressed with this student\'s project and would like to connect / offer commendation.'}\n\nBest regards.`
                            )}`}
                            className="py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-red-600/20 group"
                            title="Email regarding this student"
                          >
                            <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            <span>Email</span>
                          </a>

                          {/* 3. LinkedIn */}
                          <a
                            id="student-modal-linkedin-btn"
                            href="https://www.linkedin.com/in/s-b-omotoso/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-600/20 group"
                            title="Connect on LinkedIn"
                          >
                            <Linkedin className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            <span>LinkedIn</span>
                          </a>

                          {/* 4. Instagram */}
                          <a
                            id="student-modal-instagram-btn"
                            href="https://www.instagram.com/sbomotoso/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-2.5 px-3 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-pink-600/20 group"
                            title="Follow on Instagram"
                          >
                            <Instagram className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            <span>Instagram</span>
                          </a>
                        </div>
                      </div>

                      {/* Secondary Action: Copy Student Commendation Citation */}
                      <div className="pt-2">
                        <button
                          onClick={() => {
                            const textToCopy = `Student Project Commendation:\nName: ${contactingStudent.name}\nMatric: ${contactingStudent.matric}\nProgramme: ${contactingStudent.programme}\nGroup: ${contactingStudent.groupName || 'Individual'}\nTheme: ${studentTheme.toUpperCase()}\nProject Title: ${projectDetails.title}\nLive Web App: ${contactingStudent.websiteUrl || 'N/A'}\nVideo Pitch: ${contactingStudent.videoUrl || 'N/A'}\nCourse: GST 206 (AI Literacy & Vibe Coding)\nInstitution: Chrisland University, Abeokuta\nCourse Directorate: S. B. Omotoso`;
                            navigator.clipboard.writeText(textToCopy);
                            setStudentCommendationCopied(true);
                            setTimeout(() => setStudentCommendationCopied(false), 2500);
                          }}
                          className="w-full py-2.5 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-semibold text-slate-300 hover:text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
                        >
                          {studentCommendationCopied ? (
                            <>
                              <Check className="w-4 h-4 text-emerald-400" />
                              <span className="text-emerald-300">Student Profile & Credentials Copied to Clipboard!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 text-slate-400" />
                              <span>Copy Student Credentials & Citation Summary</span>
                            </>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Persistent Footer Quick Actions */}
                <div className="px-6 py-3.5 border-t border-white/10 bg-black/50 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-400">
                    <UserCheck className="w-4 h-4 text-indigo-400" />
                    <span>Chrisland University · GST 206</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {studentModalTab !== 'contact' && (
                      <button
                        onClick={() => setStudentModalTab('contact')}
                        className="px-3.5 py-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Direct Contact</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setContactingStudent(null);
                        setStudentCommendationCopied(false);
                        setStudentNote('');
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      Close Window
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* Footer */}
      <footer className="relative z-10 px-4 sm:px-8 lg:px-12 py-10 border-t border-white/10 bg-[#040609]">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          {/* Institution Info */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center p-1 shadow-md shadow-black/40 overflow-hidden flex-shrink-0 border border-amber-500/40">
              <Image src="/Chrisland-Logo.jpeg" alt="Chrisland University Crest" width={36} height={36} unoptimized className="object-contain w-full h-full" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-slate-100 text-sm tracking-tight">Chrisland University</span>
              <span className="text-slate-400 text-xs">Entrepreneurship & General Studies · GST 206</span>
            </div>
          </div>

          {/* Course Lecturer Contact Block with Click-to-Call Phone Symbol ONLY (No figures) */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-medium">Course Lecturer:</span>
              <span className="text-slate-100 font-bold bg-white/[0.05] border border-white/10 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                <span suppressHydrationWarning>{lecturerName}</span>
                {isAdmin && (
                  <button
                    onClick={() => {
                      setTempLecturerName(lecturerName);
                      setIsEditingLecturer(true);
                    }}
                    className="text-slate-400 hover:text-white p-0.5"
                    title="Change Lecturer Name"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                )}
              </span>
            </div>

            {/* Contact Channels strictly in order: 1. WhatsApp, 2. Email, 3. LinkedIn, 4. Instagram */}
            <div className="flex items-center gap-2">
              <a
                id="footer-whatsapp-btn"
                href="https://wa.me/2348034710699?text=Hello%20S.%20B.%20Omotoso%2C%20I%20am%20contacting%20you%20regarding%20the%20GST%20206%20Showcase"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 hover:border-emerald-500/50 text-emerald-300 hover:text-emerald-200 font-semibold transition-all shadow-sm group"
                title="WhatsApp S. B. Omotoso"
                aria-label="WhatsApp S. B. Omotoso"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              </a>

              <a
                id="footer-email-btn"
                href="mailto:sbomotoso@gmail.com?subject=GST%20206%20Showcase%20Inquiry"
                className="p-2.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 hover:border-red-500/50 text-red-300 hover:text-red-200 transition-all shadow-sm group"
                title="Email S. B. Omotoso: sbomotoso@gmail.com"
                aria-label="Email S. B. Omotoso"
              >
                <Mail className="w-4 h-4 text-red-400 group-hover:scale-110 transition-transform" />
              </a>

              <a
                id="footer-linkedin-btn"
                href="https://www.linkedin.com/in/s-b-omotoso/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 hover:border-blue-500/50 text-blue-300 hover:text-blue-200 transition-all shadow-sm group"
                title="Connect with S. B. Omotoso on LinkedIn"
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
              </a>

              <a
                id="footer-instagram-btn"
                href="https://www.instagram.com/sbomotoso/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-pink-600/20 hover:bg-pink-600/30 border border-pink-500/30 hover:border-pink-500/50 text-pink-300 hover:text-pink-200 transition-all shadow-sm group"
                title="Follow S. B. Omotoso on Instagram"
                aria-label="Instagram Profile"
              >
                <Instagram className="w-4 h-4 text-pink-400 group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>

          {/* Status & Portal Info */}
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Sync Active
            </span>
            <span className="text-slate-500">GST 206 Academic Portal</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* =========================================================================
   COMPONENTS
   ========================================================================= */

// 1. Group Website Card Component
function GroupCard({ 
  group, 
  index, 
  isAdmin,
  isExpanded, 
  onToggleExpand, 
  onCopy, 
  isCopied,
  onContactStudent,
  onViewDetails,
  onEditStudent,
  onDeleteStudent,
  onSuggestCorrection
}: { 
  group: GroupProject; 
  index: number; 
  isAdmin: boolean;
  isExpanded: boolean; 
  onToggleExpand: () => void; 
  onCopy: (url: string) => void; 
  isCopied: boolean;
  onContactStudent: (student: { id: string; name: string; matric: string; programme: string; websiteUrl?: string; videoUrl?: string; groupName?: string; groupUrl?: string; videoTitle?: string }) => void;
  onViewDetails: (student: { id: string; name: string; matric: string; programme: string; websiteUrl?: string; videoUrl?: string; groupName?: string; groupUrl?: string; videoTitle?: string }) => void;
  onEditStudent: (studentId: string) => void;
  onDeleteStudent: (studentId: string) => void;
  onSuggestCorrection: (studentId: string) => void;
}) {
  const cleanGroupUrl = formatUrl(group.url);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all flex flex-col overflow-hidden shadow-xl shadow-black/40 group"
    >
      {/* Website Thumbnail Header - Clickable to open site */}
      <a
        href={cleanGroupUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`aspect-video w-full relative overflow-hidden bg-gradient-to-br ${group.gradient} block cursor-pointer select-none`}
        title={`Visit ${group.name} Website`}
      >
        {/* Thematic Syndicate UI Wireframe Canvas */}
        <div className="absolute inset-0 p-3 pt-8 flex flex-col justify-between opacity-80 group-hover:opacity-100 transition-opacity">
          {/* Subtle Grid */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          {/* Mini Dashboard Widget Rows */}
          <div className="relative z-0 grid grid-cols-3 gap-2 mt-1">
            <div className="bg-black/40 border border-white/10 rounded-lg p-2 flex flex-col">
              <span className="text-[9px] text-slate-400 font-mono">Cohort</span>
              <span className="text-xs font-black text-white">{group.students.length} Students</span>
            </div>
            <div className="bg-black/40 border border-white/10 rounded-lg p-2 flex flex-col">
              <span className="text-[9px] text-slate-400 font-mono">Continuum Focus</span>
              <span className="text-xs font-black text-amber-300 truncate">{group.theme}</span>
            </div>
            <div className="bg-black/40 border border-white/10 rounded-lg p-2 flex flex-col">
              <span className="text-[9px] text-slate-400 font-mono">App Status</span>
              <span className="text-xs font-black text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Vibe
              </span>
            </div>
          </div>

          {/* Graphical Waveform Bar Preview */}
          <div className="relative z-0 bg-black/30 border border-white/10 rounded-lg p-2 flex items-center justify-between gap-1 h-10 mt-auto mb-14 px-3">
            {[40, 65, 30, 85, 55, 90, 45, 70, 95, 60, 80, 50, 75, 90, 60, 40, 85, 100, 70, 55].map((val, i) => (
              <div
                key={i}
                className="flex-1 bg-white/20 group-hover:bg-white/40 rounded-full transition-all"
                style={{ height: `${val}%` }}
              />
            ))}
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-[#07090e]/40 to-transparent" />
        
        {/* Browser Mockup Top Bar */}
        <div className="absolute top-0 inset-x-0 h-6 bg-black/80 border-b border-white/10 flex items-center px-3 gap-1.5 z-10">
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500/80" />
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500/80" />
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/80" />
          </div>
          <div className="text-[9px] font-mono text-slate-300 truncate flex-1 pl-1 opacity-80">
            {cleanGroupUrl ? cleanGroupUrl.replace(/^https?:\/\//, '') : 'group.syndicate.live'}
          </div>
        </div>

        {/* Top Badges */}
        <div className="absolute top-8 left-3.5 flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-black/85 border border-white/15 text-white flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Group Website {index + 1}
          </span>
        </div>

        <div className="absolute top-8 right-3.5">
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/85 border ${group.accent}`}>
            Theme: {group.theme}
          </span>
        </div>

        {/* Bottom Title & Launch Indicator */}
        <div className="absolute bottom-3.5 left-3.5 right-3.5">
          <h3 className="text-xl font-black text-white tracking-tight leading-tight drop-shadow-md flex items-center gap-2">
            <span>{group.name}</span>
            <ExternalLink className="w-4 h-4 text-white/60 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
          </h3>
          <p className="text-[11px] text-emerald-300 font-semibold mt-0.5 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
            <span>Click to Launch Syndicate Platform</span>
          </p>
        </div>
      </a>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div>
          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            {group.description}
          </p>

          {/* Members Toggle Button */}
          <button
            onClick={onToggleExpand}
            className="w-full py-2 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-semibold text-slate-200 flex items-center justify-between transition-colors mb-3"
          >
            <span className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              <span>Group Roster ({group.students.length} Students)</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              {isExpanded ? 'Hide ▲' : 'Show ▼'}
            </span>
          </button>

          {/* Expandable Member List with View Details, Edit/Delete options */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-2 max-h-56 overflow-y-auto text-xs">
                  {group.students.map((st, sIdx) => (
                    <div key={st.id || sIdx} className="flex items-center justify-between gap-2 p-1.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] transition-colors">
                      <div className="flex-1 min-w-0">
                        {st.websiteUrl && isValidUrl(st.websiteUrl) ? (
                          <a
                            href={formatUrl(st.websiteUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-white hover:text-emerald-400 truncate block transition-colors flex items-center gap-1 group/stname"
                            title={`Launch ${st.name}'s Web Application`}
                          >
                            <span className="truncate">{st.name}</span>
                            <ExternalLink className="w-2.5 h-2.5 opacity-0 group-hover/stname:opacity-100 text-emerald-400 flex-shrink-0" />
                          </a>
                        ) : (
                          <p className="font-semibold text-white truncate">{st.name}</p>
                        )}
                        <p className="text-[10px] text-slate-400 font-mono truncate">{st.matric} · {st.programme}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onViewDetails({ ...st, groupName: group.name, groupUrl: group.url, videoUrl: '', videoTitle: '' })}
                          className="px-2 py-1 rounded bg-white/[0.06] hover:bg-indigo-600/30 text-indigo-300 hover:text-white border border-indigo-500/20 text-[10px] font-semibold flex items-center gap-1 transition-colors"
                          title={`View Details for ${st.name}`}
                        >
                          <FileText className="w-3 h-3 text-indigo-400" />
                          <span className="hidden sm:inline">Details</span>
                        </button>
                        {st.websiteUrl && isValidUrl(st.websiteUrl) && (
                          <a
                            href={formatUrl(st.websiteUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 text-slate-400 hover:text-emerald-300"
                            title="View Personal Website"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        <button
                          onClick={() => onContactStudent({ ...st, groupName: group.name, groupUrl: group.url, videoUrl: '', videoTitle: '' })}
                          className="p-1 text-slate-400 hover:text-indigo-300 transition-colors"
                          title={`Contact / Connect with ${st.name}`}
                        >
                          <UserCheck className="w-3 h-3" />
                        </button>
                        {isAdmin ? (
                          <>
                            <button
                              onClick={() => onEditStudent(st.id)}
                              className="p-1 text-slate-400 hover:text-amber-300"
                              title="Edit this student's submission"
                            >
                              <Pencil className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => onDeleteStudent(st.id)}
                              className="p-1 text-slate-400 hover:text-red-400"
                              title="Delete this student"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => onSuggestCorrection(st.id)}
                            className="p-1 text-slate-400 hover:text-amber-300"
                            title="Submit Correction / Update for this Student"
                          >
                            <MessageCircle className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-white/10 flex items-center gap-2">
          <a
            href={formatUrl(group.url)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#B25900] hover:bg-[#d96d00] text-white text-xs font-bold text-center inline-flex items-center justify-center gap-2 shadow-lg shadow-[#B25900]/20 transition-all"
          >
            <span>Visit Group Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={() => onCopy(group.url)}
            className="p-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-slate-300 hover:text-white transition-colors"
            title="Copy Group Website Link"
          >
            {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// 2. Video Card Component with Edit & Delete Controls & Modified Status
function VideoCard({ 
  project, 
  index, 
  isAdmin,
  onPlay, 
  onCopy, 
  isCopied, 
  onContactStudent,
  onViewDetails,
  onEdit, 
  onDelete,
  onCopySheetRow,
  onSuggestCorrection
}: { 
  project: Project; 
  index: number; 
  isAdmin: boolean;
  onPlay: () => void; 
  onCopy: (url: string) => void; 
  isCopied: boolean; 
  onContactStudent: () => void;
  onViewDetails: () => void;
  onEdit: () => void; 
  onDelete: () => void;
  onCopySheetRow: () => void;
  onSuggestCorrection: () => void;
}) {
  const ytThumb = getYouTubeThumbnail(project.videoUrl);
  const musicInfo = getInvitingMusicTitle(project);
  const [thumbError, setThumbError] = useState(false);

  // Reset thumbError if project.videoUrl changes
  useEffect(() => {
    setThumbError(false);
  }, [project.videoUrl]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: (index % 12) * 0.05 }}
      className="group rounded-2xl bg-white/[0.03] border border-white/10 hover:border-red-500/40 hover:bg-white/[0.05] transition-all flex flex-col overflow-hidden shadow-lg shadow-black/30 relative"
    >
      {/* Video Thumbnail with Hover Play Button */}
      <div 
        onClick={onPlay}
        className="aspect-video w-full relative overflow-hidden bg-[#0a0d16] cursor-pointer select-none"
      >
        {ytThumb && !thumbError ? (
          <Image
            src={ytThumb}
            alt={musicInfo.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-85 group-hover:opacity-100 bg-[#0a0d16]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            referrerPolicy="no-referrer"
            unoptimized
            onLoad={(e) => {
              // Catch YouTube's default 120x90 placeholder image returned on missing videos
              const img = e.currentTarget;
              if (img.naturalWidth > 0 && img.naturalWidth <= 120) {
                setThumbError(true);
              }
            }}
            onError={() => setThumbError(true)}
          />
        ) : (
          /* Dark Audio Studio Visualizer */
          <div className="absolute inset-0 bg-gradient-to-br from-[#1c0818] via-[#090d16] to-[#180808] p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between opacity-70">
              <div className="flex items-center gap-1.5 text-xs text-red-300 font-bold">
                <Music className="w-3.5 h-3.5 text-red-400" />
                <span>GST 206 Soundtrack</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Hi-Fi Audio</span>
            </div>

            {/* Visualizer bars */}
            <div className="flex items-end justify-center gap-1 h-12 my-auto px-4">
              {[30, 70, 45, 90, 60, 100, 75, 40, 85, 95, 50, 80, 65, 90, 40, 70].map((h, i) => (
                <div 
                  key={i} 
                  className="flex-1 bg-gradient-to-t from-red-600 to-amber-400 rounded-t-sm opacity-70 group-hover:opacity-100 transition-opacity" 
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>

            <div className="text-center truncate text-[11px] text-slate-300 font-semibold opacity-80">
              {musicInfo.title}
            </div>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

        {/* Center Glowing Play Icon */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-12 h-12 rounded-full bg-red-600/90 group-hover:bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-600/50 transition-all group-hover:scale-110">
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </div>
        </div>

        {/* Platform Pill */}
        <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/90 text-[10px] font-mono text-white font-semibold">
          {project.videoUrl.includes('suno.com') ? 'Suno Audio' : 'YouTube'}
        </div>

        {/* Matric Badge & Modified Badge */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded bg-black/85 text-[10px] font-mono text-slate-300 font-semibold border border-white/10">
            {project.matric || `Student #${index + 1}`}
          </span>
          {project.isModified && (
            <span className="px-2 py-0.5 rounded bg-amber-500 text-[9px] font-bold text-black border border-amber-400">
              UPDATED
            </span>
          )}
        </div>

        {/* Hover Listen Indicator */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 pointer-events-none">
          <span className="text-[11px] font-bold text-white bg-red-600 px-3 py-1.5 rounded-xl border border-red-400/40 flex items-center justify-center gap-1.5 shadow-lg shadow-black/50">
            <Headphones className="w-3.5 h-3.5" />
            <span>Listen to Music Video</span>
          </span>
        </div>
      </div>

      {/* Video & Music Info */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        <div>
          {/* Genre & Theme Tags */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-500/10 text-red-300 border border-red-500/25 flex items-center gap-1">
              <Music className="w-2.5 h-2.5" />
              {musicInfo.genreTag}
            </span>
            {project.groupName && !project.groupName.toLowerCase().includes('no group') && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 truncate max-w-[140px]">
                {cleanGroupName(project.groupName)}
              </span>
            )}
          </div>

          {/* Inviting Musical Title */}
          <h3 
            onClick={onPlay}
            className="font-extrabold text-sm text-white line-clamp-2 leading-snug group-hover:text-red-400 transition-colors mt-2 cursor-pointer"
            title={musicInfo.title}
          >
            {musicInfo.title}
          </h3>

          {/* Inviting Tagline */}
          <p className="text-[11px] text-amber-300/90 font-medium line-clamp-1 mt-1.5 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-400 flex-shrink-0" />
            <span>{musicInfo.inviteTagline}</span>
          </p>

          {/* Student Creator Info */}
          <div className="flex items-center justify-between text-xs text-slate-300 font-medium mt-2 pt-2 border-t border-white/5">
            <span className="text-slate-200 font-semibold truncate">{project.name}</span>
            <span className="text-[10px] text-slate-400 font-mono truncate">{project.programme}</span>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              id={`video-watch-btn-${project.id}`}
              onClick={onPlay}
              className="py-2 px-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 shadow-md shadow-red-600/30 transition-all cursor-pointer"
            >
              <Headphones className="w-3.5 h-3.5" />
              <span>Listen Now</span>
            </button>

            <button
              id={`video-details-btn-${project.id}`}
              onClick={onViewDetails}
              className="py-2 px-2.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 hover:text-white border border-white/10 text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              title={`View Full Details & Bio for ${project.name}`}
            >
              <FileText className="w-3 h-3 text-indigo-400" />
              <span>View Details</span>
            </button>
          </div>

          <div className="flex items-center justify-between gap-1 pt-1 border-t border-white/5">
            <a
              href={formatUrl(project.videoUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              title="Open video link in new tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={() => onCopy(project.videoUrl)}
              className="flex-1 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-[11px] font-medium flex items-center justify-center gap-1 transition-colors"
              title="Copy video link"
            >
              {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Share2 className="w-3 h-3" />}
              <span className="text-[10px]">{isCopied ? 'Copied' : 'Share'}</span>
            </button>

            <button
              onClick={onContactStudent}
              className="flex-1 p-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 hover:text-indigo-200 border border-indigo-500/30 text-[11px] font-medium flex items-center justify-center gap-1 transition-colors"
              title={`Contact / Connect with ${project.name}`}
            >
              <UserCheck className="w-3 h-3" />
              <span className="text-[10px]">Connect</span>
            </button>

            {isAdmin ? (
              <>
                {/* Copy Row for Google Sheet */}
                <button
                  onClick={onCopySheetRow}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-300 transition-colors"
                  title="Copy Google Sheet formatted row"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>

                {/* Edit Entry Button */}
                <button
                  onClick={onEdit}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-amber-500/20 text-slate-400 hover:text-amber-300 transition-colors"
                  title="Edit student details & URLs (Design Platform Only)"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>

                {/* Delete Entry Button */}
                <button
                  onClick={onDelete}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                  title="Delete this entry (Design Platform Only)"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <button
                onClick={onSuggestCorrection}
                className="p-1.5 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 transition-colors"
                title="Submit correction to Course Lecturer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// 3. Website Card Component with Edit & Delete Controls
function WebsiteCard({ 
  project, 
  index, 
  isAdmin,
  onCopy, 
  isCopied, 
  onContactStudent,
  onViewDetails,
  onEdit, 
  onDelete,
  onCopySheetRow,
  onSuggestCorrection
}: { 
  project: Project; 
  index: number; 
  isAdmin: boolean;
  onCopy: (url: string) => void; 
  isCopied: boolean; 
  onContactStudent: () => void;
  onViewDetails: () => void;
  onEdit: () => void; 
  onDelete: () => void;
  onCopySheetRow: () => void;
  onSuggestCorrection: () => void;
}) {
  const cleanUrl = formatUrl(project.websiteUrl);
  const initials = project.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  const groupThemeColor = project.groupName?.toLowerCase().includes('stress') 
    ? { from: 'from-amber-950/60', to: 'to-amber-900/20', border: 'border-amber-500/20', text: 'text-amber-300', theme: 'Stress Mgmt' }
    : project.groupName?.toLowerCase().includes('depression')
    ? { from: 'from-emerald-950/60', to: 'to-emerald-900/20', border: 'border-emerald-500/20', text: 'text-emerald-300', theme: 'Depression Care' }
    : { from: 'from-indigo-950/60', to: 'to-indigo-900/20', border: 'border-indigo-500/20', text: 'text-indigo-300', theme: 'Anxiety Relief' };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: (index % 12) * 0.05 }}
      className="group rounded-2xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/40 hover:bg-white/[0.05] transition-all flex flex-col overflow-hidden shadow-lg shadow-black/30"
    >
      {/* Website Preview Image / Visualizer */}
      <a 
        href={cleanUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="aspect-[4/3] w-full relative overflow-hidden bg-[#0a0d16] cursor-pointer block select-none"
      >
        {/* Dark Vibe Coding App Dashboard Preview */}
        <div className={`absolute inset-0 bg-gradient-to-br ${groupThemeColor.from} via-[#0a0d16] ${groupThemeColor.to} p-3.5 pt-9 flex flex-col justify-between`}>
          {/* Subtle Grid */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />

          {/* Mini UI Header */}
          <div className="relative z-0 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center text-[10px] font-black text-white">
                {initials}
              </div>
              <span className="text-[10px] font-bold text-slate-200 truncate max-w-[110px]">
                {project.name.split(' ')[0]}&apos;s App
              </span>
            </div>
            <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/50 border ${groupThemeColor.border} ${groupThemeColor.text}`}>
              {groupThemeColor.theme}
            </span>
          </div>

          {/* Mini Dashboard Widget Cards */}
          <div className="relative z-0 grid grid-cols-2 gap-1.5 my-auto">
            <div className="bg-black/50 border border-white/10 rounded-lg p-2 flex flex-col">
              <span className="text-[8px] text-slate-400 font-mono uppercase">AI Companion</span>
              <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                Active
              </span>
            </div>
            <div className="bg-black/50 border border-white/10 rounded-lg p-2 flex flex-col">
              <span className="text-[8px] text-slate-400 font-mono uppercase">Intervention</span>
              <span className="text-[10px] font-bold text-indigo-300">Self-Care</span>
            </div>
          </div>

          {/* Graphical Sparkline */}
          <div className="relative z-0 bg-black/40 border border-white/10 rounded-lg p-1.5 flex items-center justify-between gap-1 h-7 px-2">
            {[35, 55, 40, 75, 50, 85, 65, 45, 90, 70, 60, 80, 50, 70, 85].map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-emerald-400/40 group-hover:bg-emerald-400/80 rounded-full transition-all"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20 pointer-events-none" />

        {/* Browser Mockup Top Bar */}
        <div className="absolute top-0 inset-x-0 h-6 bg-black/80 border-b border-white/10 flex items-center px-2.5 gap-1.5 z-10">
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500/80" />
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500/80" />
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/80" />
          </div>
          <div className="text-[9px] font-mono text-slate-300 truncate flex-1 pl-1 opacity-80">
            {cleanUrl ? cleanUrl.replace(/^https?:\/\//, '') : 'app.gst206.live'}
          </div>
        </div>

        {/* Live Indicator Pill & Modified Badge */}
        <div className="absolute top-8 right-2.5 flex items-center gap-1.5 z-10">
          {project.isModified && (
            <span className="px-2 py-0.5 rounded-full bg-amber-500 text-black text-[9px] font-extrabold border border-amber-400">
              UPDATED
            </span>
          )}
          <div className="px-2 py-0.5 rounded-full bg-emerald-950/90 text-[10px] font-semibold text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Live Site
          </div>
        </div>

        {/* Matric Badge */}
        <div className="absolute top-8 left-2.5 px-2 py-0.5 rounded bg-black/85 text-[10px] font-mono text-slate-300 font-semibold border border-white/10 z-10">
          {project.matric || `Student #${index + 1}`}
        </div>

        {/* Hover Launch Indicator on Preview */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 z-10 pointer-events-none">
          <span className="text-[11px] font-bold text-white bg-emerald-600 px-3 py-1.5 rounded-xl border border-emerald-400/40 flex items-center justify-center gap-1.5 shadow-lg shadow-black/50">
            <span>Launch Live App</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </span>
        </div>
      </a>

      {/* Website Info */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        <div>
          <a
            href={cleanUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group/title block"
            title={`Launch ${project.name}'s Live Web Application`}
          >
            <h3 className="font-bold text-sm text-white line-clamp-1 group-hover:text-emerald-400 group-hover/title:text-emerald-300 transition-colors flex items-center justify-between gap-1">
              <span>{project.name}</span>
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 text-emerald-400 transition-opacity flex-shrink-0" />
            </h3>
          </a>
          <p className="text-xs text-slate-400 font-medium line-clamp-1 mt-0.5">
            {project.programme}
          </p>

          <div className="flex items-center gap-2 mt-2">
            {project.groupName && !project.groupName.toLowerCase().includes('no group') && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 truncate max-w-[140px]">
                {cleanGroupName(project.groupName)}
              </span>
            )}
          </div>
        </div>

        {/* Bottom Actions with View Details & Direct Controls */}
        <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-2">
            <a
              id={`website-visit-btn-${project.id}`}
              href={cleanUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-1.5 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-emerald-600/20"
            >
              <span>Visit App</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <button
              id={`website-details-btn-${project.id}`}
              onClick={onViewDetails}
              className="py-1.5 px-2.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 hover:text-white border border-white/10 text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              title={`View Full Details & Bio for ${project.name}`}
            >
              <FileText className="w-3 h-3 text-indigo-400" />
              <span>View Details</span>
            </button>
          </div>

          <div className="flex items-center justify-between gap-1 pt-1 border-t border-white/5">
            <button
              onClick={() => onCopy(cleanUrl)}
              className="flex-1 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-[11px] font-medium flex items-center justify-center gap-1 transition-colors"
              title="Copy website link"
            >
              {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Share2 className="w-3 h-3" />}
              <span className="text-[10px]">{isCopied ? 'Copied' : 'Share'}</span>
            </button>

            <button
              onClick={onContactStudent}
              className="flex-1 p-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 hover:text-indigo-200 border border-indigo-500/30 text-[11px] font-medium flex items-center justify-center gap-1 transition-colors"
              title={`Contact / Connect with ${project.name}`}
            >
              <UserCheck className="w-3 h-3" />
              <span className="text-[10px]">Connect</span>
            </button>

            {isAdmin ? (
              <>
                {/* Copy Row for Google Sheet */}
                <button
                  onClick={onCopySheetRow}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-300 transition-colors"
                  title="Copy Google Sheet formatted row"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>

                {/* Edit Entry Button */}
                <button
                  onClick={onEdit}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-amber-500/20 text-slate-400 hover:text-amber-300 transition-colors"
                  title="Edit student details & URLs (Design Platform Only)"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>

                {/* Delete Entry Button */}
                <button
                  onClick={onDelete}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                  title="Delete this entry (Design Platform Only)"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <button
                onClick={onSuggestCorrection}
                className="p-1.5 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 transition-colors"
                title="Submit correction to Course Lecturer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* =========================================================================
   UTILITIES & HELPERS
   ========================================================================= */

function isValidUrl(url: string) {
  if (!url) return false;
  const trimmed = url.trim();
  if (trimmed === '' || trimmed.toLowerCase() === 'no group' || trimmed.toLowerCase() === 'unavailable') return false;
  return trimmed.length > 3;
}

function autoCorrectUrl(input: string): string {
  if (!input) return '';
  let url = input.trim();
  if (url === '' || url.toLowerCase() === 'no group' || url.toLowerCase() === 'unavailable' || url === '#') {
    return url;
  }
  
  // Unwrap Google redirect wrapper
  if (url.includes('google.com/url?q=')) {
    const match = url.match(/google\.com\/url\?q=([^&]+)/);
    if (match && match[1]) {
      url = decodeURIComponent(match[1]);
    }
  }

  // Fix protocol typos
  if (url.toLowerCase().startsWith('ttp://')) {
    url = 'http://' + url.substring(6);
  } else if (url.toLowerCase().startsWith('ttps://') || url.toLowerCase().startsWith('htps://') || url.toLowerCase().startsWith('htpps://')) {
    url = 'https://' + url.replace(/^h?ttps?:\/\//i, '');
  } else if (url.toLowerCase().startsWith('http//')) {
    url = 'http://' + url.substring(6);
  } else if (url.toLowerCase().startsWith('https//')) {
    url = 'https://' + url.substring(7);
  } else if (!/^https?:\/\//i.test(url) && url.length > 0 && !url.startsWith('#')) {
    url = 'https://' + url;
  }

  // Fix common domain typos
  if (url.endsWith('.vercel.ap')) {
    url = url + 'p';
  } else if (url.endsWith('.verce.app')) {
    url = url.replace('.verce.app', '.vercel.app');
  } else if (url.endsWith('.netlif.app')) {
    url = url.replace('.netlif.app', '.netlify.app');
  }

  return url;
}

function formatUrl(url: string) {
  return autoCorrectUrl(url);
}

function getYouTubeId(url: string) {
  if (!url) return null;
  const clean = formatUrl(url);
  const match = clean.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
  return match ? match[1] : null;
}

function getYouTubeThumbnail(url: string) {
  const id = getYouTubeId(url);
  return id ? `https://i.ytimg.com/vi/${id}/mqdefault.jpg` : null;
}

function cleanGroupName(name: string) {
  const lower = name.toLowerCase();
  if (lower.includes('anxiety') || lower.includes('mindsync') || lower.includes('mind-sync')) return 'Mind Sync (Anxiety)';
  if (lower.includes('serenity') || lower.includes('stress') || lower.includes('stess')) return 'Serenity Hub (Stress)';
  if (lower.includes('depression') || lower.includes('hope harbour') || lower.includes('hope habour')) return 'Hope Harbour (Depression)';
  return name;
}

function FallbackImage({ srcList, alt, ...props }: any) {
  const [index, setIndex] = useState(0);
  const safeSrcList = srcList.filter(Boolean);
  const currentSrc = safeSrcList[index] || safeSrcList[safeSrcList.length - 1];

  return (
    <Image
      src={currentSrc || 'https://picsum.photos/seed/chrisland/800/600'}
      alt={alt}
      onError={() => {
        if (index < safeSrcList.length - 1) {
          setIndex(index + 1);
        }
      }}
      {...props}
    />
  );
}
