/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {Collection as ICollection} from '@tsdotnet/collection-base';
import NotImplementedException from '@tsdotnet/exceptions';

/*
 * This is a reusable set of unit test for use with any ICollection to ensure all features of that ICollection function properly.
 */

export function General<T> (
	collection: ICollection<string>): void
{
	const count = collection.count;

	describe('.count', () => {
		assertIsNumber(count);
	});
}

function assertIsNumber (value: any, message: string = 'should be a real number')
{
	expect(!isNaN(value)).withContext(message).toBeTrue();
}

function assertAdding<T> (c: ICollection<T>, a: T[])
{
	it('.add(value)', () => {
		let count: number;
		for(const v of a)
		{
			assertIsNumber(count = c.count, 'before adding');
			c.add(v);
			assertIsNumber(c.count, 'after adding');
			expect(c.count)
				.withContext('\'count\' should have incremented')
				.toBe(count + 1);
			expect(c.contains(v))
				.withContext('\'value\' must exist after adding')
				.toBeTrue();
		}
	});
}

function assertCopyToClear<T> (c: ICollection<T>)
{
	it('.copyTo(other) & .clear()', () => {
		const count: number = c.count;
		assertIsNumber(count);
		if(count<2) throw 'Can\'t assert \'.copyTo()\' or \'.clear()\' without at least (2) entries.';

		const a: T[] = [];

		c.copyTo(a);
		assertIsNumber(c.count, 'count');
		expect(a.length)
			.withContext('An empty array\'s length should match the count if copied to.')
			.toBe(count);
		c.clear();
		expect(c.count)
			.withContext('A collection\'s count should be zero after calling \'.clear()\'.')
			.toBe(0);

		// Restore contents.
		for(const v of a) c.add(v);

		const extraSize = 10;
		const b = new Array<T>(count + extraSize);

		c.copyTo(b, 1);
		expect(b.length)
			.withContext('An array\'s length should be equal to it\'s original length if the count added does not exceed the length.')
			.toBe(count + extraSize);
		c.copyTo(b, count + extraSize - 1);
		expect(b.length)
			.withContext('An array\'s length should be equal to index+count if the count exceeds the length.')
			.toBe(2*count + extraSize - 1);
		c.clear();
		expect(c.count)
			.withContext('A collection\'s count should be zero after calling \'.clear()\'.')
			.toBe(0);

		// Restore contents.
		for(const v of a) c.add(v);
		expect(c.count)
			.withContext('A collection\'s count should be equal to the number of items added.')
			.toBe(a.length);
	});

}

function assertRemoving<T> (c: ICollection<T>)
{
	it('.remove(values)', () => {

		let count: number;
		assertIsNumber(count = c.count);
		if(c.count<2) throw 'Can\'t assert \'.remove()\' without at least (2) entries.';

		const a: T[] = [];
		c.copyTo(a);
		assertIsNumber(c.count);

		try
		{
			for(const v of a)
			{
				count -= c.remove(v); // More than one instance can exist and it should remove both.
				assertIsNumber(c.count, 'after removing');
				expect(c.count)
					.withContext('\'count\' should increment after removing.')
					.toBe(count);
				expect(c.contains(v))
					.withContext('\'value\' must not exist after removing.')
					.toBeFalse();
			}
		}
		catch(ex)
		{
			if((ex) instanceof (NotImplementedException))
			{
				//console.log(ex);
			}
			else
			{
				throw ex;
			}
		}
	});

}

export function Collection<T> (
	name: string,
	collection: ICollection<T>,
	sourceValues: T[]): void
{
	if(sourceValues.indexOf(null as any)!= -1)
		throw 'Source values should not contain null as checking against null is one of the tests.';

	/* The following tests inherently test:
	 - count
	 - contains
	 */
	describe(name, () => {
		assertAdding(collection, sourceValues);
		assertCopyToClear(collection);
		assertRemoving(collection);
		it('equality comparison should be strict', () => {
			expect(collection.contains(null as any)).toBeFalse();
		});
		it('should throw if modified while iterating.', () => {
			expect(() => {
				for(const e of collection)
				{
					collection.add(e);
				}
			}).toThrow();
		});
	});

}

export function StringCollection (
	name: string,
	collection: ICollection<string>): void
{

	//noinspection SpellCheckingInspection
	Collection(name + '<' + 'string>', collection, [
		'',
		'lorem',
		'ipsum',
		'dolem',
		'ipsum' // Have a repeated entry to test removing multiple.
	]);


}

export function NumberCollection (
	name: string,
	collection: ICollection<number>): void
{
	//noinspection SpellCheckingInspection
	Collection(name + '<' + 'number>', collection, [
		0,
		1,
		1, // Have a repeated entry to test removing multiple.
		2,
		3,
		5,
		8,
		NaN // Must be able to reconginze NaN
	]);


}

export function InstanceCollection (
	name: string,
	collection: ICollection<Record<string, any>>): void
{
	const repeat = {};
	//noinspection SpellCheckingInspection
	Collection(name + '<' + 'Object>', collection, [
		undefined,
		{},
		repeat,
		{},
		repeat // Have a repeated entry to test removing multiple.
	]);
}

