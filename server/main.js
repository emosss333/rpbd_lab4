import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { check } from 'meteor/check';
import '../imports/api/faculties.js';
import '../imports/api/groups.js';
import '../imports/api/students.js';
import '../imports/api/grades.js';
import '../imports/api/degrees.js';
import '../imports/api/departments.js';
import '../imports/api/ranks.js';
import '../imports/api/teachers.js';
import '../imports/api/theses.js';

Meteor.startup(() => {
  console.log('Server started');
});

// Метод для создания пользователей
Meteor.methods({
  async 'users.create'(username, password) {
    check(username, String);
    check(password, String);

    // Проверка, существует ли пользователь с таким username
    const existingUser = await Meteor.users.findOneAsync({ username });
    if (existingUser) {
      console.log(`User exists: ${username}`);
      throw new Meteor.Error('user-exists', 'User already exists');
    }

    // Создание пользователя
    const userId = Accounts.createUser({ username, password });
    console.log(`User created: ${username}`);
    return userId;
  },

  'users.remove'(userId) {
    check(userId, String);
    Meteor.users.removeAsync(userId)
      .then(() => {
        console.log('User removed');
      })
      .catch((error) => {
        throw new Meteor.Error('remove-failed', 'Failed to remove user: ' + error.message);
      });
  }
});
