module.exports = {
  type: 'object',
  required: ['type', 'usageCharacteristic', 'relatedParty'],
  properties: {
    type: {
      enum: ['data', 'sms', 'voice'],
      type: 'string',
      isNotEmpty: true
    },
    usageCharacteristic: {
      type: 'array',
      minItems: 1,
      uniqueItems: true,
      isNotDuplicate: ['name']
    },
    relatedParty: {
      type: 'array',
      maxItems: 2,
      uniqueItems: true,
      isNotDuplicate: ['role'],
      items: {
        allOf: [
          {
            type: 'object',
            required: ['role', 'name', '_nameType'],
            properties: {
              role: {
                enum: ['supplier', 'service'],
                type: 'string',
                isNotEmpty: true
              },
              name: {
                type: 'string',
                isNotEmpty: true
              },
              _nameType: {
                type: 'string',
                isNotEmpty: true
              }
            }
          }
        ]
      }
    }
  },
  allOf: [
    {
      if: {
        properties: { type: { const: 'data' } }
      },
      then: {
        properties: {
          usageCharacteristic: {
            // isMatch: ['upload', 'download', 'total']
            isMatch: {
              selects: [''],
              match: ['']
            }
          }
        }
      },
      else: {
        if: {
          properties: { type: { const: 'sms' } }
        },
        then: {
          properties: {
            usageCharacteristic: {
              isMatch: ['transaction']
            }
          }
        },
        else: {
          if: {
            properties: { type: { const: 'voice' } }
          },
          then: {
            properties: {
              usageCharacteristic: {
                isMatch: ['duration']
              }
            }
          },
          else: {

          }
        }
      }
    }
  ]
}
