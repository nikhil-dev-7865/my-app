import 'dotenv/config';
import { db } from './lib/prisma.js';

async function checkUsers() {
  try {
    const users = await db.user.findMany();
    console.log('Users in database:', users);
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}

checkUsers();