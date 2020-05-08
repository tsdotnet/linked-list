/* eslint-disable @typescript-eslint/no-non-null-assertion */

import * as CollectionTests from './Collection';
import {areEqual} from '@tsdotnet/array-compare';
import LinkedList from '../src/LinkedList';

const CLASS_NAME = 'LinkedList';
CollectionTests.StringCollection(CLASS_NAME, new LinkedList<string>());
CollectionTests.NumberCollection(CLASS_NAME, new LinkedList<number>());
CollectionTests.InstanceCollection(CLASS_NAME, new LinkedList<object>());

describe('.addAfter & .addBefore', () => {
	const part1: number[] = [1, 2, 3], part2: number[] = [5, 6, 7];
	const parts = part1.concat(part2), len1 = parts.length;
	const list = new LinkedList<number>(parts);
	const list1 = list.toArray();
	const count1 = list.count;

	const partsSpliced = part1.concat([4]).concat(part2);
	const len2 = partsSpliced.length;
	list.find(5)!.addBefore(4);
	const count2 = list.count;
	const list2 = list.toArray();
	list.find(6)!.addAfter(6.5);
	const count3 = list.count;
	const list3 = list.toArray();


	it('should match expected initial count', () => {
		expect(count1).toBe(len1);
		expect(areEqual(parts, list1)).toBeTrue();
	});

	it('should match expected count after inserting before', () => {
		expect(count2).toBe(len2);
		expect(areEqual(partsSpliced, list2)).withContext(partsSpliced.join(',') + ' != ' + list2.join(',')).toBeTrue();
	});

	it('should match expected count after inserting after', () => {
		expect(count3).toBe(len2 + 1);
		expect(areEqual(partsSpliced, list2)).withContext(list3.join(',')).toBeTrue();
	});


});

describe('Validate external node detachment', () => {

	it('should assert if node detached', () => {
		const list = new LinkedList<number>();
		list.add(1).add(2);
		expect(list.count).toBe(2);

		expect(list.findLast(1)!.value).toBe(1);
		expect(list.firstValue).toBe(1);
		expect(list.find(2)!.value).toBe(2);
		expect(list.lastValue).toBe(2);
		list.last!.value = 3;
		expect(list.find(3)!.value).toBe(3);
		expect(list.lastValue).toBe(3);

		list.addAfter(list.first!, 5)
			.addFirst(0)
			.addLast(10);

		expect(list.first!.value).toBe(0);
		expect(list.getNodeAt(0)!.value).toBe(0);
		expect(list.getValueAt(0)).toBe(0);
		expect(list!.getNodeAt(2)!.value).toBe(5);
		expect(list.getValueAt(2)).toBe(5);
		expect(list!.getNodeAt(4)!.value).toBe(10);
		expect(list.getValueAt(4)).toBe(10);
		expect(list.removeLast()).toBeTrue();
		expect(list.removeFirst()).toBeTrue();
		const n = list.getNodeAt(1)!;
		expect(list.removeAt(1)).toBeTrue();
		expect(() => n.value).toThrow();

		const last = list.last!;
		expect(last.previous!.value).toBe(1);
		expect(last.previous!.next).toBe(last);
		last.remove();
		expect(!last.list).toBeTrue();
		expect(list.count).toBe(1);

		expect(() => last.remove()).not.toThrow();
		expect(() => last.value).toThrow();
		expect(() => last.next).toThrow();
		expect(() => last.previous).toThrow();

		const first = list.first!;
		list.dispose();
		expect(!first.list).toBeTrue();
		expect(() => first.value).toThrow();

	});

});
