import React from 'react';
import FormSection from './common/FormSection';
import FormInput from './common/FormInput';

const BillingSection = () => {
  return (
    <FormSection>
      <div className="flex flex-wrap gap-4">
        <FormInput label="Lot Section" title="master.lotsection" size="sm" />
        <FormInput label="Call Type" title="master.calltype" size="md" />
        <FormInput label="Have Key?" title="master.keyinfo" size="xs" />
        <FormInput label="Hold Note" title="master.holdnote" size="lg" />
      </div>
    </FormSection>
  );
};

export default BillingSection;