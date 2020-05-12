/*!
 * @author electricessence / https://github.com/electricessence/
 * Based Upon: http://msdn.microsoft.com/en-us/library/he2s3bh7%28v=vs.110%29.aspx
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET-Core/blob/master/LICENSE.md
 */

import {
	LinkedNode,
	LinkedNodeList,
	LinkedNodeWithValue,
	NodeWithValue
} from '@tsdotnet/linked-node-list';
import InvalidOperationException from '@tsdotnet/exceptions/dist/InvalidOperationException';
import ArgumentNullException from '@tsdotnet/exceptions/dist/ArgumentNullException';
import CollectionBase from '@tsdotnet/collection-base/dist/CollectionBase';
import {EqualityComparison} from '@tsdotnet/compare/dist/Comparable';
import areEqual from '@tsdotnet/compare/dist/areEqual';


/*****************************
 * IMPORTANT NOTES ABOUT PERFORMANCE:
 * http://jsperf.com/simulating-a-queue
 *
 * Adding to an array is very fast, but modifying is slow.
 * LinkedList wins when modifying contents.
 * http://stackoverflow.com/questions/166884/array-versus-linked-list
 *****************************/

export interface LinkedListNode<T>
	extends LinkedNodeWithValue<T>
{
	previous: LinkedListNode<T> | undefined;
	next: LinkedListNode<T> | undefined;

	list: LinkedList<T>;

	addBefore (entry: T): void;

	addAfter (entry: T): void;

	remove (): void;
}

/*
 * An internal node is used to manage the order without exposing underlying link chain to the consumer.
 */
class InternalNode<T>
	implements LinkedNode<InternalNode<T>>, NodeWithValue<T>
{
	external?: LinkedListNode<T>;

	constructor (
		public value: T,
		public previous?: InternalNode<T>,
		public next?: InternalNode<T>)
	{
	}

	assertDetached (): true | never
	{
		if(this.next || this.previous)
			throw new InvalidOperationException(
				'Adding a node that is already placed.');
		return true;
	}

}

function ensureExternal<T> (
	node: InternalNode<T> | undefined,
	list: LinkedList<T>): LinkedListNode<T> | undefined
{
	if(!node)
		return undefined;
	if(!list)
		throw new ArgumentNullException('list');

	let external = node.external;
	if(!external)
		node.external = external = new InternalLinkedListNode<T>(list, node);

	return external;
}

function getInternal<T> (node: LinkedListNode<T>, list: LinkedList<T>): InternalNode<T>
{
	if(!node)
		throw new ArgumentNullException('node');
	if(!list)
		throw new ArgumentNullException('list');

	if(node.list!=list)
		throw new InvalidOperationException(
			'Provided node does not belong to this list.');

	const n: InternalNode<T> = (node as any)._nodeInternal;
	if(!n)
		throw new InvalidOperationException(
			'Provided node is not valid.');

	return n;
}

function detachExternal (node: InternalNode<any>): void
{
	if(node)
	{
		const e: any = node.external;
		if(e)
		{
			e._list = undefined;
			e._nodeInternal = undefined;
		}
		node.external = undefined;
	}
}

/**
 * A doubly (bidirectional) linked list.  Acts as a safe, value focused wrapper for a [linked-node-list](https://github.com/tsdotnet/linked-node-list).
 */
