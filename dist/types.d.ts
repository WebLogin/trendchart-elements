export interface ShapeCircle {
    center: ShapePoint;
    radius: number;
}
export interface ShapeLine {
    start: ShapePoint;
    end: ShapePoint;
}
export interface ShapePoint {
    x: number;
    y: number;
}
export interface ShapeRectangle {
    origin: ShapePoint;
    width: number;
    height: number;
}
export interface ShapeSlice {
    center: ShapePoint;
    path: string;
}
interface ValueShape {
    index: number;
    value: number;
    label: string | null;
}
export interface ValueCircle extends ValueShape, ShapeCircle {
}
export interface ValueRectangle extends ValueShape, ShapeRectangle {
}
export interface ValueSlice extends ValueShape, ShapeSlice {
}
export {};
