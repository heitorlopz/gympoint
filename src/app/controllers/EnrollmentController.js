import * as Yup from 'yup';
import { startOfDay, isBefore, addMonths, parseISO } from 'date-fns';
import Plan from '../models/Plan';
import User from '../models/User';
import Student from '../models/Student';
import Enrollment from '../models/Enrollment';

import EnrollmentMail from '../jobs/EnrollmentMail';
import Queue from '../../lib/Queue';

class EnrollmentController {
  async index(req, res) {
    const checkUserProvider = await User.findOne({
      where: {
        id: req.userId,
        provider: true,
      },
    });

    if (!checkUserProvider) {
      return res.status(401).json({ error: 'User is not a provider.' });
    }

    const enrollment = await Enrollment.findAll({
      attributes: ['id', 'price', 'start_date', 'end_date'],
      include: [
        {
          model: Plan,
          as: 'plan',
          where: { user_id: req.userId },
          attributes: ['name', 'duration', 'price', 'user_id'],
        },
      ],
    });
    return res.json(enrollment);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      start_date: Yup.date().required(),
      plan_id: Yup.number().required(),
      student_id: Yup.number().required(),
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

    const { start_date, plan_id, student_id } = req.body;

    const studentEnrolled = await Enrollment.findOne({
      where: {
        student_id,
      },
    });

    const plan = await Plan.findByPk(plan_id);

    if (!plan) {
      return res.status(400).json({ error: 'Plan does not exist.' });
    }

    if (studentEnrolled) {
      return res.status(400).json({ error: 'Student already enrolled.' });
    }

    const dayStart = startOfDay(parseISO(start_date));

    if (isBefore(dayStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permited.' });
    }

    const price = plan.price * plan.duration;

    const end_date = addMonths(parseISO(start_date), plan.duration);

    const enrollment = await Enrollment.create({
      plan_id,
      student_id,
      price,
      start_date,
      end_date,
    });

    /**  Notify enrolled student
     */

    const student = await Student.findByPk(student_id);

    await Queue.add(EnrollmentMail.key, {
      student,
      plan,
      start_date,
      end_date,
    });

    return res.json(enrollment);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      plan_id: Yup.number(),
      start_date: Yup.date().when('plan_id', (plan_id, field) =>
        plan_id ? field.required() : field
      ),
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
    const enrollmentId = req.params.id;

    const enrollment = await Enrollment.findByPk(enrollmentId);

    if (!enrollment) {
      return res.status(400).json({ error: 'Enrollment does not exist.' });
    }

    const { plan_id, start_date } = req.body;

    const plan = await Plan.findByPk(plan_id);

    if (!plan) {
      return res.status(400).json({ error: 'Plan does not exist.' });
    }

    const price = plan.duration * plan.price;

    const dayStart = startOfDay(parseISO(start_date));

    if (isBefore(dayStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permited.' });
    }

    const end_date = addMonths(parseISO(start_date), plan.duration);

    const { student_id } = await enrollment.update({
      price,
      end_date,
      start_date: dayStart,
      plan_id: plan.id,
    });

    await enrollment.update(req.body);

    enrollment.updated_at = new Date();

    await enrollment.save();

    return res.json({
      student_id,
      plan_id,
      price,
      start_date,
      end_date,
    });
  }

  async delete(req, res) {
    const enrollmentId = req.params.id;

    const enrollment = await Enrollment.findByPk(enrollmentId);

    if (!enrollment) {
      return res.status(400).json({ error: 'Enrollment does not exist.' });
    }

    const student = await Student.findOne({
      where: {
        id: enrollment.student_id,
      },
    });

    Enrollment.destroy({
      where: {
        id: enrollmentId,
      },
    });

    return res.json({
      message: `A matrícula de número ${enrollment.id} referente ao aluno ${student.name} foi excluído com sucesso!`,
    });
  }
}

export default new EnrollmentController();
