import { PropertyValues, TemplateResult } from 'lit';
import { TcBase } from './tc-base.js';
import { ValueSlice } from './types.js';
export declare class TcPie extends TcBase {
    sliceSize: number | null;
    sliceGap: number;
    protected valueShapes: ValueSlice[];
    protected valueShapeFocused: ValueSlice;
    private cutoutCircle;
    private gapLines;
    private areaPath;
    static styles: import("lit").CSSResultGroup[];
    protected computeChartProperties(): void;
    protected willUpdate(changedProperties: PropertyValues<this>): void;
    protected findValueShapeAtPosition(x: number, y: number): ValueSlice | null;
    protected templateChart(): TemplateResult | null;
    protected templateTooltip(): TemplateResult | null;
}
