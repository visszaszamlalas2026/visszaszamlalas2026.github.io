import https from "node:https";
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

  console.log({ id, isImage, date, targetFile, downloadUrl });

  const downloadFile = async (url: string, target: string, cookie: string = '') => {
    await new Promise(async (resolve, reject) => {
      https.get(url, {
        headers: {
          Cookie: cookie
        }
      }, async (res) => {

        console.log({ get: url, h: res.headers });

        switch (res.statusCode) {
          case 307: await downloadFile(url, res.headers.location as string, res.headers["set-cookie"] && res.headers["set-cookie"].length > 0 ? res.headers["set-cookie"].at(0) : '').then(resolve).catch(reject); break;
          case 200: res.pipe(fs.createWriteStream(target))
            .on('finish', resolve)
            .on('error', reject); break;
          default: throw new Error(res.statusCode?.toString());
        }
      }).on('error', reject);
    });
  };

  await downloadFile(downloadUrl, targetFile);
}