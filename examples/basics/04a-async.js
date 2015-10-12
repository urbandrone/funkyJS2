/* globals funkyJS */
;(function (factory) {
    // global factory definition, pushed up for better readability
    window.factCalculator = factory(funkyJS);

})(function (f) {

    // This example implements a asynchronous interface for calculating the
    //   factorial of every given number (except infinity). There are two
    //   problems to solve:
    //   1. JavaScript is a stack oriented language, which means any number
    //      given to the factorial computation process might create a stack
    //      overflow which then results to an error being thrown
    //   2. Because we don't know which number has been given into the process,
    //      we also don't know the point in time, at which the calculation
    //      finishes. Therefor, the UI shouldn't block in the mean time
    //      
    // -----
    // The final interface will be usable like this:
    // 
    // factCalculator(100, function (fact) { ... do something with fact ... });
    
    function _fact (n) {
        if (n < 1) {
            return 1;
        }
        return f.thunk(function () {
            return n * _fact(n - 1);
        });
    }

    function factorial (n) {
        return f.trampoline(_fact(Math.abs(n)));
    }

    return f.liftAsync(function factCalculator (n) {
        if (f.isNotNumber(n)) {
            return n;
        }
        return factorial(n);
    });
});