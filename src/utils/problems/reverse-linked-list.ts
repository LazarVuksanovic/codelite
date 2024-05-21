import assert from "assert";
import { Problem, TestCase } from "../types/problem";
import example from "./images/reverseLL.jpg";

// JS doesn't have a built in LinkedList class, so we'll create one
const helperCode = `class LinkedList {
	constructor(value) {
		this.value = value;
		this.next = null;
	}

	reverse() {
		let current = this;
		let prev = null;
		while (current !== null) {
			const next = current.next;
			current.next = prev;
			prev = current;
			current = next;
		}
		return prev;
	}
}

// it creates a linked list from an array
function createLinkedList(values) {
	const head = new LinkedList(values[0]);
	let current = head;
	for (let i = 1; i < values.length; i++) {
		const node = new LinkedList(values[i]);
		current.next = node;
		current = node;
	}
	return head;
}

// it returns an array of values from a linked list
function getListValues(head) {
	const values = [];
	let current = head;
	while (current !== null) {
		values.push(current.value);
		current = current.next;
	}
	return values;
}`

const testCases: TestCase[] = [
	{
		args: '[1, 2, 3, 4, 5]',
		answer: '[5, 4, 3, 2, 1]'
	},
	{
		args: '[5, 4, 3, 2, 1]',
		answer: '[1, 2, 3, 4, 5]'
	},
	{
		args: '[1, 2, 3]',
		answer: '[3, 2, 1]'
	},
	{
		args: '[1]',
		answer: '[1]'
	}
]

export const reverseLinkedListHandler = (userCode: string, problem: Problem): string => {
	userCode = helperCode + userCode
	problem.testCases.forEach(testCase => {
		userCode += `\nconsole.log(getListValues(${problem.starterFunctionName}(createLinkedList(${testCase.args}))).toString() === ${testCase.answer}.toString())`
	});
	return userCode
};

const starterCodeReverseLinkedListJS =`
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
// Do not edit function name
function reverseLinkedList(head) {
  // Write your code here
};`

export const reverseLinkedList: Problem = {
	id: "reverse-linked-list",
	title: "2. Reverse Linked List",
	problemStatement: `<p class='mt-3'>Given the <code>head</code> of a singly linked list, reverse the list, and return <em>the reversed list</em>.</p>
	`,
	examples: [
		{
			id: 0,
			inputText: "head = [1,2,3,4,5]",
			outputText: "[5,4,3,2,1]",
			img: example.src,
		},
		{
			id: 1,
			inputText: "head = [1,2,3]",
			outputText: "[3,2,1]",
		},
		{
			id: 2,
			inputText: "head = [1]",
			outputText: "[1]",
		},
	],
	constraints: `<li class='mt-2'>The number of nodes in the list is the range <code>[0, 5000]</code>.</li>
<li class='mt-2'><code>-5000 <= Node.val <= 5000</code></li>`,
	starterCode: starterCodeReverseLinkedListJS,
	handlerFunction: reverseLinkedListHandler,
	starterFunctionName: "reverseLinkedList",
	order: 2,
	testCases: testCases
};