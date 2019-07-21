const fib = position => {
	if (position < 2) return 1;
	return fib(position - 1) + fib(position - 2);
};

module.exports = fib;
