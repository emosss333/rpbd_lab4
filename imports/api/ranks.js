import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

const CollectionName = 'ranks';
export const RanksCollection = new Mongo.Collection(CollectionName);
RanksCollection.collectionName = CollectionName;
export const RanksFields = [
  { name: 'rank', label: 'Название ранга', type: 'text' },
];

export const GetRankById = async (id) => {
  try {
    const result = await Meteor.callAsync(CollectionName + '.getById', id);
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const rankSchema = { rank: String };

Meteor.methods({
  'ranks.insert'(newEntity) {
    check(newEntity, rankSchema);
    return RanksCollection.insertAsync(newEntity);
  },
  'ranks.remove'(id) {
    check(id, String);
    return RanksCollection.removeAsync(id);
  },
  'ranks.update'(id, updatedEntity) {
    check(id, String);
    check(updatedEntity, Object);
    return RanksCollection.updateAsync(
      { _id: id },
      { $set: updatedEntity }
    );
  },
  'ranks.getById'(id) {
    check(id, String);
    return RanksCollection.findOneAsync(id);
  },
});

if (Meteor.isServer) {
  RanksCollection.rawCollection().createIndex(
    { rank: 1 },
    { unique: true }
  );

  Meteor.publish(CollectionName, function () {
    if (!this.userId) return this.ready();
    return RanksCollection.find();
  });
}
