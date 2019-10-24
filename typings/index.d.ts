import { Source } from "webpack-sources";
import "./declarations";
export type SourceFactory = (...sources: (string | Source)[]) => Source;