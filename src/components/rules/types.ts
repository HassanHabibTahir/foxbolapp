export interface Rule {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface RuleFormData {
  name: string;
  description?: string;
}