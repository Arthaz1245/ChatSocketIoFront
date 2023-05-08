import { useSelector, useDispatch } from "react-redux";
import { createChat } from "../../features/chatSlice";
const PotentialChats = ({ pChats, usersOnline }) => {
  const authId = useSelector((state) => state.auth._id);
  const dispatch = useDispatch();

  const handleSubmitCreateChat = (u1, u2) => {
    const input = { firstId: u1, secondId: u2 };
    dispatch(createChat(input));
  };

  return (
    <>
      <div className="all-users">
        {pChats &&
          pChats.map((u, index) => {
            return (
              <div
                className="single-user"
                key={index}
                onClick={() => handleSubmitCreateChat(authId, u._id)}
              >
                {u.name}
                <span
                  className={
                    usersOnline?.some((user) => user?.userId === u?._id)
                      ? "user-online"
                      : ""
                  }
                ></span>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default PotentialChats;
