import { MetadataStorage } from '../metadata';
import { Utils } from '../utils';
import { Cascade, EntityValidator, ReferenceType, LoadStrategy } from '../entity';
import { EntityName, EntityProperty, AnyEntity, Constructor } from '../typings';
import { Type } from '../types';

// allow `any` in the target so we get around `Value of type 'typeof Address1' has no properties in common with type 'AnyEntity<any>'. Did you mean to call it?`
// this allows to not require `PrimaryKeyProp` in embeddables (where only @Property decorator is allowed), but be strict in the regular entities, where we need it
// in other words, it allows to require `PrimaryKeyProp` only when some additional properties are defined (when other than `@Property` decorator is used)
export function Property<T extends AnyEntity<T>>(options: PropertyOptions<T> = {}): (target: T | unknown, propertyName: string) => void {
  return function (target: T | unknown, propertyName: string) {
    const meta = MetadataStorage.getMetadataFromDecorator((target as T).constructor);
    const desc = Object.getOwnPropertyDescriptor(target, propertyName) || {};
    EntityValidator.validateSingleDecorator(meta, propertyName);
    const name = options.name || propertyName;

    if (propertyName !== name && !(desc.value instanceof Function)) {
      Utils.renameKey(options, 'name', 'fieldName');
    }

    options.name = propertyName;
    const prop = Object.assign({ reference: ReferenceType.SCALAR }, options) as EntityProperty;
    prop.getter = !!desc.get;
    prop.setter = !!desc.set;

    if (desc.value instanceof Function) {
      prop.getter = true;
      prop.persist = false;
      prop.type = 'method';
      prop.getterName = propertyName;
      prop.name = name;
    }

    meta.properties[prop.name] = prop;
  };
}

export type PropertyOptions<T> = {
  name?: string;
  fieldName?: string;
  fieldNames?: string[];
  customType?: Type<any>;
  columnType?: string;
  type?: 'string' | 'number' | 'boolean' | 'bigint' | 'ObjectId' | string | unknown | bigint | Date | Constructor<Type<any>> | Type<any>;
  length?: number;
  onCreate?: (entity: T) => any;
  onUpdate?: (entity: T) => any;
  default?: string | number | boolean | null;
  defaultRaw?: string;
  formula?: string | ((alias: string) => string);
  nullable?: boolean;
  unsigned?: boolean;
  persist?: boolean;
  hidden?: boolean;
  version?: boolean;
  index?: boolean | string;
  unique?: boolean | string;
  lazy?: boolean;
  primary?: boolean;
  serializedPrimaryKey?: boolean;
};

export interface ReferenceOptions<T, O> extends PropertyOptions<O> {
  entity?: string | (() => EntityName<T>);
  cascade?: Cascade[];
  eager?: boolean;
  strategy?: LoadStrategy;
}
