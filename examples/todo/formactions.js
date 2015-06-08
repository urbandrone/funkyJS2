/* global funkyJS, TodoApp */
;(function (f) {

    function getInputs (form) {
        return form.querySelectorAll('input,textarea,select');
    }

    function input2Dict (input) {
        return {
            id: input.id,
            value: input.value || input.textContent,
            name: input.name
        };
    }

    function clearInput (input) {
        if (input.nodeName === 'SELECT') {
            input.options[input.selectedIndex].selected = null;
            input.options[0].selected = true;

        } else {
            input.value = '';
        }
    }

    function isValid (input) {
        return input.value !== '';
    }

    function isExecutable (inputs) {
        return inputs.length > 2;
    }



    var extractAndFormatInputValues = f.pipe(
        getInputs,
        f.toArray,
        f.splat([
            f.pipe(
                f.mapWith(input2Dict),
                f.filterWith(isValid),
                f.guard(isExecutable, function (formattedInputs) {
                    // TodoApp.addTodo({
                    //     name: formattedInputs[0].value,
                    //     desc: formattedInputs[1].value,
                    //     dead: +formattedInputs[2].value
                    // });
                    TodoApp.saveTodo({
                        name: formattedInputs[0].value,
                        desc: formattedInputs[1].value,
                        dead: +formattedInputs[2].value
                    });
                })
            ),
            f.forEachWith(clearInput)
        ])
    );


    var todoForm = document.querySelector('#todoform');
    todoForm.addEventListener('submit', function (event) {
        event.preventDefault();
        extractAndFormatInputValues(this);
    }, false);

})(funkyJS);