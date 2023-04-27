import { CSSResultGroup, HTMLTemplateResult, LitElement, TemplateResult } from 'lit';
import { ValueCircle, ValueRectangle, ValueSlice } from './types.js';
export declare abstract class TcBase extends LitElement {
    values: number[];
    min: number | null;
    max: number | null;
    tooltipDisabled: boolean;
    tooltipText: string;
    protected valueShapeFocused: ValueCircle | ValueRectangle | ValueSlice | null;
    protected width: number;
    protected height: number;
    protected valueShapes: (ValueCircle | ValueRectangle | ValueSlice)[];
    private resizeObserver;
    static styles: CSSResultGroup;
    connectedCallback(): void;
    disconnectedCallback(): void;
    protected firstUpdated(): void;
    /**
     * Compute the propeties used to create the chart
     */
    protected abstract computeChartProperties(): void;
    /**
     * Find the ValueShape at given position
     */
    protected abstract findValueShapeAtPosition(x: number, y: number): ValueCircle | ValueRectangle | ValueSlice | null;
    protected render(): HTMLTemplateResult;
    protected abstract templateChart(): TemplateResult | null;
    protected abstract templateTooltip(): TemplateResult | null;
    protected tooltipTextFormatted(text: string): string;
    protected validatePropertyAsPositiveNumber(propertyName: keyof this & string): void;
    protected onlyNegativeValues(): boolean;
}
