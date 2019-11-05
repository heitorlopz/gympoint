import * as Yup from 'yup';
import Plan from '../models/Plan';
import User from '../models/User';

class PlanController {
  async index(req, res) {
    // um plano é de uma academia (user)
    const plans = await Plan.findAll({
      where: {
        user_id: req.userId,
      },
      order: [['updated_at', 'DESC']],
    });

    const checkUserProvider = await User.findOne({
      where: {
        id: req.userId,
        provider: true,
      },
    });

    if (!checkUserProvider) {
      return res.status(401).json({ error: 'User is not a provider.' });
    }

    return res.json(plans);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      duration: Yup.number().required(),
      price: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const checkUserProvider = await User.findOne({
      where: {
        id: req.userId,
        provider: true,
      },
    });

    if (!checkUserProvider) {
      return res.status(401).json({ error: 'User is not a provider.' });
    }

    const planExists = await Plan.findOne({
      where: { name: req.body.name },
    });

    if (planExists) {
      return res.status(400).json({ error: 'Plan already exists.' });
    }

    const { name, duration, price } = req.body;

    const plan = await Plan.create({
      user_id: req.userId,
      name,
      duration,
      price,
    });

    return res.json(plan);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      duration: Yup.number(),
      price: Yup.number(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }
    const checkUserProvider = await User.findOne({
      where: {
        id: req.userId,
        provider: true,
      },
    });

    if (!checkUserProvider) {
      return res.status(401).json({ error: 'User is not a provider.' });
    }

    const planId = req.params.id;

    const { name } = req.body;

    const plan = await Plan.findByPk(planId);

    if (name !== plan.name) {
      const planExists = await Plan.findOne({
        where: { name },
      });

      if (planExists) {
        return res.status(400).json({ error: 'Plan already exists.' });
      }
    }

    const { duration, price } = await plan.update(req.body);

    plan.updated_at = new Date();

    await plan.save();

    return res.json({
      name,
      duration,
      price,
    });
  }

  async delete(req, res) {
    const planId = req.params.id;

    const plan = await Plan.findByPk(planId);

    const checkUserProvider = await User.findOne({
      where: {
        id: req.userId,
        provider: true,
      },
    });

    if (!checkUserProvider) {
      return res.status(401).json({ error: 'User is not a provider.' });
    }

    Plan.destroy({
      where: {
        id: planId,
      },
    });

    return res.json(plan);
  }
}

export default new PlanController();
