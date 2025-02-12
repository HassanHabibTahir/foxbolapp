import React from 'react';
import { SecurityRight } from './types';

interface SecurityTableRowProps {
  right: SecurityRight;
}

export const SecurityTableRow: React.FC<SecurityTableRowProps> = ({ right }) => {
  return (
    <tr className="border-t">
      <td className="py-3 px-4">{right.keyname}</td>
      <td className="py-3 px-4">{right.level}</td>
    </tr>
  );
};