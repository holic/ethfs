import postgres, { PendingQuery, Row, Sql } from "postgres";

export const sql = postgres(process.env.DATABASE_URL!, { debug: true });

export function and(
  sql: Sql,
  conditions: (PendingQuery<Row[]> | null | undefined)[],
): PendingQuery<Row[]> {
  return sql`(${conditions
    .filter(
      (condition): condition is Exclude<typeof condition, null | undefined> =>
        condition != null,
    )
    .reduce((query, condition) => sql`${query} AND ${condition}`)})`;
}

export function or(
  sql: Sql,
  conditions: (PendingQuery<Row[]> | null | undefined)[],
): PendingQuery<Row[]> {
  return sql`(${conditions
    .filter(
      (condition): condition is Exclude<typeof condition, null | undefined> =>
        condition != null,
    )
    .reduce((query, condition) => sql`${query} OR ${condition}`)})`;
}
