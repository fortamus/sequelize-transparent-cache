const classMethods = require('./methods/class')
const instanceMethods = require('./methods/instance')
/*
 * @param {Function} [options.logging=console.log] A function that gets executed every time Sequelize would log something.
 */
//TODO: Look at removing classMethods and instanceMethods returned object and change to constructor
module.exports = function(client, options) {
  /* istanbul ignore next: covered, but depends on installed sequelize version */
  return {
    withCache(modelClass) {
      modelClass.cache = function() {
        return classMethods(client, this, options)
      }

      modelClass.prototype.cache = function() {
        return instanceMethods(client, this, options)
      }

      return modelClass
    }
  }
}
