// Hand-written interview question banks — the indexable SEO layer for the
// interview module. Each becomes /interview/<slug>. Content is genuine and
// concise (quality over quantity) so it can actually rank, unlike thin
// AI-generated lists. Extend by adding entries here.

export type QA = { q: string; a: string };

export type QuestionBank = {
  slug: string;
  topic: string; // display name, e.g. "JavaScript"
  title: string; // page <title> / H1 base
  description: string; // meta description (kept <= ~155 chars)
  intro: string; // rankable intro paragraph
  questions: QA[];
};

export const QUESTION_BANKS: QuestionBank[] = [
  {
    slug: "javascript",
    topic: "JavaScript",
    title: "JavaScript Interview Questions",
    description:
      "JavaScript interview questions with answers — closures, the event loop, this, promises, hoisting and more. Practice live with an AI interviewer.",
    intro:
      "The JavaScript questions that come up most in frontend and full-stack interviews, with concise, correct answers. Read through them, then run a live mock interview to practice explaining them out loud.",
    questions: [
      { q: "What's the difference between == and ===?", a: "== compares after type coercion, while === compares value and type with no coercion. Prefer === to avoid surprises — for example 0 == \"\" is true but 0 === \"\" is false." },
      { q: "Explain closures.", a: "A closure is a function that keeps access to variables from its outer (lexical) scope even after that outer function has returned. They power data privacy, factory functions, and callbacks that remember state." },
      { q: "What's the difference between var, let, and const?", a: "var is function-scoped and hoisted as undefined; let and const are block-scoped with a temporal dead zone. const can't be reassigned (though objects it holds stay mutable). Prefer const, then let, and avoid var." },
      { q: "What is the event loop?", a: "JavaScript runs on a single thread. The event loop moves queued callbacks onto the call stack when it's empty. Microtasks (promise callbacks) run before macrotasks (setTimeout) after each tick." },
      { q: "How does `this` work?", a: "`this` depends on how a function is called: as a method it's the object, as a plain call it's undefined/global in strict mode, and arrow functions inherit `this` from their enclosing scope. call, apply, and bind set it explicitly." },
      { q: "What's the difference between null and undefined?", a: "undefined means a variable was declared but never assigned; null is an intentional 'no value.' typeof undefined is \"undefined\", while typeof null is \"object\" — a long-standing language quirk." },
      { q: "What are promises and async/await?", a: "A promise represents a future value that's pending, fulfilled, or rejected. async/await is sugar over promises that lets you write asynchronous code in a synchronous style; await pauses until the promise settles." },
      { q: "What is hoisting?", a: "Declarations are processed before code runs. var and function declarations are hoisted (var initializes to undefined), while let and const are hoisted but left uninitialized in the temporal dead zone until their line executes." },
      { q: "What's the difference between map, forEach, filter, and reduce?", a: "map returns a new transformed array, forEach just iterates and returns undefined, filter returns items that pass a test, and reduce folds the array into a single accumulated value." },
      { q: "What is a shallow copy versus a deep copy?", a: "A shallow copy duplicates only top-level properties, so nested objects are shared by reference; a deep copy duplicates everything. {...obj} and Object.assign are shallow; structuredClone(obj) makes a deep copy." },
      { q: "Explain debouncing versus throttling.", a: "Debounce waits until activity stops before running (good for search inputs); throttle runs at most once per interval (good for scroll or resize). Both limit how often an expensive handler fires." },
    ],
  },
  {
    slug: "react",
    topic: "React",
    title: "React Interview Questions",
    description:
      "Top React interview questions with answers — hooks, the virtual DOM, useEffect, keys, re-renders, and server components. Practice live with an AI interviewer.",
    intro:
      "The React questions interviewers actually ask, from hooks and reconciliation to avoiding re-renders and server components — each with a short, correct answer. Then rehearse them in a live AI mock.",
    questions: [
      { q: "What is the virtual DOM?", a: "It's an in-memory representation of the UI. React diffs the new tree against the previous one (reconciliation) and applies only the minimal set of real DOM updates, which is faster than manual DOM manipulation." },
      { q: "What are hooks and what are the rules?", a: "Hooks like useState and useEffect let function components use state and lifecycle features. Rules: only call them at the top level (not in loops/conditions) and only from components or other hooks." },
      { q: "useState versus useReducer — when to use each?", a: "Use useState for simple, independent pieces of state. Reach for useReducer when state is complex, several values change together, or the next state depends on the previous — it centralizes the logic in a reducer." },
      { q: "What does useEffect do and when does it run?", a: "It runs side effects after render. The dependency array controls timing: [] runs once on mount, [dep] runs when dep changes, and no array runs after every render. Return a cleanup function for teardown." },
      { q: "Why do list items need keys?", a: "Keys give items a stable identity so React can tell which were added, removed, or reordered. Use stable unique IDs — not the array index, which causes subtle bugs when the list reorders or changes." },
      { q: "Controlled versus uncontrolled components?", a: "In a controlled component the form value lives in React state (one source of truth); in an uncontrolled one the DOM holds the value and you read it with a ref. Controlled is preferred for validation and dynamic behavior." },
      { q: "What do useMemo and useCallback do?", a: "useMemo caches a computed value and useCallback caches a function reference between renders. Use them to skip expensive recomputation or to keep stable props for memoized children — not everywhere, since they add overhead." },
      { q: "What causes unnecessary re-renders and how do you prevent them?", a: "State or prop changes, new object/function references each render, and context updates. Mitigate with React.memo, useMemo/useCallback, splitting state, and lifting state only as high as needed." },
      { q: "What is prop drilling and how do you avoid it?", a: "Prop drilling is passing props through many intermediate components that don't use them. Avoid it with the Context API, component composition, or a state manager like Zustand or Redux." },
      { q: "Server Components versus Client Components?", a: "Server Components render on the server, ship no JavaScript, and can fetch data directly. Client Components ('use client') run in the browser for interactivity and state. Compose them to keep client-side JS small." },
    ],
  },
  {
    slug: "nodejs",
    topic: "Node.js",
    title: "Node.js Interview Questions",
    description:
      "Node.js interview questions with answers — the event loop, streams, async errors, middleware, and clustering. Practice live with an AI interviewer.",
    intro:
      "Key Node.js interview questions for backend and full-stack roles, covering the event loop, streams, error handling, and scaling — each with a concise answer. Then practice explaining them in a live mock.",
    questions: [
      { q: "What is Node.js and its execution model?", a: "Node.js is a JavaScript runtime built on V8 for server-side code. It uses a single-threaded, non-blocking event loop with asynchronous I/O, so it handles many concurrent connections efficiently." },
      { q: "CommonJS require versus ES module import?", a: "CommonJS is synchronous and uses module.exports/require; ES modules use import/export, are statically analyzable, and support top-level await. Node supports both — .mjs or \"type\":\"module\" selects ESM." },
      { q: "How does the Node event loop work?", a: "It runs in phases (timers, pending callbacks, poll, check, close). Microtasks — promises and process.nextTick — run between phases, and blocking I/O is offloaded to libuv's thread pool." },
      { q: "Blocking versus non-blocking code?", a: "Blocking code halts the event loop until it finishes (e.g. fs.readFileSync), starving other requests; non-blocking code uses callbacks or promises so the loop keeps serving work. Avoid blocking calls in request handlers." },
      { q: "What are streams?", a: "Streams process data in chunks instead of loading it all into memory — Readable, Writable, Duplex, and Transform. They're ideal for large files or network data and are composed with .pipe()." },
      { q: "How do you handle errors in async code?", a: "Use try/catch with async/await, .catch() on promises, error-first callbacks, and 'error' events on streams and emitters. Always handle unhandled promise rejections so the process doesn't crash silently." },
      { q: "What is middleware in Express?", a: "Middleware are functions with (req, res, next) that run in order to process a request — parsing bodies, auth, logging — calling next() to pass control or ending the response themselves." },
      { q: "process.nextTick versus setImmediate?", a: "nextTick callbacks run right after the current operation, before the loop continues; setImmediate runs on the next iteration's check phase. Overusing nextTick can starve I/O." },
      { q: "How do you scale a Node app across CPU cores?", a: "Node is single-threaded per process, so use the cluster module or worker_threads, or run multiple processes behind a load balancer (e.g. with PM2) to use all cores." },
      { q: "dependencies versus devDependencies?", a: "dependencies are needed at runtime in production; devDependencies are only for development and builds (test runners, bundlers, linters). npm install --production skips devDependencies." },
    ],
  },
  {
    slug: "python",
    topic: "Python",
    title: "Python Interview Questions",
    description:
      "Python interview questions with answers — data structures, the GIL, decorators, generators, and memory. Practice live with an AI interviewer.",
    intro:
      "Frequently asked Python interview questions for backend, data, and general software roles — from the GIL and decorators to generators and memory — with clear answers. Then rehearse them in a live mock.",
    questions: [
      { q: "What are Python's core built-in data structures?", a: "list (ordered, mutable), tuple (ordered, immutable), dict (key-value mapping), and set (unique, unordered). Choose based on whether you need mutability, ordering, or fast membership tests." },
      { q: "list versus tuple?", a: "Lists are mutable — you can append and change them. Tuples are immutable and hashable, so they can be dict keys, are slightly faster, and signal that the data is fixed." },
      { q: "What is a list comprehension?", a: "A concise way to build a list, like [x*2 for x in items if x > 0]. It's usually more readable and a bit faster than the equivalent for-loop with append." },
      { q: "Explain *args and **kwargs.", a: "*args collects extra positional arguments into a tuple and **kwargs collects extra keyword arguments into a dict. They let a function accept a flexible number of arguments." },
      { q: "What is the GIL?", a: "The Global Interpreter Lock allows only one thread to execute Python bytecode at a time, so threads don't speed up CPU-bound work. Use multiprocessing, async, or C extensions for real parallelism." },
      { q: "is versus ==?", a: "== compares values, while is compares identity — whether two names point to the same object in memory. Use is only for singletons like None." },
      { q: "What are decorators?", a: "Decorators are functions that wrap another function to add behavior — logging, timing, caching, auth — without changing it, applied with @decorator syntax. A decorator takes a function and returns a new one." },
      { q: "Explain generators and yield.", a: "Generators produce values lazily, one at a time, using yield and keeping their state between calls. They're memory-efficient for large or streaming sequences because they don't build the whole result at once." },
      { q: "How does Python manage memory?", a: "Through reference counting plus a cyclic garbage collector. An object is freed when its reference count hits zero, and the collector reclaims objects trapped in reference cycles." },
      { q: "What is a context manager (the with statement)?", a: "An object with __enter__ and __exit__ methods that handles setup and teardown automatically — like closing a file or releasing a lock — even if an exception occurs inside the block." },
    ],
  },
  {
    slug: "behavioral",
    topic: "Behavioral",
    title: "Behavioral Interview Questions",
    description:
      "Behavioral interview questions with STAR-method tips — conflict, failure, leadership, deadlines and more. Practice live with an AI interviewer.",
    intro:
      "The behavioral questions nearly every interview includes, with guidance on answering them using the STAR method (Situation, Task, Action, Result). Read the tips, then practice telling your stories out loud in a live mock.",
    questions: [
      { q: "Tell me about yourself.", a: "Give a tight 60–90 second pitch: your current role, two or three relevant achievements, and why this role excites you. Tailor it to the job — don't recite your whole resume." },
      { q: "Tell me about a conflict with a teammate.", a: "Use STAR: describe the situation, the specific actions you took to resolve it (listening, finding common ground, focusing on the goal), and the positive outcome. Emphasize collaboration, not blame." },
      { q: "Describe a challenging project and how you handled it.", a: "Pick a real project, explain what made it hard, the steps and trade-offs you made, and the measurable result. Show ownership and structured problem-solving." },
      { q: "Tell me about a time you failed.", a: "Choose a genuine failure, own your part in it, and focus on what you learned and changed afterward. Interviewers want accountability and growth, not a fake weakness." },
      { q: "How do you handle tight deadlines and pressure?", a: "Talk about prioritizing, communicating early, and scoping down non-essentials, then give an example where you delivered under pressure without burning out yourself or the team." },
      { q: "Tell me about a time you disagreed with your manager.", a: "Show you can push back respectfully with data, and then commit to the decision once it's made ('disagree and commit'). It signals maturity and professionalism." },
      { q: "Describe a time you showed leadership.", a: "Leadership isn't only about titles — mentoring, driving a decision, or unblocking others counts. Use STAR and quantify the impact where you can." },
      { q: "Why do you want to work here?", a: "Connect the company's mission, product, or tech stack to your own interests and strengths. Show you've researched them and avoid generic, one-size-fits-all answers." },
      { q: "Tell me about difficult feedback you received.", a: "Show that you took it constructively, acted on it, and improved. This demonstrates coachability, which interviewers value highly." },
      { q: "How do you prioritize when everything feels urgent?", a: "Describe a framework — impact versus effort, deadlines, stakeholder input — communicating trade-offs clearly, and give a concrete example of making the call." },
    ],
  },
  {
    slug: "java-backend",
    topic: "Java Backend",
    title: "Java Backend Interview Questions",
    description:
      "Java backend interview questions with answers — Spring Boot, JVM, concurrency, JPA/Hibernate, REST APIs, and microservices. Practice live with an AI interviewer.",
    intro:
      "The Java backend questions that come up most in Spring Boot and enterprise Java interviews, with concise, correct answers. Work through them, then run a live mock to practice explaining them out loud.",
    questions: [
      { q: "What is the difference between the JDK, JRE, and JVM?", a: "The JVM is the runtime engine that executes bytecode. The JRE bundles the JVM with the standard class libraries needed to run Java programs. The JDK is the full development kit — it includes the JRE plus the compiler (javac), debugger, and other tools. You develop with the JDK and ship/run with the JRE." },
      { q: "Explain Java's memory model — heap vs. stack.", a: "The stack holds method frames with local variables and references, allocated and freed per-call in LIFO order. The heap holds all object instances and is shared across threads — managed by the garbage collector. Large long-lived objects go on the heap; primitives and references in an active frame stay on the stack." },
      { q: "What is the difference between checked and unchecked exceptions?", a: "Checked exceptions (extend Exception but not RuntimeException) must be declared in the method signature or caught — the compiler enforces this. Unchecked exceptions (RuntimeException and its subclasses, plus Errors) don't require declaration. Use checked for recoverable conditions and unchecked for programming errors." },
      { q: "How does Spring Boot auto-configuration work?", a: "Spring Boot scans the classpath for libraries and, based on what it finds (e.g. spring-data-jpa + a datasource), uses @Conditional annotations to register beans automatically. The spring.factories / AutoConfiguration.imports file lists candidate configurations that are evaluated at startup — you can override any bean or property to customise or disable them." },
      { q: "What is the Spring Bean lifecycle?", a: "Spring instantiates the bean, injects dependencies, then calls @PostConstruct / afterPropertiesSet(). The bean is then in use. On shutdown it calls @PreDestroy / destroy(). The container manages scope — singleton beans live for the application lifetime, request/session-scoped beans are shorter." },
      { q: "Explain @Transactional in Spring — what does it do and what are common pitfalls?", a: "@Transactional wraps the method in a database transaction that commits on success or rolls back on a RuntimeException by default. Common pitfalls: calling a @Transactional method from within the same bean bypasses the proxy (no transaction); checked exceptions don't trigger rollback unless you set rollbackFor; and catching exceptions inside the method silently swallows the rollback." },
      { q: "What is N+1 query problem in JPA/Hibernate and how do you fix it?", a: "N+1 occurs when loading a list of N entities triggers N extra lazy queries for an association. Fix it with JOIN FETCH in JPQL, @EntityGraph, or a @NamedEntityGraph to eagerly load associations in a single query, or use batch fetching. Avoid FetchType.EAGER globally — it causes over-fetching." },
      { q: "How does Java handle concurrency — threads, synchronized, and modern alternatives?", a: "Threads share heap memory; synchronized methods/blocks acquire an intrinsic lock to prevent concurrent access. Modern alternatives: ReentrantLock for explicit locking, volatile for visibility without mutual exclusion, java.util.concurrent classes (ConcurrentHashMap, atomic types, locks, semaphores), and CompletableFuture for async composition. Prefer higher-level abstractions to raw synchronized." },
      { q: "What is the difference between ArrayList and LinkedList?", a: "ArrayList is backed by an array — O(1) random access, O(n) insertions in the middle. LinkedList is a doubly-linked list — O(1) insertions/deletions at head/tail, O(n) random access. ArrayList is almost always the better default due to cache locality; use LinkedList when you insert/remove frequently at both ends." },
      { q: "Explain REST API best practices in a Spring Boot context.", a: "Use meaningful URIs (nouns, plural: /users/{id}), correct HTTP verbs (GET/POST/PUT/PATCH/DELETE), and standard status codes (200, 201, 204, 400, 404, 409, 500). Return consistent error bodies. Version via URI (/v1/) or Accept header. Secure with Spring Security (JWT or OAuth2). Validate input with @Valid/@Validated and handle exceptions globally with @ControllerAdvice." },
      { q: "What is a microservice and what challenges does it introduce?", a: "A microservice is a small, independently deployable service with a single bounded context. Benefits: independent scaling and deployment. Challenges: distributed system problems — network latency, partial failures, distributed transactions (use sagas/outbox pattern), data consistency, service discovery, and observability (distributed tracing with Sleuth/Zipkin, centralised logging, metrics)." },
      { q: "How do you write unit tests for a Spring Boot service?", a: "Use JUnit 5 and Mockito — annotate with @ExtendWith(MockitoExtension.class), mock dependencies with @Mock, inject them with @InjectMocks, and assert with AssertJ. For Spring slice tests use @WebMvcTest (controller layer with MockMvc) or @DataJpaTest (repository layer with an in-memory DB). Keep unit tests fast by avoiding the full context (@SpringBootTest is integration, not unit)." },
    ],
  },
  {
    slug: "system-design",
    topic: "System Design",
    title: "System Design Interview Questions",
    description:
      "System design interview questions with answers — scaling, load balancing, caching, SQL vs NoSQL, CAP and queues. Practice live with an AI interviewer.",
    intro:
      "Core system design interview questions for mid and senior engineers, covering how to approach the problem plus scaling, caching, databases, and availability — each with a concise answer. Then practice a live mock.",
    questions: [
      { q: "How do you approach a system design question?", a: "Clarify functional and non-functional requirements and scale, do rough capacity estimates, define the APIs and data model, sketch a high-level architecture, then deep-dive components and discuss trade-offs and bottlenecks." },
      { q: "Horizontal versus vertical scaling?", a: "Vertical scaling means a bigger machine — simple but has a ceiling and a single point of failure. Horizontal scaling adds more machines — it scales much further but needs load balancing and stateless services." },
      { q: "What does a load balancer do?", a: "It distributes incoming traffic across multiple servers for availability and scale, using strategies like round-robin or least-connections, and typically does health checks and can terminate TLS." },
      { q: "SQL versus NoSQL — when to use each?", a: "Use SQL for structured data, complex queries, and strong transactional consistency. Use NoSQL (document, key-value, wide-column) for flexible schemas, very high write throughput, and easy horizontal scaling. Decide by access patterns." },
      { q: "What is caching and where do you apply it?", a: "Caching stores frequent results closer to the user — browser, CDN, in-memory stores like Redis, or a query cache — to cut latency and load. The hard part is invalidation, so discuss TTLs and staleness." },
      { q: "Sharding versus replication?", a: "Replication copies the same data to multiple nodes for read scaling and availability; sharding partitions data across nodes by a key for write and storage scaling. Large systems often use both together." },
      { q: "What is the CAP theorem?", a: "During a network partition you can guarantee only two of Consistency, Availability, and Partition tolerance. In practice you trade consistency against availability, giving CP or AP systems." },
      { q: "How do you design for high availability?", a: "Remove single points of failure with redundancy, load balancing, and replication across zones; add health checks, automatic failover, and graceful degradation; and measure against SLAs." },
      { q: "How would you implement rate limiting?", a: "Use an algorithm like token bucket or sliding window, enforced per user or API key at the gateway, backed by a fast store such as Redis, and return HTTP 429 when the limit is exceeded." },
      { q: "What is a message queue and why use one?", a: "A queue like Kafka, RabbitMQ, or SQS decouples producers from consumers, absorbs traffic spikes, and enables asynchronous processing and retries — improving resilience and scalability." },
    ],
  },
  // ── Python Backend ─────────────────────────────────────────────────────────
  {
    slug: "python-backend",
    topic: "Python Backend",
    title: "Python Backend Interview Questions",
    description:
      "Python backend interview questions with answers — FastAPI, Django, async, ORMs, Celery, REST APIs, and testing. Practice live with an AI interviewer.",
    intro:
      "The Python backend questions interviewers ask most in FastAPI, Django, and Flask roles — covering async, ORMs, API design, task queues, and testing — each with a clear answer. Then rehearse them in a live mock.",
    questions: [
      { q: "What is the difference between Django, Flask, and FastAPI?", a: "Django is a batteries-included framework with ORM, admin, auth, and templating — ideal for large apps. Flask is a micro-framework giving you full control with minimal defaults — good for small services. FastAPI is modern and async-first, built on Starlette and Pydantic, with automatic OpenAPI docs — the best choice for high-performance APIs. Choose based on scale, team preference, and async needs." },
      { q: "How does Python's async/await work and when should you use it?", a: "async functions return coroutines that run in an event loop. await suspends the coroutine until the awaited task (usually I/O) completes, letting other coroutines run. Use async for I/O-bound work — HTTP calls, DB queries, file reads — where you want to handle many concurrent requests without threads. For CPU-bound work, use multiprocessing instead; async won't help there." },
      { q: "What are Pydantic models and why are they useful in FastAPI?", a: "Pydantic models define data shapes with Python type hints and validate automatically at parse time — raising clear errors for invalid input. FastAPI uses them for request body parsing, query parameters, and response serialisation, giving you automatic validation, IDE autocompletion, and generated OpenAPI docs for free." },
      { q: "What is an ORM and how does Django ORM compare to SQLAlchemy?", a: "An ORM maps Python classes to database tables so you write Python instead of SQL. Django ORM is tightly coupled to Django, simple to use, and handles migrations via makemigrations. SQLAlchemy is standalone, more powerful, and gives fine-grained control — used widely with Flask and FastAPI. For complex queries or multiple database support, SQLAlchemy is more flexible; for standard CRUD in a Django app, the built-in ORM is faster to work with." },
      { q: "What is Celery and when would you use it?", a: "Celery is a distributed task queue for running work asynchronously or on a schedule, backed by a broker like Redis or RabbitMQ. Use it for tasks that are slow or can be deferred — sending emails, processing images, generating reports, or retrying failed operations — so the HTTP response isn't blocked." },
      { q: "How do you handle database migrations in Python backend projects?", a: "In Django, run makemigrations to generate migration files from model changes, then migrate to apply them. In SQLAlchemy-based projects use Alembic — autogenerate detects schema diffs or you write them manually. Always review auto-generated migrations, never edit them after merging, and run migrations in CI before deploying." },
      { q: "Explain REST vs GraphQL — when would you choose each?", a: "REST uses fixed endpoints per resource (GET /users/{id}) and is simple, cacheable, and widely understood. GraphQL uses a single endpoint where clients specify exactly what fields they need — reducing over/under-fetching for complex, nested data. Choose REST for simple CRUD APIs and public APIs; choose GraphQL when clients have varying data needs or you're building a BFF layer." },
      { q: "How do you secure a Python API? Walk through the main concerns.", a: "Authentication (JWT or OAuth2 with libraries like python-jose or Authlib), authorisation (check permissions per resource), input validation (Pydantic or marshmallow), SQL injection prevention (use ORM or parameterised queries, never string-format SQL), rate limiting (slowapi or gateway-level), HTTPS everywhere, secrets in env vars (never in code), CORS configured narrowly, and dependency scanning in CI." },
      { q: "What is the GIL and how does it affect backend Python?", a: "The Global Interpreter Lock allows only one thread to execute Python bytecode at a time, so threads can't parallelise CPU-bound work. For I/O-bound concurrency use async or threads (GIL releases during I/O). For CPU-bound parallelism use multiprocessing or offload to C extensions. Gunicorn/uvicorn workers side-step this by running multiple processes." },
      { q: "How do you write and organise tests in a Python backend project?", a: "Use pytest as the test runner. Organise by type: unit tests (test pure functions with mocks for dependencies), integration tests (test DB layer with a test DB or transactions rolled back after each test), and API tests (use FastAPI's TestClient or Django's APIClient). Mark slow tests, run fast ones in CI on every push, slow ones nightly. Use fixtures for DRY setup and conftest.py for shared helpers." },
      { q: "What is dependency injection in FastAPI?", a: "FastAPI's Depends() system lets you declare dependencies (DB sessions, auth checks, config, shared clients) as functions that FastAPI resolves and injects into route handlers. This keeps handlers thin, makes dependencies testable by overriding them in tests, and handles setup/teardown (e.g. opening and closing a DB session) through generator-based dependencies with yield." },
    ],
  },
  // ── React Frontend ─────────────────────────────────────────────────────────
  {
    slug: "react-frontend",
    topic: "React Frontend",
    title: "React Frontend Interview Questions",
    description:
      "React frontend interview questions with answers — hooks, state management, SSR, Next.js, testing, and performance. Practice live with an AI interviewer.",
    intro:
      "The React frontend questions interviewers ask most — from hooks and reconciliation to Next.js SSR, global state, and testing — each with a concise, correct answer. Then practice them in a live mock interview.",
    questions: [
      { q: "What is the difference between controlled and uncontrolled components?", a: "A controlled component's value is driven by React state (one source of truth), making it easy to validate and respond to input. An uncontrolled component stores its value in the DOM and you read it via a ref. Controlled is preferred for forms with validation or dynamic behaviour; uncontrolled is simpler for basic read-once forms." },
      { q: "Explain the React reconciliation algorithm.", a: "When state or props change, React re-renders the component tree in memory and diffs it against the previous virtual DOM tree — the reconciliation algorithm. It assumes elements of different types produce different trees (so it replaces them), and uses keys to efficiently reorder list items. Only the minimal set of real DOM mutations is applied." },
      { q: "When would you use useReducer instead of useState?", a: "Use useReducer when state has multiple sub-values that change together, the next state depends on the previous, or the update logic is complex enough to benefit from a centralised reducer function. It makes state transitions explicit and easier to test, similar to a tiny Redux-style pattern without the library." },
      { q: "What is the Context API and what are its performance pitfalls?", a: "Context lets you pass values through the tree without prop drilling. The pitfall: every consumer re-renders whenever the context value changes, even if only an unrelated part changed. Fix by splitting contexts by concern, memoising the value object with useMemo, or reaching for a dedicated state library (Zustand, Jotai) for frequently-changing global state." },
      { q: "How does Next.js SSR differ from SSG and ISR?", a: "SSR (getServerSideProps) generates the page on every request — always fresh but slower. SSG (getStaticProps) generates at build time — fast and cacheable but stale. ISR (revalidate) is SSG that regenerates in the background after a time interval — the best of both for content that changes occasionally. Choose based on how often the data changes and your traffic patterns." },
      { q: "What is code-splitting and how do you implement it in React?", a: "Code-splitting breaks the JavaScript bundle into smaller chunks loaded on demand, so the initial page loads faster. Use React.lazy() with Suspense to lazy-load components, and dynamic import() for libraries. Next.js does route-level splitting automatically. Profile with the browser's Coverage tab to find unused code." },
      { q: "How do you optimise a React app that re-renders too often?", a: "Profile first with React DevTools Profiler to find expensive renders. Then: wrap pure components with React.memo to skip renders when props haven't changed, use useCallback to stabilise function props, use useMemo for expensive computations, split context by concern to narrow update scope, and avoid creating new objects/arrays inline in JSX." },
      { q: "What is Zustand and how does it compare to Redux?", a: "Zustand is a lightweight global state library using a simple hook-based API with no boilerplate — you define a store with state and actions in one place. Redux is more structured with actions, reducers, and middleware, and comes with Redux DevTools for time-travel debugging. Zustand is faster to set up for most apps; Redux shines in large teams that need strict conventions and advanced tooling." },
      { q: "How do you test React components?", a: "Use React Testing Library with Jest (or Vitest). Write tests from the user's perspective — query by accessible role, label, or text (getByRole, getByLabelText) rather than implementation details. For async behaviour use waitFor or findBy queries. Mock network calls with MSW (Mock Service Worker). For E2E flows use Playwright or Cypress." },
      { q: "What are React Server Components?", a: "RSCs render on the server and send HTML (with zero client JS for the component itself) — ideal for data fetching and non-interactive UI. They can import server-only code (direct DB queries, secrets). They can't use state, effects, or browser APIs — those stay in Client Components ('use client'). Compose them: a Server Component can render Client Component children, but not vice versa." },
      { q: "What is hydration and what causes hydration errors?", a: "Hydration is the process of React attaching event listeners to server-rendered HTML, making it interactive. Hydration errors occur when the server-rendered HTML doesn't match what React would render on the client — common causes: using Math.random() or Date.now() without fixing the seed, rendering based on window/localStorage (which doesn't exist server-side), or incorrect nesting (e.g. <p> inside <p>)." },
    ],
  },
  // ── SQL / Data Analyst ─────────────────────────────────────────────────────
  {
    slug: "sql-analyst",
    topic: "SQL / Data Analyst",
    title: "SQL & Data Analyst Interview Questions",
    description:
      "SQL and data analyst interview questions with answers — joins, window functions, CTEs, indexes, pandas, and reporting. Practice live with an AI interviewer.",
    intro:
      "The SQL and data analyst questions that come up most in analytics and BI roles — from joins and aggregations to window functions, CTEs, and data modeling — each with a correct, concise answer. Then practice in a live mock.",
    questions: [
      { q: "What is the difference between INNER JOIN, LEFT JOIN, RIGHT JOIN, and FULL OUTER JOIN?", a: "INNER JOIN returns only rows with matches in both tables. LEFT JOIN returns all rows from the left table with NULLs where there's no match on the right. RIGHT JOIN is the mirror. FULL OUTER JOIN returns all rows from both tables, with NULLs on either side where there's no match. In practice LEFT JOIN covers most use cases — RIGHT JOIN can always be rewritten as a LEFT JOIN by swapping table order." },
      { q: "What is a window function? Give an example.", a: "A window function performs a calculation over a set of rows related to the current row, without collapsing them like GROUP BY does. Example: ROW_NUMBER() OVER (PARTITION BY dept ORDER BY salary DESC) assigns a rank within each department. Other common ones: RANK(), DENSE_RANK(), LAG(), LEAD(), SUM() OVER(), AVG() OVER(). Use them to compute running totals, rankings, or compare a row to its neighbours." },
      { q: "What is a CTE and when would you use one over a subquery?", a: "A Common Table Expression (WITH clause) names a temporary result set you can reference in the main query. Use CTEs for readability when the logic is complex or reused multiple times in the same query. They also allow recursion (WITH RECURSIVE) for hierarchical data. Subqueries are fine for simple, one-off filters — CTEs are better when the subquery is long or repeated." },
      { q: "What is the difference between WHERE and HAVING?", a: "WHERE filters rows before aggregation; HAVING filters groups after GROUP BY. You can't use aggregate functions (SUM, COUNT) in WHERE — that's what HAVING is for. Example: WHERE salary > 50000 filters individual rows; HAVING COUNT(*) > 5 filters groups that have more than 5 members." },
      { q: "What is an index and how does it affect query performance?", a: "An index is a data structure (usually a B-tree) that lets the database find rows without a full table scan. Indexes speed up reads on the indexed column(s) but slow down writes (INSERT/UPDATE/DELETE) because the index must be kept in sync. Add indexes on columns used in WHERE, JOIN, and ORDER BY clauses. Avoid over-indexing — profile with EXPLAIN/EXPLAIN ANALYZE first." },
      { q: "What is the difference between COUNT(*), COUNT(column), and COUNT(DISTINCT column)?", a: "COUNT(*) counts all rows including NULLs. COUNT(column) counts non-NULL values in that column. COUNT(DISTINCT column) counts unique non-NULL values. Use COUNT(*) to count rows, COUNT(column) to count populated values, and COUNT(DISTINCT column) to find cardinality." },
      { q: "How do you handle NULLs in SQL?", a: "NULL means unknown — comparisons with NULL always return NULL, not TRUE or FALSE, so use IS NULL / IS NOT NULL, not = NULL. Use COALESCE(col, default) to substitute a fallback value, NULLIF(a, b) to return NULL when two values are equal. NULLs are excluded from aggregate functions except COUNT(*). Document your NULL semantics in data models so analysts don't get surprised." },
      { q: "What is the difference between UNION and UNION ALL?", a: "UNION combines result sets from two queries and removes duplicate rows (expensive — requires a sort/hash). UNION ALL combines them and keeps all rows including duplicates (faster). Use UNION ALL by default unless you specifically need deduplication, since it avoids the extra sort step." },
      { q: "How do you use pandas to clean and aggregate data?", a: "Read data with pd.read_csv() / pd.read_sql(). Clean with df.dropna(), df.fillna(), df.astype(), and df.str.strip(). Filter with boolean indexing: df[df['col'] > 0]. Aggregate with df.groupby('category')['value'].agg(['sum','mean','count']). Merge DataFrames with pd.merge(df1, df2, on='key', how='left'). Reshape with pivot_table() or melt()." },
      { q: "What metrics would you use to measure the success of a new feature?", a: "Define a primary metric tied to the product goal (e.g. conversion rate, retention, revenue per user) and guardrail metrics to ensure you don't harm other things (e.g. load time, support tickets). Use a funnel to find where users drop off. Segment by user cohort, platform, and region. Run an A/B test if traffic allows — compare treatment vs. control using a t-test or chi-square test and check for statistical significance before concluding." },
      { q: "What is data normalisation and when would you denormalise?", a: "Normalisation removes data redundancy by splitting data into related tables (1NF → 2NF → 3NF), reducing update anomalies and storage. Denormalisation intentionally adds redundancy — e.g. pre-joining tables into a wide fact table — to speed up read-heavy analytical queries. Operational OLTP databases are usually normalised; analytical OLAP/data-warehouse schemas (star schema, snowflake) are denormalised for query performance." },
    ],
  },
  // ── Cloud / AWS ─────────────────────────────────────────────────────────────
  {
    slug: "cloud-aws",
    topic: "Cloud / AWS",
    title: "Cloud & AWS Interview Questions",
    description:
      "Cloud and AWS interview questions with answers — EC2, S3, Lambda, IAM, VPC, serverless, IaC, and cost optimisation. Practice live with an AI interviewer.",
    intro:
      "The AWS and cloud questions that come up most in cloud engineer, solutions architect, and DevOps interviews — covering core services, security, networking, and serverless — each with a clear answer. Then rehearse in a live mock.",
    questions: [
      { q: "What is the difference between EC2, ECS, and Lambda?", a: "EC2 gives you a virtual machine you fully control — OS, runtime, scaling. ECS runs Docker containers on a managed cluster (EC2-backed or Fargate serverless). Lambda is fully serverless — you provide a function, AWS handles everything else, and you pay only for invocation time. Choose EC2 for full control, ECS for containerised apps needing persistent processes, Lambda for event-driven, short-lived tasks." },
      { q: "Explain S3 storage classes and when to use each.", a: "S3 Standard is for frequently accessed data. Standard-IA (Infrequent Access) is cheaper for data accessed less than once a month, with a retrieval fee. Glacier Instant Retrieval is for archives needing millisecond access. Glacier Flexible / Deep Archive are for long-term cold storage (hours to retrieve). S3 Intelligent-Tiering auto-moves objects between tiers based on access patterns — good when access is unpredictable." },
      { q: "What is IAM and what are the principles of least privilege?", a: "IAM (Identity and Access Management) controls who can do what in your AWS account — users, groups, roles, and policies. Least privilege means granting only the minimum permissions required for a task: no wildcards (*) in actions or resources unless absolutely needed, use roles instead of long-lived access keys, and rotate credentials regularly. Use IAM Access Analyzer to detect overly permissive policies." },
      { q: "What is a VPC and how does subnetting work in AWS?", a: "A VPC (Virtual Private Cloud) is your isolated network in AWS. You divide it into subnets: public subnets have a route to an Internet Gateway (for things like load balancers and bastion hosts), private subnets don't (for databases and app servers). A NAT Gateway lets private subnets initiate outbound internet connections. Security Groups are stateful instance-level firewalls; NACLs are stateless subnet-level rules." },
      { q: "How does auto-scaling work in AWS?", a: "Auto Scaling Groups (ASG) automatically add or remove EC2 instances based on policies. Scale-out triggers: CPU > 70% for 5 minutes, queue depth, or custom CloudWatch metrics. Scale-in removes instances when load drops. Use Target Tracking policies (simplest — maintain a target metric), Step Scaling (step adjustments), or Scheduled Scaling for predictable patterns. ALBs distribute traffic across healthy instances." },
      { q: "What is CloudFormation / CDK and why use IaC?", a: "CloudFormation is AWS's declarative IaC service — you describe resources in JSON/YAML templates and AWS provisions them. CDK (Cloud Development Kit) lets you write infrastructure in TypeScript/Python/Java that compiles to CloudFormation. IaC benefits: version-controlled, repeatable, reviewable infrastructure; disaster recovery by re-deploying a stack; no manual console drift. Terraform is a popular cross-cloud alternative." },
      { q: "What is the difference between RDS and DynamoDB?", a: "RDS is managed relational database service (MySQL, Postgres, Aurora) — use it for structured data with complex joins, transactions, and SQL queries. DynamoDB is a managed NoSQL key-value and document store — use it for single-digit millisecond latency at any scale, simple access patterns (get by key, range query on sort key), and when you don't need joins. DynamoDB requires careful schema design upfront around your access patterns." },
      { q: "How do you secure an S3 bucket?", a: "Block all public access by default (Block Public Access setting). Use bucket policies to restrict access to specific IAM roles or VPC endpoints. Enable server-side encryption (SSE-S3 or SSE-KMS). Enable versioning and MFA Delete for critical buckets. Use S3 Access Logs and CloudTrail for auditing. Never embed AWS credentials in code — use IAM roles for compute services." },
      { q: "What is CloudFront and when do you use it?", a: "CloudFront is AWS's CDN — it caches content at edge locations globally to serve requests from the nearest location, reducing latency and origin load. Use it for static assets, frontend apps (SPA hosting via S3 + CloudFront), API responses that can be cached, and media streaming. It also provides DDoS protection via AWS Shield and can enforce HTTPS." },
      { q: "How do you reduce AWS costs in a growing application?", a: "Right-size EC2 instances (use AWS Compute Optimizer). Use Reserved Instances or Savings Plans for predictable workloads (up to 72% savings). Move to Spot Instances for fault-tolerant batch jobs. Use S3 Intelligent-Tiering and lifecycle rules to move old objects to Glacier. Use Lambda for intermittent workloads — you only pay per request. Set billing alarms in CloudWatch. Use Cost Explorer and Cost Allocation Tags to find waste by team or service." },
      { q: "What is Lambda cold start and how do you mitigate it?", a: "A cold start is the latency when AWS provisions a new Lambda execution environment (downloads code, starts runtime) for the first function invocation after idle time. Typical cold starts: 100ms–1s for compiled runtimes, lower for Node/Python. Mitigate with Provisioned Concurrency (keeps environments warm — costs more), keeping deployment packages small, using Snap Start (Java), or choosing a lighter runtime. For latency-sensitive APIs, Provisioned Concurrency or moving to always-on compute (ECS/Fargate) may be better." },
    ],
  },
  // ── QA / SDET ──────────────────────────────────────────────────────────────
  {
    slug: "qa-sdet",
    topic: "QA / SDET",
    title: "QA & SDET Interview Questions",
    description:
      "QA and SDET interview questions with answers — testing strategies, Selenium, Playwright, API testing, CI pipelines, and test design. Practice live with an AI interviewer.",
    intro:
      "The QA and SDET interview questions asked most in software testing roles — from test strategy and automation frameworks to API testing and CI pipelines — each with a clear answer. Practice them in a live AI mock.",
    questions: [
      { q: "What is the testing pyramid and why does it matter?", a: "The testing pyramid has unit tests at the base (many, fast, cheap), integration tests in the middle (fewer, test component interactions), and E2E tests at the top (few, slow, expensive). More tests at the base means faster feedback and cheaper maintenance. Teams that invert the pyramid (mostly E2E) end up with slow, flaky CI and high maintenance cost. The pyramid is a heuristic — adjust for your product, but always bias toward lower, faster tests." },
      { q: "What is the difference between functional and non-functional testing?", a: "Functional testing verifies what the system does — features, business logic, APIs (unit, integration, E2E, regression, smoke tests). Non-functional testing verifies how well it does it — performance/load testing, security testing, accessibility testing, usability testing, and reliability/chaos testing. Both are necessary; functional is usually higher priority early in a project, non-functional as the product matures." },
      { q: "How does Playwright differ from Selenium?", a: "Playwright is a modern E2E framework from Microsoft that controls browsers via the CDP/WebDriver BiDi protocol. It has auto-wait (no explicit waits needed), built-in support for multiple browsers (Chromium, Firefox, WebKit), network interception, and parallel test execution out of the box. Selenium is older, uses the WebDriver protocol, requires explicit waits, and needs extra setup for parallelism — but has a larger ecosystem and more language bindings. For new projects, Playwright is the better choice." },
      { q: "What is the Page Object Model (POM)?", a: "POM is a design pattern for UI test automation that represents each page (or component) as a class encapsulating its locators and actions. Tests interact with page objects, not raw selectors. Benefits: locators change in one place, tests are readable and DRY, and page logic is reusable. Use it with Playwright or Selenium to keep large test suites maintainable." },
      { q: "How do you test REST APIs?", a: "Manually explore with Postman or curl. Automate with tools like REST-assured (Java), requests + pytest (Python), or supertest (Node). Verify: status codes, response body schema (use JSON Schema or Pydantic), response time, error handling (4xx/5xx), authentication, and edge cases (empty input, large payloads, invalid types). Also test contract with consumer-driven contract tests (Pact) in microservice architectures." },
      { q: "What is flakiness in tests and how do you fix it?", a: "A flaky test sometimes passes and sometimes fails with no code change — caused by timing issues (explicit sleeps, animations), test isolation failures (shared state between tests), environment differences (network calls, random data, time zones), or order dependencies. Fix by using proper async waiting (waitFor, not sleep), mocking external dependencies, using independent test data, running tests in isolation, and quarantining known flaky tests while fixing them." },
      { q: "What is regression testing vs. smoke testing vs. sanity testing?", a: "Regression testing re-runs the full (or relevant) test suite after a change to ensure nothing broke. Smoke testing is a quick, shallow check that the most critical paths work after a deployment (is the app even up?). Sanity testing is a focused check on a specific bug fix or feature to confirm it works as expected before deeper testing. Smoke and sanity are subset checks; regression is comprehensive." },
      { q: "How do you integrate automated tests into a CI/CD pipeline?", a: "Run fast unit tests on every commit/PR (seconds). Run integration tests on PR merge or schedule (minutes). Run E2E/smoke tests on deployment to staging (minutes). Gate deployments on test passage. Use parallelism (pytest-xdist, Playwright sharding) to keep pipelines fast. Report results with JUnit XML for CI dashboards. Fail fast — put the fastest tests first so developers get feedback quickly." },
      { q: "What is test data management and why is it important?", a: "Test data management ensures each test has the data it needs to run independently and predictably. Strategies: create data in test setup and clean up after (factory pattern), use a dedicated test database seeded at build time, generate realistic data with libraries like Faker, and avoid sharing mutable state between tests. Poor test data is the #1 cause of test flakiness and environment dependency." },
      { q: "How do you approach testing a new feature you know nothing about?", a: "Start with requirements and acceptance criteria — ask 'what does done look like?' Identify happy-path scenarios first, then edge cases (empty input, max limits, invalid data), error scenarios, permission boundaries, and non-functional concerns (performance under load, accessibility). Explore manually to find unexpected behaviour, then automate the most important scenarios. Prioritise by risk: what's the worst thing that could go wrong?" },
      { q: "What is the difference between black-box, white-box, and grey-box testing?", a: "Black-box testing tests behaviour without knowledge of internal implementation — the tester knows inputs and expected outputs only (most E2E and acceptance tests). White-box testing tests internal logic — the tester knows the code and writes tests to cover specific paths and branches (unit tests). Grey-box is in between — partial knowledge of internals, used for integration and API testing. Choose based on what layer you're testing and your access to the codebase." },
    ],
  },
  // ── Product Manager ─────────────────────────────────────────────────────────
  {
    slug: "product-manager",
    topic: "Product Manager",
    title: "Product Manager Interview Questions",
    description:
      "Product manager interview questions with answers — product sense, prioritisation, metrics, estimation, roadmapping, and stakeholder management. Practice live with an AI interviewer.",
    intro:
      "The PM interview questions asked most at top tech companies — from product sense and metrics to prioritisation, estimation, and stakeholder management — each with a structured answer. Then practice in a live AI mock.",
    questions: [
      { q: "How do you prioritise a product backlog?", a: "Use a framework to make trade-offs explicit. RICE (Reach × Impact × Confidence ÷ Effort) gives a numeric score per initiative. ICE is similar but simpler. For strategic bets, use an Opportunity Solution Tree or outcome-based roadmap. Always align priorities with company OKRs, current user pain signals (support data, NPS, interviews), and engineering capacity. Communicate trade-offs clearly — what you're not doing is as important as what you are." },
      { q: "How do you define and measure success for a new feature?", a: "Start by tying success to a user or business outcome, not output (shipping the feature is not a metric). Define: a primary metric (e.g. 7-day retention, conversion rate, revenue), secondary metrics (engagement, NPS), and guardrail metrics (latency, error rate, churn). Measure before launch as a baseline, run an A/B test if traffic allows, and evaluate after a statistically significant period. A feature can ship and still fail if it doesn't move the metric." },
      { q: "Tell me about a product you admire and how you'd improve it.", a: "Pick something you genuinely use. Structure: (1) describe what it does and why it's well-designed, (2) identify a real user pain — with evidence (reviews, forums, your experience), (3) propose a specific, scoped improvement and explain why it solves that pain better than alternatives, (4) describe how you'd measure success. Interviewers want product thinking, user empathy, and clear reasoning — not the most elaborate idea." },
      { q: "How would you handle a conflict between what engineering says is feasible and what sales promised customers?", a: "First understand both sides fully — what specifically was promised and what is the engineering constraint? Then find options: can the commitment be partially met? Can a simpler version ship first? Get aligned on priority (is this customer relationship critical to the business?). Communicate transparently to both sides — don't hide bad news. If a promise can't be kept, the PM owns delivering that message to the customer with an alternative. Prevent recurrence by ensuring sales involves product before committing." },
      { q: "How do you write a good user story?", a: "Use the format: 'As a [user type], I want [goal] so that [reason/value].' A good story is small enough to ship in one sprint, testable (has acceptance criteria), valuable on its own, and negotiable (not a spec). Add acceptance criteria as concrete scenarios: Given/When/Then or a checklist. Include edge cases. The user story is a conversation starter, not a full specification — the detail lives in discussion." },
      { q: "How do you do estimation for a product you know nothing about?", a: "Use Fermi estimation: break the problem into components you can reason about, make explicit assumptions, and calculate bottom-up. Example for 'how many Uber rides in NYC per day': estimate population (8M), commuter %, Uber's market share, rides per commuter. Sanity-check against known data points. In PM interviews, the process matters more than the exact answer — show structured thinking, state your assumptions, and sense-check your answer." },
      { q: "How do you decide when a product is ready to launch?", a: "Define launch criteria before development: functional requirements (all P0 bugs fixed), non-functional (performance SLA met, accessibility checked), operational (monitoring, alerts, on-call runbook in place), business (legal review, pricing set, sales trained), and risk (rollout strategy — feature flag, canary, or full launch). A product is ready when all launch criteria are met — not when it's 'perfect.' Launch to a small segment first when in doubt." },
      { q: "How do you gather user insights to inform your roadmap?", a: "Combine qualitative and quantitative: user interviews (find out why), usability tests (watch people use the product), support ticket analysis and NPS comments (what's painful), surveys, A/B test results and funnel analytics (what people do). Use a Jobs-to-be-Done framework to understand motivations beyond stated preferences. Talk to sales and CS — they hear raw feedback daily. Synthesise into themes and map to roadmap opportunities." },
      { q: "What is a product roadmap and how do you communicate it to different audiences?", a: "A roadmap is a prioritised plan of what you're building and why, tied to outcomes — not a delivery schedule. For engineering: include problem context and acceptance criteria, give them flexibility on how. For executives: show how initiatives map to strategic goals and key metrics. For sales/CS: show what's coming and when, focusing on customer-facing value. Avoid committing to hard dates for items more than 2 quarters out — keep the roadmap outcome-oriented and revisable." },
      { q: "How do you work with data scientists and engineers on an ML feature?", a: "Define the problem jointly: what user outcome are we solving for, what does success look like, what data do we have? PMs own the 'why' and 'what' — DS/ML owns the 'how' for the model. Set evaluation criteria upfront (accuracy threshold, latency budget, fairness requirements). Plan for the full lifecycle: offline experiments → A/B test → monitoring for model drift. Be pragmatic — an 80% accurate model that ships beats a perfect model that's still in research." },
      { q: "How do you deal with a stakeholder who keeps changing requirements?", a: "Probe for the root cause — is it unclear goals, new information, external pressure, or scope creep? Establish a change process: changes after sprint start defer to the next sprint unless they're critical bugs. Document requirements formally so there's a shared reference. Improve upstream — involve stakeholders early in discovery to flush out changes before development starts. If it continues, escalate to leadership as a delivery risk, framing it in terms of impact on timelines and quality." },
    ],
  },
];


const bySlug = new Map(QUESTION_BANKS.map((b) => [b.slug, b]));

export function getQuestionBank(slug: string): QuestionBank | undefined {
  return bySlug.get(slug);
}

export const questionBankSlugs: string[] = QUESTION_BANKS.map((b) => b.slug);
