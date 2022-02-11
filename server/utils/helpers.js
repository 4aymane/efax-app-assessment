const formidable = require('formidable')
const fs = require('fs')

module.exports = {
  getFormData,
  saveFile,
}

async function getFormData(req) {
  return new Promise((resolve, reject) => {
    new formidable.IncomingForm().parse(req, (err, fields, files) => {
      if (err) return reject(err)
      return resolve({ fields, file: files.file })
    })
  })
}

async function saveFile(file, fileName) {
  const oldPath = file.filepath
  const newPath = `uploads/${fileName}`
  return new Promise((resolve, reject) => {
    fs.rename(oldPath, newPath, (err) => {
      if (err) return reject(err)
      return resolve(1)
    })
  })
}
