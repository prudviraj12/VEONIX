# Architecture

VEONIX uses npm workspaces to keep the React frontend and Express API in one repository. PostgreSQL is the source of truth, accessed only through Prisma. Redis is provisioned for caching, session-adjacent workloads, rate-limit stores, and future asynchronous processing.

## AI boundary

All AI capability is exposed through `AIProvider` in `apps/api/src/providers`. Feature services depend on that interface rather than an OpenAI SDK. The OpenAI adapter is the initial implementation; Gemini, Claude, and Ollama adapters can be added without altering those services.

## Security baseline

The API has Helmet, CORS allowlisting, JSON payload limits, a global rate limit, validated environment variables, and Prisma-backed session storage. Authentication endpoints and JWT issuing are the next feature increment.
