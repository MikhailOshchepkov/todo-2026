import { arrayBuffer } from "node:stream/consumers";
import { Todo, Todos,} from "../types/todo.type";

const store = new Map<Todo['id'], Todo>();
let iterator = 0;

function listTodos(): Todos {
    return Array.from(store.values());
}

function createTodo(title: Todo['title']): Todo {
    if(!title) {
        throw new Error('Title is required');
    }

    const todo: Todo = {
        id: ++iterator,
        title,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
    }
    store.set(todo.id, todo);
    return todo;
}

function getTodoId(id: Todo['id']): Todo | undefined {
    return store.get(id);
}


function updateTodo(id: Todo['id'], updates: Partial<Omit<Todo, 'id'>>): Todo | undefined {
    const existingTodo = store.get(id);
    if (!existingTodo) {
        return undefined;
    }
    
    const updatedTodo: Todo = {
        ...existingTodo,
        ...updates,
        id,
        updatedAt: new Date()
    };
    
    store.set(id, updatedTodo);
    return updatedTodo;
}

function deleteTodo(id: Todo['id']): boolean {
    return store.delete(id);
}


export {
    listTodos,
    createTodo,
    getTodoId,
    updateTodo,
    deleteTodo
};