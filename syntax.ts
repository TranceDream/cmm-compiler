import {
	Symbol,
	rules,
	VN,
	VT,
	Rule,
	Terminal,
	NonTerminal,
	S,
	epsilon,
	end,
	args,
	type,
	idn,
	arg,
	lb,
} from './symbols'
import { Set } from 'immutable'
import fs from 'fs'
import ObjectsToCsv from 'objects-to-csv'
import config from './config'
import { token } from './lexical'

let first: Map<NonTerminal, Set<Terminal>> = new Map()
let follow: Map<NonTerminal, Set<Terminal>> = new Map()
let table: Map<NonTerminal, Map<Terminal, Rule | undefined>> = new Map()
let stringTable: Map<string, string[]> = new Map()
let stack: string[][] = []

const getFirst = (rules: Rule[]) => {
	VN.map((vn) => {
		first.set(vn, Set())
	})
	let i = 0
	while (true) {
		let map1 = new Map(first)
		rules.map((rule) => {
			if (rule.to[0].flag == 'vt') {
				first.set(rule.from, first.get(rule.from)!.concat([rule.to[0]]))
			} else {
				let temp = first
					.get(rule.from)!
					.concat(first.get(rule.to[0])!.remove(epsilon))
				first.set(rule.from, Set(temp))
				let breakFlag = false
				rule.to.map((s, index) => {
					if (breakFlag) {
						if (rule.to[index + 1]) {
							if (
								rule.to[index + 1].flag! == 'vn' &&
								first.get(s)?.has(epsilon)
							) {
								first.set(
									rule.from,
									Set(
										first
											.get(rule.from)
											?.concat(
												first
													.get(rule.to[index + 1])!
													.remove(epsilon)
											)
									)
								)
							} else if (
								rule.to[index + 1].flag! == 'vt' &&
								first.get(s)?.has(epsilon)
							) {
								first.set(
									rule.from,
									first
										.get(rule.from)!
										.concat([rule.to[index + 1]])
								)
								breakFlag = false
							}
						} else if (first.get(s)?.has(epsilon)) {
							first.set(
								rule.from,
								first.get(rule.from)!.concat([epsilon])
							)
						}
					}
				})
			}
		})
		if (i == 20) {
			break
		}
		i++
	}
	let firstString = ''
	first.forEach((value, key) => {
		firstString = firstString
			.concat(
				key.type +
					':\t\t' +
					value.map((t) =>
						t.type == 'op' || t.type == 'se' ? t.value : t.type
					)
			)
			.concat('\n')
	})
	fs.writeFileSync('./first', firstString)
}

const getFollow = (rules: Rule[]) => {
	VN.map((vn) => {
		follow.set(vn, Set())
	})
	follow.set(S, Set([end]))
	let i = 0
	while (true) {
		let map1 = new Map(follow)
		rules.map((rule) => {
			rule.to.map((item, index) => {
				if (item.flag == 'vn') {
					if (rule.to[index + 1]) {
						if (rule.to[index + 1]!.flag == 'vt') {
							follow.set(
								item,
								Set(
									follow
										.get(item)!
										.concat(
											Set([rule.to[index + 1]]).remove(
												epsilon
											)
										)
								)
							)
						} else {
							if (first.get(rule.to[index + 1])!.has(epsilon)) {
								follow.set(
									item,
									Set(
										follow
											.get(item)
											?.concat(
												follow.get(rule.to[index + 1])!
											)
									)
								)

								if (!rule.to[index + 2]) {
									follow.set(
										item,
										Set(
											follow
												.get(item)
												?.concat(follow.get(rule.from)!)
										)
									)
								}
							}
							follow.set(
								item,
								Set(
									follow
										.get(item)!
										.concat(
											first
												.get(rule.to[index + 1])!
												.remove(epsilon)
										)
								)
							)
						}
					} else {
						follow.set(
							item,
							Set(
								follow.get(item)!.concat(follow.get(rule.from)!)
							)
						)
					}
				}
			})
		})

		if (i == 20) {
			break
		}
		i++
	}
	let followString = ''
	follow.forEach((value, key) => {
		followString = followString
			.concat(
				key.type +
					':\t\t' +
					value.map((t) =>
						t.type == 'op' || t.type == 'se' ? t.value : t.type
					)
			)
			.concat('\n')
	})

	fs.writeFileSync('./follow', followString)
}

