import React, { useState } from "react";
import { LoadingElement } from "./LoadingElement";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../assets/calendar.css";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";

export enum MapViewType {
    NONE = 0,
    INTO_UTAH = 1,
    OUT_OF_UTAH = 2,
    HEAT = 3,
}


export interface SidebarProps {
    selectedMode: MapViewType;
    setSelectedMode: React.Dispatch<React.SetStateAction<MapViewType>>;
    loading: boolean;
    startDate: Date;
    endDate: Date | null;
    setStartDate: React.Dispatch<React.SetStateAction<Date>>;
    setEndDate: React.Dispatch<React.SetStateAction<Date | null>>;
    skipNumber: number;
    setSkipNumber: React.Dispatch<React.SetStateAction<number>>;
    maxResults: number;
    setMaxResults: React.Dispatch<React.SetStateAction<number>>;
    eps: number;
    setEps: React.Dispatch<React.SetStateAction<number>>;
    minSamples: number;
    setMinSamples: React.Dispatch<React.SetStateAction<number>>;
    onSubmit: () => void;
}



export const MapSidebar = ({ selectedMode, setSelectedMode, loading, startDate, setStartDate, endDate, setEndDate, skipNumber, setSkipNumber, maxResults, setMaxResults, eps, setEps, minSamples, setMinSamples, onSubmit }: SidebarProps) => {

    const [sidebarHidden, setSidebarHidden] = useState<boolean>(false);
    const onChange = (dates: [Date | null, Date | null] | null) => {
        if (dates) {
            const [start, end] = dates;
            if (start) setStartDate(start);
            setEndDate(end);
        }
    };
    return (
        <div className="sidebar-container" data-hidden={sidebarHidden}>
            <div id="hidebar">
                {loading ? <LoadingElement /> : <span style={{ "width": 30 }} />}
                <span id="sidebar-title">Datasets</span>
                <button type="button"
                    id="hide-btn"
                    onClick={() => setSidebarHidden(!sidebarHidden)}>
                    {sidebarHidden ? <CaretLeft /> : <CaretRight />}
                </button>
            </div>
            {!sidebarHidden && (
                <div id="map-sidebar">
                    <SelectModeButton text={"Freight Routes into Utah"}
                        disabled={selectedMode === MapViewType.INTO_UTAH || loading}
                        onclick={() => setSelectedMode(MapViewType.INTO_UTAH)} />
                    <SelectModeButton text={"Freight Routes from Utah"}
                        disabled={selectedMode === MapViewType.OUT_OF_UTAH || loading}
                        onclick={() => setSelectedMode(MapViewType.OUT_OF_UTAH)} />
                    <SelectModeButton text={"Heatmap of suspected Stops"}
                        disabled={selectedMode === MapViewType.HEAT || loading}
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
                        minDate={new Date(2023, 0, 1)}
                        maxDate={new Date(2023, 11, 0)}
                        disabled={loading}
                    />
                    {selectedMode === MapViewType.HEAT ? (
                        <>
                            <div className="sidebar-item">
                                <label htmlFor="eps">EPS (min 0.00001):</label>
                                <input
                                    type="number"
                                    id="eps"
                                    min="0.00001"
                                    step="0.00001"
                                    value={eps}
                                    onChange={(e) => setEps(Math.max(0.00001, parseFloat(e.target.value) || 0.00001))}
                                    className="sidebar-input"
                                    disabled={loading}
                                />
                            </div>
                            <div className="sidebar-item">
                                <label htmlFor="minSamples">Min Samples (min 1):</label>
                                <input
                                    type="number"
                                    id="minSamples"
                                    min="1"
                                    value={minSamples}
                                    onChange={(e) => setMinSamples(Math.max(1, parseInt(e.target.value) || 1))}
                                    className="sidebar-input"
                                    disabled={loading}
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="sidebar-item">
                                <label htmlFor="skipNumber">Route Point Sampling:</label>
                                <input
                                    type="number"
                                    id="skipNumber"
                                    min="1"
                                    value={skipNumber}
                                    onChange={(e) => setSkipNumber(Math.max(1, parseInt(e.target.value) || 1))}
                                    className="sidebar-input"
                                    disabled={loading}
                                />
                            </div>
                            <div className="sidebar-item">
                                <label htmlFor="maxResults">Max Results (min 10,000):</label>
                                <input
                                    type="number"
                                    id="maxResults"
                                    min="10000"
                                    value={maxResults}
                                    onChange={(e) => setMaxResults(Math.max(10000, parseInt(e.target.value) || 10000))}
                                    className="sidebar-input"
                                    disabled={loading}
                                />
                            </div>
                        </>
                    )}
                    <button
                        className="sidebar-item"
                        onClick={onSubmit}
                        disabled={loading || endDate === null}
                    >
                        Submit Query
                    </button>
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

const SelectModeButton = ({ text, disabled, onclick }: SelectButtonProps) => {
    return (
        <button type="button"
            className="sidebar-item"
            onClick={onclick}
            disabled={disabled}>
            {text}
        </button>
    )
}