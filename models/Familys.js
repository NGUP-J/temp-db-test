const { CosmosClient } = require('@azure/cosmos');
const config = require('../config');

const endpoint = config.endpoint;
const key = config.key;
const databaseId = config.database.id;
const containerId = config.container.id;

const client = new CosmosClient({ endpoint, key });
const database = client.database(databaseId);
const container = database.container(containerId);

class Family {
  constructor(data) {
    this.id = data.id;
    this.partitionKey = data.partitionKey;
    this.Country = data.Country;
    this.lastName = data.lastName;
    this.parents = data.parents;
    this.children = data.children;
    this.address = data.address;
    this.isRegistered = data.isRegistered;
  }

  static async getAll() {
    const { resources: items } = await container.items.readAll().fetchAll();
    return items.map(item => new Family(item));
  }

  static async create(data) {
    const { resource: createdItem } = await container.items.create(data);
    return new Family(createdItem);
  }

  static async update(id, data) {
    const { resource: updatedItem } = await container.item(id).replace(data);
    return new Family(updatedItem);
  }
}

module.exports = Family;