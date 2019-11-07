import { parseISO, subDays } from 'date-fns';
import mongoose from 'mongoose';
import Student from '../models/Student';
import Enrollment from '../models/Enrollment';
import User from '../models/User';
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

    const checkStudentEnrollment = await Enrollment.findOne({
      where: {
        student_id: studentId,
      },
    });

    if (!checkStudentEnrollment) {
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

    return res.json();
  }
}

export default new CheckinController();
