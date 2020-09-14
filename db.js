const faker = require('faker');

function generateData() {
  const users = [];
  const tasks = [];
  const tasksScore = [];
  const state = ["DRAFT", "PUBLISHED", "ARCHIVED"];

  for(let id = 0; id < 10; id+= 1) {
    const username = faker.internet.userName();
    users.push({
      "id": username,
      "roles": ["author", "student", "supervisor", "course_manager"]
    })
  }

  for(let id = 0; id < 20; id+= 1) {
    const taskName = faker.name.jobTitle();
    tasks.push({
      "id": id,
      "name": taskName,
      "userId": users[Math.floor(Math.random() * users.length)].id,
      "state": state[Math.floor(Math.random() * state.length)],
      "categoriesOrder": ["Basic Scope", "Extra Scope", "Fines"],
      "items": [
        {
          "name": "basic_p1",
          "minScore": 0,
          "maxScore": 20,
          "category": "Basic Scope",
          "title": "Basic things",
          "description": "You need to make things right, not wrong"
        },
        {
          "name": "extra_p1",
          "minScore": 0,
          "maxScore": 30,
          "category": "Extra Scope",
          "title": "More awesome things",
          "description": "Be creative and make up some more awesome things"
        },
        {
          "name": "fines_p1",
          "minScore": -10,
          "maxScore": 0,
          "category": "Fines",
          "title": "App crashes",
          "description": "App causes BSoD!"
        }
      ]
    })
  }

  for(let id = 0; id < 20; id+= 1) {
    tasksScore.push({
      "id": id,
      "taskId": tasks[Math.floor(Math.random() * tasks.length)].id,
      "items": {
        "basic_p1": {"score": 20, "comment": "Well done!"},
        "extra_p1": {"score": 15, "comment": "Some things are done, some are not"},
        "fines_p1": {"score": 0, "comment": "No ticket today"},
      }
    })
  }

  return {
    "users":users,
    "tasks": tasks,
    "tasksScore": tasksScore
  }
}

module.exports = generateData;