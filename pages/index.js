import { RoomService } from "@roomservice/browser";
import { useState, useEffect } from "react";
import ChatBubble from "../components/chatBubble";

// creates a new room service client config
const service = new RoomService({ auth: "/api/hello" });

// this is the react library
function useRoomServiceMap(roomName, mapName) {
  const [map, setMap] = useState();

  useEffect(() => {
    async function load() {
      const room = await service.room(roomName);
      let map = await room.map(mapName);
      setMap(map);

      // listens for OTHER people making changes
      room.subscribe(map, (m) => {
        console.log("trigger");
        setMap(m);
      });
    }
    load();
  }, [roomName, mapName]);

  return [map, setMap];
}

function useRoomServiceList(roomName, listName) {
  const [list, setList] = useState();

  useEffect(() => {
    async function load() {
      const room = await service.room(roomName);
      let list = await room.list(listName);
      setList(list);

      // listens for OTHER people making changes
      room.subscribe(list, (l) => {
        console.log("trigger");
        setList(l);
      });
    }
    load();
  }, [roomName, listName]);

  return [list, setList];
}

export default function Home() {
  const [map, setMap] = useRoomServiceMap("room-name-yay", "map-name-woo");
  const [list, setList] = useRoomServiceList("room-name-list", "list-name-woo");

  const [text, setText] = useState({ value: "type your message" });

  function handleChange(event) {
    setText({ value: event.target.value });
  }

  return (
    <div className="appContainer">
      <div className="titleContainer">To-Do App Example (aka THE CHATROOM)</div>

      <div className="inputContainer">
        <textarea
          className="inputArea"
          value={text.value}
          onChange={handleChange}
        ></textarea>
        <div
          className="submitContainer"
          onClick={() => {
            console.log(text.value);
            setText({ value: "type your message" });
          }}
        >
          submit
        </div>
      </div>

      <ChatBubble text="hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world " />

      <style jsx>{`
        .appContainer {
          display: flex;
          background-color: #181818;
          height: 100vh;
          flex-direction: column;
          align-items: center;
        }
        .titleContainer {
          height: 50px;
          background-color: #181818;
          width: 100%;
          color: #f2f2f2;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 18px;
          font-weight: 600;
          border-bottom: 1px solid #363636;
          cursor: default;
        }
        .inputArea {
          height: 40px;
          border-radius: 4px 0 0 4px;
          resize: none;
          outline: none;
          border: none;
          font-size: 16px;
          padding: 10px;
          width: 100%;
        }
        .inputContainer {
          display: flex;
          justify-content: center;
          flex-direction: row;
          width: 60%;
          margin-top: 40px;
        }
        .submitContainer {
          background-color: white;
          width: 100px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0 4px 4px 0;
          cursor: pointer;
          font-weight: bold;
          color: #181818;
        }
        .submitContainer:hover {
          background-color: #f2f2f2;
        }
      `}</style>
    </div>
  );
}
