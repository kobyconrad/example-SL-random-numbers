import { RoomService } from "@roomservice/browser";
import { useState, useEffect } from "react";

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

  return (
    <div>
      Hello World
      <button
        onClick={() => {
          setMap(map.set("color", "blue"));
        }}
      >
        Blue
      </button>
      <button
        onClick={() => {
          setMap(map.set("color", "yellow"));
        }}
      >
        Yellow
      </button>
      <button
        onClick={() => {
          setMap(map.set("array", [1, 2, 3]));
        }}
      >
        Array
      </button>
      <button
        onClick={() => {
          let num = Math.random() * 10;
          setList(list.push(num));
        }}
      >
        Increase List
      </button>
      {/* <button onClick={() => {
        
      }}></button> */}
      {map && JSON.stringify(map.store)}
      {list && JSON.stringify(list)}
    </div>
  );
}
