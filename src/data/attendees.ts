import { faker } from '@faker-js/faker'
import { v4 as uuid } from 'uuid';

export const attendees = Array.from({ length: 216 }).map(() => {
  return {
    id: uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email().toLocaleLowerCase(),
    createAt: faker.date.recent({ days: 30 }),
    checkedInAt: faker.date.recent({ days: 7 }),
  }
})