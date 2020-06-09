import { Dictionary, EntityType, IdentifiedReference, Primary, PrimaryProperty, Relation } from '../typings';
import { wrap } from './wrap';

export class Reference<T> implements Relation<T> {

  [EntityType]?: T;

  constructor(private entity: T) {
    this.set(entity);
    const wrapped = wrap(this.entity, true);

    wrapped.__meta.primaryKeys.forEach(primaryKey => {
      Object.defineProperty(this, primaryKey, {
        get() {
          return this.entity[primaryKey];
        },
      });
    });

    if (wrapped.__meta.serializedPrimaryKey && wrapped.__meta.primaryKeys[0] !== wrapped.__meta.serializedPrimaryKey) {
      Object.defineProperty(this, wrapped.__meta.serializedPrimaryKey, {
        get() {
          return wrap(this.entity, true).__serializedPrimaryKey;
        },
      });
    }
  }

  static create<T>(entity: T | IdentifiedReference<T>): IdentifiedReference<T> {
    if (entity instanceof Reference) {
      return entity;
    }

    return new Reference(entity) as IdentifiedReference<T>;
  }

  async load(): Promise<T>;
  async load<K extends keyof T>(prop: K): Promise<T[K]>;
  async load<K extends keyof T = never>(prop?: K): Promise<T | T[K]> {
    if (!this.isInitialized()) {
      await wrap(this.entity, true).init();
    }

    if (prop) {
      return this.entity[prop];
    }

    return this.entity;
  }

  set(entity: T | IdentifiedReference<T>): void {
    if (entity instanceof Reference) {
      entity = entity.unwrap();
    }

    this.entity = entity;
    Object.defineProperty(this, '$', { value: entity, writable: true });
    Object.defineProperty(this, 'get', { value: () => entity, writable: true });
  }

  unwrap(): T {
    return this.entity;
  }

  getEntity(): T {
    if (!this.isInitialized()) {
      throw new Error(`Reference<${wrap(this, true).__meta.name}> ${(wrap(this.entity, true).__primaryKey as unknown as Primary<T>)} not initialized`);
    }

    return this.entity;
  }

  getProperty<K extends keyof T>(prop: K): T[K] {
    return this.getEntity()[prop];
  }

  isInitialized(): boolean {
    return wrap(this.entity, true).isInitialized();
  }

  populated(populated?: boolean): void {
    wrap(this.entity, true).populated!(populated);
  }

  toJSON(...args: any[]): Dictionary {
    return wrap(this.entity).toJSON!(...args);
  }

}
