import { subDays } from 'date-fns';
import Enrollment from '../models/Enrollment';
import Student from '../models/Student';
import Checkin from '../schemas/Checkin';

class CheckinController {
  async index(req, res) {
    /** VALIDAÇÕES */

    /* const checkUserProvider = await User.findOne({
      where: {
        id: req.userId,
        provider: true,
      },
    });

    if (!checkUserProvider) {
      return res
        .status(401)
        .json({ error: 'Only provider can load students checkin.' });
    } */

    const studentId = req.params.id;

    const checkStudentEnrollment = await Enrollment.findOne({
      where: {
        student_id: studentId,
      },
    });

    if (!checkStudentEnrollment) {
      return res.status(401).json({ error: 'User is not enrolled.' });
    }

    /** MÉTODOS */

    const checkins = await Checkin.find({
      user: studentId,
    })
      .sort({
        createdAt: 'desc',
      })
      .limit(10);

    return res.json(checkins);
  }

  async store(req, res) {
    const studentId = req.params.id;

    const checkStudent = await Enrollment.findOne({
      where: {
        student_id: studentId,
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['name'],
          },
        ],
      },
    });

    if (!checkStudent) {
      return res.status(401).json({ error: 'User is not enrolled.' });
    }

    const checkInStartDate = subDays(new Date(), 7);

    const checkins = await Checkin.where('createdAt').gte(checkInStartDate);

    if (checkins.length === 5) {
      return res
        .status(400)
        .json({ error: 'Checkins weekly limits has been reached.' });
    }

    await Checkin.create({
      user: studentId,
    });

    return res.json({
      message: `${checkStudent.student.name} acabou de entrar na academia!`,
    });
  }
}

export default new CheckinController();
