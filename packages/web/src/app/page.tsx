import { sql } from "../database";

export default async function HomePage() {
  const files = Array.from(
    await sql`
      SELECT
        filename, block_time as "createdAt", size, metadata
      FROM files_created
      WHERE chain_id = 5
      ORDER BY block_time DESC
    `,
  );

  console.log("got files", files);

  return (
    <div>
      {files.map((file) => (
        <div key={file.filename}>
          {file.filename} {new Date(file.createdAt * 1000).toLocaleString()}
        </div>
      ))}
    </div>
  );
}
