import { EntityManager, FindOneOrFailOptions } from '../EntityManager';
import { EntityData, EntityName, AnyEntity, Primary } from '../typings';
import { QueryOrderMap } from '../enums';
import { FilterQuery, FindOneOptions, FindOptions, IdentifiedReference, Reference } from '..';

export class EntityRepository<T> {

  constructor(protected readonly em: EntityManager,
              protected readonly entityName: EntityName<T>) { }

  persist(entity: AnyEntity | AnyEntity[], flush?: false): void;
  persist(entity: AnyEntity | AnyEntity[], flush: true): Promise<void>;
  persist(entity: AnyEntity | AnyEntity[], flush = false): void | Promise<void> {
    return this.em.persist(entity, flush as true);
  }

  async persistAndFlush(entity: AnyEntity | AnyEntity[]): Promise<void> {
    await this.em.persistAndFlush(entity);
  }

  /**
   * @deprecated use `persist()`
   */
  persistLater(entity: AnyEntity | AnyEntity[]): void {
    this.em.persistLater(entity);
  }

  async findOne(where: FilterQuery<T>, options?: FindOneOptions<T>): Promise<T | null> {
    return this.em.findOne<T>(this.entityName, where, options);
  }

  async findOneOrFail(where: FilterQuery<T>, options?: FindOneOrFailOptions<T>): Promise<T> {
    return this.em.findOneOrFail<T>(this.entityName, where, options);
  }

  async find(where: FilterQuery<T>, options?: FindOptions<T>): Promise<T[]> {
    return this.em.find<T>(this.entityName, where as FilterQuery<T>, options);
  }

  async findAndCount(where: FilterQuery<T>, options?: FindOptions<T>): Promise<[T[], number]> {
    return this.em.findAndCount<T>(this.entityName, where as FilterQuery<T>, options);
  }

  async findAll(options?: FindOptions<T>): Promise<T[]> {
    return this.em.find<T>(this.entityName, {}, options);
  }

  remove(where: T | FilterQuery<T>, flush?: false): void;
  remove(where: T | FilterQuery<T>, flush: true): Promise<number>;
  remove(where: T | FilterQuery<T>, flush = false): void | Promise<number> {
    return this.em.remove(this.entityName, where, flush as true);
  }

  async removeAndFlush(entity: AnyEntity): Promise<void> {
    await this.em.removeAndFlush(entity);
  }

  /**
   * @deprecated use `remove()`
   */
  removeLater(entity: AnyEntity): void {
    // noinspection JSDeprecatedSymbols
    this.em.removeLater(entity);
  }

  async flush(): Promise<void> {
    return this.em.flush();
  }

  async nativeInsert(data: EntityData<T>): Promise<Primary<T>> {
    return this.em.nativeInsert<T>(this.entityName, data);
  }

  async nativeUpdate(where: FilterQuery<T>, data: EntityData<T>): Promise<number> {
    return this.em.nativeUpdate(this.entityName, where, data);
  }

  async nativeDelete(where: FilterQuery<T> | any): Promise<number> {
    return this.em.nativeDelete(this.entityName, where);
  }

  map(result: EntityData<T>): T {
    return this.em.map(this.entityName, result);
  }

  /**
   * Gets a reference to the entity identified by the given type and identifier without actually loading it, if the entity is not yet loaded
   */
  getReference<PK extends keyof T>(id: Primary<T>, wrapped: true): IdentifiedReference<T, PK>;
  getReference<PK extends keyof T = keyof T>(id: Primary<T>): T;
  getReference<PK extends keyof T = keyof T>(id: Primary<T>, wrapped: false): T;
  getReference<PK extends keyof T = keyof T>(id: Primary<T>, wrapped = false): T | Reference<T> {
    return this.em.getReference<T>(this.entityName, id, wrapped);
  }

  canPopulate(property: string): boolean {
    return this.em.canPopulate(this.entityName, property);
  }

  async populate(entities: T, populate: string | string[] | boolean, where?: FilterQuery<T>, orderBy?: QueryOrderMap, refresh?: boolean, validate?: boolean): Promise<T>;
  async populate(entities: T[], populate: string | string[] | boolean, where?: FilterQuery<T>, orderBy?: QueryOrderMap, refresh?: boolean, validate?: boolean): Promise<T[]>;
  async populate(entities: T | T[], populate: string | string[] | boolean, where: FilterQuery<T> = {}, orderBy: QueryOrderMap = {}, refresh = false, validate = true): Promise<T | T[]> {
    return this.em.populate<T>(entities as T, populate, where, orderBy, refresh, validate);
  }

  /**
   * Creates new instance of given entity and populates it with given data
   */
  create(data: EntityData<T>): T {
    return this.em.create<T>(this.entityName, data);
  }

  async count(where: FilterQuery<T> = {}): Promise<number> {
    return this.em.count<T>(this.entityName, where);
  }

}
