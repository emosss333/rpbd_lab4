import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

const CollectionName = 'faculties';
export const FacultiesCollection = new Mongo.Collection(CollectionName);
FacultiesCollection.collectionName = CollectionName;
export const FacultiesFields = [
  { name: 'faculty_name', label: 'Название факультета', type: 'text' },
];

export const GetFacultyById = async (id) => {
  try {
    const result = await Meteor.callAsync(CollectionName + '.getById', id);
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const facultySchema = { faculty_name: String };

Meteor.methods({
    'faculties.insert'(newEntity) {
      check(newEntity, facultySchema);
      return FacultiesCollection.insertAsync(newEntity);
    },
    'faculties.remove'(id) {
      check(id, String);
      return FacultiesCollection.removeAsync(id);
    },
    'faculties.update'(id, updatedEntity) {
      check(id, String);
      check(updatedEntity, Object);
      return FacultiesCollection.updateAsync(
        { _id: id },
        { $set: updatedEntity }
      );
    },
    'faculties.getById'(id) {
      check(id, String);
      return FacultiesCollection.findOneAsync(id);
    },
});

if (Meteor.isServer) {
    FacultiesCollection.rawCollection().createIndex(
      { faculty_name: 1 },
      { unique: true }
    );
  
    Meteor.publish(CollectionName, function () {
      if (!this.userId) return this.ready();
      return FacultiesCollection.find();
    });
}
