import { LatLngTuple } from "leaflet";
import { Polyline } from "react-leaflet"


export interface RouteProps {
    routes: Route[]
} 

export class Route {
    positions: LatLngTuple[]

    constructor(positions: LatLngTuple[]) {
        this.positions = positions;
    }
}

export const Routes = (props: RouteProps) => {
    return props.routes.map((route, index) => {
        let polyline: Polyline = <Polyline key={index} positions={route.positions} pathOptions={{
            "color" : "black",
            "opacity" : 0.5,
            "fillOpacity" : 0.5,
            "weight" : 1,
        }}/>;
        return polyline;
    });
}