const { getdb } = require('../db/connect');
const { ObjectId } = require('mongodb');

const createpost = async (req, res) => {
  const { text } = req.body;
  const userId = req.user.userId;
  const db = getdb();

  const newpost = {
    userId: new ObjectId(userId),
    text,
    createdAt: new Date(),
    likes: [],
    comments: []
  };

  const result = await db.collection('posts').insertOne(newpost);

  if (!result.acknowledged) {
    return res.status(500).json({ error: "Failed to create post" });
  }

  const [postWithUser] = await db.collection('posts').aggregate([
    { $match: { _id: result.insertedId } },
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
      $project: {
        text: 1,
        likes: 1,
        comments: 1,
        createdAt: 1,
        "user._id": 1,
        "user.name": 1,
        "user.profileImage": 1
      }
    }
  ]).toArray();

  res.status(201).json(postWithUser);
};


const getpost = async (req, res) => {
  const db = getdb();

  const posts = await db.collection("posts")
    .aggregate([
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
          text: 1,
          likes: 1,
          comments: {
            _id: 1,
            comment: 1,
            createdAt: 1,
            "user._id": 1,
            "user.name": 1,
            "user.profileImage": 1
          },
          createdAt: 1,
          "user._id": 1,
          "user.name": 1,
          "user.profileImage": 1
        }
      },
      { $sort: { createdAt: -1 } }
    ])
    .toArray();

  res.json(posts);
};

const likepost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.userId;
  const db = getdb();

  const post = await db.collection('posts').findOne({ _id: new ObjectId(postId) });
  if (!post) return res.status(404).json({ error: "Post not found" });

  const likesArray = Array.isArray(post.likes) ? post.likes : [];

  if (likesArray.includes(userId)) {
    await db.collection('posts').updateOne(
      { _id: new ObjectId(postId) },
      { $pull: { likes: userId } }
    );
  } else {
    await db.collection('posts').updateOne(
      { _id: new ObjectId(postId) },
      { $addToSet: { likes: userId } }
    );
  }

  const updatedPost = await db.collection('posts').findOne(
    { _id: new ObjectId(postId) },
    { projection: { likes: 1 } }
  );

  res.json({
    message: likesArray.includes(userId) ? "Like removed" : "Post liked",
    likes: updatedPost.likes || [],
  });
}

const comment = async (req, res) => {
  const { postId } = req.params;
  const { comment } = req.body;
  const userId = req.user.userId;
  const db = getdb();

  const newComment = {
    _id: new ObjectId(),
    userId: new ObjectId(userId),
    comment,
    createdAt: new Date()
  };

  const updateResult = await db.collection('posts').updateOne(
    { _id: new ObjectId(postId) },
    { $push: { comments: newComment } }
  );

  if (updateResult.modifiedCount === 0) {
    return res.status(404).json({ error: "Post not found or comment not added" });
  }

  const user = await db.collection('users').findOne(
    { _id: new ObjectId(userId) },
    { projection: { name: 1, profileImage: 1 } }
  );

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const enrichedComment = {
    ...newComment,
    user: {
      _id: user._id,
      name: user.name,
      profileImage: user.profileImage
    }
  };

  res.status(201).json(enrichedComment);
};

const deletepost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.userId;
  const db = getdb();

  const post = await db.collection('posts').findOne({ _id: new ObjectId(postId) });
  if (post.userId.toString() !== userId) return res.status(403).json({ error: 'Unauthorized' });

  await db.collection('posts').deleteOne({ _id: new ObjectId(postId) });
  res.json({ message: 'Post deleted' });
}

const deletecomment = async (req, res) => {
  const { postId, commentId } = req.params;
  const userId = req.user.userId; 
  const db = getdb();

  const post = await db.collection('posts').findOne({ _id: new ObjectId(postId) });
  if (!post) return res.status(404).json({ error: 'Post not found' });

  const comment = post.comments.find(c => c._id.toString() === commentId);
  if (!comment) return res.status(404).json({ error: 'Comment not found' });

  if (comment.userId.toString() !== userId.toString()) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  await db.collection('posts').updateOne(
    { _id: new ObjectId(postId) },
    { $pull: { comments: { _id: new ObjectId(commentId) } } }
  );

  res.json({ message: 'Comment deleted' });
};


module.exports = { createpost, getpost, likepost, comment, deletepost, deletecomment };
