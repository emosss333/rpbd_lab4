import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

const CollectionName = 'theses';
export const ThesesCollection = new Mongo.Collection(CollectionName);
ThesesCollection.collectionName = CollectionName;

export const ThesesFields = [
  { name: 'grade_book', label: 'Номер зачетной книжки', type: 'text' },
  { name: 'teacher_code', label: 'Код преподавателя', type: 'text' },
  { name: 'topic', label: 'Тема дипломной работы', type: 'text' },
];

const thesisSchema = {
  grade_book: String,
  teacher_code: String,
  topic: String,
};

export const GetThesisById = async (id) => {
  try {
    const result = await Meteor.callAsync(CollectionName + '.getById', id);
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
};

Meteor.methods({
  'theses.insert'(newEntity) {
    check(newEntity, thesisSchema);
    return ThesesCollection.insertAsync(newEntity);
  },

  'theses.remove'(gradeBook) {
    check(gradeBook, String);
    return ThesesCollection.removeAsync({ grade_book: gradeBook });
  },

  'theses.update'(gradeBook, updatedEntity) {
    check(gradeBook, String);
    check(updatedEntity, Object);
    return ThesesCollection.updateAsync(
      { grade_book: gradeBook },
      { $set: updatedEntity }
    );
  },

  'theses.getById'(gradeBook) {
    check(gradeBook, String);
    return ThesesCollection.findOneAsync({ grade_book: gradeBook });
  },
});

if (Meteor.isServer) {
  ThesesCollection.rawCollection().createIndex(
    { grade_book: 1 },
    { unique: true }
  );

  Meteor.publish(CollectionName, function () {
    if (!this.userId) return this.ready();
    return ThesesCollection.find();
  });
}