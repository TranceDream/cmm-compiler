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
} from './symbols'
import { Set } from 'immutable'
import fs from 'fs'
import ObjectsToCsv from 'objects-to-csv'
import { token } from './lexical'

const unacceptable = (msg: string, index: number) =>
	new Error(
		'Failed to pass syntax analysis. At position ' + index + ':\t' + msg
	)

let first: Map<NonTerminal, Set<Terminal>> = new Map()
let follow: Map<NonTerminal, Set<Terminal>> = new Map()
let table: Map<NonTerminal, Map<Terminal, Rule | undefined>> = new Map()
let stringTable: Map<string, string[]> = new Map()
let stack: string[][] = []

const getFirst = (rules: Rule[]) => {
	VN.map((vn) => {
		first.set(vn, Set())
	})
	while (true) {
		let mapBefore = new Map(first)
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
		let same = true
		mapBefore.forEach((v, k) => {
			if (!v.equals(first.get(k))) {
				same = false
			}
		})
		if (same) {
			break
		}
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
	while (true) {
		let mapBefore = new Map(follow)
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
		let same = true
		mapBefore.forEach((v, k) => {
			if (!v.equals(follow.get(k))) {
				same = false
			}
		})
		if (same) {
			break
		}
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
		let innerMap = table.get(rule.from)!
		let hasEpsilon = true
		for (let symbol of rule.to) {
			if (symbol.flag == 'vt') {
				if (symbol != epsilon) {
					innerMap?.set(symbol, rule)
					hasEpsilon = false
					break
				} else {
					hasEpsilon = true
				}
			} else {
				if (first.get(symbol)?.has(epsilon)) {
					for (let fst of first.get(symbol)!) {
						if (fst != epsilon) {
							innerMap?.set(fst, rule)
						}
					}
				} else {
					for (let fst of first.get(symbol)!) {
						innerMap?.set(fst, rule)
					}
					hasEpsilon = false
					break
				}
			}
		}
		if (hasEpsilon) {
			for (let flw of follow.get(rule.from)!) {
				innerMap?.set(flw, { from: rule.from, to: [epsilon] })
			}
		}
		table.set(rule.from, innerMap)
	})
}
const getCSV = async () => {
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
	await csv.toDisk('./table.csv')
}

export const getStack = (src: token[]) => {
	try {
		getFirst(rules)
		getFollow(rules)
		getTable(rules)
		getCSV()

		let symbolStack: Symbol[] = []
		let tokens: token[] = src.concat({ type: '#', value: '' })
		symbolStack.push(end)
		symbolStack.push(S)
		stack.push([
			'S-#',
			symbolStack
				.map((e) =>
					e.type == 'op' || e.type == 'se' ? e.value : e.type
				)
				.toString(),
			'',
		])

		for (let i = 0; i < tokens.length; ) {
			let result: string[] = []
			let tokenType =
				tokens[i].type == 'op' || tokens[i].type == 'se'
					? tokens[i].value!
					: tokens[i].type
			let topType =
				symbolStack[symbolStack.length - 1].type == 'op' ||
				symbolStack[symbolStack.length - 1].type == 'se'
					? symbolStack[symbolStack.length - 1].value
					: symbolStack[symbolStack.length - 1].type
			result.push(topType + '-' + tokenType)
			result.push('')
			if (tokenType == topType!) {
				symbolStack.pop()
				result.push('')
				i++
			} else {
				if (symbolStack[symbolStack.length - 1].flag == 'vn') {
					let innerMap = table.get(
						symbolStack[symbolStack.length - 1]
					)!
					let pass = false
					let iter = true
					innerMap.forEach((value, key) => {
						if (iter) {
							let keyType =
								key.type == 'op' || key.type == 'se'
									? key.value
									: key.type
							if (keyType == tokenType) {
								if (value) {
									if (value.to.find((e) => e == epsilon)) {
										symbolStack.pop()
									} else {
										symbolStack.pop()
										value.to
											.slice()
											.reverse()
											.map((e) => {
												symbolStack.push(e)
											})
									}
									result.push(
										value.from.type +
											' -> ' +
											value.to
												.map((e) =>
													e.type == 'op' ||
													e.type == 'se'
														? e.value
														: e.type
												)
												.toString()
									)
									pass = true
									iter = false
								}
							}
						}
					})
					if (!pass) {
						throw unacceptable(tokenType, i)
					}
				} else {
					throw unacceptable(tokenType, i)
				}
			}
			result[1] = symbolStack
				.map((e) =>
					e.type == 'op' || e.type == 'se' ? e.value : e.type
				)
				.toString()

			stack.push(result)
		}

		return stack
	} catch (error) {
		console.error(error)
	}
}
