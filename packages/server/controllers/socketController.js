const redisClient = require("../redis");

module.exports.authorizeUser = async (socket, next) => {
  if (!socket.request.session || !socket.request.session.user) {
    console.log("Bad request!");
    next(new Error("Not authorized"));
  } else {
    socket.user = { ...socket.request.session.user };
    await redisClient.hset(
      `userid:${socket.user.username}`,
      "userid",
      socket.user.userid
    );
    const friendList= await redisClient.lrange(`friends:${socket.user.username}`,0,-1);
    console.log(friendList);
    socket.emit("friends",friendList);
    next();
  }
};

module.exports.addFriend = async (socket,friendName,cb) => {
  if(friendName=== socket.user.username){
    cb({done:false,errorMsg:"Cannot add self!"});
    return;
  }
  const friendUserID = await redisClient.hget(`userid:${friendName}`,"userid")
  if(!friendUserID){
    cb({done:false,errorMsg:"User doesn't exist!"});
    return;
  }
  const currentFriendList = await redisClient.lrange(`friends:${socket.user.username}`,0,-1)
  if(currentFriendList && currentFriendList.indexOf(friendName) !== -1){
    cb({done:false,errorMsg:"Friend already added"})
    return;
  }

  await redisClient.lpush(`friends:${socket.user.username}`,friendName);
  cb({done:true});
};
