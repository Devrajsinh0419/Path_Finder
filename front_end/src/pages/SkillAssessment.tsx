import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Brain, ChevronLeft, ChevronRight, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import api from "@/lib/api";

type DifficultyLevel = 1 | 2 | 3;
type SkillKey =
  | "python"
  | "java"
  | "c"
  | "cpp"
  | "web_dev"
  | "iot"
  | "cybersecurity"
  | "programming";

interface Question {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
}

interface LevelInfo {
  value: "FOUNDATION" | "INTERMEDIATE" | "ADVANCED";
  label: string;
  description: string;
}

const TOTAL_QUESTIONS = 5;
const START_DIFFICULTY: DifficultyLevel = 2;
const BASELINE_LEVEL: DifficultyLevel = 1;
const MAX_FOCUS_VIOLATIONS = 2;
const VIOLATION_DEBOUNCE_MS = 800;

const DIFFICULTY_META: Record<DifficultyLevel, string> = {
  1: "Easy",
  2: "Medium",
  3: "Hard",
};

const LEVEL_MAP: Record<DifficultyLevel, LevelInfo> = {
  1: {
    value: "FOUNDATION",
    label: "Foundation",
    description: "Good start. Focus on basics and coding consistency.",
  },
  2: {
    value: "INTERMEDIATE",
    label: "Intermediate",
    description: "You can solve practical problems with confidence.",
  },
  3: {
    value: "ADVANCED",
    label: "Advanced",
    description: "Strong command of concepts and deeper problem solving.",
  },
};

