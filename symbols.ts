export class Symbol {
	flag?: string
	type?: string | undefined
	value?: string | undefined
}

export class Terminal extends Symbol {
	flag? = 'vt'
	type?: string | undefined
	value?: string | undefined
}

export class NonTerminal extends Symbol {
	flag? = 'vn'
	type?: string | undefined
}

export interface Rule {
	from: NonTerminal
	to: Symbol[]
}

export let S: NonTerminal = { type: 'S' }
let func: NonTerminal = { type: 'func' }
export let type: NonTerminal = { type: 'type' }
export let args: NonTerminal = { type: 'args' }
let funcBody: NonTerminal = { type: 'funcBody' }
export let arg: NonTerminal = { type: 'arg' }
let block: NonTerminal = { type: 'block' }
let defineStmts: NonTerminal = { type: 'defineStmts' }
let stmts: NonTerminal = { type: 'stmts' }
let defineStmt: NonTerminal = { type: 'defineStmt' }
let init: NonTerminal = { type: 'init' }
let vars: NonTerminal = { type: 'vars' }
let stmt: NonTerminal = { type: 'stmt' }
let assignStmt: NonTerminal = { type: 'assignStmt' }
let jumpStmt: NonTerminal = { type: 'jumpStmt' }
let iterationStmt: NonTerminal = { type: 'iterationStmt' }
let branchStmt: NonTerminal = { type: 'branchStmt' }
let expression: NonTerminal = { type: 'expression' }
let isNullExpr: NonTerminal = { type: 'isNullExpr' }
let logicExpr: NonTerminal = { type: 'logicExpr' }
let blockStmt: NonTerminal = { type: 'blockStmt' }
let result: NonTerminal = { type: 'result' }
let boolExpr: NonTerminal = { type: 'boolExpr' }
let lop: NonTerminal = { type: 'lop' }
let value: NonTerminal = { type: 'value' }
let operation: NonTerminal = { type: 'operation' }
let compareOp: NonTerminal = { type: 'compareOp' }
let equalOp: NonTerminal = { type: 'equalOp' }
let item: NonTerminal = { type: 'item' }
let valuePrime: NonTerminal = { type: 'valuePrime' }
let factor: NonTerminal = { type: 'factor' }
let itemPrime: NonTerminal = { type: 'itemPrime' }
let callFunc: NonTerminal = { type: 'callFunc' }
let es: NonTerminal = { type: 'es' }
let isNullEs: NonTerminal = { type: 'isNullEs' }
let constValue: NonTerminal = { type: 'constValue' }
let numConst: NonTerminal = { type: 'numConst' }

export let idn: Terminal = { type: 'idn' }
export let lb: Terminal = { type: 'se', value: '(' }
let rb: Terminal = { type: 'se', value: ')' }
let lcb: Terminal = { type: 'se', value: '{' }
let rcb: Terminal = { type: 'se', value: '}' }
let int: Terminal = { type: 'int' }
let char: Terminal = { type: 'char' }
let float: Terminal = { type: 'float' }
let str: Terminal = { type: 'str' }
let voidType: Terminal = { type: 'void' }
export let epsilon: Terminal = { type: 'epsilon' }
let comma: Terminal = { type: 'se', value: ',' }
let semicolon: Terminal = { type: 'se', value: ';' }
let eq: Terminal = { type: 'op', value: '=' }
let continueKw: Terminal = { type: 'continue' }
let breakKw: Terminal = { type: 'break' }
let returnKw: Terminal = { type: 'return' }
let whileKw: Terminal = { type: 'while' }
let forKw: Terminal = { type: 'for' }
let ifKw: Terminal = { type: 'if' }
let elseKw: Terminal = { type: 'else' }
let sigh: Terminal = { type: 'op', value: '!' }
let and: Terminal = { type: 'op', value: '&&' }
let or: Terminal = { type: 'op', value: '||' }
let doublePlus: Terminal = { type: 'op', value: '++' }
let doubleMinus: Terminal = { type: 'op', value: '++' }
let gt: Terminal = { type: 'op', value: '>' }
let gte: Terminal = { type: 'op', value: '>=' }
let lt: Terminal = { type: 'op', value: '<' }
let lte: Terminal = { type: 'op', value: '<=' }
let doubleEq: Terminal = { type: 'op', value: '==' }
let notEq: Terminal = { type: 'op', value: '!=' }
let plusEq: Terminal = { type: 'op', value: '+=' }
let minusEq: Terminal = { type: 'op', value: '-=' }
let multiplyEq: Terminal = { type: 'op', value: '*=' }
let divEq: Terminal = { type: 'op', value: '/=' }
let modEq: Terminal = { type: 'op', value: '%=' }
let plus: Terminal = { type: 'op', value: '+' }
let minus: Terminal = { type: 'op', value: '-' }
let multiply: Terminal = { type: 'op', value: '*' }
let div: Terminal = { type: 'op', value: '/' }
let mod: Terminal = { type: 'op', value: '%' }
let intValue: Terminal = { type: 'const' }
let floatValue: Terminal = { type: 'const' }
let charValue: Terminal = { type: 'const' }
export let end: Terminal = { type: '#' }

