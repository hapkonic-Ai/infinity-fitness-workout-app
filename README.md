# Infinity Fitness

A kiosk-style gym workout app for a single-branch fitness center. Members walk in, pick a body part, choose any 3 exercise variations, and follow video-guided workouts — all content is geo-fenced to the gym's physical location and available in English, Hindi, and Tamil.

Built as a monorepo: a React SPA + tRPC API in one Vite process, backed by a serverless Neon Postgres database.

---

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [System architecture](#system-architecture)
- [Authentication flow](#authentication-flow)
- [Geofencing](#geofencing)
- [Data model](#data-model)
- [Weekly schedule](#weekly-schedule)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Testing the geofence](#testing-the-geofence)
- [Deployment](#deployment)
- [Project structure](#project-structure)

---

## Features

- **Body-part workout browser** — Chest, Triceps, Lats, Biceps, Shoulders, Legs, Abs and Cardio categories with 73 exercises; members pick any 3 variations per muscle group.
- **Video-guided exercises** — every exercise embeds a Muscle & Strength YouTube demonstration plus written *how-to* and *what-not-to-do* guidance.
- **Geo-fenced access** — member content unlocks only when the device is physically inside the assigned gym's radius (15-minute authorization window, renewable).
- **Weekly schedule board** — Monday–Saturday split displayed on the home screen with today highlighted; Sunday is rest.
- **Circuit training card** — instructions to run one exercise per body part, back to back.
- **Trilingual UI** — one-tap toggle between English, हिंदी and தமிழ்; all 73 exercise guides are fully translated.
- **Shared-gym mode** — one trainee login used by everyone; the app silently auto-signs members in, no daily login friction.
- **Admin panel** — configure gym branches (coordinates + radius), assign members to branches, audit presence events, and test the fence from any coordinates.
- **Safety first** — warning banner on the workouts screen; the app never silently locks a member whose GPS fix is merely imprecise.

## Tech stack

| Layer    | Choice                                                          |
| -------- | --------------------------------------------------------------- |
| Frontend | React 19 · Vite 7 · Tailwind CSS · shadcn/ui · React Router   |
| API      | tRPC 11 · Hono 4 · Zod                                          |
| Database | Postgres (Drizzle ORM) — [Neon](https://neon.tech) serverless   |
| Auth     | HMAC-signed JWT session cookie (secret derived from DB URL)     |
| Geo      | Haversine distance over GPS coordinates                         |
| i18n     | In-app string dictionaries (EN/HI/TA)                           |

## System architecture

```mermaid
flowchart TB
    subgraph Client["Browser (single-page app)"]
        UI[React SPA<br/>Home · Workouts · Exercise detail · Profile]
        LG[Login screen<br/>admin only]
        GL[GeoLock screen<br/>GPS verify + test panel]
        TG[Language toggle<br/>EN / हिंदी / தமிழ்]
    end

    subgraph Server["One Node process (Vite dev / bundled prod)"]
        VT[Vite middleware<br/>serves SPA + HMR]
        HN[Hono server]
        TR[tRPC router]
        MW[Middleware<br/>auth · admin role · geofence]
    end

    subgraph API["tRPC procedures"]
        AUTH[auth.*<br/>loginPassword · me · logout]
        GEO[geo.*<br/>myGym · status · verifyLocation]
        CNT[content.*<br/>exercises list · favorites]
        ADM[admin.*<br/>gyms · members · presence audit · geofenceTest]
    end

    DB[(Neon Postgres<br/>users · gyms · member_profiles<br/>exercises · location_access_sessions · favorites)]

    UI --> VT
    LG --> VT
    GL --> VT
    VT --> HN
    HN --> TR
    TR --> MW
    MW --> AUTH & GEO & CNT
    MW --> ADM
    AUTH & GEO & CNT & ADM --> DB
```

### Request pipeline

```mermaid
sequenceDiagram
    autonumber
    participant B as Browser
    participant S as Hono + tRPC
    participant D as Neon Postgres

    B->>S: POST /api/trpc/auth.loginPassword
    S->>D: upsert user (local:trainee / local:admin)
    S-->>B: Set-Cookie: infinity_sid (HMAC JWT, 1 year)

    B->>S: any /api/trpc/* request
    S->>S: verify JWT → load user → attach to context
    alt member content (content.*, geo-gated)
        S->>D: look up active location_access_session
        alt session valid (less than 15 min)
            S-->>B: data
        else
            S-->>B: 403 LOCATION_LOCKED
        end
    else admin content (admin.*)
        S->>S: require role = admin
        S-->>B: data
    end
```

## Authentication flow

Shared-gym mode — there is one credential pair for the floor and one for staff:

```mermaid
flowchart LR
    A[App opened] --> B{Session cookie<br/>valid?}
    B -->|yes| C[Home screen]
    B -->|no| D{Explicit sign-out<br/>this session?}
    D -->|no| E[Auto sign-in as<br/>trainee / trainee123]
    D -->|yes| F[/login screen/]
    F -->|admin / admin123| G[Admin panel]
    F -->|trainee / trainee123| C
    E --> H{Geofence<br/>session valid?}
    H -->|yes| C
    H -->|no| I[GeoLock screen]
    I -->|GPS verify inside fence| C
```

- The JWT secret is derived from `DATABASE_URL` (SHA-256) — the only secret the deployment carries. Rotating the database password invalidates all sessions.
- An explicit sign-out sets a session flag that suppresses auto sign-in, so staff can stay on the login screen.

## Geofencing

Branch coordinates live **only** in the database (`gyms` table), never in the app bundle. Presence is verified with the Haversine formula; precise coordinates are never stored — only distance-from-gym and GPS accuracy, as an audit trail.

```mermaid
sequenceDiagram
    autonumber
    participant M as Member device
    participant A as tRPC API
    participant D as Postgres

    M->>A: geo.verifyLocation {lat, lng, accuracy}
    A->>D: load member's assigned gym
    A->>A: d = haversine(device, gym)
    alt accuracy missing or greater than 250 m
        A-->>M: accuracy_poor — never lock on a bad fix
    else d greater than radius and d minus accuracy greater than radius
        A-->>M: outside — distance
    else inside fence
        A->>D: expire old sessions, insert active session (TTL 15 min)
        A-->>M: verified — distance, expiresAt
    end

    Note over M,A: Every content request re-checks the session server-side
```

```mermaid
flowchart TD
    REQ[Content request] --> SESS{Active location<br/>session?}
    SESS -->|yes| OK[Serve content]
    SESS -->|no| LOCK[403 LOCATION_LOCKED]
    LOCK --> UI[GeoLock screen]
    UI --> GPS[Get GPS fix]
    GPS --> VER{Haversine within radius<br/>plus accuracy margin?}
    VER -->|yes| SES[Issue 15-min session]
    VER -->|no| DENY[Show distance + denial]
    SES --> OK
    UI --> TEST[Test panel:<br/>custom coordinates]
    TEST --> VER
```

## Data model

```mermaid
erDiagram
    users ||--o| member_profiles : "1:0..1"
    gyms ||--o{ member_profiles : "assigned branch"
    gyms ||--o{ location_access_sessions : "verifications"
    users ||--o{ location_access_sessions : "presence"
    users ||--o{ favorites : "bookmarks"
    exercises ||--o{ favorites : "bookmarked"

    users {
        serial id PK
        text unionId UK "local:admin / local:trainee"
        text name
        text role "user | admin"
        timestamp lastSignInAt
    }
    gyms {
        serial id PK
        text name
        text address
        doublePrecision latitude
        doublePrecision longitude
        int radiusMeters
        boolean active
    }
    member_profiles {
        serial id PK
        int userId FK
        int gymId FK
        text membershipStatus
    }
    exercises {
        serial id PK
        text name UK
        text category "strength | cardio"
        text muscleGroup "Chest | Triceps | Lats | Biceps | Shoulders | Legs | Abs | Cardio"
        text description
        text videoUrl "Muscle & Strength YouTube embed"
        text difficulty
        int sets
        text reps
        json instructions "how-to steps"
        json mistakes "what not to do"
    }
    location_access_sessions {
        serial id PK
        int userId FK
        int gymId FK
        timestamp verifiedAt
        timestamp expiresAt
        text status "active | expired"
        doublePrecision verificationAccuracy
        int distanceFromGym "meters — never raw coordinates"
    }
    favorites {
        serial id PK
        int userId FK
        int exerciseId FK
    }
```

Hindi and Tamil exercise content lives in the frontend (`src/lib/i18n/gen/`), keyed by exercise name and merged at render time — the database stores English only.

## Weekly schedule

| Day       | Focus                |
| --------- | -------------------- |
| Monday    | Chest & Triceps      |
| Tuesday   | Back (Lats) & Biceps |
| Wednesday | Shoulders            |
| Thursday  | Legs & Abs           |
| Friday    | Circuit training     |
| Saturday  | Cardio               |
| Sunday    | Rest                 |

The schedule is a read-only board on the home screen (today is highlighted). Members are not locked into a day — they can open any body part and pick their 3 variations.

## Getting started

**Prerequisites:** Node 20+, pnpm, a Neon (or any Postgres) database.

```bash
# 1. install dependencies
pnpm install

# 2. configure the database — the ONLY environment variable
cp .env.example .env
#    then paste your Neon pooled connection string into .env

# 3. create tables and seed the 73-exercise catalog
pnpm db:push
npx tsx db/seed.ts

# 4. run
pnpm dev          # http://localhost:3000
```

Production build & run:

```bash
pnpm build        # bundles SPA + API server to dist/
pnpm start        # serves everything from one Node process
```

Validation: `pnpm check` (types) · `pnpm lint` · `pnpm test` (vitest).

## Environment variables

Exactly one.

| Variable       | Required | Purpose                                                        |
| -------------- | -------- | -------------------------------------------------------------- |
| `DATABASE_URL` | yes      | Postgres connection string. Also keys the session-cookie HMAC. |

`NODE_ENV` and `PORT` are honored with sane defaults (`development`, `3000`) and are not configuration.

## Testing the geofence

Two built-in tools, no GPS spoofing required:

1. **Admin panel → GEOFENCE TEST** — pick a branch, enter any coordinates (or "Use my position"), hit Check. Shows `INSIDE/OUTSIDE the fence` with the exact distance. Creates no session, so it can be used repeatedly.
2. **GeoLock screen → Test with custom coordinates** — runs the real verification pipeline. Enter the branch coordinates to simulate being on-site (unlocks for 15 minutes), or distant coordinates to see the denial with distance.

Backend-only smoke test (after logging in to get a session cookie):

```bash
# locked without a location session
curl -b cookies.txt 'http://localhost:3000/api/trpc/content.exercises.list?batch=1&input=%7B%220%22%3A%7B%22json%22%3A%7B%7D%7D%7D'
# → 403 LOCATION_LOCKED

# verify at the branch → then the same request returns 73 exercises
curl -b cookies.txt -H 'Content-Type: application/json' \
  -d '{"json":{"latitude":12.960293,"longitude":79.154320,"accuracy":10}}' \
  http://localhost:3000/api/trpc/geo.verifyLocation
```

## Deployment

**Docker (all-in-one):**

```bash
docker build -t infinity-fitness .
docker run -p 3000:3000 -e DATABASE_URL="postgresql://..." infinity-fitness
```

**Vercel + Neon:** the database is already external and serverless. Add `DATABASE_URL` in *Project → Settings → Environment Variables*. Note that this app currently serves the API from the same Node process as the Vite frontend — for Vercel, deploy the API as a serverless function (Hono has a `@hono/vercel` adapter) or keep the Docker/VM deployment.

## Project structure

```text
├── api/                  # tRPC API (Hono + tRPC 11)
│   ├── auth-router.ts    #   shared staff/trainee password logins
│   ├── geo.ts            #   geofence verification + location middleware
│   ├── content.ts        #   exercise catalog (geo-gated)
│   ├── admin.ts          #   branch config, members, presence audit, fence test
│   ├── session.ts        #   HMAC JWT sign/verify + cookie auth
│   ├── middleware.ts     #   auth / admin-role guards
│   └── queries/          #   neon connection + user upserts
├── contracts/            # shared constants & errors (frontend + backend)
├── db/
│   ├── schema.ts         #   Drizzle schema (pg-core)
│   └── seed.ts           #   73-exercise catalog + default branch
├── src/
│   ├── pages/            #   Home, Workouts, ExerciseDetail, Profile, Admin, Login
│   ├── components/       #   AppShell, GeoLock, Gates, WarningBanner, ui/…
│   ├── lib/i18n/         #   EN/HI/TA strings + 73-exercise translations
│   └── hooks|providers/  #   useAuth, trpc client
├── Dockerfile            # single-image build (SPA + API)
└── drizzle.config.ts
```

## Security notes

- Branch coordinates are server-side only; clients receive just name, radius and their own distance at verification time.
- Presence audit stores distance and accuracy — never raw GPS coordinates.
- The two password pairs are defined server-side in `api/auth-router.ts`; the trainee pair is a shared kiosk credential, not per-person identity.
- Change both passwords before going to production, and rotate the Neon password if it has ever been shared.
