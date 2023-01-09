import { css, CSSResultGroup, html, HTMLTemplateResult, LitElement, nothing, TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { ValueCircle, ValueRectangle, ValueSlice } from './types.js';


export abstract class TcBase extends LitElement {
    @property({type: Array, reflect: true})
    public values: number[] = [];
    @property({type: Number, reflect: true})
    public min: number | null = null;
    @property({type: Number, reflect: true})
    public max: number | null = null;
    @property({type: Boolean, reflect: true, attribute: 'tooltip-disabled'})
    public tooltipDisabled = false;
    @property({type: String, attribute: 'tooltip-text'})
    public tooltipText = '%V%';

    @state()
    protected valueShapeFocused: ValueCircle | ValueRectangle | ValueSlice | null = null;
    @state()
    protected width = 0;
    @state()
    protected height = 0;

    protected valueShapes: (ValueCircle | ValueRectangle | ValueSlice)[] = [];
    private resizeObserver!: ResizeObserver;

    static styles = css`
        :host {
            --tooltip-font-color: white;
            --tooltip-font-size: 0.875em;
            --tooltip-font-weight: bold;
            --tooltip-radius: 3px;
            --tooltip-padding: 3px 4px;
            --tooltip-background: black;
            --tooltip-shadow: none;
            display: inline-block;
        }
        .wrapper {
            display: block;
            width: 100%;
            height: 100%;
            position: relative;
            z-index: 1;
            box-sizing: border-box;
            border-radius: inherit;
        }
        .wrapper * {
            box-sizing: border-box;
        }
        .chart {
            display: block;
            position: relative;
            z-index: 1;
            overflow: hidden;
            border-radius: inherit
        }
        .tooltip {
            position: absolute;
            z-index: 10;
            font-size: var(--tooltip-font-size);
            font-weight: var(--tooltip-font-weight);
            line-height: 1;
            text-align: center;
            white-space: nowrap;
            color: var(--tooltip-font-color);
            padding: var(--tooltip-padding);
            pointer-events: none;
            border-radius: var(--tooltip-radius);
            background-color: var(--tooltip-background);
            box-shadow: var(--tooltip-shadow);
        }
    ` as CSSResultGroup;


    public connectedCallback() {
        super.connectedCallback();

        this.resizeObserver = new ResizeObserver((entries) => {
            entries.forEach((entry) => {
                this.width = entry.contentRect.width;
                this.height = entry.contentRect.height;
            });
        });
        this.resizeObserver.observe(this);
    }


    public disconnectedCallback() {
        super.disconnectedCallback();
        this.resizeObserver.unobserve(this);
    }


    protected firstUpdated() {
        const wrapperElement = this.renderRoot.querySelector('.wrapper') as HTMLElement;

        if (!this.tooltipDisabled) {
            wrapperElement.addEventListener('mousemove', (event: MouseEvent) => {
                this.valueShapeFocused = this.findValueShapeAtPosition(event.offsetX, event.offsetY);;
            });
            wrapperElement.addEventListener('mouseleave', () => {
                this.valueShapeFocused = null;
            });
        }
    }


    /**
     * Compute the propeties used to create the chart
     */
    protected abstract computeChartProperties(): void;


    /**
     * Find the ValueShape at given position
     */
    protected abstract findValueShapeAtPosition(x: number, y: number): ValueCircle | ValueRectangle | ValueSlice | null;


    protected render(): HTMLTemplateResult {
        return html`
            <div class="wrapper">
                ${this.templateChart() ?? nothing}
                ${this.templateTooltip() ?? nothing}
            </div>
        `;
    }


    protected abstract templateChart(): TemplateResult | null;


    protected abstract templateTooltip(): TemplateResult | null;


    protected tooltipTextFormatted(text: string): string {
        return this.tooltipText.replace(/%V%/g, text);
    }


    protected validatePropertyAsPositiveNumber(propertyName: keyof this & string): void {
        const property = this[propertyName] as any;
        if (!Number.isFinite(property) || property < 0) {
            throw new Error(`The property ${propertyName} must be a positive number`);
        }
    }


    protected onlyNegativeValues(): boolean {
        return (Math.max(...this.values) === 0);
    }
}