export default class LinkedList<T>
	extends CollectionBase<T>
{
	private readonly _listInternal: LinkedNodeList<InternalNode<T>> = new LinkedNodeList<InternalNode<T>>();

	constructor (
		initialValues?: Iterable<T> | null,
		equalityComparer: EqualityComparison<T> = areEqual)
	{
		super(equalityComparer);
		if(initialValues) this._addEntries(initialValues);
	}

	/**
	 * Returns the first node or undefined if the list is empty.
	 */
	get first (): LinkedListNode<T> | undefined
	{
		return ensureExternal(this._listInternal.first, this);
	}

	/**
	 * Returns the first value or undefined if the list is empty.
	 */
	get firstValue (): T | undefined
	{
		return this._listInternal.first?.value;
	}

	/**
	 * Returns the last node or undefined if the list is empty.
	 */
	get last (): LinkedListNode<T> | undefined
	{
		return ensureExternal(this._listInternal.last, this);
	}

	/**
	 * Returns the last value or undefined if the list is empty.
	 */
	get lastValue (): T | undefined
	{
		return this._listInternal.last?.value;
	}

	/**
	 * The version number used to track changes.
	 * @returns {number}
	 */
	get version (): number
	{
		return this._listInternal.version;
	}

	/**
	 * Iterates the list and finds the first node that matches the provided value and removes it.
	 * @param entry The value to remove.
	 * @return {boolean} True if found and removes, otherwise false.
	 */
	removeOnce (entry: T): boolean
	{
		return this.remove(entry, 1)!==0;
	}

	/**
	 * Iterates the list returns the value of the node at the index requested.
	 * Returns undefined if the index is out of range.
	 * @param index
	 * @returns The value at the index requested or undefined.
	 */
	getValueAt (index: number): T | undefined
	{
		return this._listInternal.getNodeAt(index)?.value;
	}

	/**
	 * Iterates the list returns the the node at the index requested.
	 * Returns undefined if the index is out of range.
	 * @param index
	 * @returns The node at the index requested or undefined.
	 */
	getNodeAt (index: number): LinkedListNode<T> | undefined
	{
		return ensureExternal(this._listInternal.getNodeAt(index), this);
	}

	/**
	 * Iterates the list returns the the first node that matches the value specified.
	 * Returns undefined if not found.
	 * @param entry
	 * @returns The node matching the entry or undefined if not found
	 */
	find (entry: T): LinkedListNode<T> | undefined
	{
		return ensureExternal(this._findFirst(entry), this);
	}

	/**
	 * Iterates the list in reverse returns the the first node that matches the value specified.
	 * Returns undefined if not found.
	 * @param entry
	 * @returns The node matching the entry or undefined if not found
	 */
	findLast (entry: T): LinkedListNode<T> | undefined
	{
		const li = this._listInternal;
		return li && ensureExternal(this._findLast(entry), this);
	}

	/**
	 * Adds to specified entry to the beginning of the list.
	 * @param entry
	 * @return {this}
	 */
	addFirst (entry: T): this
	{
		this._listInternal.addNodeBefore(new InternalNode(entry));
		return this;
	}

	/**
	 * Adds to specified entry to the end of the list.
	 * @param entry
	 * @return {this}
	 */
	addLast (entry: T): this
	{
		return this.add(entry);
	}

	/**
	 * Removes the first node and returns its value.
	 * @return The value of the first node or undefined if the list is empty.
	 */
	takeFirstValue (): T | undefined
	{
		const n = this._listInternal.first;
		return this._removeNodeInternal(n) ? n?.value : undefined;
	}

	/**
	 * Removes the first node.
	 * @return True if the node was removed.  False if the list is empty.
	 */
	removeFirst (): boolean
	{
		return this._removeNodeInternal(this._listInternal.first);
	}

	/**
	 * Removes the last node and returns its value.
	 * @return The value of the last node or undefined if the list is empty.
	 */
	takeLastValue (): T | undefined
	{
		const n = this._listInternal.last;
		return this._removeNodeInternal(n) ? n?.value : undefined;
	}

	/**
	 * Removes the last node.
	 * @return True if the node was removed.  False if the list is empty.
	 */
	removeLast (): boolean
	{
		return this._removeNodeInternal(this._listInternal.last);
	}

	/**
	 * Removes the node at the specified index.
	 * @param {number} index
	 * @return {boolean} True if the node was removed.  False if the index was out of range.
	 */
	removeAt (index: number): boolean
	{
		return this._removeNodeInternal(this._listInternal.getNodeAt(index));
	}

	/**
	 * Removes the node specified.
	 * @param {number} node
	 * @return {boolean} True if the node was removed.  False if not found (already removed).
	 */
	removeNode (node: LinkedListNode<T>): boolean
	{
		return this._removeNodeInternal(getInternal(node, this));
	}

	/**
	 * Adds a entry before the specified node.
	 * @param {LinkedListNode} before The node to follow the entry.
	 * @param entry The value to insert before the node.
	 * @return {this}
	 */
	addBefore (before: LinkedListNode<T>, entry: T): this
	{
		this._listInternal.addNodeBefore(
			new InternalNode(entry),
			getInternal(before, this)
		);
		return this;
	}

	/**
	 * Adds a entry after the specified node.
	 * @param {LinkedListNode} after The node to precede the entry.
	 * @param entry The value to insert after the node.
	 * @return {this}
	 */
	addAfter (after: LinkedListNode<T>, entry: T): this
	{
		this._listInternal.addNodeAfter(
			new InternalNode(entry),
			getInternal(after, this)
		);

		return this;
	}

	/**
	 * Increments the collection version.
	 * Useful for tracking changes.
	 * @return {number} The new version.
	 */
	incrementVersion (): number
	{
		return this._listInternal.incrementVersion();
	}

	/**
	 * Throws if the provided version does not match the current one.
	 * @param {number} version
	 * @returns {boolean}
	 */
	assertVersion (version: number): true | never
	{
		return this._listInternal.assertVersion(version);
	}

	/**
	 * Gets the number of nodes in the list.
	 * @return {number}
	 */
	getCount (): number
	{
		return this._listInternal.unsafeCount;
	}

	protected* _getIterator (): Iterator<T>
	{
		for(const n of this._listInternal)
		{
			yield n.value;
		}
	}

	protected _addInternal (entry: T): boolean
	{
		this._listInternal.addNode(new InternalNode(entry));
		return true;
	}

	protected _removeInternal (entry: T, max: number = Infinity): number
	{
		const
			equals = this._equalityComparer,
			list   = this._listInternal;

		let removedCount = 0;
		for(const node of list)
		{
			if(node && equals(entry, node.value) && this._removeNodeInternal(node))
				removedCount++;

			if(removedCount>=max) break;
		}

		return removedCount;
	}

	protected _clearInternal (): number
	{
		const list = this._listInternal;
		for(const node of list)
		{
			detachExternal(node);
		}
		return list.clear();
	}

	private _findFirst (entry: T): InternalNode<T> | undefined
	{
		//noinspection UnnecessaryLocalVariableJS
		const equals = this._equalityComparer;

		let next = this._listInternal.first;
		while(next)
		{
			if(equals(entry, next.value))
				return next;
			next = next.next;
		}
		return undefined;
	}

	private _findLast (entry: T): InternalNode<T> | undefined
	{
		//noinspection UnnecessaryLocalVariableJS
		const equals = this._equalityComparer;

		let prev = this._listInternal.last;
		while(prev)
		{
			if(equals(entry, prev.value))
				return prev;
			prev = prev.previous;
		}
		return undefined;
	}

	private _removeNodeInternal (node: InternalNode<T> | undefined): boolean
	{
		if(node && this._listInternal.removeNode(node))
		{
			detachExternal(node);
			return true;
		}
		return false;
	}

}

