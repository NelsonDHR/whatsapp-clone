const redisClient = require("../redis");

module.exports.authorizeUser = async (socket, next) => {
  if (!socket.request.session || !socket.request.session.user) {
    console.log("Bad request!");
    next(new Error("Not authorized"));
  } else {
    socket.user = { ...socket.request.session.user };
    socket.join(socket.user.userid);
    await redisClient.hset(
      `userid:${socket.user.username}`,
      "userid",
      socket.user.userid,
      "connected",
      true
    );
    const friendList= await redisClient.lrange(`friends:${socket.user.username}`,0,-1);
    const parsedFriendList = await parseFriendList(friendList)
    const friendRooms = await parsedFriendList.map(friend => friend.userid);
    
    if(friendRooms.length>0){
      socket.to(friendRooms).emit("connected",true,socket.user.username);
    }

    console.log(`${socket.user.username} friends:`,parsedFriendList);
    socket.emit("friends",friendList);
    next();
  }
};

module.exports.addFriend = async (socket,friendName,cb) => {
  if(friendName=== socket.user.username){
    cb({done:false,errorMsg:"Cannot add self!"});
    return;
  }
  const friend = await redisClient.hgetall(`userid:${friendName}`)
  if(!friend.userid){
    cb({done:false,errorMsg:"User doesn't exist!"});
    return;
  }
  const currentFriendList = await redisClient.lrange(`friends:${socket.user.username}`,0,-1)
  if(currentFriendList && currentFriendList.indexOf(friendName) !== -1){
    cb({done:false,errorMsg:"Friend already added"})
    return;
  }

  await redisClient.lpush(`friends:${socket.user.username}`,[friendName,friend.userid].join("."));

  const newFriend = {username: friendName,userid: friend.userid,connected:friend.connected};
  cb({done:true,newFriend});
};

module.exports.onDisconnect = async (socket) =>{
  await redisClient.hset(`userid:${socket.user.username}`,"connected",false);
  const friendList = await redisClient.lrange(`friends:${socket.user.username}`,0,-1);
  const friendRooms = await parseFriendList(friendList).then(friends => 
    friends.map(friend => friend.userid));
  
  socket.to(friendRooms).emit("connected",false,socket.user.username);
  //get friends

  //emit to all friends tha we are offline
}

const parseFriendList = async (friendList)  => {
  const newFriendList=[];
  for (let friend of friendList){
    const parsedFriend =friend.split(".");
    const friendConnected = await redisClient.hget(`userid:${parsedFriend[0]}`,"connected");
    newFriendList.push({username:parsedFriend[0],userid:parsedFriend[1],connected:friendConnected});
  }
  return newFriendList;
};
