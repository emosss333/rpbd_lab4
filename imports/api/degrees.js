import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

const CollectionName = 'degrees';
export const DegreesCollection = new Mongo.Collection(CollectionName);
DegreesCollection.collectionName = CollectionName;
export const DegreesFields = [
  { name: 'degree', label: 'Степень', type: 'text' },
];

export const GetDegreeById = async (id) => {
  try {
    const result = await Meteor.callAsync(CollectionName + '.getById', id);
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const degreeSchema = { degree: String };

Meteor.methods({
  'degrees.insert'(newEntity) {
    check(newEntity, degreeSchema);
    return DegreesCollection.insertAsync(newEntity);
  },
  'degrees.remove'(id) {
    check(id, String);
    return DegreesCollection.removeAsync(id);
  },
  'degrees.update'(id, updatedEntity) {
    check(id, String);
    check(updatedEntity, Object);
    return DegreesCollection.updateAsync(
      { _id: id },
      { $set: updatedEntity }
    );
  },
  'degrees.getById'(id) {
    check(id, String);
    return DegreesCollection.findOneAsync(id);
  },
});

if (Meteor.isServer) {
  DegreesCollection.rawCollection().createIndex(
    { degree: 1 },
    { unique: true }
  );

  Meteor.publish(CollectionName, function () {
    if (!this.userId) return this.ready();
    return DegreesCollection.find();
  });
}
