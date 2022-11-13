import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
  if (!req.query.id) res.status(404).send("File Not Found");

  const response = await fetch(
    "https://api.thegraph.com/subgraphs/name/holic/ocfs-goerli",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query File($id: ID!) {
            file(id: $id) {
              id
              contents
              type
              encoding
              compression
            }
          }
        `,
        variables: {
          id: req.query.id,
        },
      }),
    }
  );
  const {
    data: { file },
  } = await response.json();
  res.setHeader("Content-Type", `${file.type}; charset=UTF-8`);
  // console.log(
  //   file.encoding,
  //   Buffer.from(file.contents, file.encoding).slice(0, 10)
  // );
  const buffer = Buffer.from(
    file.contents,
    req.query.raw ? null : file.encoding
  );
  if (req.query.buffer) {
    res.json(Array.from(buffer));
  } else {
    res.send(buffer);
  }
};

export default handler;
