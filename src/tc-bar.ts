import { html, svg, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { StyleInfo } from 'lit/directives/style-map.js';
import { TcBase } from './tc-base.js';
import { ValueShapeRectangle } from './types.js';


@customElement('tc-bar')
export class TcBar extends TcBase {
    @property({type: Number, attribute: 'shape-gap'})
    public shapeGap = 1;
    @property({type: Number, attribute: 'shape-radius'})
    public shapeRadius = 2;
    @property({type: Boolean, reflect: true})
    public horizontal = false;

    protected valuesMinCount = 2;
    protected valueShapes!: ValueShapeRectangle[];
    protected valueShapeFocused!: ValueShapeRectangle;


    protected computeChartData(): void {
        this.valueShapes = [];

        const valueMin = (this.min === null) ? Math.min(...this.values) : Math.min(...this.values, this.min);
        const valueMax = (this.max === null) ? Math.max(...this.values) : Math.max(...this.values, this.max);
        const valueScale = valueMax - valueMin;

        const inlineSize = ((this.horizontal ? this.height : this.width) - (this.shapeGap * (this.values.length - 1))) / this.values.length;
        const blockPosition = (value: number): number => {
            const size = this.horizontal ? this.width : this.height;
            const position = valueScale ? ((value - valueMin) / valueScale) * size : 1;

            return this.horizontal ? position : (size - position);
        };

        this.values.forEach((value, index) => {
            let inlineStart = (inlineSize + this.shapeGap) * index;
            let blockStart = (value < 0) ? blockPosition(Math.min(valueMax, 0)) : blockPosition(value);
            let blockEnd = (value < 0) ? blockPosition(value) : blockPosition(Math.max(valueMin, 0));
            if (this.horizontal) {
                [blockStart, blockEnd] = [blockEnd, blockStart];
            }

            let blockSize = blockEnd - blockStart;
            if (blockSize == 0) {
                blockSize = 1;
                if (valueScale && (this.horizontal ? (valueMax < 0) : (valueMax > 0))) {
                    blockStart--;
                }
            }

            this.valueShapes.push({
                index: index,
                value: value,
                label: this.labels[index] ?? null,
                origin: {
                    x: this.horizontal ? blockStart : inlineStart,
                    y: this.horizontal ? inlineStart : blockStart,
                },
                width: this.horizontal ? blockSize : inlineSize,
                height: this.horizontal ? inlineSize : blockSize,
            });
        });
    }


    protected chartTemplate(): TemplateResult {
        const shapeRadius = Math.min(this.shapeRadius, (this.horizontal ? this.valueShapes[0].height : this.valueShapes[0].width) / 2);

        return html`
            <svg class="chart" width="100%" height="100%">
                ${this.valueShapes.map((valueShape, index) => svg`
                    <rect class="area"
                        x="${this.horizontal ? 0 : valueShape.origin.x}"
                        y="${this.horizontal ? valueShape.origin.y : 0}"
                        width="${this.horizontal ? this.width : valueShape.width}"
                        height="${this.horizontal ? valueShape.height : this.height}"
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

        if (!this.horizontal && (valueShape.value < 0 || Math.max(...this.values) === 0)) {
            style.top = (valueShape.origin.y + valueShape.height + 2) + 'px';
            style.transform = 'translate(-50%, 0%)';
        }

        return style;
    }


    protected findValueShapeAtPosition(x: number, y: number): ValueShapeRectangle | null {
        const position = this.horizontal ? y : x;

        return this.valueShapes.find((valueShape: ValueShapeRectangle): boolean => {
            const shapeOrigin = this.horizontal ? valueShape.origin.y : valueShape.origin.x;
            const shapeSize = this.horizontal ? valueShape.height : valueShape.width;
            const positionMin = shapeOrigin - (this.shapeGap / 2);
            const positionMax = shapeOrigin + shapeSize + (this.shapeGap / 2);

            return position >= positionMin && position <= positionMax;
        }) ?? null;
    }
}
