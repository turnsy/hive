/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("n6ic0uc79abybqb")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "6bgyflgp",
    "name": "user",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "_pb_users_auth_",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("n6ic0uc79abybqb")

  // remove
  collection.schema.removeField("6bgyflgp")

  return dao.saveCollection(collection)
})
