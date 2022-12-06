const bcrypt = require('bcryptjs') // 載入 bcrypt
const { User } = require('../models')
// const { getUser } = require('../../helpers/auth-helpers')
// const { imgurFileHandler } = require('../../helpers/file-helpers')

const userServices = {
  signUp: (req, cb) => {
    const { name, email, password, passwordCheck } = req.body
    // 如果兩次輸入的密碼不同，就建立一個 Error 物件並拋出
    if (password !== passwordCheck) throw new Error('Passwords do not match!')
    // 確認資料裡面沒有一樣的 email，若有，就建立一個 Error 物件並拋出
    User.findOne({ where: { email } })
      .then(user => {
        if (user) throw new Error('Email already exists!')
        return bcrypt.hash(password, 10) // 前面加 return
      })
      .then(hash => {
        return User.create({ // 上面錯誤狀況都沒發生，就把使用者的資料寫入資料庫
          name,
          email,
          password: hash
        })
      })
      .then(newUser => cb(null, { user: newUser }))
      .catch(err => cb(err)) // 接住前面拋出的錯誤，呼叫專門做錯誤處理的 middleware
  }
}
module.exports = userServices
