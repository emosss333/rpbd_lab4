import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

const CollectionName = 'students';
export const StudentsCollection = new Mongo.Collection(CollectionName);
StudentsCollection.collectionName = CollectionName;

export const StudentsFields = [
  { name: 'grade_book', label: 'Номер зачетной книжки', type: 'text' },
  { name: 'full_name', label: 'ФИО студента', type: 'text' },
  { name: 'faculty', label: 'Факультет', type: 'select' },
  { name: 'group', label: 'Группа', type: 'select' },
];

const studentSchema = {
  grade_book: String,
  full_name: String,
  faculty: String,
  group: String,
};

export const GetStudentById = async (id) => {
  try {
    const result = await Meteor.callAsync(CollectionName + '.getById', id);
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
};

Meteor.methods({
  'students.insert'(newEntity) {
    check(newEntity, studentSchema);
    return StudentsCollection.insertAsync(newEntity);
  },

  'students.remove'(gradeBook) {
    check(gradeBook, String);
    return StudentsCollection.removeAsync({ grade_book: gradeBook });
  },

  'students.update'(gradeBook, updatedEntity) {
    check(gradeBook, String);
    check(updatedEntity, Object);
    return StudentsCollection.updateAsync(
      { grade_book: gradeBook },
      { $set: updatedEntity }
    );
  },

  'students.getById'(gradeBook) {
    check(gradeBook, String);
    return StudentsCollection.findOneAsync({ grade_book: gradeBook });
  },
});

if (Meteor.isServer) {
  StudentsCollection.rawCollection().createIndex(
    { grade_book: 1 },
    { unique: true }
  );

  Meteor.publish(CollectionName, function () {
    if (!this.userId) return this.ready();
    return StudentsCollection.find();
  });
}
