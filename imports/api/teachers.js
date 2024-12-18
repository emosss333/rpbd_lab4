import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

const CollectionName = 'teachers';
export const TeachersCollection = new Mongo.Collection(CollectionName);
TeachersCollection.collectionName = CollectionName;

export const TeachersFields = [
  { name: 'teacher_code', label: 'Код преподавателя', type: 'text' },
  { name: 'full_name', label: 'ФИО преподавателя', type: 'text' },
  { name: 'degree', label: 'Степень', type: 'select' },
  { name: 'rank', label: 'Звание', type: 'select' },
  { name: 'department', label: 'Кафедра', type: 'select' },
  { name: 'phone', label: 'Телефон', type: 'text' },
  { name: 'email', label: 'Email', type: 'text' },
];

const teacherSchema = {
  teacher_code: String,
  full_name: String,
  degree: String,
  rank: String,
  department: String,
  phone: String,
  email: String,
};

export const GetTeacherById = async (id) => {
  try {
    const result = await Meteor.callAsync(CollectionName + '.getById', id);
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
};

Meteor.methods({
  'teachers.insert'(newEntity) {
    check(newEntity, teacherSchema);
    return TeachersCollection.insertAsync(newEntity);
  },

  'teachers.remove'(teacherCode) {
    check(teacherCode, String);
    return TeachersCollection.removeAsync({ teacher_code: teacherCode });
  },

  'teachers.update'(teacherCode, updatedEntity) {
    check(teacherCode, String);
    check(updatedEntity, Object);
    return TeachersCollection.updateAsync(
      { teacher_code: teacherCode },
      { $set: updatedEntity }
    );
  },

  'teachers.getById'(teacherCode) {
    check(teacherCode, String);
    return TeachersCollection.findOneAsync({ teacher_code: teacherCode });
  },
});

if (Meteor.isServer) {
  TeachersCollection.rawCollection().createIndex(
    { teacher_code: 1 },
    { unique: true }
  );

  Meteor.publish(CollectionName, function () {
    if (!this.userId) return this.ready();
    return TeachersCollection.find();
  });
}
