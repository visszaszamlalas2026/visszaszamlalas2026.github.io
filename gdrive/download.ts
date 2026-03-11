import fs from "node:fs";

const lines = fs.readFileSync('./gdown_logs.txt', 'utf-8')
  .split('\n')
  .filter((line) => line.startsWith('Processing file '))
  .filter((line) => /.*\d{4}-\d{2}-\d{2}.*/.test(line));

for (let line of lines) {
  const id = line.split(' ')[2];
  const isImage = line.includes('.jpg');
  const date = (line.match(/\d{4}-\d{2}-\d{2}/) as string[])[0];

  const downloadUrl = isImage ? `https://drive.usercontent.google.com/uc?id=${id}&export=download` : `https://docs.google.com/feeds/download/documents/export/Export?id=${id}&exportFormat=txt`;
  const targetFile = isImage ? `./${date}.jpg` : './' + line.split(' ').slice(3).join(' ') + '.txt';

  await fetch(downloadUrl, { redirect: 'follow' }).then(async (resp) => {
    await fs.writeFileSync(targetFile, Buffer.from(await resp.arrayBuffer()));
  });

  console.log({ targetFile });
}