# Project CvSU Portal

#### By John Daniel C. Garan

Video overview: [LINK]

This project is designed to be an independent portfolio and a final CS50x project. It is not affiliated with, endorsed by, or an official project of Cavite State University. This project exists to showcase one developer's own idea of what the university portal could look like (basically a clone). It is not a replacement for the real system. Everything in this project runs on simulated data.

**Live demo:** [project-cvsu-portal.vercel.app](https://project-cvsu-portal.vercel.app/)

## Features

**Create**

- Multi-step student account registration form
- Enroll into the program's curriculum for all semesters with one click (schedule is based on the section selected during registration)
- Grade encoding for each enrolled subject (self-encoded, see [Design Choices](#design-choices) for why)

**Read**

- Student profile overview
- Class schedule, generated from the student's own enrollments
- List of enrolled subjects and encoded grades
- Registration Form preview

**Update**

- Student profile information
- Account password
- Which academic period is currently being viewed (which render subjects, schedule, and regform together)

**Delete**

- Account deletion, which cascades to the student's related data

## How It Works

1. A student creates an account through the registration form, picking a course, entering personal details, and receiving a system-generated student number.
2. Once logged in, the account dashboard page reflects their student information and whichever curriculum the student has selected.
3. The student enrolls in a curriculum and is then automatically enrolled into every semester of that curriculum. Each semester has one or many subject offering (a subject + section + faculty + period combination) ties the student to a specific class.
4. The subjects, schedules, and regform pages all display data for the currently selected academic period, which defaults to the most recent semester but can be changed to view earlier semesters.
5. The subjects page lists all enrolled subjects for the selected academic period.
6. The schedule page displays those subjects as a weekly calendar view.
7. The student can encode their own final grades against each enrolled subject, standing in for a faculty grading process that's outside this project's scope.
8. The grades page displays all encoded grades.
9. The regform brings student, course, and fee information together into a printable PDF, laid out to match the university's actual registration form.
10. From account settings, the student can update their profile, change their password, or delete their account entirely.

## Design Choices

This project didn't start out with a registration form. The original scope was a read-only viewer: someone had to seed the database with one student, and that student, who already had their information sitting in the database, could browse a pre-populated dashboard, schedule, and grades. That was easy to build, but it wasn't really an _application_, there was nothing to actually do, just a page to look at once.

The scope grew to include a registration form instead, to actually implement CRUD. A student creates a real account, gets a generated student number, and enrolls themselves, rather than viewing data that already existed. That single change turned the project from a mockup into a small but functioning system with real state to manage.

A few other decisions were made deliberately to keep the project small enough to build, but complete enough to feel like a real student portal:

- **The schema is built like a real institutional system, the app isn't.** Tables like sections, subject offerings, and academic periods are modeled the way an actual university database would need them. In a real system, a faculty or registrar role would be the one enrolling students each period and keeping that data current. For this project's scope, the student does that work themselves instead, creating their own account, enrolling into their curriculum, encoding their own grades, which simulates the full portal experience without needing a second role to drive it.

- **All institutional data is seeded mockup data.** Departments, courses, faculty, sections, and academic periods aren't managed through the app at all, they're inserted directly into the database ahead of time. It's enough to make the student's experience feel like it's sitting inside a real, populated university system, without needing a faculty role just to type that data in by hand.

- **Grades are self-encoded.** For the same reason, there's no faculty role to encode them the way a real portal would. This keeps the grades feature behaving like a real portal's would, without expanding the project's scope.

## Tech Stack

- **Framework:** TanStack Start (React) with TanStack Router for file-based routing and `createServerFn` for server functions
- **Database:** Neon Postgres, via Drizzle ORM (`neon-serverless` + `Pool` + `ws`, needed for real transaction support)
- **UI:** shadcn/ui on top of Radix primitives, styled with Tailwind CSS
- **Forms:** React Hook Form + Zod v4
- **Auth:** bcryptjs for password hashing, wrapped in a custom session layer built on TanStack Start's `useSession`
- **PDF export:** `jsPDF` + `html2canvas-pro`
- **Deployment:** Vercel, via the Nitro adapter

## Installation

### Setup

To run this application:

```bash
npm install
npm run dev
```

### Building For Production

To build this application for production:

```bash
npm run build
```

### Styling

This project uses [Tailwind CSS](https://tailwindcss.com/) for styling.

### Linting & Formatting

This project uses [eslint](https://eslint.org/) and [prettier](https://prettier.io/) for linting and formatting. Eslint is configured using [tanstack/eslint-config](https://tanstack.com/config/latest/docs/eslint). The following scripts are available:

```bash
npm run lint
npm run format
npm run check
```

### Deploy with Nitro

This project uses Nitro as a generic server adapter, so the same build can run on any Node-compatible host, not just Vercel.

```bash
npm run build
node --env-file=.env .output/server/index.mjs
```

The `--env-file` flag is only needed for testing the production build locally, Nitro's standalone output doesn't load `.env` automatically. On Vercel this isn't an issue, since environment variables are injected directly into the build.

### Learn More

You can learn more about all of the offerings from TanStack in the [TanStack documentation](https://tanstack.com).

For TanStack Start specific documentation, visit [TanStack Start](https://tanstack.com/start).

## Challenges and Lessons Learned

The biggest challenge wasn't really a single bug, it was more about the technicality of the project. The database schema was exhausting to work with, mainly because of how often it had to change. Because there's no registrar or faculty, all of the institutional mockup data (departments, courses, faculty, sections, subjects, academic periods, subject offerings) has to be seeded by hand, directly into the database, rather than typed in through the app. That's tedious on its own, but it got a lot more painful once the schema kept changing and the data has to be seeded again.

If there's a lesson in all of that, it's that software development never really stops, it's constant revision, even on a project this size. This whole thing actually started much smaller than it ended up: the idea was just a read-only viewer, born out of noticing that CvSU's actual portal doesn't even offer a PDF export for the regform, and wanting to give students something the real system didn't. Somewhere in the middle of building that, it became obvious the project could go further, into a full CRUD app instead of a static viewer, mostly because it was a chance to actually learn what a real CRUD workflow looks like end to end, not just read about one. That shift, more than any single feature, is the reason the project looks the way it does now.

## Future Improvements

- Turn this into a real system, where a faculty or registrar could encode sections, subjects, and schedules themselves, instead of that data being seeded by hand
- A real professor or faculty role so grades are encoded instead of self-encoded by the student
- Automated test coverage for the registration, enrollment, and regform flows
