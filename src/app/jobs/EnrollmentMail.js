import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class EnrollmentMail {
  get key() {
    return 'EnrollmentMail';
  }

  async handle({ data }) {
    const { student, plan, start_date, end_date } = data;

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Bem vindo!',
      template: 'enrollment',
      context: {
        student: student.name,
        plan: `${plan.name} (${plan.duration} ${
          plan.duration > 1 ? 'meses' : 'mês'
        })`,
        price: `R$${plan.price}`,
        start_date: format(parseISO(start_date), 'MM/dd/yyyy', {
          locale: pt,
        }),
        end_date: format(parseISO(end_date), 'MM/dd/yyyy', {
          locale: pt,
        }),
      },
    });
  }
}

export default new EnrollmentMail();
