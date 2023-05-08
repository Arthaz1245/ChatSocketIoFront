import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserChats } from "../features/chatSlice";
import { Container, Stack } from "react-bootstrap";
import UserChat from "../components/chat/UserChat";
import PotentialChats from "../components/chat/potentialChats";
import ChatBox from "../components/chat/ChatBox";
import { io } from "socket.io-client";
const Chat = () => {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const userId = auth._id;
  const chatStatus = useSelector((state) => state.chat.status);
  // const messageStatus = useSelector((state) => state.chat.status);
  const users = useSelector((state) => state.auth.users);
  const chats = useSelector((state) => state.chat.chats);

  const [currentChat, setCurrentChat] = useState(null);

  const [socket, setSocket] = useState(null);
  const [usersOnline, setUsersOnline] = useState([]);
  useEffect(() => {
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, [auth]);

  useEffect(() => {
    if (socket === null) return;
    socket.emit("addNewUser", userId);
    socket.on("getOnlineUsers", (res) => {
      setUsersOnline(res);
    });
    return () => {
      socket.off("getOnlineUsers");
    };
  }, [socket]);
  //send message
  useEffect(() => {
    dispatch(getUserChats(userId));
  }, [dispatch, userId]);

  const pChats = users.filter((u) => {
    let isChatCreated = false;
    if (u?._id === userId) return false;
    if (chats) {
      isChatCreated = chats.some((chat) => {
        return chat.members[0] === u._id || chat.members[1] === u._id;
      });
    }
    return !isChatCreated;
  });
  const updateChat = (chat) => {
    setCurrentChat(chat);
  };

  return (
    <Container>
      <PotentialChats
        pChats={pChats}
        userId={userId}
        usersOnline={usersOnline}
      />
      {chats?.length < 1 ? null : (
        <Stack direction="horizontal" gap={4} className="align-items-start">
          <Stack className="messages-box flex-grow-0 pe-3">
            {chatStatus === "loading" && <p>Loading Chats ...</p>}
            {chats?.map((chat, index) => {
              return (
                <div key={index} onClick={() => updateChat(chat)}>
                  <UserChat
                    chat={chat}
                    userId={userId}
                    usersOnline={usersOnline}
                  />
                </div>
              );
            })}
          </Stack>

          <ChatBox
            currentChat={currentChat}
            userId={userId}
            auth={auth}
            socket={socket}
          />
        </Stack>
      )}
    </Container>
  );
};

export default Chat;
