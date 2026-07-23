"use client";

import * as React from "react";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/copy-button";

const selectClass =
  "h-9 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

const DIALECTS = [
  { value: "sql", label: "Standard SQL" },
  { value: "mysql", label: "MySQL" },
  { value: "postgresql", label: "PostgreSQL" },
  { value: "mariadb", label: "MariaDB" },
  { value: "sqlite", label: "SQLite" },
  { value: "bigquery", label: "BigQuery" },
  { value: "tsql", label: "SQL Server (T-SQL)" },
  { value: "plsql", label: "Oracle (PL/SQL)" },
];

const EXAMPLE =
  "select u.id, u.name, count(o.id) as orders from users u left join orders o on o.user_id=u.id where u.active=1 group by u.id, u.name having count(o.id)>3 order by orders desc limit 10;";

export function SqlFormatter() {
  const [input, setInput] = React.useState("");
  const [dialect, setDialect] = React.useState("sql");
  const [output, setOutput] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  async function format() {
    if (!input.trim()) {
      setError("Paste some SQL first.");
      setOutput("");
      return;
    }
    try {
      const { format: formatSql } = await import("sql-formatter");
      setOutput(formatSql(input, { language: dialect as never }));
      setError(null);
    } catch (e) {
      setError((e as Error).message || "Could not format that SQL.");
      setOutput("");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="sqlf-in">SQL</Label>
        <Textarea
          id="sqlf-in"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="SELECT * FROM users WHERE active = 1;"
          className="min-h-32 font-mono text-xs"
        />
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="sqlf-dialect">Dialect</Label>
          <select id="sqlf-dialect" value={dialect} onChange={(e) => setDialect(e.target.value)} className={selectClass}>
            {DIALECTS.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </div>
        <Button className="mb-0.5" onClick={format}>Format SQL</Button>
        <Button variant="outline" size="sm" className="mb-0.5" onClick={() => { setInput(EXAMPLE); setOutput(""); setError(null); }}>
          Try example
        </Button>
        <Button variant="ghost" size="sm" className="mb-0.5" onClick={() => { setInput(""); setOutput(""); setError(null); }}>
          Clear
        </Button>
      </div>

      {error && <p className="text-sm text-destructive break-words">{error}</p>}

      {output && (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="sqlf-out">Formatted</Label>
            <CopyButton value={output} label="" />
          </div>
          <pre className="max-h-96 overflow-auto rounded-lg bg-muted p-3 text-xs">
            <code className="font-mono">{output}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
