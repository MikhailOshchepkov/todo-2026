import { Router } from "express";
import { listTodos, createTodo, getTodoId, updateTodo, deleteTodo } from "../services/todos.service";

const router = Router();

router.get("/", (_req, res) => {
  res.status(200).json({
    items: listTodos(), 
    message: "List of todos",
  })
});

router.post('/', (req, res) => {
  //Вариант первый
  const {title} = req.body ?? {};

  //второй варинат
  // const title = req.body.title;

  if(!title){
    return res.status(400).json({
      status: 'Bad request',
      message: 'Title must be a strng',
    })
  }

    if(typeof title !== 'string'){
    return res.status(400).json({
      status: 'Bad request',
      message: 'Title must be a strng',
    })
  }

    if(title.trim().length === 0){
    return res.status(400).json({
      status: 'Bad request',
      message: 'Title must be a strng',
    })
  }
  const todo = createTodo(title);

  res.status(201).json({
    iteam: todo,
    message: 'Todo create',
  })
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
      message: 'Todo with id ${id} not found',
    })
  }

  res.status(200).json({
    iteam: todo,
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
      message: 'Todo with id ${id} not found',
    })
  }

  const updatedTodo = updateTodo(validation.numericId!, req.body);

  res.status(200).json({
    iteam: updatedTodo,
    message: 'Todo updated',
  });
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
      message: 'Todo with id ${id} not found',
    })
  }

  deleteTodo(validation.numericId!);

  res.status(200).json({
    message: 'Todo deleted',
  });
});

export default router;
