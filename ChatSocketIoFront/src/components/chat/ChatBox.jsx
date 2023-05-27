import { Stack } from "react-bootstrap";
import moment from "moment/moment";
import InputEmoji from "react-input-emoji";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipientUser";
const ChatBox = () => {
  const { user } = useContext(AuthContext);
  const { currentChat, messages, isMessagesLoading, sendTextMessage } =
    useContext(ChatContext);
  const { recipientUser } = useFetchRecipientUser(currentChat, user);
  const [textMessage, setTextMessage] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isSending, setIsSending] = useState(false);

  const scroll = useRef();
  //to scroll messages

  useEffect(() => {
    scroll.current?.scrollIntoView({ behaviour: "smooth" });
  }, [messages]);

  if (!user) {
    return (
      <p style={{ textAlign: "center", width: "100%" }}>Loading user ..</p>
    );
  }
  if (!recipientUser) {
    return (
      <p style={{ textAlign: "center", width: "100%" }}>
        Not conversation selected yet
      </p>
    );
  }

  if (isMessagesLoading) {
    return (
      <p style={{ textAlign: "center", width: "100%" }}>Loading Chat ...</p>
    );
  }
  const TransformFile = (file) => {
    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setPreview(reader.result);
      };
    } else {
      setPreview("");
    }
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    TransformFile(file);
  };

  return (
    <Stack gap={4} className="chat-box">
      <div className="chat-header">
        <strong>{recipientUser?.name}</strong>
      </div>
      <Stack gap={3} className="messages">
        {messages &&
          messages.map((message, index) => (
            <Stack
              key={index}
              className={`${
                message?.senderId === user?._id
                  ? "message self align-self-end flex-grow-0"
                  : "message align self-start flex-grow-0"
              }`}
              ref={scroll}
            >
              <span>{message?.text}</span>

              <img src={message?.image?.secure_url} alt="" className="" />

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
        <label htmlFor="fileInput">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-image"
            viewBox="0 0 16 16"
          >
            <path d="M13.25 2H2.75C1.784 2 1 2.784 1 3.75v8.5C1 13.216 1.784 14 2.75 14h10.5c.966 0 1.75-.784 1.75-1.75v-8.5C15 2.784 14.216 2 13.25 2zm0 1.75a.25.25 0 0 1 .25.25v7a.25.25 0 0 1-.25.25H2.75a.25.25 0 0 1-.25-.25v-7a.25.25 0 0 1 .25-.25h10.5zM10 5.5a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm2.5 2.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm-3 2.5a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0z" />
          </svg>
        </label>
        <input
          id="fileInput"
          type="file"
          onChange={handleImageChange}
          accept="image/*"
          style={{ display: "none" }}
        />

        <button
          className="send-btn"
          onClick={() =>
            sendTextMessage(
              textMessage,
              user,
              currentChat?._id,
              setTextMessage,
              image,
              setImage,
              setPreview,
              setIsSending
            )
          }
          disabled={isSending}
        >
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
      {preview && (
        <img
          src={preview?.secure_url}
          alt="chosen"
          style={{ height: "300px" }}
        />
      )}
    </Stack>
  );
};

export default ChatBox;
