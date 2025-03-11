export interface VehicleType {
  id: string;
  label: string;
}

export interface PricingRate {
  id: string;
  name: string;
  rates: {
    [key: string]: {
      amount: number;
      isCustom: boolean;
    };
  };
}