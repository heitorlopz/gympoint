import { format } from 'date-fns';
import * as Yup from 'yup';
import pt from 'date-fns/locale/pt';
import Student from '../models/Student';
import User from '../models/User';
import HelpOrder from '../schemas/HelpOrder';

import Mail from '../../lib/Mail';

class HelpOrderController {
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

    const ordersWithoutAnswer = await HelpOrder.find(
      {
        answer_content: null,
      },
      [
        'user',
        'question_content',
        'answer_content',
        'createdAt',
        'updatedAt',
        '-_id',
      ]
    );

    return res.json(ordersWithoutAnswer);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      answer_content: Yup.string().required(),
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

    const helpOrderId = req.params.id;

    const { answer_content } = req.body;

    const helpOrder = await HelpOrder.findByIdAndUpdate(helpOrderId, {
      answer_content,
      answer_at: new Date(),
    });

    if (!helpOrder) {
      return res.status(400).json({
        error: 'This help order does not exist or has been already answered.',
      });
    }

    /**  Notify enrolled student
     */

    const studentId = helpOrder.user;

    const student = await Student.findByPk(studentId);

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Aqui está sua resposta!',
      template: 'helporder',
      context: {
        student: student.name,
        message_date: format(helpOrder.createdAt, 'MM/dd/yyyy', {
          locale: pt,
        }),
        question: helpOrder.question_content,
        answer: answer_content,
      },
    });

    return res.json();
  }
}

export default new HelpOrderController();