// Use an internal node class to prevent mucking up the LinkedList.
class InternalLinkedListNode<T>
	implements LinkedListNode<T>
{
	constructor (
		private _list: LinkedList<T>,
		private _nodeInternal: InternalNode<T>)
	{
	}

	get list (): LinkedList<T>
	{
		return this._list;
	}

	get previous (): LinkedListNode<T> | undefined
	{
		this.throwIfDetached();
		return ensureExternal(this._nodeInternal.previous, this._list);
	}

	get next (): LinkedListNode<T> | undefined
	{
		this.throwIfDetached();
		return ensureExternal(this._nodeInternal.next, this._list);
	}

	get value (): T
	{
		this.throwIfDetached();
		return this._nodeInternal.value;
	}

	set value (v: T)
	{
		this.throwIfDetached();
		this._nodeInternal.value = v;
	}

	addBefore (entry: T): this
	{
		this.throwIfDetached();
		this._list.addBefore(this, entry);
		return this;
	}

	addAfter (entry: T): this
	{
		this.throwIfDetached();
		this._list.addAfter(this, entry);
		return this;
	}

	remove (): void
	{
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const _: any = this;
		const list = _._list;
		if(list) list.removeNode(this);
		_._list = undefined;
		_._nodeInternal = undefined;
	}

	dispose (): void
	{
		this.remove();
	}

	private throwIfDetached (): void
	{
		if(!this._list)
			throw new Error('This node has been detached from its list and is no longer valid.');
	}

}
