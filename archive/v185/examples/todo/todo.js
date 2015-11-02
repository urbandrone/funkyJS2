/* global funkyJS, dom, TodoApp */
;(function (f, d) {

    function makeTodoView (description) {
        var _wrap = d.tag('li'),
            _name = d.tag('span'),
            _dead = d.tag('span'),
            _desc = d.tag('span');

        _wrap.dataset.id = description.todoId;
        [
            d.setText(description.name, d.setClass('todo_name', _name)),
            d.setText(description.deadline, d.setClass('todo_dead', _dead)),
            d.setText(description.desc, d.setClass('todo_desc', _desc))
        ].forEach(d.appendTo(
            d.setClass('todo list_item', _wrap)
        ));

        if (description.isDone) {
            d.setClass('todo--done', _wrap);
        }

        return _wrap;
    }

    function addTodoControls (todoView) {
        var _wrap = d.tag('div'),
            _done = d.tag('button'),
            _del = d.tag('button');

        _done.type = 'button';
        _del.type = 'button';
        [
            d.setText('Done', d.setClass('todo_close button', _done)),
            d.setText('Close', d.setClass('todo_delete button', _del))
        ].forEach(d.appendTo(
            d.setClass('todo_controls', _wrap)
        ));

        if (d.hasClass('todo--done', todoView)) {
            d.setClass('is--disabled', d.disable(_done));
        }

        d.appendTo(todoView, _wrap);
        return todoView;
    }


    var todos = document.querySelector('#todos');
    var addTodo = f.pipe(
        makeTodoView,
        addTodoControls,
        d.appendTo(todos)
    );


    var done = f.pipe(
        d.disable,
        d.setClass('is--disabled'),
        d.parents(2),
        d.setClass('todo--done')
    );

    var closed = f.pipe(
        d.parents(3),
        d.removeFrom
    );



    var parentParent = d.parents(2);

    todos.addEventListener('click', function (event) {
        var _ppNode;
        if (event.target.nodeName === 'BUTTON') {
            event.preventDefault();
            event.stopPropagation();

            _ppNode = parentParent(event.target);
            if (event.target.textContent === 'Done') {
                TodoApp.isDone(_ppNode);
                done(event.target);

            } else if (event.target.textContent === 'Close') {
                TodoApp.deleteTodo(_ppNode);
                closed(event.target)(_ppNode);

            }
        }
    }, false)

    TodoApp.addTodo = addTodo;

})(funkyJS, dom);