const QUESTION_BANK: Record<SkillKey, Record<DifficultyLevel, Question[]>> = {
  python: {
    1: [
      {
        id: "py-1",
        prompt: "What is the output?\na = [1, 2, 3]\nb = a\nb.append(4)\nprint(a)",
        options: ["[1,2,3]", "[1,2,3,4]", "Error", "None"],
        correctIndex: 1,
      },
      {
        id: "py-3",
        prompt: "Time complexity of searching in a Python dictionary (average case)?",
        options: ["O(n)", "O(log n)", "O(1)", "O(n log n)"],
        correctIndex: 2,
      },
      {
        id: "py-8",
        prompt: "Which is mutable?",
        options: ["tuple", "string", "list", "frozenset"],
        correctIndex: 2,
      },
    ],
    2: [
      {
        id: "py-2",
        prompt: "Which statement about Python’s GIL is correct?",
        options: [
          "Allows true parallel execution of threads",
          "Prevents multiple native threads from executing Python bytecodes simultaneously",
          "Exists only in Python 2",
          "Used for garbage collection",
        ],
        correctIndex: 1,
      },
      {
        id: "py-4",
        prompt: "What does @staticmethod imply?",
        options: [
          "Method belongs to instance",
          "Requires self",
          "Cannot access class or instance variables directly",
          "Runs in separate thread",
        ],
        correctIndex: 2,
      },
      {
        id: "py-5",
        prompt: "What will this produce?\nprint(type(lambda x: x))",
        options: ["function", "lambda", "object", "None"],
        correctIndex: 0,
      },
      {
        id: "py-6",
        prompt: "Which module is used for multiprocessing?",
        options: ["threading", "async", "multiprocessing", "concurrent"],
        correctIndex: 2,
      },
    ],
    3: [
      {
        id: "py-7",
        prompt: "What happens if a generator function has no yield?",
        options: ["Returns generator", "Returns None", "SyntaxError", "Infinite loop"],
        correctIndex: 1,
      },
      {
        id: "py-9",
        prompt: "What does __slots__ do?",
        options: [
          "Enables inheritance",
          "Reduces memory by preventing dynamic attribute creation",
          "Improves recursion",
          "Locks object",
        ],
        correctIndex: 1,
      },
      {
        id: "py-10",
        prompt: "Output?\nx = [i*i for i in range(3)]",
        options: ["[1,4,9]", "[0,1,4]", "[0,1,4,9]", "Error"],
        correctIndex: 1,
      },
    ],
  },
  java: {
    1: [
      {
        id: "java-3",
        prompt: "What is true about HashMap?",
        options: ["Ordered", "Thread-safe", "Allows one null key", "Synchronized"],
        correctIndex: 2,
      },
      {
        id: "java-5",
        prompt: "Which keyword prevents inheritance?",
        options: ["static", "final", "const", "private"],
        correctIndex: 1,
      },
      {
        id: "java-9",
        prompt: "Which is immutable?",
        options: ["String", "StringBuilder", "ArrayList", "HashMap"],
        correctIndex: 0,
      },
    ],
    2: [
      {
        id: "java-1",
        prompt: "Which ensures thread safety?",
        options: ["volatile", "synchronized", "final", "static"],
        correctIndex: 1,
      },
      {
        id: "java-2",
        prompt: "JVM memory does NOT include?",
        options: ["Heap", "Stack", "Method Area", "Cache Memory"],
        correctIndex: 3,
      },
      {
        id: "java-4",
        prompt: "Functional interface contains?",
        options: ["One abstract method", "Two methods", "No methods", "Multiple constructors"],
        correctIndex: 0,
      },
      {
        id: "java-8",
        prompt: "What is JIT?",
        options: ["Java Input Tool", "Just-In-Time compiler", "JVM Interface", "Java Interpreter"],
        correctIndex: 1,
      },
    ],
    3: [
      {
        id: "java-6",
        prompt: "What causes deadlock?",
        options: ["Infinite loop", "Circular waiting of locks", "Garbage collection", "Recursion"],
        correctIndex: 1,
      },
      {
        id: "java-7",
        prompt: "Time complexity of HashSet lookup?",
        options: ["O(n)", "O(log n)", "O(1) average", "O(n²)"],
        correctIndex: 2,
      },
      {
        id: "java-10",
        prompt: "Which exception is unchecked?",
        options: ["IOException", "SQLException", "NullPointerException", "FileNotFoundException"],
        correctIndex: 2,
      },
    ],
  },
  c: {
    1: [
      {
        id: "c-1",
        prompt: "Output?\nint x=5;\nprintf(\"%d\", x++);",
        options: ["5", "6", "Error", "Undefined"],
        correctIndex: 0,
      },
      {
        id: "c-4",
        prompt: "Storage class that retains value?",
        options: ["auto", "static", "register", "extern"],
        correctIndex: 1,
      },
      {
        id: "c-10",
        prompt: "Stack memory is?",
        options: ["Dynamic", "LIFO", "Heap", "Permanent"],
        correctIndex: 1,
      },
    ],
    2: [
      {
        id: "c-2",
        prompt: "Dangling pointer refers to?",
        options: ["NULL pointer", "Freed memory pointer", "Uninitialized pointer", "Function pointer"],
        correctIndex: 1,
      },
      {
        id: "c-3",
        prompt: "sizeof(int) depends on?",
        options: ["Compiler", "OS", "Architecture", "RAM"],
        correctIndex: 2,
      },
      {
        id: "c-5",
        prompt: "Which is dynamic memory allocation?",
        options: ["malloc", "calloc", "realloc", "All"],
        correctIndex: 3,
      },
      {
        id: "c-6",
        prompt: "Header for malloc?",
        options: ["stdio.h", "stdlib.h", "string.h", "math.h"],
        correctIndex: 1,
      },
    ],
    3: [
      {
        id: "c-7",
        prompt: "What is segmentation fault?",
        options: ["Syntax error", "Memory access violation", "Compile error", "Overflow"],
        correctIndex: 1,
      },
      {
        id: "c-8",
        prompt: "What is pointer arithmetic based on?",
        options: ["1 byte", "Data type size", "4 bytes", "Random"],
        correctIndex: 1,
      },
      {
        id: "c-9",
        prompt: "Recursion requires?",
        options: ["Loop", "Base condition", "Global variable", "Pointer"],
        correctIndex: 1,
      },
    ],
  },
  cpp: {
    1: [
      {
        id: "cpp-1",
        prompt: "What enables runtime polymorphism?",
        options: ["Overloading", "Templates", "Virtual functions", "Macros"],
        correctIndex: 2,
      },
      {
        id: "cpp-5",
        prompt: "STL container with key-value pairs?",
        options: ["vector", "list", "map", "stack"],
        correctIndex: 2,
      },
      {
        id: "cpp-6",
        prompt: "Default access in class?",
        options: ["public", "private", "protected", "global"],
        correctIndex: 1,
      },
    ],
    2: [
      {
        id: "cpp-2",
        prompt: "std::move does?",
        options: ["Copies object", "Transfers ownership", "Deletes object", "Clones object"],
        correctIndex: 1,
      },
      {
        id: "cpp-3",
        prompt: "Smart pointer for shared ownership?",
        options: ["unique_ptr", "shared_ptr", "weak_ptr", "auto_ptr"],
        correctIndex: 1,
      },
      {
        id: "cpp-4",
        prompt: "What is RAII?",
        options: ["Memory leak", "Resource Acquisition Is Initialization", "Runtime error", "Loop type"],
        correctIndex: 1,
      },
      {
        id: "cpp-7",
        prompt: "Overriding requires?",
        options: ["static", "virtual", "inline", "friend"],
        correctIndex: 1,
      },
    ],
    3: [
      {
        id: "cpp-8",
        prompt: "What is diamond problem?",
        options: [
          "Memory leak",
          "Multiple inheritance ambiguity",
          "Recursion issue",
          "Thread issue",
        ],
        correctIndex: 1,
      },
      {
        id: "cpp-9",
        prompt: "constexpr means?",
        options: ["Runtime constant", "Compile-time constant", "Mutable", "Global"],
        correctIndex: 1,
      },
      {
        id: "cpp-10",
        prompt: "Which prevents copying?",
        options: ["Delete copy constructor", "Inline function", "Static keyword", "Friend class"],
        correctIndex: 0,
      },
    ],
  },
  web_dev: {
    1: [
      {
        id: "web-1",
        prompt: "REST is?",
        options: ["Protocol", "Architectural style", "Language", "Framework"],
        correctIndex: 1,
      },
      {
        id: "web-2",
        prompt: "HTTP status 401 means?",
        options: ["Not found", "Unauthorized", "Forbidden", "Server error"],
        correctIndex: 1,
      },
      {
        id: "web-9",
        prompt: "SPA stands for?",
        options: [
          "Single Page Application",
          "Secure Page Access",
          "Server Page App",
          "Simple Program",
        ],
        correctIndex: 0,
      },
    ],
    2: [
      {
        id: "web-3",
        prompt: "JWT contains?",
        options: ["Header, Payload, Signature", "Body only", "Cookie", "Hash"],
        correctIndex: 0,
      },
      {
        id: "web-5",
        prompt: "HTTPS uses?",
        options: ["SSL/TLS", "FTP", "TCP only", "UDP"],
        correctIndex: 0,
      },
      {
        id: "web-7",
        prompt: "What is CORS?",
        options: ["Security policy", "Database", "Language", "Framework"],
        correctIndex: 0,
      },
      {
        id: "web-10",
        prompt: "Which is NoSQL?",
        options: ["MySQL", "PostgreSQL", "MongoDB", "Oracle"],
        correctIndex: 2,
      },
    ],
    3: [
      {
        id: "web-4",
        prompt: "XSS is?",
        options: ["SQL attack", "Script injection", "DDOS", "Encryption"],
        correctIndex: 1,
      },
      {
        id: "web-6",
        prompt: "Which improves scalability?",
        options: ["Monolith", "Load balancing", "Inline CSS", "Local storage"],
        correctIndex: 1,
      },
      {
        id: "web-8",
        prompt: "What does CDN improve?",
        options: ["Security only", "Latency", "Database size", "Backend logic"],
        correctIndex: 1,
      },
    ],
  },
  iot: {
    1: [
      {
        id: "iot-1",
        prompt: "MQTT is?",
        options: ["Protocol", "Language", "OS", "Sensor"],
        correctIndex: 0,
      },
      {
        id: "iot-5",
        prompt: "Sensor converts?",
        options: [
          "Digital to analog",
          "Physical to electrical signal",
          "Voltage to light",
          "WiFi",
        ],
        correctIndex: 1,
      },
      {
        id: "iot-10",
        prompt: "Firmware runs on?",
        options: ["Server", "Microcontroller", "Cloud", "Browser"],
        correctIndex: 1,
      },
    ],
    2: [
      {
        id: "iot-2",
        prompt: "IoT architecture layers?",
        options: ["2", "3", "4", "5"],
        correctIndex: 2,
      },
      {
        id: "iot-3",
        prompt: "Edge computing means?",
        options: ["Cloud processing", "Processing near device", "Data deletion", "Routing"],
        correctIndex: 1,
      },
      {
        id: "iot-4",
        prompt: "Which board is popular for IoT prototyping?",
        options: ["Raspberry Pi", "UNO", "ESP32", "All"],
        correctIndex: 3,
      },
      {
        id: "iot-6",
        prompt: "Zigbee is?",
        options: ["Programming language", "Wireless protocol", "Database", "API"],
        correctIndex: 1,
      },
    ],
    3: [
      {
        id: "iot-7",
        prompt: "Latency critical in?",
        options: ["Smart bulbs", "Autonomous cars", "Logging", "Storage"],
        correctIndex: 1,
      },
      {
        id: "iot-8",
        prompt: "IoT security risk?",
        options: ["Weak authentication", "Encryption", "VPN", "TLS"],
        correctIndex: 0,
      },
      {
        id: "iot-9",
        prompt: "Cloud IoT platforms?",
        options: ["AWS IoT", "Azure IoT", "Google IoT", "All"],
        correctIndex: 3,
      },
    ],
  },
  cybersecurity: {
    1: [
      {
        id: "cyber-1",
        prompt: "CIA triad stands for?",
        options: [
          "Confidentiality, Integrity, Availability",
          "Control, Identity, Access",
          "Cyber, Internet, Attack",
          "Crypto, Integrity, Audit",
        ],
        correctIndex: 0,
      },
      {
        id: "cyber-2",
        prompt: "SQL Injection targets?",
        options: ["Network", "Database", "Hardware", "DNS"],
        correctIndex: 1,
      },
      {
        id: "cyber-10",
        prompt: "Phishing is?",
        options: ["Social engineering", "Encryption", "Firewall", "VPN"],
        correctIndex: 0,
      },
    ],
    2: [
      {
        id: "cyber-3",
        prompt: "Hashing is used for?",
        options: ["Encryption", "Password storage", "Compression", "Routing"],
        correctIndex: 1,
      },
      {
        id: "cyber-4",
        prompt: "Public key encryption uses?",
        options: ["Same key", "Two keys", "No key", "Password"],
        correctIndex: 1,
      },
      {
        id: "cyber-6",
        prompt: "HTTPS prevents?",
        options: ["DDOS", "Eavesdropping", "Malware", "Spam"],
        correctIndex: 1,
      },
      {
        id: "cyber-7",
        prompt: "2FA improves?",
        options: ["Speed", "Security", "Storage", "UI"],
        correctIndex: 1,
      },
    ],
    3: [
      {
        id: "cyber-5",
        prompt: "Brute force attack means?",
        options: ["Guessing repeatedly", "SQL attack", "Virus", "Firewall"],
        correctIndex: 0,
      },
      {
        id: "cyber-8",
        prompt: "Firewall works at?",
        options: ["Network layer", "Physical layer", "Presentation", "Application only"],
        correctIndex: 0,
      },
      {
        id: "cyber-9",
        prompt: "Zero-day vulnerability means?",
        options: [
          "Old bug",
          "Newly discovered unpatched bug",
          "Fixed bug",
          "Virus",
        ],
        correctIndex: 1,
      },
    ],
  },
  programming: {
    1: [
      {
        id: "gen-1",
        prompt: "Which data structure follows FIFO order?",
        options: ["Stack", "Queue", "Tree", "Graph"],
        correctIndex: 1,
      },
      {
        id: "gen-2",
        prompt: "Time complexity of hash-table lookup in average case?",
        options: ["O(n)", "O(log n)", "O(1)", "O(n log n)"],
        correctIndex: 2,
      },
      {
        id: "gen-3",
        prompt: "Which is generally mutable?",
        options: ["tuple", "string", "list", "frozenset"],
        correctIndex: 2,
      },
    ],
    2: [
      {
        id: "gen-4",
        prompt: "What helps improve scalability in web systems?",
        options: ["Load balancing", "Inline CSS", "Single huge server only", "Disabling caching"],
        correctIndex: 0,
      },
      {
        id: "gen-5",
        prompt: "Which statement about threads in CPython is true?",
        options: [
          "True parallel bytecode execution always",
          "GIL limits simultaneous bytecode execution",
          "Threads are unavailable",
          "Threads replace processes",
        ],
        correctIndex: 1,
      },
      {
        id: "gen-6",
        prompt: "Which C++ feature enables runtime polymorphism?",
        options: ["Templates", "Virtual functions", "Macros", "Namespaces"],
        correctIndex: 1,
      },
    ],
    3: [
      {
        id: "gen-7",
        prompt: "What is a common risk in security authentication?",
        options: ["Weak authentication", "Strong MFA", "TLS", "Rate limiting"],
        correctIndex: 0,
      },
      {
        id: "gen-8",
        prompt: "What does CORS define?",
        options: ["Cross-origin resource sharing policy", "Database indexing", "Thread scheduler", "OS process table"],
        correctIndex: 0,
      },
      {
        id: "gen-9",
        prompt: "What does edge computing usually mean?",
        options: ["Processing near device/source", "Only cloud processing", "Database sharding", "Compiler optimization"],
        correctIndex: 0,
      },
    ],
  },
};

