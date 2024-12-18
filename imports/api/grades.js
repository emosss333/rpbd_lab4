import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

const CollectionName = 'grades';
export const GradesCollection = new Mongo.Collection(CollectionName);
GradesCollection.collectionName = CollectionName;

export const GradesFields = [
  { name: 'grade_book', label: 'Номер зачетной книжки', type: 'text' },
  { name: 'exam_grade', label: 'Оценка за экзамен', type: 'text' },
  { name: 'diploma_grade', label: 'Оценка за диплом', type: 'text' },
];

const gradeSchema = {
  grade_book: String,
  exam_grade: String,
  diploma_grade: String,
};

export const GetGradeById = async (id) => {
  try {
    const result = await Meteor.callAsync(CollectionName + '.getById', id);
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
};

Meteor.methods({
  'grades.insert'(newEntity) {
    check(newEntity, gradeSchema);
    return GradesCollection.insertAsync(newEntity);
  },

  'grades.remove'(gradeBook) {
    check(gradeBook, String);
    return GradesCollection.removeAsync({ grade_book: gradeBook });
  },

  'grades.update'(gradeBook, updatedEntity) {
    check(gradeBook, String);
    check(updatedEntity, Object);
    return GradesCollection.updateAsync(
      { grade_book: gradeBook },
      { $set: updatedEntity }
    );
  },

  'grades.getById'(gradeBook) {
    check(gradeBook, String);
    return GradesCollection.findOneAsync({ grade_book: gradeBook });
  },
});

if (Meteor.isServer) {
  GradesCollection.rawCollection().createIndex(
    { grade_book: 1 },
    { unique: true }
  );

  Meteor.publish(CollectionName, function () {
    if (!this.userId) return this.ready();
    return GradesCollection.find();
  });
}
