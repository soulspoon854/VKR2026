export type StepType = "video" | "text" | "terminal" | "quiz";

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export interface Step {
  id: string;
  type: StepType;
  title: string;
  // video
  videoUrl?: string;
  videoPoster?: string;
  // text
  content?: string;
  // terminal
  prompt?: string;
  expectedCommand?: string;
  hint?: string;
  successOutput?: string;
  // quiz
  questions?: QuizQuestion[];
}

export interface Lesson {
  id: string;
  title: string;
  steps: Step[];
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  lessons: Lesson[];
}

export const course: Course = {
  id: "infosec-101",
  title: "Информационная безопасность 101",
  subtitle: "От основ криптографии до пентеста",
  lessons: [
    {
      id: "l1",
      title: "Введение в ИБ",
      steps: [
        {
          id: "l1s1",
          type: "video",
          title: "Что такое информационная безопасность",
          videoUrl:
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        },
        {
          id: "l1s2",
          type: "text",
          title: "Триада CIA",
          content:
            "**CIA** — фундаментальная модель ИБ:\n\n- **Confidentiality** (Конфиденциальность) — данные доступны только авторизованным лицам.\n- **Integrity** (Целостность) — данные не изменены без разрешения.\n- **Availability** (Доступность) — данные доступны, когда они нужны.\n\nЭти три принципа лежат в основе любой стратегии защиты информации.",
        },
        {
          id: "l1s3",
          type: "quiz",
          title: "Проверка: основы",
          questions: [
            {
              question: "Что означает буква 'I' в триаде CIA?",
              options: ["Identification", "Integrity", "Isolation", "Inspection"],
              correctIndex: 1,
            },
            {
              question: "Какой принцип нарушается при DDoS-атаке?",
              options: ["Confidentiality", "Integrity", "Availability", "Authenticity"],
              correctIndex: 2,
            },
          ],
        },
      ],
    },
    {
      id: "l2",
      title: "Криптография на практике",
      steps: [
        {
          id: "l2s1",
          type: "text",
          title: "Симметричное и асимметричное шифрование",
          content:
            "**Симметричное шифрование** использует один ключ для шифрования и расшифровки (AES, ChaCha20).\n\n**Асимметричное** — пару ключей: публичный и приватный (RSA, ECDSA, Ed25519).\n\nНа практике обычно комбинируют: асимметрично обмениваются ключом сессии, а данные шифруют симметрично.",
        },
        {
          id: "l2s2",
          type: "terminal",
          title: "Сгенерируйте SSH-ключ",
          prompt: "Введите команду для генерации Ed25519 ключа (без аргументов комментария):",
          expectedCommand: "ssh-keygen -t ed25519",
          hint: "Подсказка: ssh-keygen с флагом -t и алгоритмом ed25519",
          successOutput:
            "Generating public/private ed25519 key pair.\nEnter file in which to save the key (/home/user/.ssh/id_ed25519):\nYour identification has been saved.\nYour public key has been saved.",
        },
        {
          id: "l2s3",
          type: "terminal",
          title: "Хеш файла",
          prompt: "Посчитайте SHA-256 хеш файла report.pdf:",
          expectedCommand: "sha256sum report.pdf",
          hint: "Утилита: sha256sum",
          successOutput:
            "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08  report.pdf",
        },
      ],
    },
    {
      id: "l3",
      title: "Сетевая разведка",
      steps: [
        {
          id: "l3s1",
          type: "video",
          title: "Pre-engagement и сбор информации",
          videoUrl:
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        },
        {
          id: "l3s2",
          type: "terminal",
          title: "Сканирование портов",
          prompt: "Просканируйте все TCP-порты хоста 10.0.0.1 с помощью nmap:",
          expectedCommand: "nmap -p- 10.0.0.1",
          hint: "Флаг -p- означает все 65535 портов",
          successOutput:
            "Starting Nmap 7.94 ( https://nmap.org )\nNmap scan report for 10.0.0.1\nHost is up (0.0012s latency).\nNot shown: 65530 closed tcp ports\nPORT      STATE SERVICE\n22/tcp    open  ssh\n80/tcp    open  http\n443/tcp   open  https",
        },
        {
          id: "l3s3",
          type: "quiz",
          title: "Финальный тест модуля",
          questions: [
            {
              question: "Какой флаг nmap делает сканирование скрытым (SYN-scan)?",
              options: ["-sT", "-sS", "-sU", "-sA"],
              correctIndex: 1,
            },
            {
              question: "Какой порт по умолчанию использует HTTPS?",
              options: ["80", "8080", "443", "22"],
              correctIndex: 2,
            },
            {
              question: "Что такое OSINT?",
              options: [
                "Open Source Intelligence",
                "Operational Security Intel",
                "Online Scanning Tool",
                "Offensive Security Internal",
              ],
              correctIndex: 0,
            },
          ],
        },
      ],
    },
  ],
};

export const allSteps = course.lessons.flatMap((l) =>
  l.steps.map((s) => ({ ...s, lessonId: l.id, lessonTitle: l.title }))
);