import { PropertyValues, TemplateResult } from 'lit';
import { TcBase } from './tc-base.js';
import { ValueRectangle } from './types.js';
export declare class TcBar extends TcBase {
    shapeGap: number;
    shapeRadius: number;
    protected valueShapes: ValueRectangle[];
    protected valueShapeFocused: ValueRectangle;
    static styles: import("lit").CSSResultGroup[];
    protected computeChartProperties(): void;
    protected willUpdate(changedProperties: PropertyValues<this>): void;
    protected findValueShapeAtPosition(x: number, y: number): ValueRectangle | null;
    protected templateChart(): TemplateResult | null;
    protected templateTooltip(): TemplateResult | null;
}
