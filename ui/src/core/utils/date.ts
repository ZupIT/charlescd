/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import dayjs from 'dayjs';
import 'dayjs/locale/pt';
import relativeTime from 'dayjs/plugin/relativeTime';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);
dayjs.extend(relativeTime);

export const dateFrom = (date: string) => {
  const minutesInHours = 60;
  const hoursInADay = 24;
  const hoursAgo = dayjs().diff(date, 'hour');
  const guestTimezoneHour = dayjs().utcOffset() / minutesInHours;
  const currentDate = dayjs(date).hour(dayjs(date).hour() + guestTimezoneHour);

  if (hoursAgo >= hoursInADay) {
    return dayjs(currentDate).format('hh:mm • MM/DD/YYYY');
  }

  return dayjs(currentDate).fromNow();
};

export const humanizeDateFromSeconds = (timeInSeconds: number) => {
  const minutes = dayjs.duration(timeInSeconds, 'seconds').minutes();
  const seconds = dayjs.duration(timeInSeconds, 'seconds').seconds();
  const hours = dayjs.duration(timeInSeconds, 'seconds').hours();
  const formattedHours = hours ? `${hours}:` : '';

  return `${formattedHours}${minutes}:${seconds}m`;
};
