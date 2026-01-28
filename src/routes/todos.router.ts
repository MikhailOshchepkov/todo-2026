import { Router } from "express";
import { listTodos, createTodo } from "../services/todos.service";

const router = Router();

router.get("/", (_req, res) => {
  res.status(200).json({
    items: listTodos(),
    message: "List of todos",
  })
});

router.post('/', (req, res) => {
  //Вариант первый

  debugger
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


export default router;
