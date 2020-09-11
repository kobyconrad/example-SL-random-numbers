import { XCircle } from "react-feather";

function ChatBubble(props) {
  return (
    <>
      <div className="compContainer">
        {props.text}
        <div className="deleteContainer">
          <XCircle width="20px" color="#363636" />
        </div>
        <style jsx>{`
          .compContainer {
            background-color: white;
            margin-top: 15px;
            width: 60%;
            min-height: 40px;
            border-radius: 4px;
            display: flex;
            align-items: center;
            padding: 10px 0 10px 10px;
            font-family: Courier;
            font-size: 16px;
          }
          .deleteContainer {
            margin-right: 10px;
            margin-left: 10px;
            cursor: pointer;
          }
        `}</style>
      </div>
    </>
  );
}

export default ChatBubble;
