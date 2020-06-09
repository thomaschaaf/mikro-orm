import { ObjectId } from 'bson';
import { PrimaryKey, PrimaryKeyProp, SerializedPrimaryKey } from '@mikro-orm/core';

export abstract class BaseEntity3 {

  @PrimaryKey()
  _id!: ObjectId;

  @SerializedPrimaryKey()
  id!: string;

  [PrimaryKeyProp]: '_id' | 'id';

}
