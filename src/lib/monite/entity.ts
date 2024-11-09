import { getMoniteInstance } from './config';
import type { EntityResponse, CreateEntityRequest, UpdateEntityRequest } from '@monite/sdk-api';

export class MoniteEntityError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MoniteEntityError';
  }
}

export async function createEntity(data: CreateEntityRequest): Promise<EntityResponse> {
  try {
    const monite = getMoniteInstance();
    const entity = await monite.entity.create(data);
    return entity;
  } catch (error) {
    console.error('Entity creation error:', error);
    throw new MoniteEntityError('Failed to create entity');
  }
}

export async function getEntityDetails(): Promise<EntityResponse> {
  try {
    const monite = getMoniteInstance();
    const entity = await monite.entity.getEntity();
    return entity;
  } catch (error) {
    console.error('Entity fetch error:', error);
    throw new MoniteEntityError('Failed to fetch entity details');
  }
}

export async function updateEntitySettings(
  entityId: string,
  data: UpdateEntityRequest
): Promise<EntityResponse> {
  try {
    const monite = getMoniteInstance();
    const updatedEntity = await monite.entity.update(entityId, data);
    return updatedEntity;
  } catch (error) {
    console.error('Entity update error:', error);
    throw new MoniteEntityError('Failed to update entity settings');
  }
}

export async function listEntities(params?: {
  limit?: number;
  offset?: number;
}): Promise<EntityResponse[]> {
  try {
    const monite = getMoniteInstance();
    const response = await monite.entity.getList(params);
    return response.data;
  } catch (error) {
    console.error('Entity list error:', error);
    throw new MoniteEntityError('Failed to fetch entities list');
  }
}

export async function deleteEntity(entityId: string): Promise<void> {
  try {
    const monite = getMoniteInstance();
    await monite.entity.delete(entityId);
  } catch (error) {
    console.error('Entity deletion error:', error);
    throw new MoniteEntityError('Failed to delete entity');
  }
}

export async function validateEntity(entityId: string): Promise<boolean> {
  try {
    const monite = getMoniteInstance();
    const entity = await monite.entity.getById(entityId);
    return !!entity && entity.id === entityId;
  } catch (error) {
    console.error('Entity validation error:', error);
    return false;
  }
}

export async function getEntitySettings(entityId: string): Promise<EntityResponse> {
  try {
    const monite = getMoniteInstance();
    const settings = await monite.entity.getById(entityId);
    return settings;
  } catch (error) {
    console.error('Entity settings fetch error:', error);
    throw new MoniteEntityError('Failed to fetch entity settings');
  }
}

export async function updateEntityStatus(
  entityId: string,
  status: 'active' | 'inactive'
): Promise<EntityResponse> {
  try {
    const monite = getMoniteInstance();
    const updatedEntity = await monite.entity.update(entityId, { status });
    return updatedEntity;
  } catch (error) {
    console.error('Entity status update error:', error);
    throw new MoniteEntityError('Failed to update entity status');
  }
}