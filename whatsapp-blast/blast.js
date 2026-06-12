const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const ExcelJS = require('exceljs');
const config = require('./config');

function normalizeNumber(raw) {
  let n = String(raw).trim().replace(/\D/g, '');
  if (!n.startsWith('60')) {
    if (n.startsWith('0')) n = '60' + n.slice(1);
    else n = '60' + n;
  }
  return n + '@c.us';
}

async function loadNumbers() {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(config.excelPath);
  const sheet = workbook.getWorksheet(config.sheetName);
  const numbers = [];
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber < config.startRow) return;
    const val = row.getCell(1).value;
    if (val) numbers.push(String(val));
  });
  return numbers;
}

async function main() {
  const numbers = await loadNumbers();
  console.log(`Loaded ${numbers.length} numbers starting from entry #11.`);

  const client = new Client({
    authStrategy: new LocalAuth({ dataPath: __dirname + '/.wwebjs_auth' }),
  });

  client.on('qr', (qr) => {
    console.log('Scan this QR code with WhatsApp (Linked Devices) on your phone:');
    qrcode.generate(qr, { small: true });
  });

  client.on('ready', async () => {
    console.log('WhatsApp client ready. Starting blast...');

    for (const raw of numbers) {
      const chatId = normalizeNumber(raw);
      try {
        const isRegistered = await client.isRegisteredUser(chatId);
        if (!isRegistered) {
          console.log(`SKIP ${raw} - not a WhatsApp user`);
          continue;
        }
        await client.sendMessage(chatId, config.message);
        console.log(`SENT -> ${raw}`);
      } catch (err) {
        console.log(`FAILED -> ${raw}: ${err.message}`);
      }
      await new Promise((r) => setTimeout(r, config.delayMs));
    }

    console.log('Blast complete.');
    process.exit(0);
  });

  client.initialize();
}

main();
