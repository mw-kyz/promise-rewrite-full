const fs = require("fs").promises;

function * getUserClasses(uid) {
  // fs.readFile会返回一个promise对象
  let userDatas = yield fs.readFile("./data/user.json", "utf8");
  userDatas = JSON.parse(userDatas);
  const userData = userDatas.find((user) => user.id === uid);
  let classDatas = yield fs.readFile("./data/class.json", "utf-8");
  classDatas = JSON.parse(classDatas);

  let userClassData = {
    id: userData.id,
    name: userData.name,
    classes: [],
  };

  classDatas.map((c) => {
    const studentsArr = JSON.parse(c.students);
    studentsArr.map((s) => {
      if (s === uid) {
        userClassData.classes.push({
          id: c.id,
          name: c.name,
        });
      }
    });
  });

  return userClassData;
}

async function getUserClassesByAsync(uid) {
  // 返回一个promise对象
  let userDatas = await fs.readFile("./data/user.json", "utf8");
  userDatas = JSON.parse(userDatas);
  const userData = userDatas.find((user) => user.id === uid);
  let classDatas = await fs.readFile("./data/class.json", "utf-8");
  classDatas = JSON.parse(classDatas);

  let userClassData = {
    id: userData.id,
    name: userData.name,
    classes: [],
  };

  classDatas.map((c) => {
    const studentsArr = JSON.parse(c.students);
    studentsArr.map((s) => {
      if (s === uid) {
        userClassData.classes.push({
          id: c.id,
          name: c.name,
        });
      }
    });
  });

  return userClassData;
}

function co(iterator) {
  return new Promise((resolve, reject) => {
    function walk(data) {
      const { value, done } = iterator.next(data);

      if (!done) {
        Promise.resolve(value).then((res) => {
          walk(res);
        }, reject);
      } else {
        resolve(value);
      }
    }

    walk();
  });
}

module.exports = {
  getUserClasses,
  getUserClassesByAsync,
  co,
};
