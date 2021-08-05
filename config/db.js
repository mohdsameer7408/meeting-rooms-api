import mongoose from "mongoose";
import GridFsStorage from "multer-gridfs-storage";
import multer from "multer";
import path from "path";
import Pusher from "pusher";

let gfs, upload;

const connectDB = async () => {
  const dbURI = `mongodb+srv://root:${process.env.PASS}@cluster0.euskn.mongodb.net/meetingRoom?retryWrites=true&w=majority`;
  const dbOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  };

  const pusher = new Pusher({
    appId: "1245662",
    key: "065c8d5cf3e03b73bd2f",
    secret: "ddf5e19a015c4ba2b7fc",
    cluster: "ap2",
    useTLS: true,
  });

  try {
    // db connection
    const conn = await mongoose.connect(dbURI, dbOptions);
    console.log(`MongoDB connected:${conn.connection.host}`);

    // storage connection
    const fileConn = await mongoose.createConnection(dbURI, dbOptions);
    console.log(`MongoDB storage connected:${fileConn.host}`);

    gfs = new mongoose.mongo.GridFSBucket(fileConn.db, {
      bucketName: "images",
    });

    const storage = new GridFsStorage({
      url: dbURI,
      options: { useNewUrlParser: true, useUnifiedTopology: true },
      file: (req, file) =>
        new Promise((resolve, reject) => {
          const fileName = `IMG-${Date.now()}${path.extname(
            file.originalname
          )}`;
          const fileInfo = {
            filename: fileName,
            bucketName: "images",
          };
          resolve(fileInfo);
        }),
    });

    upload = multer({ storage });

    const roomsChangeStream = mongoose.connection.collection("rooms").watch();
    roomsChangeStream.on("change", (change) => {
      console.log("Change stream triggered!");
      console.log(change);

      if (change.operationType === "insert") {
        const data = change.fullDocument;
        console.log("A room was Created!");
        pusher.trigger("rooms", "inserted", data);
      } else if (
        change.operationType === "update" ||
        change.operationType === "delete"
      ) {
        console.log("A room was Updated or Deleted!");
        pusher.trigger("rooms", "inserted", {});
      } else {
        console.log("A Strange operation was triggered!");
      }
    });
  } catch (error) {
    console.log(`An error occured while connecting to mongoDB: ${error}`);
  }
};

export { gfs, upload };
export default connectDB;
