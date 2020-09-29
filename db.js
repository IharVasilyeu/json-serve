const faker = require("faker");
const fs = require("fs");

function generateData() {
  const users = [];
  const tasks = [];
  const crossCheckSessions = [];
  const reviewRequest = [];
  const reviews = [];
  const disputes = [];

  const taskState = ["DRAFT", "PUBLISHED", "ARCHIVED"];
  const crossCheckState = [
    "DRAFT",
    "REQUESTS_GATHERING",
    "CROSS_CHECK",
    "COMPLETED",
  ];
  const requestState = ["DRAFT", "PUBLISHED", "COMPLETED"];
  const reviewState = [
    "DRAFT",
    "PUBLISHED",
    "DISPUTED",
    "ACCEPTED",
    "REJECTED",
  ];
  const disputeState = ["ONGOING", "ACCEPTED", "REJECTED"];

  for (let id = 0; id < 100; id += 1) {
    const username = faker.internet.userName();
    users.push({
      id: username,
      roles: ["author", "student", "supervisor", "course_manager"],
    });
  }

  for (let id = 0; id < 1000; id += 1) {
    const taskName = faker.name.jobTitle();
    const short = Math.floor(Math.random() * 2);
    tasks.push({
      id: id,
      name: taskName,
      userId: users[Math.floor(Math.random() * users.length)].id,
      state: taskState[Math.floor(Math.random() * taskState.length)],
      categoriesOrder: ["Basic Scope", "Extra Scope", "Fines"],
      items: short
        ? [
            {
              name: "basic_p1",
              minScore: 0,
              maxScore: 20,
              category: "Basic Scope",
              categoryTitle: "basic_scope",
              title: "Basic things",
              description: "You need to make things right, not wrong",
            },
            {
              name: "extra_p1",
              minScore: 0,
              maxScore: 30,
              category: "Extra Scope",
              categoryTitle: "extra_scope",
              title: "More awesome things",
              description: "Be creative and make up some more awesome things",
            },
            {
              name: "fines_p1",
              minScore: -10,
              maxScore: 0,
              category: "Fines",
              categoryTitle: "fines_scope",
              title: "App crashes",
              description: "App causes BSoD!",
            },
          ]
        : [
            {
              name: "basic_p1",
              minScore: 0,
              maxScore: 20,
              category: "Basic Scope",
              categoryTitle: "basic_scope",
              title: "Basic things",
              description: "You need to make things right, not wrong",
            },
            {
              name: "basic_p2",
              minScore: 0,
              maxScore: 25,
              category: "Basic Scope",
              categoryTitle: "basic_scope",
              title: "Basic things",
              description: "You need to make things right, not wrong",
            },
            {
              name: "basic_p3",
              minScore: 0,
              maxScore: 30,
              category: "Basic Scope",
              categoryTitle: "basic_scope",
              title: "Basic things",
              description: "You need to make things right, not wrong",
            },
            {
              name: "extra_p1",
              minScore: 0,
              maxScore: 30,
              category: "Extra Scope",
              categoryTitle: "extra_scope",
              title: "More awesome things",
              description: "Be creative and make up some more awesome things",
            },
            {
              name: "extra_p2",
              minScore: 0,
              maxScore: 50,
              category: "Extra Scope",
              categoryTitle: "extra_scope",
              title: "More awesome things",
              description: "Be creative and make up some more awesome things",
            },
            {
              name: "fines_p1",
              minScore: -10,
              maxScore: 0,
              category: "Fines",
              categoryTitle: "fines_scope",
              title: "App crashes",
              description: "App causes BSoD!",
            },
            {
              name: "fines_p2",
              minScore: -30,
              maxScore: 0,
              category: "Fines",
              categoryTitle: "fines_scope",
              title: "App crashes",
              description: "App causes BSoD!",
            },
          ],
    });
  }

  const useTask = [];
  for (let id = 0; id < 1000; id += 1) {
    const randomTask = tasks[Math.floor(Math.random() * tasks.length)];
    if (randomTask.state === "PUBLISHED" && !useTask.includes(randomTask)) {
      const ccName = `rss2020Q3 Cross Check - ${randomTask.name}`;
      const attendees = users.map((u, i, users) => {
        const bufUsers = [...users];
        bufUsers.splice(i, 1);
        bufUsers.sort(() => Math.random() - 0.5);
        return {
          githubId: u.id,
          reviewerOf: bufUsers.splice(0, 4),
        };
      });
      crossCheckSessions.push({
        id: id,
        state:
          crossCheckState[Math.floor(Math.random() * crossCheckState.length)],
        name: ccName,
        taskId: randomTask.id,
        coefficient: 0.7,
        startDate: "2020-07-07",
        endDate: "2020-07-14",
        discardMinScore: true,
        discardMaxScore: false,
        minReviewsAmount: 1,
        desiredReviewersAmount: 3,
        attendees: attendees,
      });
      useTask.push(randomTask);
    }
  }

  for (let id = 0; id < 1000; id += 1) {
    const taskId = tasks[Math.floor(Math.random() * tasks.length)].id;
    const cc = crossCheckSessions.find((x) => x.taskId === taskId);
    if (cc) {
      const state =
        requestState[Math.floor(Math.random() * requestState.length)];
      if (state === "DRAFT") {
        reviewRequest.push({
          id: id,
          state: state,
          taskId: taskId,
          pullRequest: "",
          crossCheckSessionsId: cc.id,
          userId: users[Math.floor(Math.random() * users.length)].id,
          selfGrade: {},
        });
      } else {
        reviewRequest.push({
          id: id,
          state: state,
          taskId: taskId,
          pullRequest: "https://github.com/Ildar107/RS-Assessment-Tool/pull/14",
          crossCheckSessionsId: cc.id,
          userId: users[Math.floor(Math.random() * users.length)].id,
          selfGrade: {
            basic_p1: {
              score: Math.random().toFixed(1) * 200,
              comment: "Well done!",
            },
            extra_p1: {
              score: Math.random().toFixed(1) * 100,
              comment: "Some things are done, some are not",
            },
            fines_p1: {
              score: -Math.random().toFixed(1) * 50,
              comment: "No ticket today",
            },
          },
        });
      }
    }
  }

  for (let id = 0; id < 1000; id += 1) {
    const taskId = tasks[Math.floor(Math.random() * tasks.length)].id;
    const rr = reviewRequest.find((x) => x.taskId === taskId);
    if (rr) {
      const state = reviewState[Math.floor(Math.random() * reviewState.length)];
      if (state === "DRAFT") {
        reviews.push({
          id: id,
          state: state,
          taskId: taskId,
          reviewRequestId: rr.id,
          userId: users[Math.floor(Math.random() * users.length)].id,
          grade: {},
        });
      } else {
        reviews.push({
          id: id,
          state: state,
          taskId: taskId,
          reviewRequestId: rr.id,
          userId: users[Math.floor(Math.random() * users.length)].id,
          grade: {
            basic_p1: {
              score: Math.random().toFixed(1) * 200,
              comment: "Well done!",
            },
            extra_p1: {
              score: Math.random().toFixed(1) * 100,
              comment: "Some things are done, some are not",
            },
            fines_p1: {
              score: -Math.random().toFixed(1) * 50,
              comment: "No ticket today",
            },
          },
        });
      }
    }
  }

  const useReview = [];
  for (let id = 0; id < 200; id += 1) {
    const randomReview = reviews[Math.floor(Math.random() * reviews.length)];
    if (!useReview.includes(randomReview)) {
      disputes.push({
        id: id,
        reviewId: randomReview.id,
        state: disputeState[Math.floor(Math.random() * disputeState.length)],
        item: "basic_p1",
        suggestedScore: Math.random().toFixed(1) * 250,
      });
      useReview.push(randomReview);
    }
  }

  return {
    users: users,
    tasks: tasks,
    reviews: reviews,
    crossCheckSessions: crossCheckSessions,
    reviewRequest: reviewRequest,
    disputes: disputes,
  };
}

const data = generateData();

fs.writeFile("db.json", JSON.stringify(data), function (err) {
  if (err) throw err;
  console.log("complete");
});
