export interface Session {
  id: string;
  _id: string;
  name: string;
  avatar?: string | null | undefined;
  isAdmin: boolean;
  userLanguage: string;
  userStatus: string;
}


export interface User {
  name?: string | null
}
export interface Task {
  id: string
  title: string
  responsible: User?;
  client?: User
  status: string | null
  content: string | null
  priority: string | null
  startDate: Date | null
  endDate: Date | null
  responsibleId?: string | null
  clientId?: string | null
}