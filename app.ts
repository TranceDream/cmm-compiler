import fs from 'fs'
import { analyze } from './lexical'
import { getStack } from './syntax'

fs.readFile(process.argv.slice(2)[0], (error, data) => {
	if (error) {
		console.error(error)
		return
	}
	const { stream, tokens } = analyze(data.toString('utf-8'))
	stream.forEach((v) => console.log(v))
	console.log('\n\n')
	tokens.forEach((v) => console.log(v))

	getStack(tokens)
})
