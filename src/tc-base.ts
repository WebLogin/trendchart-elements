import { CSSResultGroup, HTMLTemplateResult, LitElement, PropertyValues, TemplateResult, css, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { ValueShape, ValueShapeEvent } from './types.js';


export abstract class TcBase extends LitElement {
    @property({type: Array})
    public values: number[] = [];
    @property({type: Array})
    public labels: string[] = [];
    @property({type: Number})
    public max = 0;
    @property({type: Boolean, reflect: true})
    public static = false;
    @property({type: String})
    public tooltip = '@L @V';

    @state()
    protected width = 0;
    @state()
    protected height = 0;
    @state()
    protected valueShapeActive?: ValueShape;

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
            display: block;
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
            user-select: none;
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
            this.labels = this.labels.map((label) => (label != null) ? ('' + label).trim() : '');
        }

        const propertiesRelatedToChart = ['width', 'height', 'values', 'labels', 'min', 'max', 'gap', 'weight', 'donut', 'radius'];
        if (propertiesRelatedToChart.some((property) => changedProperties.has(property as any))) {
            this.computeChartData();
        }
    }


    protected render(): HTMLTemplateResult {
        const shouldRender = this.hasEnoughValues() && this.valueShapes.length;

        return html`
            <div class="wrapper">
                ${shouldRender ? this.chartTemplate() : nothing}
                ${shouldRender ? this.tooltipTemplate() : nothing}
            </div>
        `;
    }


    protected firstUpdated() {
        this.registerEvents();
    }


    protected updated() {
        this.fixTooltipOverflow();
    }


    protected abstract computeChartData(): void;


    protected abstract chartTemplate(): TemplateResult;


    protected abstract tooltipTemplate(): TemplateResult;


    protected abstract findValueShapeAtPosition(x: number, y: number): ValueShape | undefined;


    protected hasEnoughValues(): boolean {
        return (this.values.length >= this.valuesMinCount);
    }


    private registerEvents(): void {
        const wrapperElement = this.renderRoot.querySelector('.wrapper') as HTMLElement;

        // Click on shape
        wrapperElement.addEventListener('click', (event: MouseEvent) => {
            event.stopPropagation();

            const valueShapeActive = this.findValueShapeAtPosition(event.offsetX, event.offsetY);
            if (valueShapeActive) {
                this.dispatchValueShapeEvent('shape-click', valueShapeActive);
            }
        });

        // Mouse enter/leave shape
        let currentValueShapeActive: ValueShape | undefined;
        wrapperElement.addEventListener('mousemove', (event: MouseEvent) => {
            event.stopPropagation();

            const newValueShapeActive = this.findValueShapeAtPosition(event.offsetX, event.offsetY);
            if (currentValueShapeActive && (!newValueShapeActive || newValueShapeActive.index !== currentValueShapeActive.index)) {
                this.dispatchValueShapeEvent('shape-leave', currentValueShapeActive);
            }
            if (newValueShapeActive && (!currentValueShapeActive || newValueShapeActive.index !== currentValueShapeActive.index)) {
                this.dispatchValueShapeEvent('shape-enter', newValueShapeActive);
            }

            currentValueShapeActive = newValueShapeActive;
            if (!this.static) {
                this.valueShapeActive = currentValueShapeActive;
            }
        });
        wrapperElement.addEventListener('mouseleave', (event: MouseEvent) => {
            event.stopPropagation();

            if (currentValueShapeActive) {
                this.dispatchValueShapeEvent('shape-leave', currentValueShapeActive);
            }

            currentValueShapeActive = undefined;
            if (!this.static) {
                this.valueShapeActive = currentValueShapeActive;
            }
        });
    }


    protected tooltipText(): string {
        if (!this.valueShapeActive) return '';

        return this.tooltip
            .replace(/@V/g, this.valueShapeActive.value.toLocaleString())
            .replace(/@L/g, this.valueShapeActive.label ? this.valueShapeActive.label : '')
            .trim();
    }


    private fixTooltipOverflow(): void {
        const tooltip = this.renderRoot.querySelector<HTMLElement>('.tooltip');
        if (!tooltip) {
            return;
        }

        const screenOffset = 10;
        const tooltipRect = tooltip.getBoundingClientRect();

        let left = parseFloat(tooltip.style.left);
        if (tooltipRect.left < screenOffset) {
            left += screenOffset - Math.floor(tooltipRect.left);
        } else if (tooltipRect.right > (document.documentElement.offsetWidth - screenOffset)) {
            left += (document.documentElement.offsetWidth - screenOffset - Math.ceil(tooltipRect.right));
        }

        tooltip.style.left = `${left}px`;
    }


    private dispatchValueShapeEvent(type: string, valueShape: ValueShape): void {
        this.dispatchEvent(new CustomEvent<ValueShapeEvent>(type, {
            detail: {
                index: valueShape.index,
                value: valueShape.value,
                label: valueShape.label,
            },
            bubbles: false,
            composed: false,
          }));
    }
}
