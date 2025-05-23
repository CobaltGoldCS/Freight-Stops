import { MapContainer, TileLayer } from "react-leaflet"
import { StopMarkerProps } from "../components/StopMarkers"
import 'leaflet/dist/leaflet.css';
import { MapSidebar, MapViewType } from "../components/MapSidebar";
import React, { ReactNode, useRef, useState } from "react";
import { RouteProps, Routes, Route } from "../components/Routes";
import HeatmapLayer, { HeatLayerProps } from "../components/HeatmapLayer";
import { MapEventHandler } from "../components/MapEventHandler";
import { LatLng, LatLngBounds, LatLngTuple } from "leaflet";

interface MapInfo {
    stopMarkerProps?: StopMarkerProps;
    routeProps?: RouteProps;
    heatmapProps?: HeatLayerProps;
}

export const VisualMap = () => {
    const [selectedMode, setSelectedMode] = useState<MapViewType>(MapViewType.NONE);
    const mapInfo = useRef<MapInfo>({ heatmapProps: { latlngs: [] } });
    const [markers, setMarkers] = useState<ReactNode>([]);
    const [bounds, setBounds] = useState<LatLngBounds>(new LatLngBounds(new LatLng(37.42256837427797, -124.01365575321213), new LatLng(44.24523729658361, -100.0634604407121)));
    const [loading, setLoading] = useState<boolean>(false);
    const [startDate, setStartDate] = useState<Date>(new Date(2023, 0, 1));
    const [endDate, setEndDate] = useState<Date | null>(new Date(2023, 0, 31));
    const [skipNumber, setSkipNumber] = useState<number>(3);
    const [maxResults, setMaxResults] = useState<number>(10000);
    const [eps, setEps] = useState<number>(0.00005);
    const [minSamples, setMinSamples] = useState<number>(3);

    const abortController = useRef(new AbortController());
    const loadingTimeout = useRef<number>();

    const handleSubmit = () => {
        if (endDate == null || startDate.getMonth() != endDate.getMonth()) {
            setSelectedMode(MapViewType.NONE);
            setLoading(false);
            abortController.current.abort();
            return;
        }
        abortController.current = new AbortController();
        setLoading(true);

        // Set a timeout to automatically stop loading after 120 seconds
        loadingTimeout.current = setTimeout(() => {
            setSelectedMode(MapViewType.NONE);
            setLoading(false);
            abortController.current.abort();
        }, 120000);

        updateSelectedMode(
            selectedMode,
            mapInfo,
            setLoading,
            abortController.current,
            setMarkers,
            startDate,
            endDate,
            skipNumber,
            maxResults,
            eps,
            minSamples
        );
    };

    return (
        <div id="super-container">
            <div className="layout-container">
                <MapContainer center={bounds.getCenter()} zoom={6} scrollWheelZoom={true}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {!loading && markers}
                    <MapEventHandler setBounds={setBounds} />
                </MapContainer>
            </div>
            <MapSidebar
                selectedMode={selectedMode}
                setSelectedMode={setSelectedMode}
                loading={loading}
                startDate={startDate}
                endDate={endDate}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                skipNumber={skipNumber}
                setSkipNumber={setSkipNumber}
                maxResults={maxResults}
                setMaxResults={setMaxResults}
                eps={eps}
                setEps={setEps}
                minSamples={minSamples}
                setMinSamples={setMinSamples}
                onSubmit={handleSubmit}
            />
        </div>
    )
}

