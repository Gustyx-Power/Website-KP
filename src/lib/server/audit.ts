import { prisma } from './prisma';

export type AuditAction = 
  | 'INBOUND' 
  | 'PENJUALAN' 
  | 'DISTRIBUSI_CREATE'
  | 'DISTRIBUSI_APPROVE'
  | 'DISTRIBUSI_REJECT'
  | 'RETUR_CREATE'
  | 'RETUR_APPROVE'
  | 'UPDATE_STOK' 
  | 'DELETE_USER'
  | 'DELETE_TOKO'
  | 'DELETE_KATEGORI';

export type AuditEntity = 
  | 'STOK' 
  | 'PENJUALAN' 
  | 'DISTRIBUSI' 
  | 'RETUR' 
  | 'USER' 
  | 'TOKO' 
  | 'KATEGORI';

interface CreateAuditLogParams {
  userId: string;
  userName: string;
  userRole: string;
  action: AuditAction;
  entity: AuditEntity;
  entityId?: string;
  tokoId?: number;
  tokoName?: string;
  kategoriId?: number;
  kategoriName?: string;
  oldValue?: any;
  newValue?: any;
  description: string;
  ipAddress?: string;
  userAgent?: string;
}

export async function createAuditLog(params: CreateAuditLogParams) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: params.userId,
        userName: params.userName,
        userRole: params.userRole,
        action: params.action,
        entity: params.entity,
        entityId: params.entityId,
        tokoId: params.tokoId,
        tokoName: params.tokoName,
        kategoriId: params.kategoriId,
        kategoriName: params.kategoriName,
        oldValue: params.oldValue ? JSON.stringify(params.oldValue) : null,
        newValue: params.newValue ? JSON.stringify(params.newValue) : null,
        description: params.description,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent
      }
    });
  } catch (error) {
    console.error('Failed to create audit log:', error);
    // Don't throw - audit log failure shouldn't break the main operation
  }
}
