import { ObjectId } from '@mikro-orm/mongodb';
import { BaseEntity, PrimaryKey, PrimaryKeyProp, SerializedPrimaryKey } from '@mikro-orm/core';

export abstract class BaseEntity3 extends BaseEntity<BaseEntity3>{

  @PrimaryKey()
  _id!: ObjectId;

  @SerializedPrimaryKey()
  id!: string;

  [PrimaryKeyProp]: 'id' | '_id';

}
