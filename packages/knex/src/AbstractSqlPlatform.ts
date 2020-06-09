import { AnyEntity, Constructor, EntityRepository, Platform } from '@mikro-orm/core';
import { SqlEntityRepository } from './SqlEntityRepository';
import { SchemaHelper } from './schema';

export abstract class AbstractSqlPlatform extends Platform {

  protected readonly schemaHelper?: SchemaHelper;

  usesPivotTable(): boolean {
    return true;
  }

  getRepositoryClass<T extends AnyEntity<T>>(): Constructor<EntityRepository<T>> {
    return SqlEntityRepository as Constructor<EntityRepository<T>>;
  }

  getSchemaHelper(): SchemaHelper | undefined {
    return this.schemaHelper;
  }

}
