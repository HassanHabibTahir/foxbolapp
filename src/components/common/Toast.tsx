import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
}

export function Toast({ message, type }: ToastProps) {
  const bgColor = type === 'success' ? 'bg-green-50' : 'bg-red-50';
  const textColor = type === 'success' ? 'text-green-800' : 'text-red-800';
  const Icon = type === 'success' ? CheckCircle : XCircle;

  return (
    <div className={`fixed bottom-4 right-4 ${bgColor} p-4 rounded-md shadow-lg`}>
      <div className="flex items-center">
        <Icon className={`h-5 w-5 ${textColor} mr-2`} />
        <span className={textColor}>{message}</span>
      </div>
    </div>
  );
}