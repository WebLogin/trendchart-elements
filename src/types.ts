// Shapes
export interface ShapeCircle {
    center: ShapePoint,
    radius: number,
}
export interface ShapeLine {
    start: ShapePoint,
    end: ShapePoint,
}
export interface ShapePoint {
    x: number,
    y: number,
}
export interface ShapeRectangle {
    origin: ShapePoint,
    width: number,
    height: number,
}
export interface ShapeSlice {
    center: ShapePoint,
    path: string,
}


// ValueShapes
interface BaseValueShape {
    index: number,
    value: number,
    label: string | null,
}
export interface ValueShapeCircle extends BaseValueShape, ShapeCircle {}
export interface ValueShapeRectangle extends BaseValueShape, ShapeRectangle {}
export interface ValueShapeSlice extends BaseValueShape, ShapeSlice {}
export type ValueShape = ValueShapeCircle | ValueShapeRectangle | ValueShapeSlice;


// Events
export interface ValueShapeEvent extends BaseValueShape {}
