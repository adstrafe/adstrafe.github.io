class ASTParser {
	tokens;
	index = 0;
	precedenceTable = {
		'+': 0,
		'-': 0,
		'*': 1,
		'/': 1
	};
	constructor(tokens) {
		this.tokens = tokens;
	}
	peek() {
		return this.index < this.tokens.length ? this.tokens[this.index] : null;
	}
	advance() {
		return this.index < this.tokens.length ? this.tokens[this.index++] : null;
	}
	parse() {
		return this.parseExpression();
	}
	// handles + / - with low precedence
	parseExpression() {
		let left = this.parseTerm();
		while (this.peek()?.type === TokenType.OPERATOR && this.precedenceTable[this.peek().value] === 0) {
			const operator = this.advance(); // Get the + or -
			const right = this.parseTerm(); // Parse next term
			left = {
				type: 'operator',
				value: operator.value,
				left,
				right,
				precedence: this.precedenceTable[operator.value]
			};
		}
		return left;
	}
	// handles * and / with higher precedence
	parseTerm() {
		let left = this.parseFactor();
		while (this.peek()?.type === TokenType.OPERATOR && this.precedenceTable[this.peek().value] === 1) {
			const operator = this.advance(); // Get the * or /
			const right = this.parseFactor(); // Parse next factor
			left = {
				type: 'operator',
				value: operator.value,
				left,
				right,
				precedence: this.precedenceTable[operator.value]
			};
		}
		return left;
	}
	// handles numbers and ()
	parseFactor() {
		const token = this.advance();
		if (token?.type === TokenType.NUMBER) {
			return {
				type: 'number',
				value: token.value
			};
		}
		else if (token?.type === TokenType.PARENTHESES && token.value === '(') {
			const node = this.parseExpression();
			this.advance();
			return node;
		}
	}
}

var TokenType;
(function (TokenType) {
	TokenType[TokenType["OPERATOR"] = 0] = "OPERATOR";
	TokenType[TokenType["NUMBER"] = 1] = "NUMBER";
	TokenType[TokenType["PARENTHESES"] = 2] = "PARENTHESES";
})(TokenType || (TokenType = {}));
class Tokenizer {
	tokens;
	index = 0;
	constructor() {
		this.tokens = [];
	}
	peek(input) {
		return this.index < input.length ? input[this.index] : null;
	}
	advance(input) {
		return this.index < input.length ? input[this.index++] : null;
	}
	tokenize(input) {
		while (this.index < input.length) {
			const char = this.advance(input);
			if (char === null) {
				break;
			}
			// Check for numbers (including negative numbers)
			if (/\d/.test(char) || (char === '-' && this.isNegativeNumber(input))) {
				let numStr = char;
				while (this.peek(input) !== null && (/\d/.test(this.peek(input)) || this.peek(input) === '.')) {
					numStr += this.advance(input);
				}
				this.tokens.push({
					type: TokenType.NUMBER,
					value: Number.parseFloat(numStr)
				});
			}
			// Check for operators
			else if (/[+\-*/]/.test(char)) {
				this.tokens.push({
					type: TokenType.OPERATOR,
					value: char
				});
			}
			// Ignore spaces
			else if (char === ' ') {
				continue;
			}
			else {
				throw new Error(`Invalid character: ${char}`);
			}
		}
		return this.tokens;
	}
	
	isNegativeNumber(input) {
		if (this.tokens.length === 0) {
			return true;
		}
		const lastToken = this.tokens[this.tokens.length - 1];
		return lastToken.type === TokenType.OPERATOR || lastToken.value === '(';
	}
}

class Evaluator extends ASTParser {
	evaluate() {
		const head = this.parse();
		return this.evaluateNode(head);
	}
	evaluateNode(headNode) {
		const { value, type } = headNode;
		if (type === 'number') {
			return value;
		}
		if (type === 'operator') {
			const node = headNode;
			const leftNode = this.evaluateNode(node.left);
			const rightNode = this.evaluateNode(node.right);
			switch (value) {
				case '*':
					return leftNode * rightNode;
				case '/':
					return leftNode / rightNode;
				case '+':
					return leftNode + rightNode;
				case '-':
					return leftNode - rightNode;
				default:
					throw new Error(`Unsupported operator ${value}`);
			}
		}
		throw new Error(`Invalid type for evaluation ${type}`);
	}
}

const INPUT_FIELD = document.getElementById('input-field');
const EVALUATE_BUTTON = document.getElementById('evaluate');
const DELETE_BUTTON = document.getElementById('delete');
let inputStr = '';

function addInput(char) {
	inputStr += char;
	INPUT_FIELD.value += char;
}

function removeInput() {
	inputStr = inputStr.slice(0, -1);
	INPUT_FIELD.value = inputStr;
	EVALUATE_BUTTON.disabled = false;
	DELETE_BUTTON.classList.remove('highlight');
}

function evaluateEx() {
	try {
		const tokenizer = new Tokenizer();
		const tokens = tokenizer.tokenize(inputStr);
		const evaluator = new Evaluator(tokens);
		const value = evaluator.evaluate();

		if (typeof(value) !== 'number' || value === Number.POSITIVE_INFINITY) {
			throw new Error(`Error while evaluating expression ${inputStr}`);
		}

		inputStr = '' + value;
		INPUT_FIELD.value = value;
	} catch (err) {
		inputStr = inputStr.slice(0, -1);
		EVALUATE_BUTTON.disabled = true;
		INPUT_FIELD.value = 'ERR';
		DELETE_BUTTON.classList.add('highlight');
	}
}