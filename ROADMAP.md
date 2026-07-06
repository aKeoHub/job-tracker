# Job Tracker Roadmap

This roadmap is intentionally phased. Finish the useful core before adding accounts,
integrations, or AI features.

## Current baseline

- [x] React frontend with Vite
- [x] FastAPI backend
- [x] SQLite persistence
- [x] Create and list jobs
- [x] Update a job's status
- [x] Delete jobs
- [x] Separate form, card, constants, and API service modules
- [x] Basic API error display

## Phase 1: Complete and stabilize the MVP

The goal is a reliable personal tracker that handles the entire basic workflow.

- [x] Add a confirmation step before deleting a job
- [x] Add loading, saving, and deleting indicators
- [x] Disable controls while their request is running
- [x] Add an empty state when there are no jobs
- [x] Show clearer success and error messages
- [ ] Allow editing company and position
- [ ] Decide whether `Saved` belongs in the workflow
- [x] Validate job status when creating jobs, not only when updating them
- [ ] Trim input and reject blank company or position values
- [ ] Read the API URL from a Vite environment variable
- [ ] Format and organize the backend imports and route spacing

### MVP definition of done

A user can create, view, edit, update the status of, and delete a job. Failed
requests are visible, accidental duplicate actions are prevented, and data remains
after restarting the backend.

## Phase 2: Store useful job details

Add fields gradually instead of creating one enormous form.

- [ ] Job posting URL
- [ ] Location
- [ ] Work arrangement: remote, hybrid, or on-site
- [ ] Employment type: full-time, part-time, contract, or internship
- [ ] Salary range and currency
- [ ] Source: LinkedIn, company site, referral, and so on
- [ ] Notes
- [ ] Date saved
- [ ] Date applied
- [ ] Created and updated timestamps
- [ ] Application deadline
- [ ] Contact or recruiter name
- [ ] Contact email
- [ ] Add database migrations before changing the schema repeatedly

## Phase 3: Find and organize applications

- [ ] Filter by status
- [ ] Search by company or position
- [ ] Sort by newest, oldest, company, or application date
- [ ] Add status counts at the top of the page
- [ ] Add pagination if the list becomes large
- [ ] Add an archive option for old applications
- [ ] Provide list and kanban-board views
- [ ] Preserve filters in the URL

## Phase 4: Track the application process

- [ ] Record status-change history instead of storing only the latest status
- [ ] Add interviews with date, type, location, and notes
- [ ] Add follow-up tasks and due dates
- [ ] Add reminders for interviews and follow-ups
- [ ] Store contacts associated with each application
- [ ] Add a timeline to each job
- [ ] Track rejection and withdrawal reasons
- [ ] Track offer details and decision deadlines

## Phase 5: Improve the user experience

- [ ] Make the layout responsive for phones and tablets
- [ ] Add accessible labels, keyboard navigation, and visible focus states
- [ ] Improve card spacing and visual hierarchy
- [ ] Use status badges with text and color
- [ ] Add confirmation dialogs for destructive actions
- [ ] Add toast notifications for successful actions
- [ ] Add a dedicated job details page or modal
- [ ] Add light and dark themes
- [ ] Add skeletons or progress indicators while loading
- [ ] Add friendly 404 and connection-error states

## Phase 6: Testing and code quality

### Backend

- [x] Add pytest tests for every endpoint
- [x] Test successful and missing-record cases
- [x] Test invalid status and invalid input cases
- [x] Use a temporary test database
- [x] Separate database access from route handlers
- [ ] Add structured logging

### Frontend

- [ ] Add Vitest and React Testing Library
- [x] Test `JobForm` validation and submission
- [x] Test `JobCard` status changes and deletion
- [x] Test loading, empty, and error states
- [x] Mock API requests in component tests
- [ ] Add an end-to-end happy-path test with Playwright

### Automation

- [ ] Add consistent Python formatting and linting
- [ ] Keep ESLint passing
- [ ] Add a CI workflow that runs backend and frontend tests
- [ ] Add development seed data
- [ ] Document local setup and common commands in `README.md`

## Phase 7: Architecture improvements

Only introduce these when the application is large enough to benefit from them.

- [ ] Split FastAPI routes, schemas, services, and database code into modules
- [x] Add a repository layer for database operations
- [ ] Replace manual schema changes with Alembic migrations
- [ ] Move frontend server-state logic into a custom `useJobs` hook
- [ ] Consider TanStack Query for caching, mutations, and request state
- [ ] Consider TypeScript for job models, component props, and API responses
- [ ] Centralize backend and frontend status definitions or expose them through the API
- [ ] Add request IDs and consistent API error responses
- [ ] Generate API documentation from FastAPI schemas

## Phase 8: Accounts and security

Skip this phase while the tracker is a private, local application.

- [ ] Add user registration and login
- [ ] Hash passwords securely
- [ ] Associate every job with its owner
- [ ] Prevent users from reading or modifying another user's jobs
- [ ] Restrict CORS in production
- [ ] Store secrets in environment variables
- [ ] Add rate limiting and secure headers
- [ ] Add password reset and account deletion
- [ ] Back up and restore user data

## Phase 9: Deployment and operations

- [ ] Add production configuration for frontend and backend
- [ ] Choose hosted PostgreSQL for a multi-user deployment
- [ ] Containerize the application if useful
- [ ] Deploy the frontend
- [ ] Deploy the API
- [ ] Configure HTTPS and production CORS
- [ ] Run database migrations during deployment
- [ ] Add health checks
- [ ] Add error monitoring and basic usage metrics
- [ ] Automate database backups
- [ ] Document deployment and recovery procedures

## Phase 10: Optional advanced features

- [ ] Import and export CSV or JSON
- [ ] Export application reports
- [ ] Calendar integration for interviews and reminders
- [ ] Email templates for follow-ups and thank-you notes
- [ ] Browser extension to save job postings
- [ ] Parse job details from a posting URL
- [ ] Attach resumes, cover letters, and other documents
- [ ] Track which resume version was used
- [ ] Analytics such as response and interview conversion rates
- [ ] Detect stale applications that need follow-up
- [ ] Duplicate-job detection
- [ ] AI-assisted job summaries or note drafting
- [ ] Mobile or progressive web app support

## Recommended next sprint

1. Add delete confirmation and request loading states.
2. Add editing for company and position.
3. Add `created_at`, `updated_at`, and `applied_at` fields with a migration.
4. Add filtering by status and search by company or position.
5. Add backend endpoint tests and document how to run them.

## Guiding rules

- Keep SQLite while this is a local, single-user application.
- Do not add global state management until state sharing becomes painful.
- Do not add authentication until the application will be accessible by other users.
- Add a migration before changing a database that contains data you care about.
- Complete and test one vertical feature across database, API, and UI at a time.
