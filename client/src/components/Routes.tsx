import { Polyline } from "react-leaflet"


export interface RouteProps {
    routes: Route[]
} 

export class Route {
    positions: Number[][]

    constructor(positions: Number[][]) {
        this.positions = positions;
    }
}

export const Routes = (props: RouteProps) => {
    return props.routes.map((route, index) => {
        return (
            <Polyline key={index} positions={route.positions} />
        )
    });
}