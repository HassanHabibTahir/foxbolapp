export interface Tag {
  id: string;
  label: string;
  category?: string;
  isSelected: boolean;
}

export interface TagCategory {
  name: string;
  tags: Tag[];
}

export const TAG_CATEGORIES: TagCategory[] = [
  {
    name: 'Parking Violations',
    tags: [
      { id: 'handicap', label: 'Handicap Zones', isSelected: false },
      { id: 'parked-grass', label: 'Parked on grass', isSelected: false },
      { id: 'commercial', label: 'Commercial Vehicles', isSelected: false },
      { id: 'permit', label: 'Permit Parking', isSelected: false },
      { id: 'curb-sidewalk', label: 'On curb/Sidewalk', isSelected: false },
      { id: 'double-parked', label: 'Double Parked', isSelected: false },
      { id: 'reserved', label: 'Reserved Parking', isSelected: false },
      { id: 'no-after-hours', label: 'No After Hours Parking', isSelected: false },
      { id: 'no-street', label: 'No Street Parking', isSelected: false },
      { id: 'double-parked-min', label: 'Double Parked Min. 6-8 inches over', isSelected: false }
    ]
  },
  {
    name: 'Safety & Security',
    tags: [
      { id: 'public-safety', label: 'Public Safety Threat', isSelected: false },
      { id: 'fire-lane', label: 'Fire lane/Tow away zones', isSelected: false },
      { id: 'blocking-entrance', label: 'Blocking Entrance/Exit', isSelected: false },
      { id: 'unauthorized', label: 'Unauthorized Vehicle', isSelected: false },
      { id: 'abandoned', label: 'Abandoned Vehicle', isSelected: false }
    ]
  },
  {
    name: 'Vehicle Status',
    tags: [
      { id: 'stickered', label: 'Stickered Vehicle', isSelected: false },
      { id: 'wrecked', label: 'Wrecked/Inoperable', isSelected: false },
      { id: 'flat-tire', label: 'Flat Tire', isSelected: false },
      { id: 'leaking-fluids', label: 'Leaking Fluids', isSelected: false }
    ]
  },
  {
    name: 'PPI Related',
    tags: [
      { id: 'ppi-patrol', label: 'PPI-Patrol', isSelected: false },
      { id: 'ppi-call-first', label: 'PPI-Call First', isSelected: false },
      { id: 'ppi-call-out', label: 'PPI-Call Out', isSelected: false },
      { id: 'ppi-fast-tow', label: 'PPI-Fast Tow', isSelected: false }
    ]
  },
  {
    name: 'Vehicle Restrictions',
    tags: [
      { id: 'no-boats', label: 'No Boats Allowed', isSelected: false },
      { id: 'no-trailers', label: 'No Trailers Allowed', isSelected: false },
      { id: 'no-motor-homes', label: 'No Motor Homes Allowed', isSelected: false },
      { id: 'no-campers', label: 'No Campers Allowed', isSelected: false }
    ]
  },
  {
    name: 'Other',
    tags: [
      { id: 'head-in', label: 'Head in Parking', isSelected: false },
      { id: 'spotter', label: 'Spotter Required', isSelected: false },
      { id: 'blocking-dumpster', label: 'Blocking Dumpster', isSelected: false },
      { id: 'for-sale', label: 'For Sale Vehicle', isSelected: false },
      { id: 'management', label: 'Management Request', isSelected: false },
      { id: 'no-parking', label: 'No Parking At All', isSelected: false },
      { id: 'blocking-garage', label: 'Blocking Garage', isSelected: false },
      { id: 'blocks-jacks', label: 'On Blocks/Jacks', isSelected: false }
    ]
  }
];