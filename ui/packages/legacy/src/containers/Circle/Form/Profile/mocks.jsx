export const initialRules = {
  type: 'CLAUSE',
  logicalOperator: 'OR',
  clauses: [
    {
      type: 'RULE',
      content: {
        key: '',
        condition: '',
        value: [],
      },
    },
  ],
}

export const responseTypes = {
  all: {
    conditions: [
      'EQUAL',
      'NOT_EQUAL',
      'LESS_THAN',
      'LESS_THAN_OR_EQUAL',
      'GREATER_THAN',
      'GREATER_THAN_OR_EQUAL',
      'BETWEEN',
      'STARTS_WITH',
    ],
  },
  date: {
    conditions: [
      'EQUAL',
      'NOT_EQUAL',
      'LESS_THAN',
      'LESS_THAN_OR_EQUAL',
      'GREATER_THAN',
      'GREATER_THAN_OR_EQUAL',
      'BETWEEN',
    ],
  },
  enum: {
    conditions: ['EQUAL', 'NOT_EQUAL'],
  },
  boolean: { conditions: ['EQUAL', 'NOT_EQUAL'] },
  string: { conditions: ['EQUAL', 'STARTS_WITH', 'NOT_EQUAL'] },
  decimal: {
    conditions: [
      'EQUAL',
      'NOT_EQUAL',
      'LESS_THAN',
      'LESS_THAN_OR_EQUAL',
      'GREATER_THAN',
      'GREATER_THAN_OR_EQUAL',
    ],
  },
  double: {
    conditions: [
      'EQUAL',
      'NOT_EQUAL',
      'LESS_THAN',
      'LESS_THAN_OR_EQUAL',
      'GREATER_THAN',
      'GREATER_THAN_OR_EQUAL',
    ],
  },
  integer: {
    conditions: [
      'EQUAL',
      'NOT_EQUAL',
      'LESS_THAN',
      'LESS_THAN_OR_EQUAL',
      'GREATER_THAN',
      'GREATER_THAN_OR_EQUAL',
    ],
  },
}

export const customerMapping = {
  income: {
    conditionType: 'double',
    type: 'decimal',
  },
  'addresses.country': {
    conditionType: 'string',
    type: 'string',
  },
  occupation: {
    conditionType: 'string',
    type: 'string',
  },
  gender: {
    values: [
      'M',
      'F',
    ],
    conditionType: 'string',
    type: 'enum',
  },
  'addresses.city': {
    conditionType: 'string',
    type: 'string',
  },
  'addresses.zipCode': {
    conditionType: 'string',
    type: 'string',
  },
  type: {
    values: [
      'CUSTOMER',
      'PROSPECT',
    ],
    conditionType: 'string',
    type: 'enum',
  },
  createdAt: {
    conditionType: 'date',
    type: 'date',
  },
  civilState: {
    conditionType: 'string',
    type: 'string',
  },
  currency: {
    conditionType: 'string',
    type: 'string',
  },
  'addresses.state': {
    conditionType: 'string',
    type: 'string',
  },
  personType: {
    values: [
      'F',
      'J',
    ],
    conditionType: 'string',
    type: 'enum',
  },
  'contacts.content.value': {
    conditionType: 'string',
    type: 'string',
  },
  'addresses.district': {
    conditionType: 'string',
    type: 'string',
  },
  fullName: {
    conditionType: 'string',
    type: 'string',
  },
  'contacts.contactType': {
    values: [
      'EMAIL',
      'PHONE',
    ],
    conditionType: 'string',
    type: 'enum',
  },
  'customFields.mainPhoneNumber': {
    conditionType: 'string',
    type: 'string',
  },
  birthDate: {
    conditionType: 'date',
    type: 'date',
  },
  'documents.number': {
    conditionType: 'string',
    type: 'string',
  },
  numberOfChildren: {
    conditionType: 'integer',
    type: 'integer',
  },
  'tags.tag': {
    conditionType: 'string',
    type: 'string',
  },
  'documents.docType': {
    values: [
      'RG',
      'CPF',
      'CNPJ',
      'PASSPORT',
    ],
    conditionType: 'string',
    type: 'enum',
  },
  'contacts.content.name': {
    conditionType: 'string',
    type: 'string',
  },
  status: {
    values: [
      'ACTIVE',
      'INACTIVE',
    ],
    conditionType: 'string',
    type: 'enum',
  },
}
