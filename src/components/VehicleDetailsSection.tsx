// import React, { useRef } from 'react';
// import FormSection from './common/FormSection';
// import FormInput from './common/FormInput';

// interface VehicleDetailsProps {
//   odometer?: string;
//   condition?: string;
//   reason?: string;
//   onChange?: (field: string, value: string) => void;
//   onEnterPress?: () => void;
// }

// const VehicleDetailsSection: React.FC<VehicleDetailsProps> = ({
//   odometer = '',
//   condition = '',
//   reason = '',
//   onChange = () => {},
//   onEnterPress
// }) => {
//   // Create refs for keyboard navigation
//   const conditionRef = useRef<HTMLInputElement>(null);
//   const reasonRef = useRef<HTMLInputElement>(null);

//   return (
//     <FormSection title="C - Vehicle Details" >
//       <div className="flex flex-wrap gap-4 items-start">
//         <FormInput 
//           label="Odometer" 
//           className="h-10 text-[14px]"
//           title="master.odometer" 
//           value={odometer}
//           onChange={(e) => onChange('odometer', e.target.value)}
//           onEnterPress={() => conditionRef.current?.focus()}
//         />
//         <div className="flex-1">
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Condition
//           </label>
//           <input
//             ref={conditionRef}
//             type="text"
//             className="h-10 text-[14px] mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             title="master.condition"
//             value={condition}
//             onChange={(e) => onChange('condition', e.target.value)}
//             onKeyDown={(e) => {
//               if (e.key === 'Enter' && !e.shiftKey) {
//                 e.preventDefault();
//                 reasonRef.current?.focus();
//               }
//             }}
//             maxLength={50}
//             style={{ minWidth: '400px' }}
//             placeholder="Enter vehicle condition"
//           />
//         </div>
//         <FormInput 
//           ref={reasonRef}
//           className='h-10 text-[14px]'
//           label="Reason" 
//           title="master.reason" 
//           value={reason}
//           onChange={(e) => onChange('reason', e.target.value)}
//           onEnterPress={onEnterPress}
//           placeholder="Enter reason"
//         />
//       </div>
//     </FormSection>
//   );
// };

// export default VehicleDetailsSection;