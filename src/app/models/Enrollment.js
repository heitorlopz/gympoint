import Sequelize, { Model } from 'sequelize';

// 2019-11-05T10:00:00-03:00
// parseiso transforma string do insomnia em objeto Date do js
class Enrollment extends Model {
  static init(sequelize) {
    super.init(
      {
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
        price: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    // quando uma tabela tem relacionamento com duas outras, é obrigado a dar um apelido
    this.belongsTo(models.Student, { foreignKey: 'student_id', as: 'student' });
    this.belongsTo(models.Plan, { foreignKey: 'plan_id', as: 'plan' });
  }
}

export default Enrollment;
