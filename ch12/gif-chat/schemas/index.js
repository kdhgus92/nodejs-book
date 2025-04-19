const mongoose = require("mongoose");

const { MONGO_ID, MONGO_PASSWORD, NODE_ENV } = process.env;

const MONGO_URL = `mongodb://${MONGO_ID}:${MONGO_PASSWORD}@localhost:27017/admin`;

const connect = async () => {
  if (NODE_ENV !== "production") {
    mongoose.set("debug", true);
  }

  mongoose.set("strictQuery", false); // ⚠️ Mongoose 7+ 권장 설정

  try {
    await mongoose.connect(MONGO_URL, {
      dbName: "gifchat",
    });
    console.log("몽고디비 연결 성공");
  } catch (error) {
    console.log("몽고디비 연결 에러", error);
  }
};

mongoose.connection.on("error", (error) => {
  console.error("몽고디비 연결 에러", error);
});

mongoose.connection.on("disconnected", () => {
  console.error("몽고디비 연결이 끊겼습니다. 연결을 재시도 합니다.");
  connect();
});

module.exports = connect;
