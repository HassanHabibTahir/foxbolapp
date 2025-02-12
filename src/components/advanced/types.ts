export interface DefaultSettings {
  defaultPO: string;
  defaultStorage: string;
  defaultAssetBodyType: string;
  defaultBillToAccount: string;
}

export interface AdvancedOptions {
  setHighPriority: boolean;
  alertManagers: boolean;
  hideCharges: boolean;
  hideDiscounts: boolean;
  includeInvoiceCopies: boolean;
  hidePhotos: boolean;
  allowViewFiles: boolean;
}

export interface MileageOptions {
  setUnloadedMileage: boolean;
  roundUpMileage: boolean;
  includeDeadhead: boolean;
  calculationMethod: string;
  fillInMethod: string;
}

export interface AdvancedSettings {
  defaults: DefaultSettings;
  advancedOptions: AdvancedOptions;
  mileageOptions: MileageOptions;
}