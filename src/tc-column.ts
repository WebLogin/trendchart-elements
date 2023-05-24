import { css, html, PropertyValues, svg, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { TcBase } from './tc-base.js';
import { ValueRectangle } from './types.js';


@customElement('tc-column')
export class TcColumn extends TcBase {
    @property({type: Number, reflect: true, attribute: 'shape-gap'})
    public shapeGap = 1;
    @property({type: Number, reflect: true, attribute: 'shape-radius'})
    public shapeRadius = 1;

    protected valueShapes!: ValueRectangle[];
    protected valueShapeFocused!: ValueRectangle;

    static styles = [
        TcBase.styles,
        css`
            :host {
                --shape-focused-opacity: 0.5;
                width: 120px;
                height: 40px;
            }
            .chart > .shape {
                fill: var(--shape-color);
                opacity: var(--shape-opacity);
                stroke: none;
            }
            .chart > .shape.is-focused {
                opacity: var(--shape-focused-opacity);
            }
        `,
    ];


    protected computeChartProperties(): void {
        this.valueShapes = [];

        let valueMin = Math.min(...this.values);
        if (this.min !== null) {
            valueMin = Math.min(valueMin, this.min);
        }

        let valueMax = Math.max(...this.values);
        if (this.max !== null) {
            valueMax = Math.max(valueMax, this.max);
        }

        const valueScale = valueMax - valueMin;

        const columnWidth = (this.width - (this.shapeGap * (this.values.length - 1))) / this.values.length;

        const columnPositionY = (value: number): number => {
            return this.height - (valueScale ? ((value - valueMin) / valueScale) * this.height : 1);
        };

        this.values.forEach((value, index) => {
            let xLeft = (columnWidth + this.shapeGap) * index;
            let yTop = (value < 0) ? columnPositionY(Math.min(valueMax, 0)) : columnPositionY(value);
            let yBottom = (value < 0) ? columnPositionY(value) : columnPositionY(Math.max(valueMin, 0));

            let height = yBottom - yTop;
            if (height == 0) {
                height = 1;
                if (valueMax > 0 && valueScale) {
                    yTop--;
                }
            }

            this.valueShapes.push({
                index: index,
                value: value,
                label: this.labels[index] ?? null,
                origin: {
                    x: xLeft,
                    y: yTop,
                },
                width: columnWidth,
                height: height,
            });
        });
    }


    protected willUpdate(changedProperties: PropertyValues<this>) {
        if (!this.width || !this.height) {
            return;
        }

        if (changedProperties.has('shapeGap')) {
            this.validatePropertyAsPositiveNumber('shapeGap');
        }

        if (changedProperties.has('shapeRadius')) {
            this.validatePropertyAsPositiveNumber('shapeRadius');
        }

        const propertiesUsedByChart = ['width', 'height', 'values', 'labels', 'min', 'max', 'shapeGap', 'shapeRadius'];
        if ([...changedProperties.keys()].some((property) => propertiesUsedByChart.includes(property as string))) {
            this.computeChartProperties();
        }
    }


    protected findValueShapeAtPosition(x: number, y: number): ValueRectangle | null {
        return this.valueShapes.find((valueShape: ValueRectangle): boolean => {
            const xMin = valueShape.origin.x - (this.shapeGap / 2);
            const xMax = valueShape.origin.x + valueShape.width + (this.shapeGap / 2);
            return x >= xMin && x <= xMax;
        }) ?? null;
    }


    protected templateChart(): TemplateResult | null {
        if (this.valueShapes.length < 1) {
            return null;
        }

        const shapeRadius = Math.min(this.shapeRadius, (this.valueShapes[0].width / 2));

        return html`
            <svg class="chart" width="100%" height="100%">
                ${this.valueShapes.map((valueShape, index) => svg`
                    <rect class="area"
                        x="${valueShape.origin.x}"
                        y="0"
                        width="${valueShape.width}"
                        height="100%"
                        rx="${shapeRadius}" ry="${shapeRadius}"
                    />
                    <rect class="shape ${(this.valueShapeFocused?.index === index) ? 'is-focused' : ''}"
                        x="${valueShape.origin.x}"
                        y="${valueShape.origin.y}"
                        width="${valueShape.width}"
                        height="${valueShape.height}"
                        rx="${shapeRadius}" ry="${shapeRadius}"
                    />
                `)}
            </svg>
        `;
    }


    protected templateTooltip(): TemplateResult | null {
        if (this.valueShapeFocused === null) {
            return null;
        }

        let style = {
            left: (this.valueShapeFocused.origin.x + (this.valueShapeFocused.width / 2)) + 'px',
            top: (this.valueShapeFocused.origin.y - 2) + 'px',
            transform: 'translate(-50%, -100%)',
        };
        if (this.valueShapeFocused.value < 0 || this.onlyNegativeValues()) {
            style.top = (this.valueShapeFocused.origin.y + this.valueShapeFocused.height + 2) + 'px';
            style.transform = 'translate(-50%, 0%)';
        }

        return html`
            <div class="tooltip" style="${styleMap(style)}">
                ${this.tooltipTextFormatted(this.valueShapeFocused)}
            </div>
        `;
    }
}
