import { TemplateResult, html, svg } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { StyleInfo, styleMap } from 'lit/directives/style-map.js';
import { TcBase } from './tc-base.js';
import { ValueShapeRectangle } from './types.js';


@customElement('tc-bar')
export class TcBar extends TcBase {
    @property({type: Number})
    public min?: number;
    @property({type: Number})
    public gap = 2;
    @property({type: Number})
    public radius = 2;
    @property({type: Boolean, reflect: true})
    public horizontal = false;

    protected valuesMinCount = 2;
    protected valueShapes: ValueShapeRectangle[] = [];
    protected valueShapeActive?: ValueShapeRectangle;


    protected computeChartData(): void {
        this.valueShapes = [];

        const valueMin = (this.min === undefined) ? Math.min(...this.values) : Math.min(...this.values, this.min);
        const valueMax = (this.max === undefined) ? Math.max(...this.values) : Math.max(...this.values, this.max);
        const valueScale = valueMax - valueMin;

        const inlineSize = ((this.horizontal ? this.height : this.width) - (this.gap * (this.values.length - 1))) / this.values.length;
        const blockPosition = (value: number): number => {
            const size = this.horizontal ? this.width : this.height;
            const position = valueScale ? ((value - valueMin) / valueScale) * size : 1;

            return this.horizontal ? position : (size - position);
        };

        this.values.forEach((value, index) => {
            let inlineStart = (inlineSize + this.gap) * index;
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
                label: this.labels[index],
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
        const radius = Math.min(this.radius, (this.horizontal ? this.valueShapes[0].height : this.valueShapes[0].width) / 2);

        return html`
            <svg class="chart" width="100%" height="100%">
                ${this.valueShapes.map((valueShape, index) => svg`
                    <rect class="area"
                        x="${this.horizontal ? 0 : valueShape.origin.x}"
                        y="${this.horizontal ? valueShape.origin.y : 0}"
                        width="${this.horizontal ? this.width : valueShape.width}"
                        height="${this.horizontal ? valueShape.height : this.height}"
                        rx="${radius}" ry="${radius}"
                    />
                    <rect class="shape ${(this.valueShapeActive?.index === index) ? 'is-active' : ''}"
                        x="${valueShape.origin.x}"
                        y="${valueShape.origin.y}"
                        width="${valueShape.width}"
                        height="${valueShape.height}"
                        rx="${radius}" ry="${radius}"
                    />
                `)}
            </svg>
        `;
    }


    protected tooltipTemplate(): TemplateResult {
        if (!this.valueShapeActive || !this.tooltipText()) return html``;

        const style: StyleInfo = {
            left: (this.valueShapeActive.origin.x + (this.valueShapeActive.width / 2)) + 'px',
            top: (this.valueShapeActive.origin.y - 2) + 'px',
            transform: 'translate(-50%, -100%)',
        };

        if (!this.horizontal && (this.valueShapeActive.value < 0 || Math.max(...this.values) === 0)) {
            style.top = (this.valueShapeActive.origin.y + this.valueShapeActive.height + 2) + 'px';
            style.transform = 'translate(-50%, 0%)';
        }

        return html`
            <div class="tooltip" style="${styleMap(style)}">${this.tooltipText()}</div>
        `;
    }


    protected findValueShapeAtPosition(x: number, y: number): ValueShapeRectangle | undefined {
        if (!this.hasEnoughValues()) return;

        const position = this.horizontal ? y : x;

        return this.valueShapes.find((valueShape: ValueShapeRectangle): boolean => {
            const shapeOrigin = this.horizontal ? valueShape.origin.y : valueShape.origin.x;
            const shapeSize = this.horizontal ? valueShape.height : valueShape.width;
            const positionMin = shapeOrigin - (this.gap / 2);
            const positionMax = shapeOrigin + shapeSize + (this.gap / 2);

            return position >= positionMin && position <= positionMax;
        });
    }
}
