import { Router } from "express";
import { 
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
} from "../services/todos.service";

const router = Router();


router.get("/", (_req, res) => {
  res.status(200).json({
    items: listTodos(), 
    message: "List of todos",
  })
});

router.post('/', (req, res) => {
  const {title, categoryId} = req.body ?? {};

  if(!title){
    return res.status(400).json({
      status: 'Bad request',
      message: 'Title must be provided',
    })
  }

  if(typeof title !== 'string'){
    return res.status(400).json({
      status: 'Bad request',
      message: 'Title must be a string',
    })
  }

  if(title.trim().length === 0){
    return res.status(400).json({
      status: 'Bad request',
      message: 'Title must be a non-empty string',
    })
  }

  if(!categoryId){
    return res.status(400).json({
      status: 'Bad request',
      message: 'Category ID must be provided',
    })
  }

  if(typeof categoryId !== 'number' || !Number.isInteger(categoryId) || categoryId <= 0){
    return res.status(400).json({
      status: 'Bad request',
      message: 'Category ID must be a positive integer',
    })
  }

  try {
    const todo = createTodo(title, categoryId);

    res.status(201).json({
      item: todo,
      message: 'Todo created',
    })
  } catch (error: any) {
    res.status(400).json({
      status: 'Bad request',
      message: error.message,
    })
  }
});

function validateId(id: any): { isValid: boolean; message?: string; numericId?: number }{
  if(id === undefined || id === null){
    return {
      isValid: false,
      message: 'Id must be a number',
    }
  }

  const numericId = Number(id);

  if (isNaN(numericId) || !Number.isInteger(numericId) || numericId <= 0) {
    return {
      isValid: false,
      message: 'ID must be a positive integer',
    }
  }

  return {
    isValid: true,
    numericId,
  }
}

router.get('/:id', (req, res) => {
  const {id} = req.params;
  const validation = validateId(id);

  if(!validation.isValid){
    return res.status(400).json({
      status: 'Bad request',
      message: validation.message,
    })
  }

  const todo = getTodoId(validation.numericId!);

  if(!todo){
    return res.status(404).json({
      status: 'Not found',
      message: `Todo with id ${id} not found`,
    })
  }

  res.status(200).json({
    item: todo,
    message: 'Todo found',
  });
});

router.put('/:id', (req, res) => {
  const {id} = req.params;
  const validation = validateId(id);

  if(!validation.isValid){
    return res.status(400).json({
      status: 'Bad request',
      message: validation.message,
    })
  }

  const todo = getTodoId(validation.numericId!);

  if(!todo){
    return res.status(404).json({
      status: 'Not found',
      message: `Todo with id ${id} not found`,
    })
  }

  try {
    const updatedTodo = updateTodo(validation.numericId!, req.body);

    res.status(200).json({
      item: updatedTodo,
      message: 'Todo updated',
    });
  } catch (error: any) {
    res.status(400).json({
      status: 'Bad request',
      message: error.message,
    })
  }
});

router.delete('/:id', (req, res) => {
  const {id} = req.params;
  const validation = validateId(id);

  if(!validation.isValid){
    return res.status(400).json({
      status: 'Bad request',
      message: validation.message,
    })
  }

  const todo = getTodoId(validation.numericId!);

  if(!todo){
    return res.status(404).json({
      status: 'Not found',
      message: `Todo with id ${id} not found`,
    })
  }

  deleteTodo(validation.numericId!);

  res.status(200).json({
    message: 'Todo deleted',
  });
});

// Получить все категории
router.get("/categories/all", (_req, res) => {
  const categories = listCategories();
  
  // Для каждой категории добавляем количество тудушек
  const categoriesWithCount = categories.map(category => {
    const todos = getTodosByCategory(category.id);
    return {
      ...category,
      todoCount: todos.length
    };
  });
  
  res.status(200).json({
    items: categoriesWithCount, 
    message: "List of categories",
  });
});

// Получить тудушки по категории
router.get("/categories/:categoryId/todos", (req, res) => {
  const {categoryId} = req.params;
  const validation = validateId(categoryId);

  if(!validation.isValid){
    return res.status(400).json({
      status: 'Bad request',
      message: validation.message,
    })
  }

  const category = getCategoryById(validation.numericId!);
  
  if(!category){
    return res.status(404).json({
      status: 'Not found',
      message: `Category with id ${categoryId} not found`,
    })
  }

  const todos = getTodosByCategory(validation.numericId!);
  
  res.status(200).json({
    category,
    items: todos,
    message: `Todos for category "${category.name}"`,
  });
});

