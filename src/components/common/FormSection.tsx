import React from 'react';

interface FormSectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  mt?:string
}

const FormSection: React.FC<FormSectionProps> = ({ 
  title, 
  children, 
  className = ''
}) => {
  return (
    <section className={`mb-4  ${className}  `} >
      {title && <h2 className="text-lg font-semibold mb-2">{title}</h2>}
      {children}
    </section>
  );
};

export default FormSection;