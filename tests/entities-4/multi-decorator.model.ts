import { Entity, ManyToOne, PrimaryKey, PrimaryKeyProp, Property } from '@mikro-orm/core';

@Entity()
export class MultiDecorator {

  @PrimaryKey()
  id!: number;

  @Property({ type: 'string' })
  @ManyToOne({ type: 'Foo' })
  name: any;

  [PrimaryKeyProp]: 'id';

}