function parseSkills(skillText: string): string[] {
  return skillText
    .split(/[,;\n]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function resolveSkillKey(skillName: string): SkillKey {
  const value = skillName.trim().toLowerCase();
  if (value.includes("python") || value === "py") return "python";
  if (value.includes("c++") || value === "cpp") return "cpp";
  if (value === "c" || value.includes(" c language") || value.startsWith("c ")) return "c";
  if (value === "java" || (value.includes("java") && !value.includes("script"))) return "java";
  if (
    value.includes("web") ||
    value.includes("frontend") ||
    value.includes("backend") ||
    value.includes("full stack") ||
    value.includes("fullstack") ||
    value.includes("javascript") ||
    value === "js" ||
    value.includes("typescript")
  ) {
    return "web_dev";
  }
  if (value.includes("iot") || value.includes("internet of things") || value.includes("embedded")) {
    return "iot";
  }
  if (value.includes("cyber") || value.includes("security")) {
    return "cybersecurity";
  }
  return "programming";
}

function pickQuestion(skillKeys: SkillKey[], difficulty: DifficultyLevel, usedIds: string[]): Question {
  const targetPool = skillKeys
    .flatMap((skillKey) => QUESTION_BANK[skillKey][difficulty])
    .filter((question) => !usedIds.includes(question.id));

  if (targetPool.length > 0) {
    return targetPool[Math.floor(Math.random() * targetPool.length)];
  }

  const fallbackPool = skillKeys
    .flatMap((skillKey) => {
      const bank = QUESTION_BANK[skillKey];
      return [...bank[1], ...bank[2], ...bank[3]];
    })
    .filter((question) => !usedIds.includes(question.id));

  if (fallbackPool.length > 0) {
    return fallbackPool[Math.floor(Math.random() * fallbackPool.length)];
  }

  const reusablePool = skillKeys.flatMap((skillKey) => QUESTION_BANK[skillKey][difficulty]);
  return reusablePool[Math.floor(Math.random() * reusablePool.length)];
}

interface FinalResult {
  highestLevel: DifficultyLevel;
  levelInfo: LevelInfo;
  correctAnswers: number;
  totalQuestions: number;
  accuracy: number;
  terminatedReason?: string;
}

const SkillAssessment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const [skillsInput, setSkillsInput] = useState("");
  const [activeSkillNames, setActiveSkillNames] = useState<string[]>([]);
  const [activeSkillKeys, setActiveSkillKeys] = useState<SkillKey[]>(["programming"]);

  const [loadingSkill, setLoadingSkill] = useState(true);
  const [assessmentStarted, setAssessmentStarted] = useState(false);
  const [savingResult, setSavingResult] = useState(false);

  const [questionNumber, setQuestionNumber] = useState(1);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(START_DIFFICULTY);
  const [highestLevelReached, setHighestLevelReached] = useState<DifficultyLevel>(BASELINE_LEVEL);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [usedQuestionIds, setUsedQuestionIds] = useState<string[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [finalResult, setFinalResult] = useState<FinalResult | null>(null);
  const [focusViolations, setFocusViolations] = useState(0);
  const violationTimestampRef = useRef(0);
  const terminatedRef = useRef(false);

  const progressValue = (questionNumber / TOTAL_QUESTIONS) * 100;
  const activeSkillLabel = activeSkillNames.length > 0 ? activeSkillNames.join(", ") : "General Programming";

  const initializeAssessment = (skillText: string): boolean => {
    const selectedSkills = parseSkills(skillText);
    if (selectedSkills.length === 0) {
      return false;
    }

    const skillKeys = Array.from(new Set(selectedSkills.map((skill) => resolveSkillKey(skill))));
    const firstQuestion = pickQuestion(skillKeys, START_DIFFICULTY, []);

    setActiveSkillNames(selectedSkills);
    setActiveSkillKeys(skillKeys);
    setQuestionNumber(1);
    setDifficulty(START_DIFFICULTY);
    setHighestLevelReached(BASELINE_LEVEL);
    setCorrectAnswers(0);
    setSelectedAnswer("");
    setUsedQuestionIds([firstQuestion.id]);
    setCurrentQuestion(firstQuestion);
    setFinalResult(null);
    setFocusViolations(0);
    violationTimestampRef.current = 0;
    terminatedRef.current = false;
    setAssessmentStarted(true);
    return true;
  };

  useEffect(() => {
    const preloadSkill = async () => {
      const routeState = location.state as { skills?: string } | null;
      const stateSkills = routeState?.skills?.trim() || "";

      if (stateSkills) {
        setSkillsInput(stateSkills);
        initializeAssessment(stateSkills);
        setLoadingSkill(false);
        return;
      }

      try {
        const response = await api.get("/academics/student-profile/");
        const profileSkills = response.data?.interests?.trim() || "";
        setSkillsInput(profileSkills);
        if (profileSkills) {
          initializeAssessment(profileSkills);
        }
      } catch (error) {
        console.error("Failed to preload skills:", error);
      } finally {
        setLoadingSkill(false);
      }
    };

    preloadSkill();
  }, [location.state]);

  const terminateAssessmentForFocusViolation = useCallback(
    async (violationCount: number) => {
      if (terminatedRef.current) {
        return;
      }

      terminatedRef.current = true;
      const levelInfo = LEVEL_MAP[BASELINE_LEVEL];

      setSavingResult(true);
      try {
        await api.post("/academics/student-profile/", {
          assessment_skill: activeSkillLabel.slice(0, 100),
          assessment_highest_level: BASELINE_LEVEL,
          assessment_level_label: levelInfo.value,
          assessment_accuracy: 0,
          assessment_total_questions: TOTAL_QUESTIONS,
          assessment_correct_answers: 0,
        });
      } catch (error) {
        console.error("Failed to save terminated assessment:", error);
      } finally {
        setSavingResult(false);
      }

      setFinalResult({
        highestLevel: BASELINE_LEVEL,
        levelInfo,
        correctAnswers: 0,
        totalQuestions: TOTAL_QUESTIONS,
        accuracy: 0,
        terminatedReason: `Assessment terminated after ${violationCount} tab switch violation${
          violationCount > 1 ? "s" : ""
        }.`,
      });
    },
    [activeSkillLabel]
  );

  useEffect(() => {
    if (!assessmentStarted || finalResult) {
      return;
    }

    const registerViolation = () => {
      const now = Date.now();
      if (now - violationTimestampRef.current < VIOLATION_DEBOUNCE_MS) {
        return;
      }

      violationTimestampRef.current = now;
      setFocusViolations((previous) => {
        const next = previous + 1;
        const remaining = MAX_FOCUS_VIOLATIONS - next;

        if (remaining > 0) {
          toast({
            title: "Tab switch detected",
            description: `Stay on this tab. ${remaining} warning${
              remaining > 1 ? "s" : ""
            } left before termination.`,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Assessment terminated",
            description: "Multiple tab switches were detected.",
            variant: "destructive",
          });
          void terminateAssessmentForFocusViolation(next);
        }

        return next;
      });
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        registerViolation();
      }
    };

    const onWindowBlur = () => {
      if (!document.hasFocus()) {
        registerViolation();
      }
    };

    const preventClipboard = (event: ClipboardEvent) => {
      event.preventDefault();
    };

    const preventContextMenu = (event: MouseEvent) => {
      event.preventDefault();
    };

    const preventShortcuts = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if ((event.ctrlKey || event.metaKey) && ["c", "v", "x", "a", "u"].includes(key)) {
        event.preventDefault();
      }
      if (key === "f12") {
        event.preventDefault();
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("blur", onWindowBlur);
    document.addEventListener("copy", preventClipboard);
    document.addEventListener("cut", preventClipboard);
    document.addEventListener("paste", preventClipboard);
    document.addEventListener("contextmenu", preventContextMenu);
    window.addEventListener("keydown", preventShortcuts);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("blur", onWindowBlur);
      document.removeEventListener("copy", preventClipboard);
      document.removeEventListener("cut", preventClipboard);
      document.removeEventListener("paste", preventClipboard);
      document.removeEventListener("contextmenu", preventContextMenu);
      window.removeEventListener("keydown", preventShortcuts);
    };
  }, [assessmentStarted, finalResult, terminateAssessmentForFocusViolation, toast]);

  const handleStart = () => {
    const started = initializeAssessment(skillsInput);
    if (!started) {
      toast({
        title: "Skill is required",
        description: "Enter at least one skill to start the adaptive test.",
        variant: "destructive",
      });
    }
  };

  const completeAssessment = async (highestLevel: DifficultyLevel, totalCorrect: number) => {
    const levelInfo = LEVEL_MAP[highestLevel];
    const accuracy = Math.round((totalCorrect / TOTAL_QUESTIONS) * 100);

    setSavingResult(true);
    try {
      await api.post("/academics/student-profile/", {
        assessment_skill: activeSkillLabel.slice(0, 100),
        assessment_highest_level: highestLevel,
        assessment_level_label: levelInfo.value,
        assessment_accuracy: accuracy,
        assessment_total_questions: TOTAL_QUESTIONS,
        assessment_correct_answers: totalCorrect,
      });

      toast({
        title: "Assessment completed",
        description: "Your skill level has been saved successfully.",
      });
    } catch (error) {
      console.error("Failed to save assessment:", error);
      toast({
        title: "Saved locally only",
        description: "Assessment finished, but backend save failed.",
        variant: "destructive",
      });
    } finally {
      setSavingResult(false);
    }

    setFinalResult({
      highestLevel,
      levelInfo,
      correctAnswers: totalCorrect,
      totalQuestions: TOTAL_QUESTIONS,
      accuracy,
    });
  };

  const handleSubmitAnswer = async () => {
    if (!currentQuestion) {
      return;
    }

    if (selectedAnswer === "") {
      toast({
        title: "Select an answer",
        description: "Please choose one option before moving next.",
        variant: "destructive",
      });
      return;
    }

    const selectedIndex = Number(selectedAnswer);
    const isCorrect = selectedIndex === currentQuestion.correctIndex;
    const updatedCorrectAnswers = isCorrect ? correctAnswers + 1 : correctAnswers;
    const nextDifficulty = isCorrect
      ? (Math.min(3, difficulty + 1) as DifficultyLevel)
      : (Math.max(1, difficulty - 1) as DifficultyLevel);
    const updatedHighestLevel = isCorrect
      ? (Math.max(highestLevelReached, difficulty) as DifficultyLevel)
      : highestLevelReached;

    setCorrectAnswers(updatedCorrectAnswers);
    setHighestLevelReached(updatedHighestLevel);

    const answeredQuestions = [...usedQuestionIds];

    if (questionNumber >= TOTAL_QUESTIONS) {
      await completeAssessment(updatedHighestLevel, updatedCorrectAnswers);
      return;
    }

    const nextQuestion = pickQuestion(activeSkillKeys, nextDifficulty, answeredQuestions);

    setUsedQuestionIds([...answeredQuestions, nextQuestion.id]);
    setDifficulty(nextDifficulty);
    setQuestionNumber((prev) => prev + 1);
    setCurrentQuestion(nextQuestion);
    setSelectedAnswer("");
  };

  if (loadingSkill) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-accent/20 border-t-accent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Preparing your adaptive assessment...</p>
        </div>
      </div>
    );
  }

  if (finalResult) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl glass-card-strong rounded-2xl p-6 sm:p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-7 h-7 text-accent" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Assessment Result</h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Skills tested: <span className="font-semibold text-foreground">{activeSkillLabel}</span>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="rounded-xl border border-border/40 p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Highest Level Reached</p>
              <p className="text-lg font-semibold">{finalResult.levelInfo.label}</p>
            </div>
            <div className="rounded-xl border border-border/40 p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Correct Answers</p>
              <p className="text-lg font-semibold">
                {finalResult.correctAnswers}/{finalResult.totalQuestions}
              </p>
            </div>
            <div className="rounded-xl border border-border/40 p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Accuracy</p>
              <p className="text-lg font-semibold">{finalResult.accuracy}%</p>
            </div>
          </div>

          <div className="rounded-xl bg-accent/10 border border-accent/20 p-4 mb-8">
            <p className="text-sm sm:text-base">{finalResult.levelInfo.description}</p>
            {finalResult.terminatedReason && (
              <p className="text-sm sm:text-base text-destructive mt-2">{finalResult.terminatedReason}</p>
            )}
          </div>

          <Button
            className="w-full h-11 sm:h-12"
            onClick={() => navigate("/upload-results")}
            disabled={savingResult}
          >
            Continue to Upload Results
          </Button>
        </div>
      </div>
    );
  }

  if (!assessmentStarted || !currentQuestion) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl glass-card-strong rounded-2xl p-6 sm:p-8">
          <button
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
            onClick={() => navigate("/input-details")}
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Input Details
          </button>

          <div className="flex items-start gap-3 mb-6">
            <div className="w-11 h-11 rounded-full bg-accent/20 flex items-center justify-center">
              <Brain className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Adaptive Skill Test</h1>
              <p className="text-muted-foreground text-sm mt-1">
                Flow: start from medium, correct answer increases difficulty, wrong answer reduces it.
                Final rating is based on highest level reached.
              </p>
            </div>
          </div>

          <div className="space-y-3 mb-8">
            <Label htmlFor="skills">Skill for assessment</Label>
            <Input
              id="skills"
              value={skillsInput}
              onChange={(event) => setSkillsInput(event.target.value)}
              placeholder="e.g., Java, Python, JavaScript"
              className="h-11"
            />
            <p className="text-xs text-muted-foreground">
              If multiple skills are entered, questions are randomly selected across those skills.
            </p>
          </div>

          <Button className="w-full h-11 sm:h-12" onClick={handleStart}>
            Start Assessment
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-3xl glass-card-strong rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Adaptive Assessment</h1>
            <p className="text-sm text-muted-foreground">
              Skills: <span className="font-semibold text-foreground">{activeSkillLabel}</span>
            </p>
          </div>
          <div className="text-xs sm:text-sm px-3 py-1 rounded-full bg-accent/15 text-accent font-medium w-fit">
            Difficulty: {DIFFICULTY_META[difficulty]}
          </div>
        </div>

        <Progress value={progressValue} className="h-2 mb-2" />
        <p className="text-xs text-muted-foreground mb-6">
          Question {questionNumber} of {TOTAL_QUESTIONS}
        </p>
        <p className="text-xs text-muted-foreground mb-6">
          Tab switches: {focusViolations}/{MAX_FOCUS_VIOLATIONS}
        </p>

        <div className="rounded-xl border border-border/40 p-4 sm:p-6 mb-6">
          <p className="text-base sm:text-lg font-medium leading-relaxed">{currentQuestion.prompt}</p>
        </div>

        <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer} className="space-y-3 mb-8">
          {currentQuestion.options.map((option, index) => {
            const value = String(index);
            const optionId = `option-${index}`;

            return (
              <div
                key={optionId}
                className="flex items-center gap-3 rounded-lg border border-border/40 p-3 hover:bg-accent/5 transition-colors"
              >
                <RadioGroupItem value={value} id={optionId} />
                <Label htmlFor={optionId} className="cursor-pointer text-sm sm:text-base w-full">
                  {option}
                </Label>
              </div>
            );
          })}
        </RadioGroup>

        <div className="flex justify-end">
          <Button onClick={handleSubmitAnswer} disabled={savingResult} className="h-11 px-6">
            {questionNumber === TOTAL_QUESTIONS ? "Finish Assessment" : "Next Question"}
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SkillAssessment;
