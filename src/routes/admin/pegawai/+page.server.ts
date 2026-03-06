import { fail } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import { hashPassword } from '$lib/server/auth';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
    // Fetch active users with their assigned store
    const users = await prisma.user.findMany({
        where: { isActive: true },
        include: { toko: true },
        orderBy: { createdAt: 'desc' }
    });

    // Fetch active stores to populate the select dropdown when assigning a user to a store
    const tokos = await prisma.toko.findMany({
        where: { isActive: true },
        orderBy: { nama_toko: 'asc' }
    });

    return { users, tokos };
};

export const actions: Actions = {
    create: async ({ request }) => {
        const data = await request.formData();
        const name = data.get('name')?.toString();
        const email = data.get('email')?.toString();
        const role = data.get('role')?.toString() as 'OWNER' | 'ADMIN' | 'KASIR';
        const password = data.get('password')?.toString();
        const tokoIdStr = data.get('tokoId')?.toString();

        if (!name || !email || !role || !password) {
            return fail(400, { error: 'Nama, Email, Role, dan Password wajib diisi!' });
        }

        // Validate email uniqueness
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return fail(400, { error: 'Email sudah terdaftar!' });
        }

        const tokoId = tokoIdStr && tokoIdStr !== '' ? Number(tokoIdStr) : null;

        // Hash password
        const hashedPassword = await hashPassword(password);

        await prisma.user.create({
            data: {
                name,
                email,
                role,
                password: hashedPassword,
                tokoId
            }
        });

        return { success: true };
    },
    
    update: async ({ request }) => {
        const data = await request.formData();
        const id = data.get('id')?.toString();
        const name = data.get('name')?.toString();
        const role = data.get('role')?.toString() as 'OWNER' | 'ADMIN' | 'KASIR';
        const tokoIdStr = data.get('tokoId')?.toString();
        const newPassword = data.get('password')?.toString();

        if (!id || !name || !role) {
            return fail(400, { error: 'Data tidak lengkap.' });
        }

        const tokoId = tokoIdStr && tokoIdStr !== '' ? Number(tokoIdStr) : null;

        const updateData: any = { name, role, tokoId: tokoId === 0 ? null : tokoId };
        
        // Update password if provided
        if (newPassword && newPassword.trim() !== '') {
            updateData.password = await hashPassword(newPassword);
        }

        await prisma.user.update({
            where: { id },
            data: updateData
        });

        return { success: true };
    },

    delete: async ({ request, locals }) => {
        const data = await request.formData();
        const id = data.get('id')?.toString();

        if (!id) {
            return fail(400, { error: 'ID user tidak ditemukan.' });
        }
        
        // Prevent deleting yourself
        if (id === locals.user?.id) {
            return fail(400, { error: 'Anda tidak bisa menghapus akun sendiri.' });
        }

        // Soft delete
        await prisma.user.update({
            where: { id },
            data: { isActive: false }
        });

        return { success: true };
    }
};
