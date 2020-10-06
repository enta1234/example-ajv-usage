const Ajv = require('ajv')
const ajv = new Ajv({
  allErrors: true
}).addKeyword('isMatch', {
  type: 'array',
  validate: function (schema, data) {
    let matchCount = 0
    if (schema.length) {
      for (const item of data) {
        if (schema.includes(item.name)) {
          matchCount += 1
        }
      }
      return matchCount === schema.length
    } else {
      return true
    }
  },
  metaSchema: {
    type: 'array'
  }
}).addKeyword('isNotDuplicate', {
  type: 'array',
  validate: function (schema, data) {
    if (schema.length) {
      for (const item of schema) {
        const valueArr = data.map(function (i) { return i[item] })
        const isDuplicate = valueArr.some(function (i, idx) {
          return valueArr.indexOf(i) !== idx
        })
        return !isDuplicate
      }
    } else {
      return true
    }
  },
  metaSchema: {
    type: 'array'
  }
}).addKeyword('isNotEmpty', {
  type: 'string',
  validate: function (condition, data) {
    if (condition) {
      if (typeof data === 'object') {
        return data.length > 0
      }
      return typeof data === 'string' && data.trim() !== ''
    } else {
      return true
    }
  }
})

module.exports = (data = {}, schema = {}, logger = console) => {
  let resultValidate = false
  const resultObj = {
    isValid: false,
    parm: ''
  }
  try {
    let parmError = ''
    const validate = ajv.compile(schema)
    resultValidate = validate(data)
    // console.log(validate)

    const missingParam = []
    const invalidParm = []
    if (!resultValidate) {
      logger.debug(`VALIDATE ${schema.name || ''} FAIL.`)
      for (const error of validate.errors) {
        logger.debug(error.message)
        // appLog.debug('PARAM', error)
        if (error.keyword === 'required') {
          logger.debug('error.params.missingProperty: ', error.params.missingProperty)
          let val = error.params.missingProperty
          if (error.dataPath) {
            const path = error.dataPath.replace('.', '')
            val = path + '.' + val
          }

          // if (missingParam.length !== 0) {
          //   val = ' ' + val
          // }

          val = val.replace(/^\./, '')

          logger.debug('missingParam: ', val)
          if (!missingParam.includes(val)) {
            missingParam.push(val)
          }
          logger.debug('missingParam: ', missingParam)
        } else {
          const val = error.dataPath.replace(/^(\.|\['|\["|"|')|('\]|"\]|"|')$/g, '')
          // if (invalidParm.length !== 0) {
          //   val = ' ' + val
          // }
          if (!invalidParm.includes(val)) {
            invalidParm.push(val)
          }
        }

        const path = error.dataPath ? (' ' + error.dataPath + ' ') : ' '
        const err = `${schema.name || ''}${path}${error.message}`
        logger.debug(err)
        // parmError.push(err)
      }
      if (missingParam.length > 0) {
        // appLog.debug(missingParam)
        parmError = 'missing=' + missingParam.join(', ')
      } else {
        logger.debug(invalidParm)
        parmError = 'invalid=' + invalidParm.join(', ')
      }
    } else {
      logger.debug(`VALIDATE ${schema.name || ''} SUCCESS.`)
    }
    resultObj.parm = parmError
    resultObj.isValid = resultValidate
    // appLog.debug('resultObj: ', resultObj)
    return resultObj
  } catch (e) {
    logger.debug(e)
    resultObj.isValid = false
    resultObj.parm = (e.error)
    // appLog.debug('resultObj: ', resultObj)
    return resultObj
  }
}
