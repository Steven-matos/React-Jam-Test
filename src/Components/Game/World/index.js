import React from "react";
import Player from "../Player/player";
import Map from "../Map/index";
import { tiles }from "../../../data/maps/1/index";
import store from "../../../Config/store";
import HUD from "../../Game/UI/HUD/hud";

function World(props) {
    store.dispatch({
        type: "add_Tiles",
        payload: {
            tiles,
        }
    })
    return (
        <div
            style={{
                position: "relative",
                width: "1600px",
                height: "800px",
            }}
        >
            <HUD />
            <Map />
            <Player />
            
        </div>
    )
}

export default World