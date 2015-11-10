/* global funkyJS, store, TodoApp */
;(function (f, d) {

    var DATA = {
        keys: {},
        todos: [],
        unique: -1
    };



    function formatTStamp (tstamp) {
        return tstamp.getDate() + '.' + (tstamp.getMonth() + 1) + '.' + tstamp.getFullYear();
    }

    function formatTodoEntry (description) {
        var _now = +(new Date()),
            _die = description.dead * (3600000 * 24);

        description.todoId = 'todo-' + (DATA.unique += 1);
        description.deadline = formatTStamp(new Date(_now + _die));

        return description;
    }



    function saveStore () {
        store.set('funkyjs-todoapp', DATA);
    }

    function readStore () {
        var _data = store.get('funkyjs-todoapp');
        if (f.isObject(_data)) {
            DATA = _data;
            DATA.todos.forEach(f.maybe(TodoApp.addTodo));
        }
    }



    var hasKey = function (key) {
        return DATA.keys.hasOwnProperty(key);
    }

    function storeTodo (todo) {
        if (!hasKey(todo.todoId)) {
            DATA.todos.push(todo);
            DATA.keys[todo.todoId] = DATA.todos.length - 1;
            TodoApp.addTodo(todo);
            saveStore();
        }
    }

    function deleteTodo (todoNode) {
        if (hasKey(todoNode.dataset.id)) {
            DATA.todos[DATA.keys[todoNode.dataset.id]] = undefined;
            delete DATA.keys[todoNode.dataset.id];
            saveStore();
        }
    }

    function isDone (todoNode) {
        if (hasKey(todoNode.dataset.id)) {
            DATA.todos[DATA.keys[todoNode.dataset.id]].isDone = true;
            saveStore();
        }
    }



    var saveTodo = f.pipe(
        formatTodoEntry,
        storeTodo
    );


    TodoApp.saveTodo = saveTodo;
    TodoApp.deleteTodo = deleteTodo;
    TodoApp.isDone = isDone;
    readStore();

})(funkyJS, store);