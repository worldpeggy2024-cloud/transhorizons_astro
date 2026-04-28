declare module "react-simple-maps" {
  import { ReactNode, MouseEvent, CSSProperties } from "react";

  export interface ProjectionConfig {
    scale?: number;
    center?: [number, number];
    rotate?: [number, number, number];
  }

  export interface ComposableMapProps {
    projectionConfig?: ProjectionConfig;
    projection?: string;
    width?: number;
    height?: number;
    style?: CSSProperties;
    children?: ReactNode;
  }

  export interface ZoomableGroupProps {
    zoom?: number;
    center?: [number, number];
    children?: ReactNode;
    [key: string]: unknown;
  }

  export interface GeoFeature {
    rsmKey: string;
    id: string | number;
    properties: Record<string, unknown>;
    geometry: unknown;
  }

  export interface GeographiesChildrenArgument {
    geographies: GeoFeature[];
    outline: GeoFeature;
    borders: GeoFeature;
  }

  export interface GeographiesProps {
    geography: string | object;
    children: (args: GeographiesChildrenArgument) => ReactNode;
  }

  export interface GeographyStyle {
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    outline?: string;
    cursor?: string;
  }

  export interface GeographyProps {
    geography: GeoFeature;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    style?: {
      default?: GeographyStyle;
      hover?: GeographyStyle;
      pressed?: GeographyStyle;
    };
    onMouseEnter?: (event: MouseEvent<SVGPathElement>) => void;
    onMouseMove?: (event: MouseEvent<SVGPathElement>) => void;
    onMouseLeave?: (event: MouseEvent<SVGPathElement>) => void;
    onClick?: (event: MouseEvent<SVGPathElement>) => void;
    [key: string]: unknown;
  }

  export function ComposableMap(props: ComposableMapProps): JSX.Element;
  export function ZoomableGroup(props: ZoomableGroupProps): JSX.Element;
  export function Geographies(props: GeographiesProps): JSX.Element;
  export function Geography(props: GeographyProps): JSX.Element;
  export type { GeographiesChildrenArgument };
}
