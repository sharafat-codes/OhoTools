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
];

const bySlug = new Map(QUESTION_BANKS.map((b) => [b.slug, b]));

export function getQuestionBank(slug: string): QuestionBank | undefined {
  return bySlug.get(slug);
}

export const questionBankSlugs: string[] = QUESTION_BANKS.map((b) => b.slug);
