/// <reference types="node" />
import { ConfigType } from "./type";
import * as http from "http";
export declare class FavoriteServe {
    config: ConfigType;
    server: http.Server;
    hostName: string;
    constructor(config: ConfigType);
    init(): void;
}
