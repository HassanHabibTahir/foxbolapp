import React, { forwardRef } from 'react';

interface FormSectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  mt?: string;
}

const FormSection = forwardRef<HTMLDivElement, FormSectionProps>(({ 
  title, 
  children, 
  className = '',
  mt = ''
}, ref) => {
  return (
    <section ref={ref} className={`mb-4 ${mt} ${className}`}>
      {title && <h2 className="text-lg font-semibold mb-2">{title}</h2>}
      {children}
    </section>
  );
});

FormSection.displayName = "FormSection";

export default FormSection;
