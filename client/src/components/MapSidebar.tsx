import React from "react";

export enum MapViewType {
    NONE = 0,
    STOPS = 1,
    INTO_UTAH = 2,
    OUT_OF_UTAH = 3,
    HEAT = 4,
}


export interface SidebarProps {
    selectedMode: MapViewType;
    setSelectedMode: React.Dispatch<React.SetStateAction<MapViewType>>;
}



export const MapSidebar = ({selectedMode, setSelectedMode} : SidebarProps) => {

    return (
        <div id="map-sidebar">
            <SelectModeButton text={"Truck Stops"}
                              disabled={selectedMode === MapViewType.STOPS}
                              onclick={() => setSelectedMode(MapViewType.STOPS)} />
            <SelectModeButton text={"Freight Routes into Utah"}
                              disabled={selectedMode === MapViewType.INTO_UTAH}
                              onclick={() => setSelectedMode(MapViewType.INTO_UTAH)} />
            <SelectModeButton text={"Freight Routes from Utah"}
                              disabled={selectedMode === MapViewType.OUT_OF_UTAH}
                              onclick={() => setSelectedMode(MapViewType.OUT_OF_UTAH)} />
            <SelectModeButton text={"Heatmap"}
                              disabled={selectedMode === MapViewType.HEAT}
                              onclick={() => setSelectedMode(MapViewType.HEAT)} />
        </div>
    )
}

interface SelectButtonProps {
    text: String;
    disabled: boolean;
    onclick: () => void;
}

const SelectModeButton = ({text, disabled, onclick} : SelectButtonProps) => {
    return (
        <button type="button"
            onClick={onclick}
            disabled={disabled}>
                {text}
        </button>
    )
}