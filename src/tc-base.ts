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
    @property({type: String})
    public tooltip = '@L @V';

    @state()
    public width = 0;
    @state()
    public height = 0;
    @state()
    protected valueShapeActive: ValueShape | null = null;

    protected valuesMinCount = 1;
    protected valueShapes: ValueShape[] = [];
    private resizeObserver!: ResizeObserver;

    static styles = css`
        :host {
            --color: #597BFC;
            --opacity: 1;
            --active-opacity: 0.5;
            --area-color: var(--color);
            --area-opacity: 0;
            --tooltip-font-color: white;
            --tooltip-font-size: 0.875em;
            --tooltip-font-weight: bold;
            --tooltip-radius: 3px;
            --tooltip-padding: 3px 4px;
            --tooltip-background: black;
            --tooltip-shadow: none;
            display: inline-block;
            width: 120px;
            height: 60px;
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
        .chart .shape {
            fill: var(--color);
            opacity: var(--opacity);
            stroke: none;
        }
        .chart .shape.is-active {
            opacity: var(--active-opacity);
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
        if (!this.width || !this.height) {
            return;
        }

        if (changedProperties.has('labels')) {
            this.labels = this.labels.map((label) => (label != null) ? '' + label : '');
        }

        const propertiesRelatedToChart = ['width', 'height', 'values', 'labels', 'min', 'max', 'gap', 'depth', 'donut', 'radius'];
        if (propertiesRelatedToChart.some((property) => changedProperties.has(property as any))) {
            this.computeChartData();
        }
    }


    protected abstract computeChartData(): void;


    protected render(): HTMLTemplateResult {
        const shouldRender = this.hasEnoughValues() && this.valueShapes.length;

        return html`
            <div class="wrapper">
                ${shouldRender ? this.chartTemplate() : nothing}
                ${shouldRender ? this.tooltipTemplate() : nothing}
            </div>
        `;
    }


    protected abstract chartTemplate(): TemplateResult;


    protected tooltipTemplate(): TemplateResult | null {
        if (!this.valueShapeActive) {
            return null;
        }

        const style = this.tooltipAnchorPositionFor(this.valueShapeActive);

        const text = this.tooltip
            .replace(/@V/g, this.valueShapeActive.value.toLocaleString())
            .replace(/@L/g, this.valueShapeActive.label ? this.valueShapeActive.label : '')
            .trim();

        return html`
            <div class="tooltip" style="${styleMap(style)}">${text}</div>
        `;
    }


    protected abstract tooltipAnchorPositionFor(valueShape: ValueShape): StyleInfo;


    protected firstUpdated() {
        if (this.static) {
            return;
        }

        const wrapperElement = this.renderRoot.querySelector('.wrapper') as HTMLElement;
        wrapperElement.addEventListener('mousemove', (event: MouseEvent) => {
            if (!this.hasEnoughValues()) {
                return;
            }

            this.valueShapeActive = this.findValueShapeAtPosition(event.offsetX, event.offsetY);
        });
        wrapperElement.addEventListener('mouseleave', () => {
            this.valueShapeActive = null;
        });
    }


    protected abstract findValueShapeAtPosition(x: number, y: number): ValueShape | null;


    protected updated() {
        if (this.valueShapeActive) {
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


    protected hasEnoughValues() {
        return (this.values.length >= this.valuesMinCount);
    }
}
