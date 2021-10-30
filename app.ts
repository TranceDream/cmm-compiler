import fs from 'fs'
import { analyze } from './lexical'

fs.readFile(process.argv.slice(2)[0], (error, data) => {
	if (error) {
		console.error(error)
		return
	}
	try {
		const { stream, tokens } = analyze(data.toString('utf-8'))
		stream.forEach((v) => console.log(v))
		console.log('\n\n')
		tokens.forEach((v) => console.log(v))
	} catch (error) {
		console.error('Failed to pass lexical analysis.')
	}
})
