// Скрипт для создания начальных данных Community
require('dotenv').config();
const mongoose = require('mongoose');
const { Group, Post, Comment } = require('./models/Community');
const User = require('./models/User');

async function seedCommunity() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');

    // Находим пользователя для создания контента
    const user = await User.findOne({});
    if (!user) {
      console.log('❌ No users found. Please register a user first.');
      process.exit(1);
    }
    console.log(`✅ Using user: ${user.firstName} ${user.lastName}`);

    // Создаем группы если их нет
    const existingGroups = await Group.countDocuments();
    if (existingGroups === 0) {
      const groups = [
        {
          name: 'თმის მოვლა 💇‍♀️',
          nameEn: 'Hair Care',
          description: 'ყველაფერი თმის მოვლის შესახებ - რჩევები, პროდუქტები, სალონები',
          descriptionEn: 'Everything about hair care - tips, products, salons',
          category: 'hair',
          icon: '💇‍♀️',
          creator: user._id,
          admins: [user._id],
          members: [user._id],
          memberCount: 1
        },
        {
          name: 'ნაილ არტი 💅',
          nameEn: 'Nail Art',
          description: 'მანიკური, პედიკური, ნაილ დიზაინი',
          descriptionEn: 'Manicure, pedicure, nail design',
          category: 'nails',
          icon: '💅',
          creator: user._id,
          admins: [user._id],
          members: [user._id],
          memberCount: 1
        },
        {
          name: 'სილამაზის რჩევები ✨',
          nameEn: 'Beauty Tips',
          description: 'გაზიარეთ სილამაზის საიდუმლოები და რჩევები',
          descriptionEn: 'Share beauty secrets and tips',
          category: 'beauty',
          icon: '✨',
          creator: user._id,
          admins: [user._id],
          members: [user._id],
          memberCount: 1
        }
      ];

      await Group.insertMany(groups);
      console.log('✅ Created 3 groups');
    } else {
      console.log(`ℹ️ Groups already exist: ${existingGroups}`);
    }

    // Создаем посты если их нет
    const existingPosts = await Post.countDocuments();
    if (existingPosts === 0) {
      const posts = [
        {
          author: user._id,
          content: '🌟 დღეს ვიყავი Berberis-ში და აბსოლუტურად მოხიბლული ვარ! ნაილებმა 2 კვირა გაძლო! რეკომენდაციას ვუწევ ყველას!',
          type: 'text',
          reactions: { like: [], love: [], haha: [], wow: [], sad: [], fire: [] },
          reactionCount: 0,
          commentCount: 0
        },
        {
          author: user._id,
          content: '💇‍♀️ ვინ იცნობს კარგ კოლორისტს თბილისში? ბალაიაჟი მინდა გავაკეთო, მაგრამ მინდა პროფესიონალს მივენდო',
          type: 'text',
          reactions: { like: [], love: [], haha: [], wow: [], sad: [], fire: [] },
          reactionCount: 0,
          commentCount: 0
        },
        {
          author: user._id,
          content: '✨ Beauty Pass-ის Pro გეგმა ნამდვილად ღირს! თვეში 4 პროცედურას ვაკეთებ და ძალიან ვზოგავ. თქვენ იყენებთ?',
          type: 'text',
          reactions: { like: [], love: [], haha: [], wow: [], sad: [], fire: [] },
          reactionCount: 0,
          commentCount: 0
        }
      ];

      await Post.insertMany(posts);
      console.log('✅ Created 3 posts');
    } else {
      console.log(`ℹ️ Posts already exist: ${existingPosts}`);
    }

    console.log('\n✅ Community seed completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

seedCommunity();
