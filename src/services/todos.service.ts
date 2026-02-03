import { arrayBuffer } from "node:stream/consumers";
import { Todo, Todos, Category, Categories} from "../types/todo.type";

const store = new Map<Todo['id'], Todo>();
let iterator = 0;

const categoryStore = new Map<Category['id'], Category>();
let categoryIterator = 0;

function listTodos(): Todos {
    return Array.from(store.values());
}

function createTodo(title: Todo['title'], categoryId: Todo['categoryId']): Todo {
    if(!title) {
        throw new Error('Title is required');
    }

    if(!categoryId || ! categoryStore.has(categoryId)){
        throw new Error('Valid category ID is required');
    }

    const todo: Todo = {
        id: ++iterator,
        title,
        categoryId,
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
    
    if(updates.categoryId && !categoryStore.has(updates.categoryId)){
        throw new Error('Category not found');
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


function listCategories(): Categories {
    return Array.from(categoryStore.values());
}


function getTodosByCategory(categoryId: Category['id']): Todo[] {
    return Array.from(store.values()).filter((todo) => todo.categoryId === categoryId);
}   

function createCategory(name: Category['name'], description?: Category['discription']): Category {
    if(!name) {
        throw new Error('Name is required');
    }

    const category: Category = {
        id: ++categoryIterator,
        name,
        discription: description,
        createdAt: new Date(),
        updatedAt: new Date(),
    }
    categoryStore.set(category.id, category);
    return category;
}

function getCategoryById(id: Category['id']): Category | undefined {
    return categoryStore.get(id);
}


function updateCategory(id: Category['id'], updates: Partial<Omit<Category, 'id'>>): Category | undefined {
    const existingCategory = categoryStore.get(id);
    if (!existingCategory) {
        return undefined;
    }
    
    const updatedCategory: Category = {
        ...existingCategory,
        ...updates,
        id,
        updatedAt: new Date()
    };
    
    categoryStore.set(id, updatedCategory);
    return updatedCategory;
}


function deleteCategory(id: Category['id']): boolean {
    const todosToDelete = Array.from(store.values()).filter((todo) => todo.categoryId === id);
    todosToDelete.forEach((todo) => deleteTodo(todo.id));
    return categoryStore.delete(id);
}

function deleteTodosByCategory(categoryId: Category['id']): boolean {
    const todosToDelete = Array.from(store.values()).filter((todo) => todo.categoryId === categoryId);
    todosToDelete.forEach((todo) => deleteTodo(todo.id));
    return todosToDelete.length > 0;
}


function updateTodosByCategory(categoryId: Category['id'], updates: Partial<Omit<Todo, 'id' | 'categoryId'>>): number {
        const todosToUpdate = Array.from(store.values()).filter(todo => todo.categoryId === categoryId);
    
    todosToUpdate.forEach(todo => {
        const updatedTodo: Todo = {
            ...todo,
            ...updates,
            id: todo.id,
            updatedAt: new Date()
        };
        store.set(todo.id, updatedTodo);
    });
    
    return todosToUpdate.length;
}

export {
    listTodos,
    createTodo,
    getTodoId,
    updateTodo,
    deleteTodo,
    listCategories,
    getTodosByCategory,
    createCategory,
    getCategoryById,
    updateCategory,
    deleteCategory,
    deleteTodosByCategory,
    updateTodosByCategory
};