export const VN: NonTerminal[] = []
const originalVN: NonTerminal[] = [
	S,
	func,
	type,
	args,
	funcBody,
	arg,
	block,
	defineStmts,
	stmts,
	defineStmt,
	init,
	vars,
	stmt,
	assignStmt,
	jumpStmt,
	iterationStmt,
	branchStmt,
	expression,
	isNullExpr,
	logicExpr,
	blockStmt,
	result,
	boolExpr,
	lop,
	value,
	operation,
	compareOp,
	equalOp,
	item,
	valuePrime,
	factor,
	itemPrime,
	callFunc,
	es,
	isNullEs,
	constValue,
	numConst,
]

originalVN.map((vn) => {
	VN.push(Object.assign(vn, { flag: 'vn' }))
})

export const VT: Terminal[] = []
const originalVT: Terminal[] = [
	idn,
	lb,
	rb,
	lcb,
	rcb,
	int,
	char,
	float,
	str,
	voidType,
	epsilon,
	comma,
	semicolon,
	eq,
	continueKw,
	breakKw,
	returnKw,
	whileKw,
	forKw,
	ifKw,
	elseKw,
	sigh,
	and,
	or,
	doublePlus,
	doubleMinus,
	gt,
	gte,
	lt,
	lte,
	doubleEq,
	notEq,
	plusEq,
	minusEq,
	multiplyEq,
	divEq,
	modEq,
	plus,
	minus,
	multiply,
	div,
	mod,
	intValue,
	floatValue,
	charValue,
	end,
]

originalVT.map((vt) => {
	VT.push(Object.assign(vt, { flag: 'vt' }))
})