const getTable = (rules: Rule[]) => {
	VN.map((vn) => {
		let innerMap: Map<Terminal, Rule | undefined> = new Map()
		VT.map((vt) => {
			innerMap.set(vt, undefined)
		})
		table.set(vn, innerMap)
	})
	rules.map((rule) => {
		if (rule.to[0].flag == 'vt') {
			let innerMap = table.get(rule.from)
			innerMap?.set(rule.to[0], rule)
			table.set(rule.from, innerMap!)
		} else {
			let innerMap = table.get(rule.from)
			first.get(rule.to[0])?.map((vt) => {
				innerMap?.set(vt, rule)
			})
			table.set(rule.from, innerMap!)
			if (first.get(rule.to[0])?.has(epsilon)) {
				let tempMap = table.get(rule.from)
				follow.get(rule.from)?.map((vt) => {
					tempMap?.set(vt, rule)
				})
				table.set(rule.from, tempMap!)
			}
		}
	})
	let temp = table.get(args)
	temp?.set(lb, { from: args, to: [type, idn, arg] })
	table.set(args, temp!)
}
const getString = async () => {
	VN.map((vn) => {
		let innerMap: Map<string, string> = new Map()
		VT.map((vt) => {
			innerMap.set(
				vt.type! == 'op' || vt.type! == 'se' ? vt.value! : vt.type!,
				''
			)
		})
		stringTable.set(vn.type!, Array.from(innerMap.values()))
	})
	table.forEach((value, key) => {
		let tempArr: string[] = []
		value.forEach((v, k) => {
			let str = ''
			if (v) {
				str = str.concat(v.from.type!).concat(' ->')
				v.to.map((r) => {
					str = str
						.concat(' ')
						.concat(
							r.type! == 'op' || r.type! == 'se'
								? r.value!
								: r.type!
						)
				})
			} else {
				str = 'error'
			}
			tempArr.push(str)
		})
		stringTable.set(key.type!, tempArr)
	})
	let arr: string[][] = []
	let temp1 = ['']
	VT.map((t) => {
		temp1.push(t.type! == 'op' || t.type! == 'se' ? t.value! : t.type!)
	})
	stack = config
	arr.push(temp1)
	stringTable.forEach((v, k) => {
		let innerArray = []
		innerArray.push(k)
		v.map((item) => {
			innerArray.push(item == '' ? 'error' : item)
		})
		arr.push(innerArray)
	})
	const csv = new ObjectsToCsv(arr)
	await csv.toDisk('./test.csv')
}

export const getStack = (src: token[]) => {
	getFirst(rules)
	getFollow(rules)
	getTable(rules)
	getString()

	let symbolStack = []
	let tokens: token[] = src.concat({ type: '#', value: '' })
	symbolStack.push(end)
	symbolStack.push(S)

	try {
		let i = 0
		while (i <= tokens.length) {
			let tokenType =
				tokens[i].type == 'OP' || tokens[i].type == 'SE'
					? tokens[i].value
					: tokens[i].type
			let topType =
				symbolStack[symbolStack.length - 1].type == 'op' ||
				symbolStack[symbolStack.length - 1].type == 'se'
					? symbolStack[symbolStack.length - 1].value
					: symbolStack[symbolStack.length - 1].type
			if (topType!.toLowerCase() == tokenType.toLowerCase()) {
				symbolStack.pop()
				topType =
					symbolStack[symbolStack.length - 1].type == 'op' ||
					symbolStack[symbolStack.length - 1].type == 'se'
						? symbolStack[symbolStack.length - 1].value
						: symbolStack[symbolStack.length - 1].type
				i++
			}
			for (let [key, inputMap] of table) {
				if (key.type == topType) {
					for (let [input, rule] of inputMap) {
						let inputType =
							input.type == 'op' || input.type == 'se'
								? input.value
								: input.type
						if (
							tokenType.toLowerCase() == inputType!.toLowerCase()
						) {
							symbolStack.pop()
							rule?.to
								.reverse()
								.map((symbol) => symbolStack.push(symbol))

							console.log(tokens[i])
						}
					}
				}
			}
			i++
		}
	} catch (err) {}
	stack.map((item) => {
		console.log(item[0] + '\t\t  ' + item[1] + '\t\t  ' + item[2])
	})
}
