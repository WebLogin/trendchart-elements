import { css, html, svg, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { StyleInfo, styleMap } from 'lit/directives/style-map.js';
import { TcBase } from './tc-base.js';
import { ShapeLine, ShapeRectangle, ValueShapeRectangle } from './types.js';


@customElement('tc-stack')
export class TcStack extends TcBase {
    @property({type: Number})
    public gap = 2;
    @property({type: Number})
    public radius = 2;
    @property({type: Boolean, reflect: true})
    public horizontal = false;

    protected valueShapes: ValueShapeRectangle[] = [];
    protected valueShapeActive?: ValueShapeRectangle;
    private gapLines!: ShapeLine[];
    private valuesRectangle!: ShapeRectangle;

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

        const valueMax = Number.isFinite(this.max)
            ? Math.max(this.values.reduce((a, b) => a + b, 0), this.max!)
            : this.values.reduce((a, b) => a + b, 0);

        let inlineStart = this.horizontal ? 0 : this.height;
        const blockStart = 0;

        this.values.forEach((value, index) => {
            const inlineSize = (value / valueMax) * (this.horizontal ? this.width : this.height);
            const blockSize = this.horizontal ? this.height : this.width;

            this.valueShapes.push({
                index: index,
                value: value,
                label: this.labels[index],
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

        this.valuesRectangle = {
            origin: { x: 0, y: 0 },
            width: this.width,
            height: this.height,
        };
        if (this.horizontal) {
            this.valuesRectangle.width = this.valueShapes.reduce((a, valueShape) => a + valueShape.width, 0);
        } else {
            this.valuesRectangle.height = this.valueShapes.reduce((a, valueShape) => a + valueShape.height, 0);
            this.valuesRectangle.origin.y = this.height - this.valuesRectangle.height;
        }
    }


    protected chartTemplate(): TemplateResult {
        const radius = Math.min(this.radius, (this.height / 2), (this.width / 2));

        return html`
            <svg class="chart" width="100%" height="100%">
                <defs>
                    <rect id="values-rectangle"
                        x="${this.valuesRectangle.origin.x}" y="${this.valuesRectangle.origin.y}"
                        width="${this.valuesRectangle.width}" height="${this.valuesRectangle.height}"
                        rx="${radius}" ry="${radius}"
                    />
                    <mask id="values-mask">
                        <use xlink:href="#values-rectangle" x="0" y="0" fill="white"/>
                        ${this.gapLines.map((gapLine) => svg`
                            <line x1="${gapLine.start.x}" y1="${gapLine.start.y}"
                                x2="${gapLine.end.x}" y2="${gapLine.end.y}"
                                stroke-width="${this.gap}" stroke="black" stroke-linecap="round"
                            />
                        `)}
                    </mask>
                    <mask id="area-mask">
                        <rect x="0" y="0"
                            width="100%" height="100%"
                            rx="${radius}" ry="${radius}"
                            fill="white"
                        />
                        <use xlink:href="#values-rectangle" x="0" y="0" fill="black"/>
                    </mask>
                </defs>
                <rect class="area"
                    x="0" y="0"
                    width="100%" height="100%"
                    mask="url(#area-mask)"
                />
                <g mask="url(#values-mask)">
                    ${this.valueShapes.map((valueShape, index) => svg`
                        <rect class="shape ${(this.valueShapeActive?.index === index) ? 'is-active' : ''}"
                            x="${valueShape.origin.x}" y="${valueShape.origin.y}"
                            width="${valueShape.width}" height="${valueShape.height}"
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


    protected findValueShapeAtPosition(x: number, y: number): ValueShapeRectangle | undefined {
        if (!this.hasEnoughValues()) return;

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
        });
    }
}
