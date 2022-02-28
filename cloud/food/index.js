// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const result = await db.collection('Food')
    .aggregate()
    .lookup({
      from: 'Category',
      localField: 'category',
      foreignField: '_id',
      as: 'categories'
    })
    .end()
    // .orderBy('priority', 'asc')
    // .get()
    console.log(result)
    return result.list
}