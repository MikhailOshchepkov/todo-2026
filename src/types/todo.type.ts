type Todo = {
    id: number;
    title: string;
    completed: boolean;
    createdAt: Date;
    updatedAt: Date;
}

type Todos = Todo[];

export {Todo, Todos};