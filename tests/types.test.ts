import { ObjectId } from 'mongodb';
import { FilterQuery, FilterValue, Primary, Query } from '../packages/core/src/typings';
import { Author2, Book2, BookTag2, FooParam2 } from './entities-sql';
import { Author, Book } from './entities';

describe('check typings', () => {

  test('Primary', async () => {
    let author2: Primary<Author2>;
    author2 = 1;
    author2 = {} as Author2;

    // @ts-expect-error
    author2 = '1';
    // @ts-expect-error
    author2 = {} as Book2;

    let book: Primary<Book2>;
    book = '1';
    book = {} as Book2;
    // @ts-expect-error
    book = 1;

    // object id allows string
    let author1: Primary<Author>;
    author1 = {} as ObjectId;
    author1 = '1';
    // @ts-expect-error
    author1 = 1;

    // bigint support
    let tag1: Primary<BookTag2>;
    tag1 = '1';
    tag1 = {} as BookTag2;
    // @ts-expect-error
    tag1 = 1;
  });

  test('FilterValue', async () => {
    let fv1: FilterValue<string>;
    fv1 = /1/;
    fv1 = '1';
    fv1 = null;
    fv1 = { $in: ['1', '2'] };
    // @ts-expect-error
    fv1 = 1;

    let fv2: FilterValue<number>;
    fv2 = 1;
    fv2 = null;
    fv2 = { $in: [1, 2] };
    // @ts-expect-error
    fv2 = { $in: ['1', '2'] };
    // @ts-expect-error
    fv2 = '1';

    let fv3: FilterValue<Date>;
    fv3 = new Date();
    fv3 = 123;
    fv3 = '2020-10-10';
    // @ts-expect-error
    fv3 = true;

    let fv4: FilterValue<RegExp>;
    // @ts-expect-error
    fv4 = new Date();
    fv4 = /123/;

    // allows collection item
    // let fv5: FilterValue<Collection<Book2>>;
    // fv5 = '1';
    // fv5 = 1;
    // fv5 = {} as Book2;
    // assert<Has<FilterValue<Collection<Book2>>, string>>(true);
    // assert<Has<FilterValue<Collection<Author2>>, number>>(true);
    // assert<Has<FilterValue<Collection<Author2>>, string>>(false);
    // assert<Has<FilterValue<Collection<Author2>>, Author2>>(true);
    // assert<Has<FilterValue<Collection<Author2>>, string[]>>(false);
    // assert<Has<FilterValue<Collection<Author2>>, Book2[]>>(false);
    // assert<Has<FilterValue<Author['books']>, ObjectId>>(true);
    // assert<Has<FilterValue<Collection<Book2>>, string>>(true);
    // assert<Has<FilterValue<Collection<Book>>, ObjectId>>(true);
    //
    // // allows entity/pk and arrays of entity/pk
    // assert<Has<FilterValue<Author2>, Author2>>(true);
    // assert<Has<FilterValue<Author2>, number>>(true);
    //
    // // date requires date
    // assert<Has<FilterValue<Author['born']>, Date>>(true);
    // assert<Has<FilterValue<Author['born']>, number>>(false);
    // assert<Has<FilterValue<Author['born']>, string>>(false);
  });

  test('Query', async () => {
    let q1: Query<Date | undefined>;
    q1 = new Date();
    q1 = 1;
    q1 = '1';

    let q2: Query<Author>;
    q2 = { born: new Date() };
    q2 = { born: 1 };
    q2 = { born: '1' };

    let q3: Query<Author2>;
    q3 = { favouriteBook: '1' };
    q3 = { favouriteBook: null };
    // @ts-expect-error
    q3 = { favouriteBook: 1 };
    q3 = { favouriteBook: { author: 1 } };
    q3 = { favouriteBook: { author: null } };
    // @ts-expect-error
    q3 = { favouriteBook: { author: '1' } };
    q3 = { books: { author: { born: '1' } }, favouriteBook: null };
    q3 = { books: { author: { born: 1 } }, favouriteBook: null };
    // @ts-expect-error
    q3 = { books: { author: { born: false } }, favouriteBook: null };
    q3 = { favouriteBook: { author: { born: new Date() } } };
    q3 = { favouriteBook: { author: { books: ['1', '2'] } } };
    q3 = { books: { author: { born: new Date() } } };
    q3 = { books: { author: { born: null } } };
    q3 = { favouriteBook: null };
    q3 = { favouriteBook: '1' };
    // @ts-expect-error
    q3 = { favouriteBook: 1 };
    q3 = { favouriteBook: {} as Book2 };
    q3 = { books: {} as Book2 };
    q3 = { books: '1' };
    q3 = { books: ['1',  '2'] };
    q3 = { books: {} as Book2 };
    q3 = { books: [] as Book2[] };
    q3 = { books: null };
    q3 = { books: { author: {} as Author2 }, favouriteBook: {} as Book2 };
    q3 = { books: { author: { born: new Date() } }, favouriteBook: null };
    q3 = { books: { author: { born: new Date() } }, favouriteBook: {} as Book2 };
    q3 = { books: { author: { born: new Date() } }, favouriteBook: null };
    q3 = { books: { author: { born: new Date() } }, favouriteBook: { title: null } };

    let q4: Query<Book2>;
    q4 = { author: { born: new Date() } };
    q4 = { author: { born: '1' } };
    q4 = { author: { born: 1 } };
    // @ts-expect-error
    q4 = { author: { born: false } };
    q4 = { author: { books: ['1', '2'] } };
    // @ts-expect-error
    q4 = { author: { born: new Date() }, favouriteBook: '1' };
    q4 = { author: { books: { publisher: 1 } } };
    q4 = { author: { books: { publisher: null } } };

    let t1: Query<Book2>;
    t1 = { author: { books: { publisher: 1 } } }; // ok
    // @ts-expect-error
    t1 = { author: { books: { publisher: '1' } } }; // should fail
    let t2: Query<Author2>;
    t2 = { age: { $gte: 1 } };
    t2 = { books: { author: { born: new Date() } }, favouriteBook: null };
  });

  test('FilterQuery', async () => {
    test('ok assignments', async () => {
      let ok01: FilterQuery<Author2>;
      ok01 = null;
      ok01 = 1;
      ok01 = {};
      ok01 = { born: new Date() };
      ok01 = { born: { $gte: new Date() } };
      ok01 = { age: { $gte: 1 } };
      ok01 = { favouriteBook: '1' };
      ok01 = { favouriteBook: ['1', '2'] };
      ok01 = { favouriteBook: null };
      ok01 = { books: { author: { born: new Date() } }, favouriteBook: null };
      ok01 = { books: { author: { born: new Date() } } };
      ok01 = { books: { author: { born: new Date() } }, favouriteBook: {} as Book2 };
      ok01 = { books: { tags: { name: 'asd' } } };
      ok01 = { books: { tags: '1' } };
      ok01 = { books: { tags: { books: { title: 'asd' } } } };
      ok01 = { name: 'asd' };
      ok01 = { $or: [{ name: 'asd' }, { age: 18 }] };
      ok01 = { books: { author: { born: 123 } }, favouriteBook: null };
      ok01 = { born: 123 };
      ok01 = { books: { author: { born: 123 } }, favouriteBook: null };
      ok01 = { books: { author: { born: '123' } }, favouriteBook: null };
      ok01 = { favouriteBook: null };
      ok01 = { books: { author: { name: 'asd' } } };
      ok01 = { books: { author: {} as Author2 } };
      ok01 = { books: { author: 123 } };
      ok01 = { books: { title: '123' }, favouriteBook: null };
      ok01 = { born: new Date() };
      ok01 = { age: { $in: [1] } };

      ok01 = { age: { $gte: 1 } };
      ok01 = { age: { $gte: 1 }, born: { $lt: new Date() }, $and: [{ name: { $ne: 'John' } }, { name: { $in: ['Ben', 'Paul'] } }] };
      ok01 = { favouriteBook: {} as Book2 };
      ok01 = { $and: [{ favouriteBook: {} as Book2 }, { name: '1' }] };
      ok01 = { $and: [{ favouriteBook: { title: '1' } }, { name: '1' }] };
      ok01 = { $and: [{ favouriteBook: '1' }, { name: '1' }] };
      ok01 = {} as Author2;
      ok01 = 1;
      ok01 = { favouriteBook: [] as Book2[] };
      ok01 = { books: { tags: [] as string[] } };
      ok01 = { books: { tags: '1' } };

      let ok02: FilterQuery<Book2>;
      ok02 = { publisher: { $ne: undefined } };
      ok02 = { publisher: { name: 'test' } };
      ok02 = { author: 123 };
      ok02 = { tags: ['1', '2'] };
      ok02 = { tags: '1' };
      ok02 = { author: { favouriteBook: [] as Book2[] } };
      ok02 = { author: { favouriteBook: { title: '1' } } };
      ok02 = { author: { favouriteBook: { tags: {} as BookTag2 } } };
      ok02 = { author: { favouriteBook: { tags: [] as BookTag2[] } } };
      ok02 = { author: { favouriteBook: { tags: ['1', '2'] } } };

      let ok03: FilterQuery<FooParam2>;
      ok03 = { bar: 1, baz: 2 };
      ok03 = { bar: { name: '1' }, baz: { name: '2' } };

      let ok04: FilterQuery<Book2>;
      ok04 = { publisher: 1 };
      ok04 = { publisher: { name: 'name' } };
      ok04 = { publisher: { name: /name/ } };
      ok04 = { publisher: { name: { $like: 'name' } } };
    });

    test('bad assignments', async () => {
      let fail01: FilterQuery<Author2>;
      // @ts-expect-error
      fail01 = '1';
      // @ts-expect-error
      fail01 = { age: { $gta: 1 } };
      // @ts-expect-error
      fail01 = { ago: { $gte: 1 } };
      // @ts-expect-error
      fail01 = { ago: { $gta: 1 } };
      // @ts-expect-error
      fail01 = { favouriteBook: 1 };
      // @ts-expect-error
      fail01 = { favouriteBook: 1 };
      // @ts-expect-error
      fail01 = { favouriteBook: [1, '2'] };
      // @ts-expect-error
      fail01 = { favouriteBook: [1, 2] };
      // @ts-expect-error
      fail01 = { books: { tags: { name: 1 } } };
      // @ts-expect-error
      fail01 = { books: { tags: true } };
      // @ts-expect-error
      fail01 = { books: { tags: { books: { title: 123 } } } };
      // @ts-expect-error
      fail01 = { books: { author: '123' } };
      // @ts-expect-error
      fail01 = { books: { title: 123 }, favouriteBook: null };
      // @ts-expect-error
      fail01 = { books: { title: new Date() }, favouriteBook: null };
      // @ts-expect-error
      fail01 = { born: false };
      // @ts-expect-error
      fail01 = { age: { $in: ['1'] } };
      // @ts-expect-error
      fail01 = { age: { $gta: ['1'] } };
    });
  });

});
