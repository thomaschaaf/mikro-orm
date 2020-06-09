import { ObjectId } from 'mongodb';
import { Entity, PrimaryKey, PrimaryKeyProp, Property, SerializedPrimaryKey } from '@mikro-orm/core';

@Entity()
export class Test {

  @PrimaryKey()
  _id!: ObjectId;

  @SerializedPrimaryKey()
  id!: string;

  @Property({ type: 'string' })
  name!: string;

  @Property({ hidden: true })
  hiddenField? = Date.now();

  [PrimaryKeyProp]: '_id' | 'id';

}
