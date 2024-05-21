export type Example = {
	id: number;
	inputText: string;
	outputText: string;
	explanation?: string;
	img?: string;
};

// local problem data
export type Problem = {
	id: string;
	title: string;
	problemStatement: string;
	examples: Example[];
	constraints: string;
	order: number;
	starterCode: string;
	handlerFunction: ((userCode: string, problem: Problem) => string) | any;
	starterFunctionName: string;
	testCases: TestCase[]
};

export type TestCase = {
	args: string,
	answer: string
}

export type DBProblem = {
	id: string;
	title: string;
	category: string;
	difficulty: string;
	likes: number;
	dislikes: number;
	order: number;
	videoId?: string;
	link?: string;
};

export type Solution = {
	id: string;
	code: string;
}