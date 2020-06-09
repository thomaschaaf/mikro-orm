import { EntityManager, FindOneOrFailOptions } from '../EntityManager';
import { EntityData, EntityName, AnyEntity, Primary, IdentifiedReference, Loaded } from '../typings';
import { QueryOrderMap } from '../enums';
import { FilterQuery, FindOneOptions, FindOptions, Populate, Reference } from '..';

export class EntityRepository<T extends AnyEntity<T>> {

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

  async findOne<P extends Populate<T> = []>(where: FilterQuery<T>, options?: FindOneOptions<T, P>): Promise<Loaded<T, P> | null> {
    return this.em.findOne<T, P>(this.entityName, where, options);
  }

  async findOneOrFail<P extends Populate<T> = []>(where: FilterQuery<T>, options?: FindOneOrFailOptions<T, P>): Promise<Loaded<T, P>> {
    return this.em.findOneOrFail<T, P>(this.entityName, where, options);
  }

  async find<P extends Populate<T> = []>(where: FilterQuery<T>, options?: FindOptions<T, P>): Promise<Loaded<T, P>[]> {
    return this.em.find<T, P>(this.entityName, where, options);
  }

  async findAndCount<P extends Populate<T> = []>(where: FilterQuery<T>, options?: FindOptions<T, P>): Promise<[T[], number]> {
    return this.em.findAndCount<T, P>(this.entityName, where, options);
  }

  async findAll<P extends Populate<T> = []>(options?: FindOptions<T, P>): Promise<Loaded<T, P>[]> {
    return this.em.find<T, P>(this.entityName, {}, options);
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
  getReference(id: Primary<T>, wrapped: true): IdentifiedReference<T>;
  getReference(id: Primary<T>): T;
  getReference(id: Primary<T>, wrapped: false): T;
  getReference(id: Primary<T>, wrapped = false): T | Reference<T> {
    return this.em.getReference<T>(this.entityName, id, wrapped);
  }

  canPopulate(property: string): boolean {
    return this.em.canPopulate(this.entityName, property);
  }

  async populate<P extends Populate<T> = []>(entities: T[], populate: P, where: FilterQuery<T> = {}, orderBy: QueryOrderMap = {}, refresh = false, validate = true): Promise<Loaded<T, P>[]> {
    return this.em.populate<T, P>(entities, populate, where, orderBy, refresh, validate);
  }

  async populateOne<T, P extends Populate<T> = []>(entity: T, populate: P, where: FilterQuery<T> = {}, orderBy: QueryOrderMap = {}, refresh = false, validate = true): Promise<Loaded<T, P>> {
    return this.em.populateOne<T, P>(entity, populate, where, orderBy, refresh, validate);
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
