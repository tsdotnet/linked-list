/* eslint-disable @typescript-eslint/no-non-null-assertion */

import {expect} from 'chai';
import * as CollectionTests from './Collection';
import LinkedList from '../src/LinkedList';

const CLASS_NAME = 'LinkedList';
CollectionTests.StringCollection(CLASS_NAME, new LinkedList<string>());
CollectionTests.NumberCollection(CLASS_NAME, new LinkedList<number>());
CollectionTests.InstanceCollection(CLASS_NAME, new LinkedList<object>());

describe('LinkedList', () => {


	const part1: number[] = [1, 2, 3], part2: number[] = [5, 6, 7];
	const parts = part1.concat(part2);
	const insertion = -10;

	describe('constructor()', () => {
		const list = new LinkedList<number>(parts);
		it('should match expected initial content', () => {
			expect(list.count, '.count').equal(parts.length);
			expect(list.toArray()).to.have.ordered.members(parts);
		});
	});

	describe('LinkedListNode', () => {

		describe('.addBefore(value)', () => {
			const partsSpliced = part1.concat([insertion]).concat(part2);
			const list = new LinkedList<number>(parts);
			list.find(part2[0])!.addBefore(insertion);
			it('should match expected count after inserting before', () => {
				expect(list.count, '.count').equal(partsSpliced.length);
				expect(list.toArray()).to.have.ordered.members(partsSpliced);
			});
		});

		describe('.addAfter(value)', () => {
			const partsSpliced = part1.concat([insertion]).concat(part2);
			const list = new LinkedList<number>(parts);
			list.find(part1[part1.length - 1])!.addAfter(insertion);
			it('should match expected count after inserting before', () => {
				expect(list.count, '.count').equal(partsSpliced.length);
				expect(list.toArray()).to.have.ordered.members(partsSpliced);
			});
		});

	});

	describe('.first', () => {
		it('should be undefined if empty list', () => {
			const list = new LinkedList<number>();
			expect(list.first).to.be.undefined;
		});
	});

	describe('.find(item)', () => {
		it('should find the first instance in list', () => {
			const list = new LinkedList<number>([1, 2, 3, 2, 3, 4]);
			const node = list.find(3)!;
			expect(node.value).equal(3);
			expect(node).not.to.be.undefined;
			expect(node.previous!.value).equal(2);
			expect(node.previous!.previous!.value).equal(1);
		});

		it('should return undefined for non members', () => {
			const list = new LinkedList<number>([1, 2, 3, 2, 3, 4]);
			const node = list.find(10)!;
			expect(node).to.be.undefined;
		});
	});

	describe('.findLast(item)', () => {
		it('should find the last instance in list', () => {
			const list = new LinkedList<number>([1, 2, 3, 2, 3, 4]);
			const node = list.findLast(3)!;
			expect(node.value).equal(3);
			expect(node).not.to.be.undefined;
			expect(node.next!.value).equal(4);
			expect(node.next!.next?.value).to.be.undefined;
		});

		it('should return undefined for non members', () => {
			const list = new LinkedList<number>([1, 2, 3, 2, 3, 4]);
			const node = list.findLast(10)!;
			expect(node).to.be.undefined;
		});
	});

	describe('.removeOnce(item)', () => {
		it('should remove an item once from the list', () => {
			const list = new LinkedList<number>([1, 2, 3, 2, 3, 4]);
			const len = list.count;
			expect(list.removeOnce(10)).to.be.false;
			expect(list.count).equal(len);
			expect(list.removeOnce(2)).to.be.true;
			expect(list.count).equal(len - 1);
			expect(list.toArray()).to.have.ordered.members([1, 3, 2, 3, 4]);
		});
	});

	describe('.takeFirstValue()', () => {
		it('should retrieve first value in list and undefined if none left', () => {
			const list = new LinkedList<number>([1, 2]);
			expect(list.takeFirstValue()).equal(1);
			expect(list.takeFirstValue()).equal(2);
			expect(list.takeFirstValue()).to.be.undefined;
		});
	});

	describe('.takeLastValue()', () => {
		it('should retrieve last value in list and undefined if none left', () => {
			const list = new LinkedList<number>([1, 2]);
			expect(list.takeLastValue()).equal(2);
			expect(list.takeLastValue()).equal(1);
			expect(list.takeLastValue()).to.be.undefined;
		});
	});

	describe('.removeNode(node)', () => {
		it('should throw if node is null', () => {
			const list = new LinkedList<number>(parts);
			expect(() => list.removeNode(null!)).to.throw();
		});

		it('should throw if node does not belong to list', () => {
			const list = new LinkedList<number>(parts);
			// @ts-expect-error
			expect(() => list.removeNode({value: 10})).to.throw();
		});

		it('should throw if node is detached', () => {
			const list = new LinkedList<number>(parts);
			// @ts-expect-error
			expect(() => list.removeNode({value: 10, list: list})).to.throw();
		});
	});


	it('should assert if node detached', () => {
		const list = new LinkedList<number>();
		list.add(1).add(2);
		expect(list.count).equal(2);

		expect(list.findLast(1)!.value).equal(1);
		expect(list.firstValue).equal(1);
		expect(list.find(2)!.value).equal(2);
		expect(list.lastValue).equal(2);
		list.last!.value = 3;
		expect(list.find(3)!.value).equal(3);
		expect(list.lastValue).equal(3);

		list.addAfter(list.first!, 5)
			.addFirst(0)
			.addLast(10);

		expect(list.first!.value).equal(0);
		expect(list.getNodeAt(0)!.value).equal(0);
		expect(list.getValueAt(0)).equal(0);
		expect(list!.getNodeAt(2)!.value).equal(5);
		expect(list.getValueAt(2)).equal(5);
		expect(list!.getNodeAt(4)!.value).equal(10);
		expect(list.getValueAt(4)).equal(10);
		expect(list.removeLast()).to.be.true;
		expect(list.removeFirst()).to.be.true;
		const n = list.getNodeAt(1)!;
		expect(list.removeAt(1)).to.be.true;
		expect(() => n.value).to.throw();

		const last = list.last!;
		expect(last.previous!.value).equal(1);
		expect(last.previous!.next).equal(last);
		// @ts-expect-error;
		last.dispose();
		expect(!last.list).to.be.true;
		expect(list.count).equal(1);

		expect(() => last.remove()).not.to.throw();
		expect(() => last.value).to.throw();
		expect(() => last.next).to.throw();
		expect(() => last.previous).to.throw();

		const first = list.first!;
		list.dispose();
		expect(!first.list).to.be.true;
		expect(() => first.value).to.throw();

	});

});

