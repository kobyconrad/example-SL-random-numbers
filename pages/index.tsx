import { RoomService } from "@roomservice/browser";
import { useState, useEffect } from "react";
import ChatBubble from "../components/chatBubble";
import { Cursor } from "../components/Cursor";

// creates a new room service client config
const service = new RoomService({ auth: "/api/hello" });

// this is the react library
function useRoomServiceMap(roomName, mapName) {
  const [map, setMap] = useState<any>();

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
  const [list, setList] = useState<any>();

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

function usePresence(roomName, key): [any, any] {
  const [presence, setPresence] = useState<any>();
  const [values, setValue] = useState({});

  useEffect(() => {
    async function load() {
      const room = await service.room(roomName); //grabs the room
      const presence = await room.presence(); //initializes presence
      setPresence(presence);
      setValue(await presence.getAll(key));
      room.subscribe(presence, key, (vs) => {
        setValue(vs);
      });
    }
    load();
  }, []);

  function set(value) {
    if (!presence) {
      console.log("HOOHHOOHHO");
      return;
    }

    setValue(presence.set(key, value));
  }

  return [presence, set];
}

export default function Home() {
  const [positions, setPresence] = usePresence(
    "room-name-presence",
    "positions"
  );
  // const [map, setMap] = useRoomServiceMap("room-name", "map-name-woo");
  const [list, setList] = useRoomServiceList("room-name", "list-name-woo");
  const [text, setText] = useState({ value: "type your message" });

  useEffect(() => {
    document.addEventListener("mousemove", (e) => {
      setPresence({ x: e.x, y: e.y });
      // console.log(e.x);
    });
  }, []);

  function handleChange(event) {
    setText({ value: event.target.value });
  }

  let currentArr = [];
  if (list) {
    currentArr = list.toArray();
  }

  let messageDivs = currentArr.map((item) => {
    let totalIndex = currentArr.length;
    let currentIndex = currentArr.indexOf(item);
    if (currentIndex >= totalIndex - 6) {
      return <ChatBubble text={item} index={currentIndex} />;
    }
  });

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
            list.push(text.value);
            setText({ value: "type your message" });
          }}
        >
          submit
        </div>
      </div>

      <div className="messageDivContainer">{messageDivs}</div>
      <button
        onClick={() => {
          // const positions = presence.getAll("position");
          console.log(positions.cache.positions);
        }}
      >
        log presence
      </button>

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
          height: 45px;
          border-radius: 4px 0 0 4px;
          resize: none;
          outline: none;
          border: none;
          font-size: 16px;
          padding: 13px 10px 10px 10px;
          width: 100%;
        }
        .inputContainer {
          display: flex;
          justify-content: center;
          flex-direction: row;
          width: 60%;
          margin-top: 40px;
          border-bottom: 1px solid #363636;
          padding-bottom: 25px;
        }
        .submitContainer {
          background-color: white;
          width: 100px;
          height: 45px;
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
        .messageDivContainer {
          display: flex;
          flex-direction: column-reverse;
          width: 100%;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  );
}
