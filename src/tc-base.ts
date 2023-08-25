import { CSSResultGroup, HTMLTemplateResult, LitElement, PropertyValues, TemplateResult, css, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { StyleInfo, styleMap } from 'lit/directives/style-map.js';
import { ValueShape } from './types.js';


export abstract class TcBase extends LitElement {
    @property({type: Array})
    public values: number[] = [];
    @property({type: Array})
    public labels: string[] = [];
    @property({type: Number})
    public min: number | null = null;
    @property({type: Number})
    public max: number | null = null;
    @property({type: Boolean, reflect: true})
    public static = false;
    @property({type: String, attribute: 'tooltip-text'})
    public tooltipText = '@L @V';

    @state()
    protected valueShapeFocused: ValueShape | null = null;
    @state()
    protected width = 0;
    @state()
    protected height = 0;

    protected valueShapes: ValueShape[] = [];
    private resizeObserver!: ResizeObserver;

    static styles = css`
        :host {
            --shape-color: #597BFC;
            --shape-opacity: 1;
            --area-color: var(--shape-color);
            --area-opacity: 0;
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
            width: 100%;
            height: 100%;
            overflow: hidden;
            border-radius: inherit
        }
        .chart .area {
            fill: var(--area-color);
            opacity: var(--area-opacity);
            stroke: none;
        }
        .chart > .shape {
            fill: var(--shape-color);
            opacity: var(--shape-opacity);
            stroke: none;
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


    protected willUpdate(changedProperties: PropertyValues<this>) {
        if (changedProperties.has('labels')) {
            this.labels = this.labels.map((label) => (label != null) ? ''+label : '');
        }
    }


    protected render(): HTMLTemplateResult {
        return html`
            <div class="wrapper">
                ${this.chartTemplate() ?? nothing}
                ${this.tooltipTemplate() ?? nothing}
            </div>
        `;
    }


    protected firstUpdated() {
        if (!this.static) {
            const wrapperElement = this.renderRoot.querySelector('.wrapper') as HTMLElement;
            wrapperElement.addEventListener('mousemove', (event: MouseEvent) => {
                this.valueShapeFocused = this.findValueShapeAtPosition(event.offsetX, event.offsetY);;
            });
            wrapperElement.addEventListener('mouseleave', () => {
                this.valueShapeFocused = null;
            });
        }
    }


    protected updated() {
        if (this.valueShapeFocused) {
            const screenOffset = 10;
            const tooltipElement = this.renderRoot.querySelector('.tooltip') as HTMLElement;
            const tooltipRect = tooltipElement.getBoundingClientRect();

            let left = parseFloat(tooltipElement.style.left);
            if (tooltipRect.left < screenOffset) {
                left += screenOffset - Math.floor(tooltipRect.left);
            } else if (tooltipRect.right > (document.documentElement.offsetWidth - screenOffset)) {
                left += (document.documentElement.offsetWidth - screenOffset - Math.ceil(tooltipRect.right));
            }

            tooltipElement.style.left = `${left}px`;
        }
    }


    protected abstract chartTemplate(): TemplateResult | null;


    protected abstract computeChartProperties(): void;


    protected abstract findValueShapeAtPosition(x: number, y: number): ValueShape | null;


    protected tooltipTemplate(): TemplateResult | null {
        if (!this.valueShapeFocused) {
            return null;
        }

        const style = this.tooltipAnchorPositionFor(this.valueShapeFocused);

        const text = this.tooltipText
            .replace(/@V/g, this.valueShapeFocused.value.toLocaleString())
            .replace(/@L/g, this.valueShapeFocused.label ? this.valueShapeFocused.label : '')
            .trim();

        return html`
            <div class="tooltip" style="${styleMap(style)}">${text}</div>
        `;
    }


    protected abstract tooltipAnchorPositionFor(valueShape: ValueShape): StyleInfo;


    protected validatePropertyAsPositiveNumber(propertyName: keyof this & string): void {
        const property = this[propertyName] as any;
        if (!Number.isFinite(property) || property < 0) {
            throw new Error(`The property ${propertyName} must be a positive number`);
        }
    }
}
