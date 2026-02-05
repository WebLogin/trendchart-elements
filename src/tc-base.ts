import { CSSResultGroup, HTMLTemplateResult, LitElement, PropertyValues, TemplateResult, css, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { ValueShape, ValueShapeEvent } from './types.js';


export abstract class TcBase<TValueShape extends ValueShape> extends LitElement {
    @property({type: Array})
    public values: number[] = [];
    @property({type: Array})
    public labels: string[] = [];
    @property({type: Number})
    public max = 0;
    @property({type: Number, attribute: false})
    public active?: number;
    @property({type: Boolean, reflect: true})
    public static = false;
    @property({type: String, attribute: 'tooltip-format'})
    public tooltipFormat = '@L @V';
    @property({type: Boolean, attribute: 'tooltip-disabled', reflect: true})
    public tooltipDisabled = false;

    @state()
    protected width = 0;
    @state()
    protected height = 0;

    public valueShapes: TValueShape[] = [];
    private resizeObserver!: ResizeObserver;

    public static styles = css`
        :host {
            --shape-color: #597BFC;
            --shape-opacity: 1;
            --shape-opacity-active: 0.5;
            --residual-color: black;
            --residual-opacity: 0;
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
            border-radius: inherit;
            transform: translateZ(0);
        }
        .chart .residual {
            fill: var(--residual-color);
            opacity: var(--residual-opacity);
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


    public get valueShapeActive(): TValueShape | undefined {
        if (this.active === undefined) return;

        return this.valueShapes[this.active];
    }


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

        const propertiesRelatedToChartShapes = ['width', 'height', 'values', 'labels', 'min', 'max', 'gap', 'weight', 'point', 'inside', 'donut', 'radius'];
        if (propertiesRelatedToChartShapes.some((property) => changedProperties.has(property as any))) {
            this.computeChartShapes();
            this.dispatchEvent(new CustomEvent('computed', {bubbles: false, composed: false}));
        }
    }


    protected render(): HTMLTemplateResult {
        return html`
            <div class="wrapper">
                ${this.hasEnoughValueShapes() ? this.chartTemplate() : nothing}
                ${this.hasEnoughValueShapes() ? this.tooltipTemplate() : nothing}
            </div>
        `;
    }


    protected firstUpdated() {
        const wrapperElement = this.renderRoot.querySelector('.wrapper') as HTMLElement;

        // Register event shape click
        wrapperElement.addEventListener('click', (event: MouseEvent) => {
            const valueShapeClicked = this.findValueShapeAtPosition(event.offsetX, event.offsetY);
            if (valueShapeClicked) {
                this.dispatchValueShapeEvent('shape-click', valueShapeClicked);
            }
        });

        // Register event shape hover
        let currentValueShapeHovered: TValueShape | undefined;
        wrapperElement.addEventListener('mousemove', (event: MouseEvent) => {
            const newValueShapeHovered = this.findValueShapeAtPosition(event.offsetX, event.offsetY);
            if (currentValueShapeHovered && (!newValueShapeHovered || newValueShapeHovered.index !== currentValueShapeHovered.index)) {
                this.dispatchValueShapeEvent('shape-leave', currentValueShapeHovered);
            }
            if (newValueShapeHovered && (!currentValueShapeHovered || newValueShapeHovered.index !== currentValueShapeHovered.index)) {
                this.dispatchValueShapeEvent('shape-enter', newValueShapeHovered);
            }

            currentValueShapeHovered = newValueShapeHovered;

            if (!this.static) {
                this.active = currentValueShapeHovered?.index;
            }
        });
        wrapperElement.addEventListener('mouseleave', (event: MouseEvent) => {
            if (currentValueShapeHovered) {
                this.dispatchValueShapeEvent('shape-leave', currentValueShapeHovered);
            }

            currentValueShapeHovered = undefined;
            if (!this.static) {
                this.active = currentValueShapeHovered;
            }
        });
        document.addEventListener('click', (event: MouseEvent) => {
            if (event.composedPath().includes(wrapperElement) || this.static) return;

            wrapperElement.dispatchEvent(new MouseEvent('mouseleave'));
        });
    }


    protected updated() {
        const tooltip = this.renderRoot.querySelector<HTMLElement>('.tooltip');
        if (tooltip) {
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
    }


    protected abstract computeChartShapes(): void;


    protected abstract chartTemplate(): TemplateResult;


    protected abstract tooltipTemplate(): TemplateResult;


    protected get tooltipText(): string {
        if (!this.valueShapeActive || this.static || this.tooltipDisabled) return '';

        return this.tooltipFormat
            .replace(/@V/g, this.valueShapeActive.value.toLocaleString())
            .replace(/@L/g, this.valueShapeActive.label ? this.valueShapeActive.label : '')
            .trim();
    }


    protected abstract findValueShapeAtPosition(x: number, y: number): TValueShape | undefined;


    protected abstract hasEnoughValueShapes(): boolean;


    protected onlyNegativeValues(): boolean {
        return Math.max(...this.values) < 0;
    }


    private dispatchValueShapeEvent(type: string, valueShape: TValueShape): void {
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
