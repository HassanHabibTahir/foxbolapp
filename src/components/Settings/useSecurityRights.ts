import { SecurityRight } from './types';

export const useSecurityRights = (): SecurityRight[] => {
  return [
    { keyname: 'Payments Receive - Change Date', level: 1 },
    { keyname: 'Payments Received Report', level: 5 },
    { keyname: 'Perday - Change Amount', level: 3 },
    { keyname: 'Price Group to Printer', level: 5 },
    { keyname: 'Price Group to Screen', level: 5 },
    { keyname: 'Price List Report', level: 5 },
    { keyname: 'Price Lists by Group & Item', level: 5 },
    { keyname: 'Price Form', level: 5 },
    { keyname: 'Price2 Form', level: 5 },
    { keyname: 'ReceivIR Form', level: 2 },
    { keyname: 'Repair Records', level: 5 },
    { keyname: 'Response Time (2) Date', level: 5 },
    { keyname: 'Response Time (Driver & Date)', level: 5 },
    { keyname: 'Response Time Report', level: 6 },
    { keyname: 'Sales Analysis Report', level: 5 },
  ];
};