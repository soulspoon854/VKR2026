export interface QuizQuestion {
  id: number;
  module: string;
  title: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    module: "Модуль 1: Основы ИБ",
    title: "Триада CIA",
    question: "Что означает буква 'C' в триаде CIA информационной безопасности?",
    options: ["Control", "Confidentiality", "Compliance", "Cryptography"],
    correctIndex: 1,
    explanation: "Confidentiality (Конфиденциальность) — доступ к данным только у авторизованных лиц.",
  },
  {
    id: 2,
    module: "Модуль 1: Основы ИБ",
    title: "Угрозы доступности",
    question: "Какой принцип триады CIA нарушается при DDoS-атаке?",
    options: ["Confidentiality", "Integrity", "Availability", "Authenticity"],
    correctIndex: 2,
    explanation: "DDoS делает сервис недоступным — нарушается Availability.",
  },
  {
    id: 3,
    module: "Модуль 2: Аутентификация",
    title: "Факторы аутентификации",
    question: "Что относится к фактору 'что-то, чем вы являетесь'?",
    options: ["Пароль", "SMS-код", "Отпечаток пальца", "USB-токен"],
    correctIndex: 2,
    explanation: "Биометрия (отпечаток, лицо, голос) — это inherence factor.",
  },
  {
    id: 4,
    module: "Модуль 2: Аутентификация",
    title: "Хранение паролей",
    question: "Как правильно хранить пароли пользователей в БД?",
    options: [
      "В открытом виде",
      "MD5-хеш",
      "Хеш с солью (bcrypt/argon2)",
      "Шифрованием AES с общим ключом",
    ],
    correctIndex: 2,
    explanation: "Только медленный хеш с уникальной солью (bcrypt, scrypt, argon2).",
  },
  {
    id: 5,
    module: "Модуль 3: Криптография",
    title: "Симметрия ключей",
    question: "Какой алгоритм является симметричным?",
    options: ["RSA", "AES", "ECDSA", "Ed25519"],
    correctIndex: 1,
    explanation: "AES — симметричный блочный шифр, остальные асимметричные.",
  },
  {
    id: 6,
    module: "Модуль 3: Криптография",
    title: "TLS-рукопожатие",
    question: "Что обеспечивает HTTPS поверх HTTP?",
    options: [
      "Только скорость",
      "Конфиденциальность и целостность канала",
      "Анонимность пользователя",
      "Защиту от XSS",
    ],
    correctIndex: 1,
    explanation: "TLS даёт шифрование, целостность и аутентификацию сервера.",
  },
  {
    id: 7,
    module: "Модуль 4: Веб-уязвимости",
    title: "OWASP Top 10",
    question: "Что такое SQL-инъекция?",
    options: [
      "Внедрение JS в страницу",
      "Подмена сессионных cookie",
      "Внедрение SQL-кода через пользовательский ввод",
      "Перехват трафика по Wi-Fi",
    ],
    correctIndex: 2,
    explanation: "SQLi — выполнение произвольного SQL через неэкранированный ввод.",
  },
  {
    id: 8,
    module: "Модуль 4: Веб-уязвимости",
    title: "XSS",
    question: "Главная защита от XSS-атак — это:",
    options: [
      "Использование HTTPS",
      "Экранирование вывода и CSP",
      "Длинные пароли",
      "Двухфакторная аутентификация",
    ],
    correctIndex: 1,
    explanation: "Экранирование пользовательского вывода + Content Security Policy.",
  },
  {
    id: 9,
    module: "Модуль 5: Сетевая разведка",
    title: "Сканирование портов",
    question: "Какая утилита используется для сканирования сетевых портов?",
    options: ["wireshark", "nmap", "john", "hydra"],
    correctIndex: 1,
    explanation: "nmap — стандарт для discovery и port-scanning.",
  },
  {
    id: 10,
    module: "Модуль 5: Сетевая разведка",
    title: "Финальный вопрос",
    question: "Что такое OSINT?",
    options: [
      "Open Source Intelligence — разведка по открытым источникам",
      "Operating System Internal Network Tool",
      "Offensive Security Internet Network Test",
      "Online Secure Intelligence Network",
    ],
    correctIndex: 0,
    explanation: "OSINT — сбор информации из общедоступных источников.",
  },
];
