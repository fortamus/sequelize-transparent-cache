function instanceToData(instance) {
  return instance.get({ plain: true })
}

function dataToInstance(model, data, options = {}) {
  if (!data) {
    return data
  }

  const instance = model.build(data, Object.assign({}, { isNewRecord: false }, options))

  if (data.updatedAt) {
    instance.setDataValue('updatedAt', data.updatedAt)
  }

  if (data.createdAt) {
    instance.setDataValue('createdAt', data.createdAt)
  }

  if (data.deletedAt) {
    instance.setDataValue('deletedAt', data.deletedAt)
  }

  return instance
}

module.exports = {
  instanceToData,
  dataToInstance
}
