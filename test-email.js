// test-email.js - Тест отправки email
require('dotenv').config();
const nodemailer = require('nodemailer');

async function testEmail() {
  console.log('=== EMAIL TEST ===');
  console.log('EMAIL_USER:', process.env.EMAIL_USER);
  console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '***SET***' : 'NOT SET');
  
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('❌ EMAIL_USER или EMAIL_PASS не настроены!');
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Проверяем соединение
  console.log('\n📧 Проверка SMTP соединения...');
  try {
    await transporter.verify();
    console.log('✅ SMTP соединение успешно!');
  } catch (error) {
    console.error('❌ Ошибка SMTP:', error.message);
    console.error('Полная ошибка:', error);
    return;
  }

  // Отправляем тестовое письмо
  console.log('\n📧 Отправка тестового письма...');
  const testCode = Math.floor(100000 + Math.random() * 900000).toString();
  
  const mailOptions = {
    from: `"Beauty Pass Test" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER, // Отправляем самому себе
    subject: '🌸 TEST: Ваш код подтверждения Beauty Pass',
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
          <h2 style="color: #ff6b9d; text-align: center;">🌸 Beauty Pass</h2>
          <p style="font-size: 16px; color: #333;">Это тестовое письмо!</p>
          <p style="font-size: 16px; color: #333;">Тестовый код:</p>
          <div style="background-color: #ffe0e8; padding: 15px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; border-radius: 10px; margin: 20px 0; color: #ff6b9d;">
            ${testCode}
          </div>
          <p style="font-size: 14px; color: #888;">Если вы видите это письмо - email работает!</p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email отправлен успешно!');
    console.log('   Message ID:', info.messageId);
    console.log('   Response:', info.response);
    console.log('\n📬 Проверьте почту:', process.env.EMAIL_USER);
    console.log('   (также проверьте папку Spam)');
  } catch (error) {
    console.error('❌ Ошибка отправки email:', error.message);
    console.error('Полная ошибка:', error);
  }
}

testEmail();
