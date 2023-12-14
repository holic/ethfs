import { sql } from "../database";

export default async function HomePage() {
  const files = Array.from(
    await sql`
      SELECT
        name, created_at, size, metadata
      FROM files
      WHERE chain_id = 5`,
  );
  console.log("got files", files);
  return (
    <div>
      {files.map((file) => (
        <div key={file.name}>{file.name}</div>
      ))}
    </div>
  );
}
