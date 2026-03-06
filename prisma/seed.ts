import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { hash } from '@node-rs/argon2';

// Setup database connection
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const hashOptions = {
	memoryCost: 19456,
	timeCost: 2,
	outputLen: 32,
	parallelism: 1
};

async function main() {
	// Create admin user
	const adminPassword = await hash('admin123456', hashOptions);
	const admin = await prisma.user.upsert({
		where: { email: 'admin@example.com' },
		update: {},
		create: {
			email: 'admin@example.com',
			password: adminPassword,
			name: 'Admin User',
			role: 'ADMIN'
		}
	});

	// Create staff user
	const staffPassword = await hash('staff123456', hashOptions);
	const staff = await prisma.user.upsert({
		where: { email: 'staff@example.com' },
		update: {},
		create: {
			email: 'staff@example.com',
			password: staffPassword,
			name: 'Staff User',
			role: 'STAFF'
		}
	});

	console.log('✅ Seed data created successfully!');
	console.log('\nTest Accounts:');
	console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
	console.log('Admin Account:');
	console.log('  Email: admin@example.com');
	console.log('  Password: admin123456');
	console.log('  Role: ADMIN');
	console.log('\nStaff Account:');
	console.log('  Email: staff@example.com');
	console.log('  Password: staff123456');
	console.log('  Role: STAFF');
	console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
