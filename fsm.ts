/*
    空格    space
    字母    letter
    字母下划线  prefix
    数字    number
    小数点  dot
    运算符  operator
    界符    delimiter
    等号    equal
*/

let dfa = {
	init: {
		on: {
			init: 'init',
			prefix: 'idn',
			number: 'int',
			delimiter: 'se',
			single: 'char0',
			double: 'str0',
			or: 'or',
			and: 'and',
			plus: 'plus',
			dash: 'minus',
			bang: 'bang',
			operator: 'op0',
		},
	},
	idn: {
		on: {
			identifier: 'idn',
			init: 'init',
		},
	},
	int: {
		on: {
			number: 'int',
			dot: 'float0',
			init: 'init',
		},
	},
	float0: {
		on: {
			number: 'float',
		},
	},
	float: {
		on: {
			number: 'float',
			init: 'init',
		},
	},
	se: {
		on: {
			init: 'init',
		},
	},
	char0: {
		on: {
			single: 'char',
			any: 'char1',
		},
	},
	char1: {
		on: {
			single: 'char',
		},
	},
	char: {
		on: {
			init: 'init',
		},
	},
	str0: {
		on: {
			double: 'str',
			any: 'str0',
			init: 'init',
		},
	},
	str: {
		on: {
			init: 'init',
		},
	},
	plus: {
		on: {
			self: 'op',
			equal: 'op',
			init: 'init',
		},
	},
	minus: {
		on: {
			self: 'op',
			equal: 'op',
			init: 'init',
		},
	},
	or: {
		on: {
			self: 'op',
		},
	},
	and: {
		on: {
			self: 'op',
		},
	},
	bang: {
		on: {
			equal: 'op',
		},
	},
	op0: {
		on: {
			op: 'op',
			init: 'init',
		},
	},
	op: {
		on: {
			init: 'init'
		}
	}
}

export default dfa
