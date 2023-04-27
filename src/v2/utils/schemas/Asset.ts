import { DocumentData } from "../../entities/DocumentData";

export interface Asset extends DocumentData {
    name: string;
    src: string;
    tags?: string[];
    ts: number;
}