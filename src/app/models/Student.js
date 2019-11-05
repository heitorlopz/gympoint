import Sequelize, { Model } from 'sequelize';
// nome, email, idade, peso e altura.

class Student extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        age: Sequelize.INTEGER,
        weight: Sequelize.INTEGER,
        height: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default Student;
