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
  name: string;
  color: string;
}

export interface Journey {
  id: string;
  name: string;
  journeySteps: JourneyStep[];
}

export enum ClientStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  IN_IMPLANTATION = "IN_IMPLANTATION",
}

export enum ClientServiceType {
  HIGH = "HIGH",
  LOW = "LOW",
  TECH = "TECH",
}

export interface ClientContact {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  jobTitle: string | null;
}
export interface Client {
  id: string;
  name: string;
  status: ClientStatus;
  description: string | null;
  csmResponsible: User?;
  userId: string | null;
  serviceModel: string | null;
  recurringContractRevenue: number;
  serviceType: ClientServiceType;
}