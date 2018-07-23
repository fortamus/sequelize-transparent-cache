const classMethods = require('./methods/class')
const instanceMethods = require('./methods/instance')

module.exports = function (client) {
  /* istanbul ignore next: covered, but depends on installed sequelize version */
  return {
    withCache (modelClass) {
      modelClass.cache = function () {
        return classMethods(client, this)
      }

      modelClass.prototype.cache = function () {
        return instanceMethods(client, this)
      }

      return modelClass
    },
    classMethods: {
      cache () {
        return classMethods(client, this)
        }
        },
        instanceMethods: {
            cache() {
              return instanceMethods(client, this)
      }
    }
  }
}
