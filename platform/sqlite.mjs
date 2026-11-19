import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";

// Local integration adapter: runs the exact same SQL and transactions as the Worker.
export function sqlite(path = ":memory:") {
  const db=new DatabaseSync(path);
  for (const file of ["0001_platform.sql","0002_media.sql"])
    db.exec(readFileSync(new URL("../migrations/"+file,import.meta.url),"utf8"));
  const DB={
    prepare(sql) {
      return { bind(...values) {
        const stmt=db.prepare(sql);
        const params=values.map(value=>value instanceof ArrayBuffer?new Uint8Array(value):value);
        return {
          first:async()=>stmt.get(...params) ?? null,
          all:async()=>({results:stmt.all(...params)}),
          run:async()=>({meta:{changes:stmt.run(...params).changes}}),
        };
      }};
    },
    async batch(statements) {
      db.exec("BEGIN");
      try {
        const results=[];
        for (const stmt of statements) results.push(await stmt.all());
        db.exec("COMMIT");
        return results;
      } catch(error) { db.exec("ROLLBACK"); throw error; }
    },
  };
  return {DB,db};
}
