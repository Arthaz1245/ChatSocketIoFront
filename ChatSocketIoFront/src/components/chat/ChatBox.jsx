import { useEffect, useState } from "react";
import { createMessage, getMessages } from "../../features/chatSlice";
import { useDispatch, useSelector } from "react-redux";
import { Stack } from "react-bootstrap";
import { findUser } from "../../features/authSlice";

import moment from "moment/moment";
import InputEmoji from "react-input-emoji";
const ChatBox = ({ currentChat, userId, socket }) => {
  const messages = useSelector((state) => state.chat.messages);
  const [textMessage, setTextMessage] = useState("");
  const chatId = currentChat?._id;
  const dispatch = useDispatch();
  const userById = useSelector((state) => state.auth.userById);
  const messageStatus = useSelector((state) => state.chat.status);
  const recipientId = currentChat?.members?.find((id) => id !== userId);

  useEffect(() => {
    dispatch(findUser(recipientId));
    dispatch(getMessages(chatId));
  }, [dispatch, recipientId, chatId]);

  useEffect(() => {
    socket.on("getMessage", (data) => {
      dispatch(createMessage(data));
    });

    return () => {
      socket.off("getMessage");
    };
  }, [dispatch, socket]);
  const handleSendMessage = async (e) => {
    e.preventDefault();
    const message = {
      chatId: chatId,
      senderId: userId,
      text: textMessage,
    };

    socket.emit("sendMessage", { ...message, recipientId });
    dispatch(getMessages(chatId));
    setTextMessage("");
  };

  if (!userById)
    return (
      <p style={{ textAlign: "center", width: "100%" }}>
        No converstation yet ...
      </p>
    );
  if (messageStatus === "loading")
    return <p style={{ textAlign: "center", width: "100%" }}>LoadingChat...</p>;

  return (
    <Stack gap={4} className="chat-box">
      <div className="chat-header">
        <strong>{userById?.name}</strong>
      </div>
      <Stack gap={3} className="messages">
        {messages &&
          messages.map((message, index) => (
            <Stack
              key={index}
              className={`${
                message?.senderId === userId
                  ? "message self align-self-end flex-grow-0"
                  : "message align self-start flex-grow-0"
              }`}
            >
              <span>{message?.text}</span>
              <span className="message-footer">
                {moment(message.createdAt).calendar()}
              </span>
            </Stack>
          ))}
      </Stack>
      <Stack direction="horizontal" gap={3} className="chat-imput flex-grow-0">
        <InputEmoji
          value={textMessage}
          onChange={setTextMessage}
          fontFamily="nunito"
          borderColor="rga(72,112,223,0.2)"
        />
        <button className="send-btn" onClick={handleSendMessage}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-send"
            viewBox="0 0 16 16"
          >
            <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z" />
          </svg>
        </button>
      </Stack>
    </Stack>
  );
};

export default ChatBox;
