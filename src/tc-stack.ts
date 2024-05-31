import { css, html, svg, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { StyleInfo, styleMap } from 'lit/directives/style-map.js';
import { TcBase } from './tc-base.js';
import { ShapeLine, ShapeRectangle, ValueShapeRectangle } from './types.js';


@customElement('tc-stack')
export class TcStack extends TcBase {
    @property({type: Number})
    public gap = 1;
    @property({type: Number})
    public radius = 2;
    @property({type: Boolean, reflect: true})
    public horizontal = false;

    protected valueShapes!: ValueShapeRectangle[];
    protected valueShapeActive!: ValueShapeRectangle;
    private gapLines!: ShapeLine[];

    static styles = [
        TcBase.styles,
        css`
            :host(:not([horizontal])) { width: 20px; }
            :host([horizontal]) { height: 20px; }
        `,
    ];


    protected computeChartData(): void {
        this.valueShapes = [];
        this.gapLines = [];

        let valueMax = this.values.reduce((a, b) => a + b, 0);
        if (this.max !== null) {
            valueMax = Math.max(valueMax, this.max);
        }

        let inlineStart = this.horizontal ? 0 : this.height;
        const blockStart = 0;

        this.values.forEach((value, index) => {
            const inlineSize = (value / valueMax) * (this.horizontal ? this.width : this.height);
            const blockSize = this.horizontal ? this.height : this.width;

            this.valueShapes.push({
                index: index,
                value: value,
                label: this.labels[index] ?? null,
                origin: {
                    x: this.horizontal ? inlineStart : blockStart,
                    y: this.horizontal ? blockStart : (inlineStart - inlineSize),
                },
                width: this.horizontal ? inlineSize : blockSize,
                height: this.horizontal ? blockSize : inlineSize,
            });

            if (index > 0 && value !== 0) {
                this.gapLines.push({
                    start: {
                        x: this.horizontal ? inlineStart : blockStart,
                        y: this.horizontal ? blockStart : inlineStart,
                    },
                    end: {
                        x: this.horizontal ? inlineStart : blockSize,
                        y: this.horizontal ? blockSize : inlineStart,
                    },
                });
            }

            inlineStart = this.horizontal ? (inlineStart + inlineSize) : (inlineStart - inlineSize);
        });
    }


    protected chartTemplate(): TemplateResult {
        const radius = Math.min(this.radius, (this.horizontal ? this.width : this.height) / 2);
        const mask:ShapeRectangle = {
            origin: { x: 0, y: 0 },
            width: this.width,
            height: this.height,
        };

        if (this.horizontal) {
            mask.width = this.valueShapes.reduce((a, valueShape) => a + valueShape.width, 0);
        } else {
            mask.height = this.valueShapes.reduce((a, valueShape) => a + valueShape.height, 0);
            mask.origin.y = this.height - mask.height;
        }

        return html`
            <svg class="chart" width="100%" height="100%">
                <mask id="mask">
                    <rect
                        x="${mask.origin.x}" y="${mask.origin.y}"
                        width="${mask.width}" height="${mask.height}"
                        rx="${radius}" ry="${radius}"
                        fill="#FFFFFF" stroke="none"
                    />
                    ${this.gapLines.map((gapLine) => svg`
                        <line x1="${gapLine.start.x}" y1="${gapLine.start.y}"
                            x2="${gapLine.end.x}" y2="${gapLine.end.y}"
                            stroke-width="${this.gap}" stroke="#000000" stroke-linecap="round"
                        />
                    `)}
                </mask>
                <rect class="area"
                    x="0" y="0"
                    width="100%" height="100%"
                    rx="${radius}" ry="${radius}"
                />
                <g mask="url(#mask)">
                    ${this.valueShapes.map((valueShape, index) => svg`
                        <rect class="shape ${(this.valueShapeActive?.index === index) ? 'is-active' : ''}"
                            x="${valueShape.origin.x}"
                            y="${valueShape.origin.y}"
                            width="${valueShape.width}"
                            height="${valueShape.height}"
                            style="fill: var(--color-${index + 1}, var(--color))"
                        />
                    `)}
                </g>
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

        return html`
            <div class="tooltip" style="${styleMap(style)}">${this.tooltipText()}</div>
        `;
    }


    protected findValueShapeAtPosition(x: number, y: number): ValueShapeRectangle | null {
        if (!this.hasEnoughValues()) return null;

        if (this.valueShapes.length === 1) {
            return this.valueShapes[0];
        }

        const position = this.horizontal ? x : y;

        return this.valueShapes.find((valueShape: ValueShapeRectangle): boolean => {
            const shapeOrigin = this.horizontal ? valueShape.origin.x : valueShape.origin.y;
            const shapeSize = this.horizontal ? valueShape.width : valueShape.height;
            const positionMin = shapeOrigin - (this.gap / 2);
            const positionMax = shapeOrigin + shapeSize + (this.gap / 2);

            return position >= positionMin && position <= positionMax;
        }) ?? null;
    }
}
