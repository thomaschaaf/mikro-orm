import { Cascade, Entity, ManyToMany, ManyToOne, PrimaryKeyProp, Property } from '@mikro-orm/core';
import { Publisher } from './Publisher';
import { Author } from './Author';
import { BookTag } from './BookTag';
import { Collection, IdentifiedReference } from '../TsMorphMetadataProvider.test';
import { BaseEntity3 } from './BaseEntity3';

@Entity()
export class Book extends BaseEntity3 {

  @Property()
  title: string;

  @ManyToOne()
  author: Author;

  @ManyToOne({ cascade: [Cascade.PERSIST, Cascade.REMOVE] })
  publisher!: IdentifiedReference<Publisher>;

  @ManyToMany()
  tags: Collection<BookTag> = new Collection<BookTag>(this);

  @Property()
  metaObject?: unknown;

  @Property()
  metaArray?: any[];

  @Property()
  metaArrayOfStrings?: string[];

  [PrimaryKeyProp]: '_id' | 'id';

  constructor(title: string, author?: Author) {
    super();
    this.title = title;
    this.author = author!;
  }

}
