export default async function AltPage() {
  return (
    <div className="min-h-screen bg-black text-white font-mono text-lg leading-tight">
      <div className="bg-neutral-700 text-neutral-300 flex">
        <div className="px-[1ch]">mainnet</div>
        <div className="px-[1ch] bg-lime-400 text-black">goerli</div>
      </div>
      <div className="whitespace-pre p-[2ch]">{`      _   _      __     
  ___| |_| |__  / _|___ 
 / _ \\ __| '_ \\| |_/ __|
|  __/ |_| | | |  _\\__ \\
 \\___|\\__|_| |_|_| |___/
  Ethereum File System
`}</div>
      {/* <div className="whitespace-pre">
        <span className="text-neutral-500">{`├── `}</span>
        <span>{`hello
└── world
`}</span>
      </div> */}
      <div className="p-[2ch]">
        <div>ethfs/</div>
        <div>
          <span className="text-neutral-500">└──&nbsp;</span>goerli/
        </div>
        <table className="w-full max-w-4xl [&_td]:p-0">
          <tbody>
            <tr>
              <td className="w-0 text-neutral-500">
                &nbsp;&nbsp;&nbsp;&nbsp;├──&nbsp;
              </td>
              <td>canvas.css</td>
              <td>text/css</td>
              <td>0 KB</td>
              <td>188 days ago</td>
            </tr>
            <tr>
              <td className="w-0 text-neutral-500">
                &nbsp;&nbsp;&nbsp;&nbsp;└──&nbsp;
              </td>
              <td>canvas.css</td>
              <td>text/css</td>
              <td>0 KB</td>
              <td>188 days ago</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
