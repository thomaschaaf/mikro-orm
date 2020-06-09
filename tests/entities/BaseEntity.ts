import { ObjectId } from 'bson';
import { BeforeCreate, PrimaryKey, Property, SerializedPrimaryKey, BaseEntity as MikroBaseEntity, PrimaryKeyProp } from '@mikro-orm/core';

export abstract class BaseEntity<T extends BaseEntity<T>> extends MikroBaseEntity<T> {

  @PrimaryKey()
  _id!: ObjectId;

  @SerializedPrimaryKey()
  id!: string;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Property()
  foo?: string;

  @Property({ persist: false })
  hookTest = false;

  [PrimaryKeyProp]: 'id' | '_id';

  @BeforeCreate()
  baseBeforeCreate() {
    this.hookTest = true;
  }

}
