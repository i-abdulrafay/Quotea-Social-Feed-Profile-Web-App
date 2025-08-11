const { getdb } = require('../db/connect');
const { ObjectId } = require('mongodb');

const getprofile = async (req, res) => {
  const userId = req.user.userId;
  const db = getdb();

  const user = await db.collection("users").findOne(
    { _id: new ObjectId(userId) },
    { projection: { password: 0 } }
  );

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const posts = await db.collection("posts")
    .aggregate([
      { $match: { userId: new ObjectId(userId) } },

      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },

      {
        $lookup: {
          from: "users",
          localField: "comments.userId",
          foreignField: "_id",
          as: "commentUsers"
        }
      },

      {
        $addFields: {
          comments: {
            $map: {
              input: "$comments",
              as: "c",
              in: {
                _id: "$$c._id",
                userId: "$$c.userId",
                comment: "$$c.comment",
                createdAt: "$$c.createdAt",
                user: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: "$commentUsers",
                        as: "cu",
                        cond: { $eq: ["$$cu._id", "$$c.userId"] }
                      }
                    },
                    0
                  ]
                }
              }
            }
          }
        }
      },

      {
        $project: {
          "user.password": 0,
          "comments.user.password": 0
        }
      },
      { $sort: { createdAt: -1 } }
    ])
    .toArray();

  res.status(200).json({ user, posts });
};


const uploadimage = async (req,res) => {
    const userId = req.user.userId;
    const { imageUrl } = req.body;
    
    if (!imageUrl) return res.status(400).json({ message: "No image provided" });

    const db = getdb();

    await db.collection("users").updateOne(
        { _id: new ObjectId(userId) },
        { $set: { profileImage: imageUrl } }
    );

    res.status(200).json({ message: "Profile image updated" });
};

module.exports = {getprofile, uploadimage};