export const sampleDispatch = {
  dispatch_number: '123456',
  driver: {
    id: 'DRV001',
    name: 'John Smith',
    license: 'TX12345'
  },
  vehicle: {
    vin: '1HGCM82633A123456',
    year: '2018',
    make: 'Honda',
    model: 'Accord',
    color: 'Silver',
    license_plate: 'ABC123',
    license_state: 'TX'
  },
  locations: {
    pickup: '123 Main St, Houston, TX 77001',
    dropoff: '456 Storage Ln, Houston, TX 77002'
  },
  invoice_items: [
    { description: 'Basic Tow', quantity: 1, price: 125.00 },
    { description: 'Storage (Daily)', quantity: 2, price: 45.00 },
    { description: 'Winching', quantity: 0.5, price: 100.00 },
    { description: 'Admin Fee', quantity: 1, price: 25.00 }
  ]
};