import { css, html, svg, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { StyleInfo } from 'lit/directives/style-map.js';
import { TcBase } from './tc-base.js';
import { ValueShapeRectangle } from './types.js';


@customElement('tc-bars')
export class TcBars extends TcBase {
    @property({type: Number, attribute: 'shape-gap'})
    public shapeGap = 1;
    @property({type: Number, attribute: 'shape-radius'})
    public shapeRadius = 1;

    protected valuesMinCount = 2;
    protected valueShapes!: ValueShapeRectangle[];
    protected valueShapeFocused!: ValueShapeRectangle;

    static styles = [
        TcBase.styles,
        css``,
    ];


    protected computeChartData(): void {
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


    protected chartTemplate(): TemplateResult {
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


    protected tooltipAnchorPositionFor(valueShape: ValueShapeRectangle): StyleInfo {
        const style: StyleInfo = {
            left: (valueShape.origin.x + valueShape.width) + 'px',
            top: (valueShape.origin.y - 2) + 'px',
            transform: 'translate(-50%, -100%)',
        };

        if ((valueShape.value < 0 || Math.max(...this.values) === 0)) {
            style.left = valueShape.origin.x + 'px';
        }

        return style;
    }


    protected findValueShapeAtPosition(x: number, y: number): ValueShapeRectangle | null {
        return this.valueShapes.find((valueShape: ValueShapeRectangle): boolean => {
            const yMin = valueShape.origin.y - (this.shapeGap / 2);
            const yMax = valueShape.origin.y + valueShape.height + (this.shapeGap / 2);
            return y >= yMin && y <= yMax;
        }) ?? null;
    }
}
