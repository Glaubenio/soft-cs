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
  id: string;
  name?: string | null
  username?: string | null
  email?: string | null
  jobTitle?: string | null
  account?: Account | null
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

export interface JourneyStep {
  id?: string;
  name: string;
  color: string;
  position: number;
  journeyId?: string;
}

export interface Journey {
  id: string;
  name: string;
  journeySteps: JourneyStep[];
}

export interface ClientContact {
  name: string | null;
  email: string | null;
  phoneNumber: string | null;
  jobTitle: string | null;
}

export interface JourneyStepClient {
  id: string;
  clientId: string;
  journeyStepId: string;
  journeyStep: JourneyStep | null;
}

export interface Client {
  id: string;
  name: string | null;
  status: "ACTIVE" | "INACTIVE" | "IN_IMPLANTATION";
  description: string | null;
  csmResponsible: User?;
  avatar?: { image_url: string }
  userId: string | null;
  contacts: ClientContact[];
  recurringContractRevenue: number;
  journeyStepsClients: JourneyStepClient[];
  serviceType: "HIGH" | "LOW" | "TECH" | null;
  tasks: Task[];
}

export interface Account {
  id: string;
  name: string | null;
  cnpj: string | null;
  segment: string | null;
  size: string | null;
  imageUpload?: { image_url: string } | null;
}