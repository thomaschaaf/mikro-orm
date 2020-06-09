import { ObjectId } from 'mongodb';
import { Entity, PrimaryKey, PrimaryKeyProp, Property, SerializedPrimaryKey } from '@mikro-orm/core';

@Entity()
export class Dup1 {

  @PrimaryKey({ type: 'ObjectId' })
  _id!: ObjectId;

  @SerializedPrimaryKey({ type: 'string' })
  id!: string;

  @Property({ type: 'string' })
  name1?: string;

  [PrimaryKeyProp]: 'id' | '_id';

}
