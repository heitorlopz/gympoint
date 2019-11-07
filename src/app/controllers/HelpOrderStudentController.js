import * as Yup from 'yup';
import HelpOrder from '../schemas/HelpOrder';
import Student from '../models/Student';

class HelpOrderStudentController {
  async index(req, res) {
    const studentId = req.params.id;

    const orders = await HelpOrder.find(
      {
        user: studentId,
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

    if (!orders) {
      return res.status(400).json({ error: 'Student has no help order.' });
    }

    return res.json(orders);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      question_content: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }
    const studentId = req.params.id;
    const student = await Student.findByPk(studentId);

    if (!student) {
      return res.status(401).json({ error: 'Student does not exist.' });
    }
    const { question_content } = req.body;

    await HelpOrder.create({
      user: studentId,
      question_content,
    });

    return res.json({ message: 'Help order created successfully!' });
  }
}

export default new HelpOrderStudentController();
