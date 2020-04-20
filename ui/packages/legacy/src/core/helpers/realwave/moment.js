import moment from 'moment'
import 'moment/locale/pt-br'
import { getLanguage } from 'core/helpers/realwave/translate'

moment.locale(getLanguage())

export default moment
