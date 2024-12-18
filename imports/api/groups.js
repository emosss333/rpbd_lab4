import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

const CollectionName = 'groups';
export const GroupsCollection = new Mongo.Collection(CollectionName);
GroupsCollection.collectionName = CollectionName;
export const GroupsFields = [
  { name: 'group_name', label: 'Название группы', type: 'text' },
];

export const GetGroupById = async (id) => {
  try {
    const result = await Meteor.callAsync(CollectionName + '.getById', id);
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const groupSchema = { group_name: String };

Meteor.methods({
    'groups.insert'(newEntity) {
      check(newEntity, groupSchema);
      return GroupsCollection.insertAsync(newEntity);
    },
    'groups.remove'(id) {
      check(id, String);
      return GroupsCollection.removeAsync(id);
    },
    'groups.update'(id, updatedEntity) {
      check(id, String);
      check(updatedEntity, Object);
      return GroupsCollection.updateAsync(
        { _id: id },
        { $set: updatedEntity }
      );
    },
    'groups.getById'(id) {
      check(id, String);
      return GroupsCollection.findOneAsync(id);
    },
});

if (Meteor.isServer) {
    GroupsCollection.rawCollection().createIndex(
      { group_name: 1 },
      { unique: true }
    );
  
    Meteor.publish(CollectionName, function () {
      if (!this.userId) return this.ready();
      return GroupsCollection.find();
    });
}