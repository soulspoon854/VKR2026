# InfoSec Course — платформа для прохождения курса по информационной безопасности

SPA на **React 19 + TanStack Start (Vite 7)** с тёмной темой, Stepik-подобной навигацией по шагам и квизом из 10 вопросов. Прогресс пользователя сохраняется в `localStorage`. Серверный рантайм собирается под Cloudflare Workers (через `@cloudflare/vite-plugin`), поэтому проект можно запускать как через обычный Vite dev server, так и через `wrangler dev` поверх production-сборки.

---

## 1. Требования

- **Node.js ≥ 18.17** (рекомендуется 20 LTS) — `node -v`
- **Bun ≥ 1.1** (основной менеджер пакетов в проекте) — `bun -v`
  - Можно использовать `npm` / `pnpm` — команды эквивалентны (`npm install`, `npm run dev` и т. д.).
- **Wrangler ≥ 3** (опционально, для шага 4) — ставится разово: `bun add -d wrangler` или `npm i -g wrangler`.
- Git и любой современный браузер (Chrome / Firefox / Edge).

Проверка окружения:

```bash
node -v && bun -v
```

---

## 2. Установка

```bash
# 1. Получить код (через GitHub-интеграцию Lovable: GitHub → Connect)
git clone <your-repo-url>
cd <project-folder>

# 2. Установить зависимости
bun install
# или: npm install
```

Никаких `.env` для базового запуска не требуется — данные курса лежат в `src/data/quiz.ts`, прогресс пишется в `localStorage`. Lovable Cloud в проекте не подключён.

---

## 3. Запуск через Vite (режим разработки)

Это основной способ для локальной разработки: горячая перезагрузка, быстрый HMR, понятные ошибки.

```bash
bun run dev
# или: npm run dev
```

- По умолчанию открывается на **http://localhost:8080** (порт задаёт пресет `@lovable.dev/vite-tanstack-config`; если порт занят, Vite выберет соседний и выведет ссылку в терминале).
- Файловый роутинг — `src/routes/` (плагин TanStack Router сам генерирует `src/routeTree.gen.ts`, его править руками не нужно).
- Стили — Tailwind CSS v4 через `src/styles.css`.

Полезные команды:

```bash
bun run lint        # ESLint
bun run format      # Prettier
bun run build       # production-сборка (вывод в .output/ для Worker и dist/ для клиента)
bun run preview     # локальный предпросмотр собранного бандла средствами Vite
```

### Типовые проблемы

| Симптом | Что делать |
|---|---|
| Порт 8080 занят | Завершите процесс (`lsof -i :8080`) либо запустите `PORT=5173 bun run dev`. |
| `Failed to resolve import` | Проверьте, что файл существует и путь использует алиас `@/...` (см. `tsconfig.json`). |
| Пустая страница / 404 на `/` | Убедитесь, что есть `src/routes/index.tsx` и `src/routes/__root.tsx`; не редактируйте `routeTree.gen.ts`. |
| Не сохраняется прогресс | Проверьте, что в DevTools → Application → Local Storage есть ключ `infosec-course-progress-v1`. Сбросить — кнопкой «Начать заново» в UI или вручную удалить ключ. |

---

## 4. Запуск через `wrangler dev` (эмуляция Cloudflare Workers)

Этот режим повторяет production-окружение: SSR-обработчик из `src/server.ts` запускается в локальной реализации Workers runtime (workerd). Используйте его, чтобы проверить SSR, заголовки, поведение `nodejs_compat` и реальные ошибки 500 перед публикацией.

### 4.1. Установить Wrangler (один раз)

```bash
bun add -d wrangler
# или глобально: npm i -g wrangler
```

### 4.2. Собрать production-бандл

`wrangler dev` запускает уже собранный Worker, поэтому сначала нужен build:

```bash
bun run build
```

После сборки появятся:
- `dist/client/` — статические ассеты (HTML/JS/CSS),
- `dist/server/` или `.output/` — серверный бандл Worker'а (точка входа задана в `wrangler.jsonc` → `"main": "src/server.ts"`, Vite-плагин Cloudflare переписывает её на собранный файл).

### 4.3. Запустить Worker локально

```bash
bunx wrangler dev
# или, если ставили глобально: wrangler dev
```

- По умолчанию слушает **http://localhost:8787**.
- Использует `compatibility_date` и флаг `nodejs_compat` из `wrangler.jsonc`.
- Логи (`console.log`, ошибки SSR) выводятся прямо в терминал; ошибки рендеринга оборачиваются брендированной 500-страницей из `src/lib/error-page.ts`.

### 4.4. Цикл «правка → проверка»

`wrangler dev` **не имеет HMR** — он отдаёт собранный бандл. Для быстрой итерации:

1. В одном терминале держите `bun run build --watch` (Vite пересоберёт бандл при изменениях).
2. В другом — `bunx wrangler dev`. После каждой пересборки перезагрузите страницу.

Для повседневной разработки используйте `bun run dev` (раздел 3); `wrangler dev` нужен только для верификации Worker-окружения.

### 4.5. Деплой (опционально)

Если вы хотите задеплоить вручную мимо Lovable:

```bash
bunx wrangler deploy
```

Lovable публикует проект автоматически по кнопке **Publish** в редакторе — ручной `wrangler deploy` для этого не нужен.

---

## 5. Структура проекта (кратко)

```text
src/
  routes/
    __root.tsx         # корневой layout (html/head/body)
    index.tsx          # домашняя страница с квизом
  components/
    course/            # StepIcon, VideoStep и т.п.
    ui/                # shadcn/ui компоненты
  data/
    quiz.ts            # 10 вопросов курса
    course.ts          # метаданные курса
  lib/
    error-capture.ts   # перехват SSR-ошибок
    error-page.ts      # HTML 500-страницы
  server.ts            # SSR-обёртка (точка входа Worker'а)
  start.ts             # middleware TanStack Start
  styles.css           # Tailwind v4 + design tokens
vite.config.ts         # пресет @lovable.dev/vite-tanstack-config
wrangler.jsonc         # конфиг Cloudflare Worker
```

---

## 6. Шпаргалка команд

```bash
bun install              # установка зависимостей
bun run dev              # Vite dev server (HMR)        → http://localhost:8080
bun run build            # production-сборка
bun run preview          # предпросмотр бандла          → http://localhost:4173
bunx wrangler dev        # Worker runtime (после build) → http://localhost:8787
bunx wrangler deploy     # ручной деплой в Cloudflare (опционально)
bun run lint             # ESLint
bun run format           # Prettier
```

Готово — после `bun install && bun run dev` курс будет доступен на `http://localhost:8080`.