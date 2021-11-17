import { createMachine, interpret } from 'xstate'
import dfa from './fsm'

const delimiters = ['(', ')', '[', ']', '{', '}', ';', ',']
const operators = ['*', '/', '%', '=', '>', '<']
const keywords = [
	'while',
	'for',
	'continue',
	'break',
	'if',
	'else',
	'float',
	'double',
	'int',
	'char',
	'void',
	'return',
]

const unacceptable = new Error('Failed to pass lexical analysis.')

export interface token {
	type: string
	value: string
}

interface lexical {
	stream: string[]
	tokens: token[]
}

export function analyze(source: string): lexical {
	const data: string[] = source.split('')
	let current: string = ''
	let symbols: token[] = []
	let fsm = interpret(
		createMachine({
			id: 'fsm',
			initial: 'init',
			states: dfa,
		})
	)
	fsm.start()

	for (let i = 0; i < data.length; i++) {
		switch (fsm.state.value) {
			case 'init':
				if (initRecv(data[i])) {
					fsm.send(initRecv(data[i])!)
					current += data[i]
				} else if (data[i].match(/\s/)) {
					fsm.send('init')
				} else {
					throw unacceptable
				}
				break
			case 'idn':
				if (idnRecv(data[i])) {
					fsm.send(idnRecv(data[i])!)
					current += data[i]
				} else {
					symbols.push({ type: 'IDN', value: current })
					current = ''
					fsm.send('init')
					i--
				}
				break
			case 'int':
				if (intRecv(data[i])) {
					fsm.send(intRecv(data[i])!)
					current += data[i]
				} else {
					symbols.push({ type: 'CONST', value: current })
					current = ''
					fsm.send('init')
					i--
				}
				break
			case 'float0':
				if (floatRecv(data[i])) {
					fsm.send(floatRecv(data[i])!)
					current += data[i]
				} else {
					throw unacceptable
				}
				break
			case 'float':
				if (floatRecv(data[i])) {
					fsm.send(floatRecv(data[i])!)
					current += data[i]
				} else {
					symbols.push({ type: 'CONST', value: current })
					current = ''
					fsm.send('init')
					i--
				}
				break
			case 'se':
				symbols.push({ type: 'SE', value: current })
				current = ''
				fsm.send('init')
				i--
				break
			case 'char0':
				if (char0Recv(data[i])) {
					fsm.send(char0Recv(data[i])!)
					current += data[i]
				} else {
					throw unacceptable
				}
				break
			case 'char1':
				if (char1Recv(data[i])) {
					fsm.send(char1Recv(data[i])!)
					current += data[i]
				} else {
					throw unacceptable
				}
				break
			case 'char':
				symbols.push({ type: 'CHAR', value: current })
				current = ''
				fsm.send('init')
				i--
				break
			case 'str0':
				if (str0Recv(data[i])) {
					fsm.send(str0Recv(data[i])!)
					current += data[i]
				} else {
					throw unacceptable
				}
				break
			case 'str':
				symbols.push({ type: 'STR', value: current })
				current = ''
				fsm.send('init')
				i--
				break
			case 'plus':
			case 'minus':
				if (pmRecv(data[i], current)) {
					fsm.send(pmRecv(data[i], current)!)
					current += data[i]
				} else {
					symbols.push({ type: 'OP', value: current })
					current = ''
					fsm.send('init')
					i--
				}
				break
			case 'op0':
				if (equalRecv(data[i])) {
					fsm.send(equalRecv(data[i])!)
					current += data[i]
				} else {
					symbols.push({ type: 'OP', value: current })
					current = ''
					fsm.send('init')
					i--
				}
				break
			case 'or':
			case 'and':
				if (aoRecv(data[i], current)) {
					fsm.send(aoRecv(data[i], current)!)
					current += data[i]
				} else {
					throw unacceptable
				}
				break
			case 'bang':
				if (equalRecv(data[i])) {
					fsm.send(equalRecv(data[i])!)
					current += data[i]
				} else {
					throw unacceptable
				}
				break
			case 'op':
				symbols.push({ type: 'OP', value: current })
				current = ''
				fsm.send('init')
				i--
				break
		}
	}
	fsm.stop()

	let stream: string[] = symbols.map((token) => token.value)
	let tokens: token[] = symbols.map((token) => {
		if (token.type == 'IDN') {
			let isKeyword = keywords.find((keyword) => token.value == keyword)
				? true
				: false
			return {
				type: isKeyword ? token.value.toUpperCase() : 'IDN',
				value: isKeyword ? '_' : token.value,
			}
		} else {
			return token
		}
	})

	return {
		stream: stream,
		tokens: tokens,
	}
}

const initRecv = (ch: string): string | undefined => {
	if (ch.match(/[a-zA-Z_]/)) {
		return 'prefix'
	} else if (ch.match(/[0-9]/)) {
		return 'number'
	} else if (ch == `'`) {
		return 'single'
	} else if (ch == `"`) {
		return 'double'
	} else if (ch == '+') {
		return 'plus'
	} else if (ch == '-') {
		return 'dash'
	} else if (ch == '!') {
		return 'bang'
	} else if (ch == '|') {
		return 'or'
	} else if (ch == '&') {
		return 'and'
	} else if (operators.find((op) => ch == op)) {
		return 'operator'
	} else if (delimiters.find((delimiter) => ch == delimiter)) {
		return 'delimiter'
	}
	return undefined
}

const idnRecv = (ch: string): string | undefined =>
	ch.match(/[0-9a-zA-Z_]/) ? 'indentifier' : undefined

const intRecv = (ch: string): string | undefined => {
	if (ch.match(/[0-9]/)) {
		return 'number'
	} else if (ch == '.') {
		return 'dot'
	}
	return undefined
}

const floatRecv = (ch: string): string | undefined =>
	ch.match(/[0-9]/) ? 'number' : undefined

const char0Recv = (ch: string): string | undefined => {
	if (ch == `'`) {
		return 'single'
	} else if (ch.match(/[^'"]/)) {
		return 'any'
	}
	return undefined
}

const char1Recv = (ch: string): string | undefined =>
	ch == `'` ? 'single' : undefined

const str0Recv = (ch: string): string | undefined => {
	if (ch == `"`) {
		return 'double'
	} else if (ch.match(/[^'"]/)) {
		return 'any'
	}
	return undefined
}

const pmRecv = (ch: string, current: string): string | undefined => {
	if (ch == current) {
		return 'self'
	} else if (ch == '=') {
		return 'equal'
	}
	return undefined
}

const aoRecv = (ch: string, current: string): string | undefined =>
	ch == current ? 'self' : undefined

const equalRecv = (ch: string): string | undefined =>
	ch == '=' ? 'equal' : undefined
