const express = require("express");
const path = require("path");
const fs = require("fs");
const https = require("https");
const authRoutes = require ("./routes/auth.js")
const userRoutes = require ("./routes/user.js")
const postRoutes = require ("./routes/posts.js")
const cookieParser = require("cookie-parser");
const multer = require ("multer");
const cors = require("cors")
const app = express()

app.use(express.json())
app.use(cookieParser())
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../client/public/upload')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now()+file.originalname)
    }
})
 

const options = {
    ca: fs.readFileSync('/etc/letsencrypt/live/api.taeeun.world/fullchain.pem'),
    key: fs.readFileSync('/etc/letsencrypt/live/api.taeeun.world/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/api.taeeun.world/cert.pem'),
  };

  https.createServer(options, app).listen(443, () => {
    console.log('443번 포트에서 대기중입니다.');
  });

const upload = multer({ storage })
app.post('/api/upload', upload.single('file'), function (req, res) {
    const file = req.file;
    console.log(file,"파일")
res.status(200).json(file.filename)
})
app.get("/hello", (req, res) => res.send("Hello"));
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)
app.use(cors());


app.listen(8800, () => {
    console.log("Connected!")
})