const updateSelectedMode = async (
    selectedMode: MapViewType,
    mapInfo: React.MutableRefObject<MapInfo>,
    setLoading: React.Dispatch<boolean>,
    shouldAbort: AbortController,
    setMarkers: React.Dispatch<React.SetStateAction<ReactNode>>,
    startDate: Date,
    endDate: Date,
    skipNumber: number,
    maxResults: number,
    eps: number,
    minSamples: number
) => {
    let result;
    try {
        switch (selectedMode.valueOf()) {
            case MapViewType.INTO_UTAH:
                result = (await toUtahCall(startDate, endDate, shouldAbort, skipNumber, maxResults)).result;
                mapInfo.current.routeProps = { routes: result }
                setMarkers(Routes(mapInfo.current.routeProps))
                break;
            case MapViewType.OUT_OF_UTAH:
                result = (await fromUtahCall(startDate, endDate, shouldAbort, skipNumber, maxResults)).result;
                mapInfo.current.routeProps = { routes: result }
                setMarkers(Routes(mapInfo.current.routeProps))
                break;
            case MapViewType.HEAT:
                result = (await heatmapCall(startDate, endDate, shouldAbort, eps, minSamples)).result;
                mapInfo.current.heatmapProps = { latlngs: result.heatmap_data };
                setMarkers(<HeatmapLayer max={4} latlngs={mapInfo.current.heatmapProps.latlngs} />);
                break;
            case MapViewType.NONE:
                break;
        }
    } catch (e) {
        if (e instanceof DOMException) {
            console.log("Request Was Aborted");
        } else {
            throw new TypeError(`Unexpected Exception ${e}`);
        }
    } finally {
        setLoading(false);
    }
}

const heatmapCall = async (startDate: Date, endDate: Date, abortController: AbortController, eps: number, minSamples: number) => {
    let heatmapResponse = await fetch(`/api/queries/heatmap`, {
        method: "POST",
        headers: [["Content-Type", "application/json"],],
        body: JSON.stringify({
            month: startDate.getMonth() + 1,
            eps: eps,
            minSamples: minSamples,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
        })
    });

    let jobId: number = (await heatmapResponse.json())["jobId"];
    let result = await waitUntilResult(jobId, abortController);

    if (result.result == null) {
        result.result.heatmap_data = [];
    }

    result["result"]["heatmap_data"] = result["result"]["heatmap_data"].map((item: any) => {
        return [item.latitude, item.longitude, item.count]
    });

    return result;
}

const toUtahCall = async (startDate: Date, endDate: Date, abortController: AbortController, skipNumber: number, maxResults: number) => {
    let response = await fetch(`/api/queries/to_utah`, {
        method: "POST",
        headers: [["Content-Type", "application/json"],],
        body: JSON.stringify({
            month: startDate.getMonth() + 1,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            skipNumber: skipNumber,
            maxResults: maxResults
        })
    });

    let jobId: number = (await response.json())["jobId"];
    let result = await waitUntilResult(jobId, abortController);

    if (result.result == null) {
        result.result = [];
    }
    result.result = result.result.reduce(
        (entryMap: any, e: any) => entryMap.set(e.route_id, [...entryMap.get(e.route_id) || [],
        [e.latitude, e.longitude]
        ]),
        new Map()
    ).values().map((value: LatLngTuple[]) => new Route(value));

    return result;
}

const fromUtahCall = async (startDate: Date, endDate: Date, abortController: AbortController, skipNumber: number, maxResults: number) => {
    let response = await fetch(`/api/queries/from_utah`, {
        method: "POST",
        headers: [["Content-Type", "application/json"],],
        body: JSON.stringify({
            month: startDate.getMonth() + 1,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            skipNumber: skipNumber,
            maxResults: maxResults
        })
    });

    let jobId: number = (await response.json())["jobId"];
    let result = await waitUntilResult(jobId, abortController);

    if (result.result == null) {
        result.result = [];
    }
    result.result = result.result.reduce(
        (entryMap: any, e: any) => entryMap.set(e.route_id, [...entryMap.get(e.route_id) || [],
        [e.latitude, e.longitude]
        ]),
        new Map()
    ).values().map((value: LatLngTuple[]) => new Route(value));

    return result;
}

const waitUntilResult = async (jobId: number, abortController: AbortController) => {
    let jobComplete = false;
    let result;
    while (!jobComplete) {
        let jobStatusResponse = await fetch(`/api/queries/status/${jobId}`, {
            headers: [['cache-control', 'no-cache']],
            signal: abortController.signal
        });

        result = await jobStatusResponse.json();

        if (result["completedAt"] != null) {
            return result
        }

        if (result["error"] != null) {
            console.error(`Error for job ${jobId}: ${result["error"]}`);
            return;
        }

        await new Promise(resolve => setTimeout(resolve, 3000));
    }
}