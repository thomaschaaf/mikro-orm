import { Entity, ManyToOne, PrimaryKey, PrimaryKeyProp, Property } from '@mikro-orm/core';
import { Test2 } from './Test2';

@Entity()
export class Configuration2 {

  @PrimaryKey()
  property: string;

  @ManyToOne(() => Test2, { primary: true })
  test: Test2;

  @Property()
  value: string;

  [PrimaryKeyProp]: ['property', 'test'];

  constructor(test: Test2, property: string, value: string) {
    this.test = test;
    this.property = property;
    this.value = value;
  }

}
