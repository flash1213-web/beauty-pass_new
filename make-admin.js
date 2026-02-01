// make-admin.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const makeUserAdmin = async (loginOrPersonalNumber) => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('🔌 Подключились к БД...');

        const user = await User.findOne({ 
            $or: [
                { login: loginOrPersonalNumber },
                { personalNumber: loginOrPersonalNumber }
            ]
        });

        if (user) {
            user.isAdmin = true;
            await user.save();
            console.log(`✅ Пользователь ${user.login} теперь админ!`);
        } else {
            console.log('❌ Пользователь не найден. Проверьте правильность email/личного номера.');
        }
    } catch (error) {
        console.error('Произошла ошибка:', error);
    } finally {
        mongoose.connection.close();
        console.log('🔌 Соединение с БД закрыто.');
    }
};

// <<<< ВАЖНО: ЗАМЕНИТЕ 'ВАШ_ЛОГИН_ИЛИ_НОМЕР' НА ВАШИ ДАННЫЕ >>>>
makeUserAdmin('01027076162');