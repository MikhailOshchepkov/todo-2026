type Todo = {
    id: number;
    title: string;
    completed: boolean;
    categoryId: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface Category {
    id: number;
    name: string;
    discription?: string;
    createdAt: Date;
    updatedAt: Date;
}

type Todos = Todo[];

export {Todo, Todos};
export type Categories = Category[];