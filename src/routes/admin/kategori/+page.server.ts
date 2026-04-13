import { fail } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import { createAuditLog } from '$lib/server/audit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
    const kategori = await prisma.kategori.findMany({
        where: { isActive: true },
        orderBy: { id: 'desc' }
    });
    return { kategori };
};

export const actions: Actions = {
    create: async ({ request }) => {
        const data = await request.formData();
        const nama_kategori = data.get('nama_kategori')?.toString();

        if (!nama_kategori) {
            return fail(400, { error: 'Nama Kategori is required' });
        }

        await prisma.kategori.create({ data: { nama_kategori } });
        return { success: true };
    },
    update: async ({ request }) => {
        const data = await request.formData();
        const id = Number(data.get('id'));
        const nama_kategori = data.get('nama_kategori')?.toString();

        if (!id || !nama_kategori) {
            return fail(400, { error: 'ID and Nama Kategori are required' });
        }

        await prisma.kategori.update({
            where: { id },
            data: { nama_kategori }
        });
        return { success: true };
    },
    delete: async ({ request, locals }) => {
        const data = await request.formData();
        const id = Number(data.get('id'));

        if (!id) {
            return fail(400, { error: 'ID is required' });
        }

        // Get kategori info before deletion
        const kategori = await prisma.kategori.findUnique({ where: { id } });

        await prisma.kategori.update({
            where: { id },
            data: { isActive: false }
        });

        // Create audit log
        if (kategori) {
            await createAuditLog({
                userId: locals.user?.id || '',
                userName: locals.user?.name || 'Unknown',
                userRole: locals.user?.role || 'ADMIN',
                action: 'DELETE_KATEGORI',
                entity: 'KATEGORI',
                entityId: id.toString(),
                kategoriId: id,
                kategoriName: kategori.nama_kategori,
                oldValue: { nama_kategori: kategori.nama_kategori, isActive: true },
                newValue: { isActive: false },
                description: `Menghapus kategori ${kategori.nama_kategori}`,
                ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
                userAgent: request.headers.get('user-agent') || undefined
            });
        }

        return { success: true };
    }
};
