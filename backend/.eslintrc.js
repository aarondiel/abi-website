module.exports = {
	root: true,

	env: {
		browser: true,
		node: true
	},

	extends: [
		'tslint:recommended',
	],

	rules: {
		'no-tabs': 'off',
		'indent': [ 'error', 'tab' ],
		'array-bracket-spacing': 'off',
		'quote-props': [ 'warn', 'consistent-as-needed' ],
		'comma-dangle': [ 'warn', 'never' ],
		'no-console': 'off',
		'space-before-function-paren': [ 'warn', { named: 'never' } ],
		'arrow-parens': [ 'warn', 'as-needed' ],
		'curly': [ 'warn', 'multi-or-nest' ],
	}
}
