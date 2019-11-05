import Sequelize, { Model } from 'sequelize';

class Plan extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        duration: Sequelize.INTEGER,
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
    this.belongsTo(models.User, { foreignKey: 'user_id' });
  }
}
export default Plan;
