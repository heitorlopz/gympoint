import { format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class HelpOrderMail {
  get key() {
    return 'HelpOrderMail';
  }

  async handle({ data }) {
    const { student, helpOrder, answer_content } = data;

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
  }
}

export default new HelpOrderMail();
