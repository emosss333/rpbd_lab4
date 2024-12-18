import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

const CollectionName = 'departments';
export const DepartmentsCollection = new Mongo.Collection(CollectionName);
DepartmentsCollection.collectionName = CollectionName;
export const DepartmentsFields = [
  { name: 'department', label: 'Название кафедры', type: 'text' },
];

const departmentSchema = { department: String };

export const GetDepartmentById = async (id) => {
  try {
    const result = await Meteor.callAsync(CollectionName + '.getById', id);
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
};

Meteor.methods({
    'departments.insert'(newEntity) {
      check(newEntity, departmentSchema);
      return DepartmentsCollection.insertAsync(newEntity);
    },
    'departments.remove'(id) {
      check(id, String);
      return DepartmentsCollection.removeAsync(id);
    },
    'departments.update'(id, updatedEntity) {
      check(id, String);
      check(updatedEntity, Object);
      return DepartmentsCollection.updateAsync(
        { _id: id },
        { $set: updatedEntity }
      );
    },
    'departments.getById'(id) {
      check(id, String);
      return DepartmentsCollection.findOneAsync(id);
    },
});

if (Meteor.isServer) {
    DepartmentsCollection.rawCollection().createIndex(
      { department: 1 },
      { unique: true }
    );
  
    Meteor.publish(CollectionName, function () {
      if (!this.userId) return this.ready();
      return DepartmentsCollection.find();
    });
}
