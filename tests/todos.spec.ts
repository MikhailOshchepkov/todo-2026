
import { createTodo, listTodos, createCategory } from "../src/services/todos.service";

describe('todos service', () => {

    test('list todos is empty', () => {
        const all = listTodos();
        expect(all).toEqual([]);
    })

    test('create and list todos', () => {
        // Сначала создаем категорию
        const category = createCategory('Test Category');
        // Затем создаем todo с categoryId
        const todo = createTodo('test', category.id);
        const all = listTodos();
        expect(all).toEqual([todo]);
    })

    test('Неправильное создание - без title', () => {
        const category = createCategory('Test Category 2');
        expect(() => createTodo('', category.id)).toThrow('Title is required');
    })

    test('Неправильное создание - без categoryId', () => {
        expect(() => createTodo('test title', 0)).toThrow('Valid category ID is required');
    })

    test('Неправильное создание - с несуществующим categoryId', () => {
        expect(() => createTodo('test title', 999)).toThrow('Valid category ID is required');
    })
})