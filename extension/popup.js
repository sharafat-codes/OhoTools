const SITE = "https://ohotool.com";

const listEl = document.getElementById("list");
const q = document.getElementById("q");

/** @type {{slug:string,name:string,tagline:string,category:string,keywords:string[]}[]} */
let tools = [];

function row(t) {
  const a = document.createElement("a");
  a.className = "row";
  a.href = `${SITE}/tools/${t.slug}`;
  a.target = "_blank";
  a.rel = "noopener";
  const name = document.createElement("span");
  name.className = "name";
  name.textContent = t.name;
  const cat = document.createElement("span");
  cat.className = "cat";
  cat.textContent = t.category || "";
  a.append(name, cat);
  return a;
}

function render(items) {
  listEl.innerHTML = "";
  if (!items.length) {
    const term = q.value.trim();
    const a = document.createElement("a");
    a.className = "empty";
    a.href = `${SITE}/request-tool${term ? `?q=${encodeURIComponent(term)}` : ""}`;
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = term ? `No match — request “${term}” →` : "No tools found";
    listEl.appendChild(a);
    return;
  }
  const frag = document.createDocumentFragment();
  for (const t of items.slice(0, 80)) frag.appendChild(row(t));
  listEl.appendChild(frag);
}

function filter() {
  const s = q.value.trim().toLowerCase();
  if (!s) return render(tools);
  const toks = s.split(/\s+/);
  render(
    tools.filter((t) => {
      const hay = `${t.name} ${t.tagline} ${t.category} ${(t.keywords || []).join(" ")}`.toLowerCase();
      return toks.every((tok) => hay.includes(tok));
    }),
  );
}

q.addEventListener("input", filter);
q.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const first = listEl.querySelector("a.row, a.empty");
    if (first) first.click();
  }
});

listEl.innerHTML = '<div class="msg">Loading tools…</div>';
fetch(`${SITE}/api/tools-index`)
  .then((r) => r.json())
  .then((data) => {
    tools = Array.isArray(data) ? data : [];
    render(tools);
  })
  .catch(() => {
    listEl.innerHTML = '<div class="msg">Couldn’t load tools. Open ohotool.com</div>';
  });
