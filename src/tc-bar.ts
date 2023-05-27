import { css, html, PropertyValues, svg, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { TcBase } from './tc-base.js';
import { ValueRectangle } from './types.js';


@customElement('tc-bar')
export class TcBar extends TcBase {
    @property({type: Number, attribute: 'shape-gap'})
    public shapeGap = 1;
    @property({type: Number, attribute: 'shape-radius'})
    public shapeRadius = 1;

    protected valueShapes!: ValueRectangle[];
    protected valueShapeFocused!: ValueRectangle;

    static styles = [
        TcBase.styles,
        css`
            :host {
                --shape-focused-opacity: 0.5;
                width: 120px;
                height: 60px;
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

        const barHeight = (this.height - (this.shapeGap * (this.values.length - 1))) / this.values.length;

        const barPositionX = (value: number): number => {
            return valueScale ? ((value - valueMin) / valueScale) * this.width : 1;
        };

        this.values.forEach((value, index) => {
            let yTop = (barHeight + this.shapeGap) * index;
            let xLeft = (value < 0) ? barPositionX(value) : barPositionX(Math.max(valueMin, 0));
            let xRight = (value < 0) ? barPositionX(Math.min(valueMax, 0)) : barPositionX(value);

            let width = xRight - xLeft;
            if (width == 0) {
                width = 1;
                if (valueMax < 0 && valueScale) {
                    xLeft--;
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
                width: width,
                height: barHeight,
            });
        });
    }


    protected willUpdate(changedProperties: PropertyValues<this>) {
        if (changedProperties.has('shapeGap')) {
            this.validatePropertyAsPositiveNumber('shapeGap');
        }

        if (changedProperties.has('shapeRadius')) {
            this.validatePropertyAsPositiveNumber('shapeRadius');
        }

        if (!this.width || !this.height) {
            return;
        }

        const propertiesUsedByChart = ['width', 'height', 'values', 'labels', 'min', 'max', 'shapeGap', 'shapeRadius'];
        if ([...changedProperties.keys()].some((property) => propertiesUsedByChart.includes(property as string))) {
            this.computeChartProperties();
        }
    }


    protected findValueShapeAtPosition(x: number, y: number): ValueRectangle | null {
        return this.valueShapes.find((valueShape: ValueRectangle): boolean => {
            const yMin = valueShape.origin.y - (this.shapeGap / 2);
            const yMax = valueShape.origin.y + valueShape.height + (this.shapeGap / 2);
            return y >= yMin && y <= yMax;
        }) ?? null;
    }


    protected templateChart(): TemplateResult | null {
        if (this.valueShapes.length < 1) {
            return null;
        }

        const shapeRadius = Math.min(this.shapeRadius, (this.valueShapes[0].height / 2));

        return html`
            <svg class="chart" width="100%" height="100%">
                ${this.valueShapes.map((valueShape, index) => svg`
                    <rect class="area"
                        x="0"
                        y="${valueShape.origin.y}"
                        width="100%"
                        height="${valueShape.height}"
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

        const style = {
            left: ((this.valueShapeFocused.value < 0) ? this.valueShapeFocused.origin.x : (this.valueShapeFocused.origin.x + this.valueShapeFocused.width)) + 'px',
            top: (this.valueShapeFocused.origin.y - 2) + 'px',
            transform: 'translate(-50%, -100%)',
        };

        return html`
            <div class="tooltip" style="${styleMap(style)}">
                ${this.tooltipTextFormatted(this.valueShapeFocused)}
            </div>
        `;
    }
}
