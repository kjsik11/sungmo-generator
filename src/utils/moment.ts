import moment from 'moment';
import 'moment/locale/ko';

moment.locale('ko');

export function dateFromNow(date: OurDate) {
  return moment(date).fromNow();
}
