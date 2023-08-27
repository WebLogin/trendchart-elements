import { css, html, PropertyValues, svg, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { StyleInfo } from 'lit/directives/style-map.js';
import { TcBase } from './tc-base.js';
import { ValueShapeRectangle } from './types.js';


@customElement('tc-column')
export class TcColumn extends TcBase {
    @property({type: Number, attribute: 'shape-gap'})
    public shapeGap = 1;
    @property({type: Number, attribute: 'shape-radius'})
    public shapeRadius = 1;

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


    protected chartTemplate(): TemplateResult | null {
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


    protected tooltipAnchorPositionFor(valueShape: ValueShapeRectangle): StyleInfo {
        const style: StyleInfo = {
            left: (valueShape.origin.x + (valueShape.width / 2)) + 'px',
            top: (valueShape.origin.y - 2) + 'px',
            transform: 'translate(-50%, -100%)',
        };

        if ((valueShape.value < 0 || Math.max(...this.values) === 0)) {
            style.top = (valueShape.origin.y + valueShape.height + 2) + 'px';
            style.transform = 'translate(-50%, 0%)';
        }

        return style;
    }


    protected findValueShapeAtPosition(x: number, y: number): ValueShapeRectangle | null {
        return this.valueShapes.find((valueShape: ValueShapeRectangle): boolean => {
            const xMin = valueShape.origin.x - (this.shapeGap / 2);
            const xMax = valueShape.origin.x + valueShape.width + (this.shapeGap / 2);
            return x >= xMin && x <= xMax;
        }) ?? null;
    }
}
