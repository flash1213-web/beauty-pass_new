// fix-send2fa.js - Исправление функции send2FACode
const fs = require('fs');
const path = require('path');

const serverPath = path.join(__dirname, 'server.js');
let content = fs.readFileSync(serverPath, 'utf8');

const newSend2FACode = `async function send2FACode(user) {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = new Date(Date.now() + 5 * 60 * 1000); // 5 минут
  user.twoFACode = code;
  user.twoFACodeExpires = expires;
  await user.save();

  console.log(\`📧 Отправка 2FA кода на \${user.email}...\`);

  // Проверяем настройки email
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('❌ EMAIL_USER или EMAIL_PASS не настроены в .env!');
    console.log('');
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║  🔐 2FA CODE (no email config - console fallback)          ║');
    console.log('╠════════════════════════════════════════════════════════════╣');
    console.log(\`║  📧 Email: \${user.email}\`);
    console.log(\`║  🔑 CODE:  \${code}\`);
    console.log('╚════════════════════════════════════════════════════════════╝');
    console.log('');
    if (process.env.NODE_ENV !== 'production') {
      return code;
    }
    throw new Error('Email не настроен на сервере');
  }

  const nodemailer = require('nodemailer');
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: \`"Beauty Pass" <\${process.env.EMAIL_USER}>\`,
    to: user.email,
    subject: '🌸 Ваш код подтверждения Beauty Pass',
    html: \`
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
          <h2 style="color: #ff6b9d; text-align: center;">🌸 Beauty Pass</h2>
          <p style="font-size: 16px; color: #333;">გამარჯობა, \${user.firstName || user.login}!</p>
          <p style="font-size: 16px; color: #333;">თქვენი დადასტურების კოდი:</p>
          <div style="background-color: #ffe0e8; padding: 15px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; border-radius: 10px; margin: 20px 0; color: #ff6b9d;">
            \${code}
          </div>
          <p style="font-size: 14px; color: #888;">კოდი მოქმედებს 5 წუთი.</p>
          <p style="font-size: 14px; color: #888;">თუ თქვენ არ მოითხოვეთ კოდი, იგნორირება გაუკეთეთ ამ წერილს.</p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
          <p style="font-size: 12px; color: #aaa; text-align: center;">Beauty Pass - თქვენი სილამაზის პასპორტი 💅</p>
        </div>
      </div>
    \`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(\`✅ 2FA კოდი გაგზავნილია: \${user.email} (messageId: \${info.messageId})\`);
    return code;
  } catch (error) {
    console.error('❌ Email გაგზავნის შეცდომა:', error.message);
    console.log('');
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║  🔐 2FA CODE (email failed - console fallback)             ║');
    console.log('╠════════════════════════════════════════════════════════════╣');
    console.log(\`║  📧 Email: \${user.email}\`);
    console.log(\`║  🔑 CODE:  \${code}\`);
    console.log('╚════════════════════════════════════════════════════════════╝');
    console.log('');
    // В режиме разработки НЕ выбрасываем ошибку
    if (process.env.NODE_ENV !== 'production') {
      console.log('⚠️  Режим разработки: email не отправлен, но код сохранён в БД');
      return code;
    }
    throw new Error('კოდის გაგზავნა ვერ მოხერხდა. სცადეთ თავიდან.');
  }
}`;

// Находим и заменяем функцию send2FACode
const startPattern = /async function send2FACode\(user\) \{/;
const endPattern = /^}$/m;

// Найдём начало функции
const startMatch = content.match(startPattern);
if (!startMatch) {
  console.error('❌ Не найдено начало функции send2FACode');
  process.exit(1);
}

const startIndex = content.indexOf(startMatch[0]);
console.log('Начало функции найдено на позиции:', startIndex);

// Найдём конец функции (первая } на отдельной строке после определённой позиции)
let braceCount = 0;
let endIndex = -1;
let inFunction = false;

for (let i = startIndex; i < content.length; i++) {
  if (content[i] === '{') {
    braceCount++;
    inFunction = true;
  }
  if (content[i] === '}') {
    braceCount--;
    if (inFunction && braceCount === 0) {
      endIndex = i + 1;
      break;
    }
  }
}

if (endIndex === -1) {
  console.error('❌ Не найден конец функции send2FACode');
  process.exit(1);
}

console.log('Конец функции найден на позиции:', endIndex);

// Вырезаем старую функцию и вставляем новую
const before = content.substring(0, startIndex);
const after = content.substring(endIndex);

const newContent = before + newSend2FACode + after;

// Сохраняем
fs.writeFileSync(serverPath, newContent, 'utf8');
console.log('✅ Функция send2FACode успешно обновлена!');