// Создать категорию
router.post('/categories', (req, res) => {
  const {name, description} = req.body ?? {};

  if(!name){
    return res.status(400).json({
      status: 'Bad request',
      message: 'Category name must be provided',
    })
  }

  if(typeof name !== 'string'){
    return res.status(400).json({
      status: 'Bad request',
      message: 'Category name must be a string',
    })
  }

  if(name.trim().length === 0){
    return res.status(400).json({
      status: 'Bad request',
      message: 'Category name must be a non-empty string',
    })
  }

  if(description && typeof description !== 'string'){
    return res.status(400).json({
      status: 'Bad request',
      message: 'Description must be a string',
    })
  }

  try {
    const category = createCategory(name, description);

    res.status(201).json({
      item: category,
      message: 'Category created',
    })
  } catch (error: any) {
    res.status(400).json({
      status: 'Bad request',
      message: error.message,
    })
  }
});

// Получить категорию по ID
router.get('/categories/:id', (req, res) => {
  const {id} = req.params;
  const validation = validateId(id);

  if(!validation.isValid){
    return res.status(400).json({
      status: 'Bad request',
      message: validation.message,
    })
  }

  const category = getCategoryById(validation.numericId!);

  if(!category){
    return res.status(404).json({
      status: 'Not found',
      message: `Category with id ${id} not found`,
    })
  }

  const todos = getTodosByCategory(validation.numericId!);

  res.status(200).json({
    item: {
      ...category,
      todos: todos,
      todoCount: todos.length
    },
    message: 'Category found',
  });
});

// Обновить категорию
router.put('/categories/:id', (req, res) => {
  const {id} = req.params;
  const validation = validateId(id);

  if(!validation.isValid){
    return res.status(400).json({
      status: 'Bad request',
      message: validation.message,
    })
  }

  const category = getCategoryById(validation.numericId!);

  if(!category){
    return res.status(404).json({
      status: 'Not found',
      message: `Category with id ${id} not found`,
    })
  }

  const updatedCategory = updateCategory(validation.numericId!, req.body);

  res.status(200).json({
    item: updatedCategory,
    message: 'Category updated',
  });
});

// Удалить категорию
router.delete('/categories/:id', (req, res) => {
  const {id} = req.params;
  const validation = validateId(id);

  if(!validation.isValid){
    return res.status(400).json({
      status: 'Bad request',
      message: validation.message,
    })
  }

  const category = getCategoryById(validation.numericId!);

  if(!category){
    return res.status(404).json({
      status: 'Not found',
      message: `Category with id ${id} not found`,
    })
  }

  const deletedTodosCount = deleteTodosByCategory(validation.numericId!);
  deleteCategory(validation.numericId!);

  res.status(200).json({
    message: `Category deleted (removed ${deletedTodosCount} todos)`,
  });
});

// Массовое обновление тудушек по категории
router.put('/categories/:id/todos', (req, res) => {
  const {id} = req.params;
  const validation = validateId(id);

  if(!validation.isValid){
    return res.status(400).json({
      status: 'Bad request',
      message: validation.message,
    })
  }

  const category = getCategoryById(validation.numericId!);

  if(!category){
    return res.status(404).json({
      status: 'Not found',
      message: `Category with id ${id} not found`,
    })
  }

  const updates = req.body;
  
  // Не позволяем менять categoryId через массовое обновление
  if (updates.categoryId) {
    return res.status(400).json({
      status: 'Bad request',
      message: 'Cannot change categoryId in bulk update',
    })
  }

  const updatedCount = updateTodosByCategory(validation.numericId!, updates);

  res.status(200).json({
    message: `Updated ${updatedCount} todos in category "${category.name}"`,
    category: category,
    updatedCount: updatedCount
  });
});

// Массовое удаление тудушек по категории
router.delete('/categories/:id/todos', (req, res) => {
  const {id} = req.params;
  const validation = validateId(id);

  if(!validation.isValid){
    return res.status(400).json({
      status: 'Bad request',
      message: validation.message,
    })
  }

  const category = getCategoryById(validation.numericId!);

  if(!category){
    return res.status(404).json({
      status: 'Not found',
      message: `Category with id ${id} not found`,
    })
  }

  const deletedCount = deleteTodosByCategory(validation.numericId!);

  res.status(200).json({
    message: `Deleted ${deletedCount} todos from category "${category.name}"`,
    category: category,
    deletedCount: deletedCount
  });
});

export default router;