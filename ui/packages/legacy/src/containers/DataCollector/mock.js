export const mock = {
  metadata: {
    id: '2d30a464fe8d9fd3dad15bb942337f32',
    checksum: '07f7d83a56b37068728ed20e7e75c20a',
    name: 'Payments#pay',
    url: 'http://localhost:8080/v1/payments',
  },
  fields: [
    'description',
    'amount',
    'currency',
    'customer.name.batata',
    'customer.cpf',
    'customer.city',
    'creditCard.holder',
    'creditCard.expiry',
    'creditCard.type',
    'creditCard.lastDigits',
    'creditCard.number',
    'creditCard.securityCode',
  ],
  whitelist: [
    'description',
    'amount',
    'currency',
    'customer.name',
    'creditCard.holder',
    'creditCard.expiry',
    'creditCard.type',
    'creditCard.lastDigits',
  ],
}

export const jsonResumeMock = {
  description: true,
  amount: false,
  currency: true,
  customer: { name: true, cpf: true, city: false },
  creditCard: {
    holder: false,
    expiry: false,
    type: false,
    lastDigits: false,
    number: true,
    securityCode: true,
  },
}
