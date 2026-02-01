// seed-specialists.js - Добавляет тестовых специалистов к салонам

const mongoose = require('mongoose');
require('dotenv').config();

const Specialist = require('./models/Specialist');
const Salon = require('./models/Salon');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/beautypass';

// Грузинские имена специалистов
const specialistData = [
  {
    name: 'ნინო გელაშვილი',
    position: 'მანიკურის სპეციალისტი',
    description: 'მანიკურის და პედიკურის პროფესიონალი 8 წლიანი გამოცდილებით',
    photoUrl: 'https://randomuser.me/api/portraits/women/32.jpg',
    services: [
      { name: 'კლასიკური მანიკური', category: 'nails', duration: 45, bpPrice: 15 },
      { name: 'გელ-ლაქი', category: 'nails', duration: 60, bpPrice: 25 },
      { name: 'პედიკური', category: 'nails', duration: 50, bpPrice: 20 }
    ]
  },
  {
    name: 'თამარ ჯანელიძე',
    position: 'თმის სტილისტი',
    description: 'კრეატიული თმის სტილისტი, სპეციალიზაცია ბალაიაჟზე და ჰაირ კოლორინგზე',
    photoUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    services: [
      { name: 'თმის შეჭრა', category: 'hair', duration: 30, bpPrice: 20 },
      { name: 'ბალაიაჟი', category: 'hair', duration: 120, bpPrice: 80 },
      { name: 'თმის შეღებვა', category: 'hair', duration: 90, bpPrice: 50 },
      { name: 'თმის დალაგება', category: 'hair', duration: 40, bpPrice: 25 }
    ]
  },
  {
    name: 'მარიამ წიკლაური',
    position: 'კოსმეტოლოგი',
    description: 'სერტიფიცირებული კოსმეტოლოგი, კანის მოვლის ექსპერტი',
    photoUrl: 'https://randomuser.me/api/portraits/women/56.jpg',
    services: [
      { name: 'სახის გაწმენდა', category: 'face', duration: 60, bpPrice: 35 },
      { name: 'ანტი-ეიჯინგ პროცედურა', category: 'face', duration: 75, bpPrice: 60 },
      { name: 'მოლამის ნიღაბი', category: 'face', duration: 45, bpPrice: 30 }
    ]
  },
  {
    name: 'ანა ბერიძე',
    position: 'ვიზაჟისტი',
    description: 'პროფესიონალი ვიზაჟისტი, საქორწილო და საღამოს მაკიაჟის ექსპერტი',
    photoUrl: 'https://randomuser.me/api/portraits/women/68.jpg',
    services: [
      { name: 'დღის მაკიაჟი', category: 'makeup', duration: 45, bpPrice: 30 },
      { name: 'საღამოს მაკიაჟი', category: 'makeup', duration: 60, bpPrice: 50 },
      { name: 'საქორწილო მაკიაჟი', category: 'makeup', duration: 90, bpPrice: 100 }
    ]
  },
  {
    name: 'ეკა ლორთქიფანიძე',
    position: 'მასაჟისტი',
    description: 'სერტიფიცირებული მასაჟისტი, რელაქსაციის და თერაპიული მასაჟის სპეციალისტი',
    photoUrl: 'https://randomuser.me/api/portraits/women/72.jpg',
    services: [
      { name: 'რელაქს მასაჟი', category: 'body', duration: 60, bpPrice: 40 },
      { name: 'ანტი-ცელულიტური მასაჟი', category: 'body', duration: 45, bpPrice: 35 },
      { name: 'სტოუნ თერაპია', category: 'body', duration: 90, bpPrice: 70 }
    ]
  },
  {
    name: 'სალომე მაისურაძე',
    position: 'წამწამების სპეციალისტი',
    description: 'წამწამების გაფართოების ექსპერტი, 2D-6D ტექნიკები',
    photoUrl: 'https://randomuser.me/api/portraits/women/85.jpg',
    services: [
      { name: 'კლასიკური წამწამები', category: 'face', duration: 90, bpPrice: 50 },
      { name: '2D წამწამები', category: 'face', duration: 120, bpPrice: 70 },
      { name: 'წამწამების კორექცია', category: 'face', duration: 60, bpPrice: 30 }
    ]
  }
];

async function seedSpecialists() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connected');

    // Find all salons from Salon model
    const salons = await Salon.find({ isActive: true }).lean();
    console.log(`📋 Found ${salons.length} salons`);

    if (salons.length === 0) {
      console.log('❌ No salons found. Please add salons first.');
      await mongoose.connection.close();
      return;
    }

    // Clear existing specialists
    await Specialist.deleteMany({});
    console.log('🗑️ Cleared existing specialists');

    // Add specialists to each salon
    let totalAdded = 0;
    for (const salon of salons) {
      // Randomly select 2-4 specialists for each salon
      const numSpecialists = Math.floor(Math.random() * 3) + 2;
      const shuffled = [...specialistData].sort(() => Math.random() - 0.5);
      const selectedSpecialists = shuffled.slice(0, numSpecialists);

      for (const sp of selectedSpecialists) {
        const specialist = new Specialist({
          salonId: salon._id,
          name: sp.name,
          position: sp.position,
          description: sp.description,
          photoUrl: sp.photoUrl,
          services: sp.services,
          workingHours: {
            monday: { start: '10:00', end: '19:00', isWorking: true },
            tuesday: { start: '10:00', end: '19:00', isWorking: true },
            wednesday: { start: '10:00', end: '19:00', isWorking: true },
            thursday: { start: '10:00', end: '19:00', isWorking: true },
            friday: { start: '10:00', end: '19:00', isWorking: true },
            saturday: { start: '11:00', end: '17:00', isWorking: true },
            sunday: { start: '00:00', end: '00:00', isWorking: false }
          },
          isActive: true
        });
        await specialist.save();
        totalAdded++;
      }
      console.log(`   ✅ Added ${selectedSpecialists.length} specialists to "${salon.name}"`);
    }

    console.log(`\n🎉 Successfully added ${totalAdded} specialists to ${salons.length} salons!`);

    await mongoose.connection.close();
    console.log('✅ MongoDB disconnected');

  } catch (error) {
    console.error('❌ Error seeding specialists:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

seedSpecialists();
