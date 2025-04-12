import React, { useState } from "react";
import { LoadingElement } from "./LoadingElement";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../assets/calendar.css";

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
    loading: boolean;
    startDate: Date;
    endDate: Date;
    setStartDate: React.Dispatch<React.SetStateAction<Date>>; 
    setEndDate: React.Dispatch<React.SetStateAction<Date>>; 
}



export const MapSidebar = ({selectedMode, setSelectedMode, loading, startDate, setStartDate, endDate, setEndDate} : SidebarProps) => {

    const [sidebarHidden, setSidebarHidden] = useState<boolean>(false);
    const onChange = (dates) => {
            const [start, end]: Date[] = dates;
            setStartDate(start);
            setEndDate(end);
    };

    const superContainer = document.getElementById("super-container");

    return (
        <div className="sidebar-container" data-hidden={sidebarHidden}>
            <div id="hidebar">
                {loading ? <LoadingElement/> : <span style={{"width" : 40}}/>}
                <span id="sidebar-title">Datasets</span>
                <button type="button"
                        id="hide-btn"
                        onClick={() => setSidebarHidden(!sidebarHidden)}>
                    {sidebarHidden ? "<" : ">"}
                </button>
            </div>
            {!sidebarHidden && (
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
                <DatePicker
                    className="sidebar-item"
                    wrapperClassName="sidebar-datepicker"
                    selected={startDate}
                    startDate={startDate}
                    endDate={endDate}
                    selectsRange
                    onChange={onChange}
                    showDisabledMonthNavigation
                    dropdownMode="select"
                    inline
                    dateFormat="yyyy-MM-dd"
                    minDate={new Date(2023, 0,1)}
                    maxDate={new Date(2023, 11, 0)}
                />
                </div>
            )}
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
                className="sidebar-item"
                onClick={onclick}
                disabled={disabled}>
                {text}
        </button>
    )
}