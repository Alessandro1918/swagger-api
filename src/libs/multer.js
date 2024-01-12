const multer = require("multer")

const UPLOADED_DIR = "uploaded/"  //"uploaded" = "uploaded/" = "./uploaded" = root of project dir

console.log(__dirname)

//Acts as a middleware on used routes.
//Save files sent from frontend requests.
const multerOptions = multer({
  // dest: './uploaded/',         //V1
  storage: multer.diskStorage({   //V2 - config Multer options
    destination: function (req, file, cb) {
      cb(null, UPLOADED_DIR)
    },
    filename: function (req, file, cb) {
      cb(null, new Date().toISOString() + "." + file.mimetype.split("/")[1])  //"2024-01-12T03:02:26.837Z.jpeg"
    }
  })
})


module.exports = { multerOptions, UPLOADED_DIR }   //JS only. On TS I export each function individually