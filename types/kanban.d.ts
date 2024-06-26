export interface KanbanBoardTaskMember {
    id: number;
    name: string;
    avatar: string;
}

export interface KanbanBoardTask {
    id: number;
    name: string;
    description: string;
    completed: boolean;
    daysLeft: number;
    attachment?: string;
    members: KanbanBoardTaskMember[];
}

export interface KanbanBoard {
    id: number;
    title: string;
    tasks: KanbanBoardTask[];
}
