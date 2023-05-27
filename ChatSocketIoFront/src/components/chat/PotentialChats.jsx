import { useContext, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
const PotentialChats = () => {
  const { user } = useContext(AuthContext);
  const [btnSelected, setBtnSelected] = useState(false);
  const { potentialChats, createChat, onlineUsers } = useContext(ChatContext);

  return (
    <>
      <div className="all-users">
        {potentialChats &&
          potentialChats.map((u, index) => {
            return (
              <button
                className="single-user"
                key={index}
                onClick={() => createChat(user._id, u._id, setBtnSelected)}
                disabled={btnSelected}
              >
                {u.name}
                <span
                  className={
                    onlineUsers?.some((user) => user?.userId === u?._id)
                      ? "user-online"
                      : "user-offline"
                  }
                ></span>
              </button>
            );
          })}
      </div>
    </>
  );
};

export default PotentialChats;
