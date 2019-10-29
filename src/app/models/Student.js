import Sequelize, { Model } from 'sequelize';
// nome, email, idade, peso e altura.

class Student extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        idade: Sequelize.INTEGER,
        peso: Sequelize.INTEGER,
        altura: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
  }
}

export default Student;
