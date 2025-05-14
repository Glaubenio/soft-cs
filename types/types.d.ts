export interface Session {
  id: string;
  _id: string;
  name: string;
  avatar?: string | null | undefined;
  isAdmin: boolean;
  userLanguage: string;
  userStatus: string;
}


interface User {
  name: string
}
export interface Task {
  id: string
  title: string
  responsible: User?;
  client: User?;
  status: string
  content: string
  priority: string
  startAt: string
  endAt: string
  startDate: Date
  endDate: Date
  priority: string
  responsibleId: string?
  clientId: string?
}

export interface User {
  id: string
  name: string
}