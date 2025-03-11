import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
    <AlertTriangle className="w-5 h-5 text-red-500" />
    <p className="text-red-700">{message}</p>
  </div>
);

export default ErrorMessage;