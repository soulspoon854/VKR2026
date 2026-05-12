# InfoSec Course

SPA-курс по информационной безопасности: 10 вопросов с проверкой ответов и сохранением прогресса в `localStorage`.

## Требования

- **Node.js ≥ 18.17** (рекомендуется 20 LTS) — `node -v`
- Один из менеджеров пакетов: **Bun ≥ 1.1** (предпочтительно), `npm`, `pnpm` или `yarn`
- Любой современный браузер

Установить Bun (если ещё нет):

```bash
curl -fsSL https://bun.sh/install | bash
```

Никакие переменные окружения, `.env` файлы и внешние сервисы для запуска не нужны — данные курса лежат в `src/data/quiz.ts`, прогресс хранится в `localStorage` браузера.

---

## Запуск с нуля (3 шага)

Из корня проекта (там, где лежит `package.json`):

```bash
# 1. Установить зависимости
bun install
# или: npm install / pnpm install / yarn

# 2. Запустить dev-сервер
bun run dev
# или: npm run dev

# 3. Открыть в браузере
#    http://localhost:8080
```

Порт по умолчанию — **8080**

Горячая перезагрузка (HMR) работает из коробки — правьте файлы в `src/` и страница обновится автоматически.

---

## Доступные скрипты

| Команда | Что делает |
|---|---|
| `bun run dev` | Vite dev-сервер с HMR → `http://localhost:8080` |
| `bun run build` | Production-сборка (клиент + Worker bundle) |
| `bun run build:dev` | Сборка в development-режиме (для отладки бандла) |
| `bun run preview` | Локальный предпросмотр production-сборки → `http://localhost:4173` |
| `bun run lint` | Проверка ESLint |
| `bun run format` | Автоформатирование Prettier |

Замените `bun run` на `npm run` / `pnpm` / `yarn`, если используете другой менеджер.



## Структура проекта

```text
src/
  routes/
    __root.tsx         # корневой layout (html/head/body shell)
    index.tsx          # домашняя страница с квизом
  components/
    course/            # компоненты курса (StepIcon, VideoStep)
    ui/                # shadcn/ui примитивы
  data/
    quiz.ts            # 10 вопросов курса
    course.ts          # метаданные курса
  lib/                 # утилиты, обработка ошибок
  router.tsx           # настройка TanStack Router
  server.ts            # SSR-обёртка (точка входа Worker'а)
  start.ts             # middleware TanStack Start
  styles.css           # Tailwind v4 + design tokens
vite.config.ts         # пресет @lovable.dev/vite-tanstack-config
wrangler.jsonc         # конфиг Cloudflare Worker (нужен только для деплоя)
package.json
```

Файл `src/routeTree.gen.ts` генерируется плагином TanStack Router автоматически — править его руками не нужно.

## Сброс прогресса курса

Прогресс хранится в `localStorage` под ключом `infosec-course-progress-v1`.

- В UI: кнопка **«Начать заново»** на финальном экране.
- Вручную: DevTools → Application → Local Storage → удалить ключ.
  
После `bun install && bun run dev` курс доступен на `http://localhost:8080`. Этого достаточно для разработки и прохождения курса локально.
