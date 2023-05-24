import { PropertyValues, TemplateResult } from 'lit';
import { TcBase } from './tc-base.js';
import { ValueCircle } from './types.js';
export declare class TcLine extends TcBase {
    shapeSize: number;
    protected valueShapes: ValueCircle[];
    protected valueShapeFocused: ValueCircle;
    private linePath;
    private areaPath;
    static styles: import("lit").CSSResultGroup[];
    protected computeChartProperties(): void;
    protected willUpdate(changedProperties: PropertyValues<this>): void;
    protected findValueShapeAtPosition(x: number, y: number): ValueCircle;
    protected templateChart(): TemplateResult | null;
    protected templateTooltip(): TemplateResult | null;
}
