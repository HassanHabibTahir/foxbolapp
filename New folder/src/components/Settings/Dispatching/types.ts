export interface CustomField {
  id: string;
  name: string;
  type: 'DateTime' | 'Number' | 'Text' | 'Yes/No' | 'Selection';
}

export interface DispatchingSettings {
  destinationArrival: boolean;
  keepCompletedCalls: boolean;
  disableCompletionSound: boolean;
  autoDispatchRecall: boolean;
}