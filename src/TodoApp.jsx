import { useReducer, useEffect, useRef } from 'react';

// Actions for reducer
const ACTIONS = {
    ADD_TODO: 'add-todo',
    TOGGLE_TODO: 'toggle-todo',
    DELETE_TODO: 'delete-todo',
    LOAD_TODOS: 'load-todos',
};

// Reducer function for todos state
function reducer(todos, action) {
    switch (action.type) {
        case ACTIONS.ADD_TODO:
            return [...todos, newTodo(action.payload.name)];
        case ACTIONS.TOGGLE_TODO:
            return todos.map(todo =>
                todo.id === action.payload.id ? { ...todo, complete: !todo.complete } : todo
            );
        case ACTIONS.DELETE_TODO:
            return todos.filter(todo => todo.id !== action.payload.id);
        case ACTIONS.LOAD_TODOS:
            return action.payload.todos;
        default:
            return todos;
    }
}

function newTodo(name) {
    return { id: Date.now(), name: name.trim(), complete: false };
}

export default function TodoApp() {
    const [todos, dispatch] = useReducer(reducer, []);
    const inputRef = useRef();

    // Load todos from localStorage on mount
    useEffect(() => {
        const storedTodos = JSON.parse(localStorage.getItem('todos')) || [];
        dispatch({ type: ACTIONS.LOAD_TODOS, payload: { todos: storedTodos } });
    }, []);

    // Save todos to localStorage whenever todos change
    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos));
    }, [todos]);

    function handleSubmit(e) {
        e.preventDefault();
        const name = inputRef.current.value;
        if (!name.trim()) return;
        dispatch({ type: ACTIONS.ADD_TODO, payload: { name } });
        inputRef.current.value = '';
    }

    return (
        <div className="todo-app" >
            <h1>To-Do List</h1>
            <form onSubmit={handleSubmit} >
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Add a new task"
                    aria-label="New todo"
                    
                />
                <button type="submit" style={{ padding: '0.5rem 1rem' }}>
                    Add
                </button>
            </form>

            <ul>
                {todos.map(todo => (
                    <li
                        key={todo.id}
                    >
                        <input
                            id={`todo-${todo.id}`}
                            type="checkbox"
                            checked={todo.complete}
                            onChange={() => dispatch({ type: ACTIONS.TOGGLE_TODO, payload: { id: todo.id } })}
                            aria-label={`Mark ${todo.name} as complete`}
                        />
                        <label
                            htmlFor={`todo-${todo.id}`}
                        >
                            {todo.name}
                        </label>
                        <button
                            onClick={() => dispatch({ type: ACTIONS.DELETE_TODO, payload: { id: todo.id } })}
                            aria-label={`Delete ${todo.name}`}
                            
                        >
                            &times;
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