export const rules: Rule[] = [
	{ from: S, to: [func] },
	{ from: func, to: [type, idn, lb, args, rb, funcBody] },
	{ from: type, to: [int] },
	{ from: type, to: [char] },
	{ from: type, to: [float] },
	{ from: type, to: [voidType] },
	{ from: type, to: [epsilon] },
	{ from: args, to: [type, idn, arg] },
	{ from: args, to: [epsilon] },
	{ from: arg, to: [comma, type, idn, arg] },
	{ from: arg, to: [epsilon] },
	{ from: funcBody, to: [semicolon] },
	{ from: funcBody, to: [block] },
	{ from: block, to: [lcb, defineStmts, stmts, rcb] },
	{ from: defineStmts, to: [type, idn, defineStmt, defineStmts] },
	{ from: defineStmts, to: [epsilon] },
	{ from: defineStmt, to: [init, vars, semicolon] },
	{ from: init, to: [eq, constValue] },
	{ from: init, to: [epsilon] },
	{ from: vars, to: [comma, idn, init, vars] },
	{ from: vars, to: [epsilon] },
	{ from: stmts, to: [stmt, stmts] },
	{ from: stmts, to: [epsilon] },
	{ from: stmt, to: [assignStmt] },
	{ from: stmt, to: [jumpStmt] },
	{ from: stmt, to: [iterationStmt] },
	{ from: stmt, to: [branchStmt] },
	{ from: assignStmt, to: [expression, semicolon] },
	{ from: jumpStmt, to: [continueKw, semicolon] },
	{ from: jumpStmt, to: [breakKw, semicolon] },
	{ from: jumpStmt, to: [returnKw, isNullExpr, semicolon] },
	{ from: iterationStmt, to: [whileKw, lb, logicExpr, rb, blockStmt] },
	{
		from: iterationStmt,
		to: [
			forKw,
			lb,
			defineStmts,
			isNullExpr,
			semicolon,
			isNullExpr,
			rb,
			blockStmt,
		],
	},
	// {
	// 	from: iterationStmt,
	// 	to: [
	// 		forKw,
	// 		lb,
	// 		isNullExpr,
	// 		semicolon,
	// 		isNullExpr,
	// 		semicolon,
	// 		isNullExpr,
	// 		rb,
	// 		blockStmt,
	// 	],
	// },
	{ from: branchStmt, to: [ifKw, lb, logicExpr, rb, blockStmt, result] },
	{ from: result, to: [elseKw, blockStmt] },
	{ from: result, to: [epsilon] },
	{ from: logicExpr, to: [sigh, expression, boolExpr] },
	{ from: logicExpr, to: [expression, boolExpr] },
	{ from: boolExpr, to: [lop, expression, boolExpr] },
	{ from: boolExpr, to: [epsilon] },
	{ from: lop, to: [and] },
	{ from: lop, to: [or] },
	{ from: blockStmt, to: [lcb, stmts, rcb] },
	{ from: isNullExpr, to: [expression] },
	{ from: isNullExpr, to: [epsilon] },
	{ from: expression, to: [value, operation] },
	{ from: operation, to: [compareOp, value] },
	{ from: operation, to: [equalOp, value] },
	{ from: operation, to: [doublePlus] },
	{ from: operation, to: [doubleMinus] },
	{ from: operation, to: [epsilon] },
	{ from: compareOp, to: [gt] },
	{ from: compareOp, to: [gte] },
	{ from: compareOp, to: [lt] },
	{ from: compareOp, to: [lte] },
	{ from: compareOp, to: [doubleEq] },
	{ from: compareOp, to: [notEq] },
	{ from: equalOp, to: [eq] },
	{ from: equalOp, to: [plusEq] },
	{ from: equalOp, to: [minusEq] },
	{ from: equalOp, to: [multiplyEq] },
	{ from: equalOp, to: [divEq] },
	{ from: equalOp, to: [modEq] },
	{ from: value, to: [item, valuePrime] },
	{ from: valuePrime, to: [plus, item, valuePrime] },
	{ from: valuePrime, to: [minus, item, valuePrime] },
	{ from: valuePrime, to: [epsilon] },
	{ from: item, to: [factor, itemPrime] },
	{ from: itemPrime, to: [multiply, itemPrime] },
	{ from: itemPrime, to: [div, itemPrime] },
	{ from: itemPrime, to: [mod, itemPrime] },
	{ from: itemPrime, to: [epsilon] },
	{ from: factor, to: [lb, value, rb] },
	{ from: factor, to: [idn, callFunc] },
	{ from: factor, to: [constValue] },
	{ from: callFunc, to: [lb, es, rb] },
	{ from: callFunc, to: [epsilon] },
	{ from: es, to: [isNullExpr, isNullEs] },
	{ from: isNullEs, to: [comma, isNullExpr, isNullEs] },
	{ from: isNullEs, to: [epsilon] },
	{ from: constValue, to: [numConst] },
	{ from: constValue, to: [floatValue] },
	{ from: constValue, to: [charValue] },
	{ from: constValue, to: [str] },
	{ from: numConst, to: [intValue] },
]
