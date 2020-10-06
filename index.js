const validator = require('./ajv')
const schema = require('./schema')

// success case.
// const obj = { type: 'data', usageCharacteristic: [{ name: 'upload', value: 3000 }, { name: 'download', value: 3000 }, { name: 'nss', value: '03333' }, { name: 'total', value: 3333 }], relatedParty: [{ name: 'chy', role: 'service', _nameType: 'xx.com' }, { name: 'kay', role: 'supplier', _nameType: 'xx.com' }] }
// const obj = { type: 'voice', usageCharacteristic: [{ name: 'duration', value: 3000 }, { name: 'missi', value: '12333' }], relatedParty: [{ name: 'chy', role: 'service', _nameType: 'xx.com' }, { name: 'kay', role: 'supplier', _nameType: 'xx.com' }] }
// error case.
// const obj = { type: 'sms', usageCharacteristic: [{ name: 'upload', value: 3000 }, { name: 'download', value: 3000 }, { name: 'nss', value: '03333' }, { name: 'total', value: 3333 }], relatedParty: [{ name: 'chy', role: 'service', _nameType: 'xx.com' }, { name: 'kay', role: 'supplier', _nameType: 'xx.com' }] }
const obj = { type: 'data', usageCharacteristic: [{ name: 'upload', value: 3000 }, { name: 'download', value: 3000 }, { name: 'nss', value: '03333' }, { name: 'total', value: 3333 }], relatedParty: [{ name: 'chy', role: 'supplier', _nameType: 'xx.com' }, { name: 'kay', role: 'supplier', _nameType: 'xx.com' }] }
// const obj = { type: 'sms', usageCharacteristic: [{ name: 'upload', value: 3000 }, { name: 'download', value: 3000 }, { name: 'nss', value: '03333' }, { name: 'total', value: 3333 }], relatedParty: [{ name: 'chy', role: 'supplier', _nameType: 'xx.com' }, { name: 'kay', role: 'supplier', _nameType: 'xx.com' }] }

const { isValid, parm } = validator(obj, schema)
console.log('parm: ', parm)
console.log('isValid: ', isValid)
