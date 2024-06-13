import { css, html, svg, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { StyleInfo, styleMap } from 'lit/directives/style-map.js';
import { TcBase } from './tc-base.js';
import { ShapeLine, ShapeRectangle, ValueShapeRectangle } from './types.js';


@customElement('tc-stack')
export class TcStack extends TcBase<ValueShapeRectangle> {
    @property({type: Number})
    public gap = 2;
    @property({type: Number})
    public radius = 2;
    @property({type: Boolean, reflect: true})
    public horizontal = false;

    private otherShapes!: {
        gapLines: ShapeLine[],
        valuesRectangle: ShapeRectangle,
    };

    public static styles = [
        TcBase.styles,
        css`
            :host(:not([horizontal])) { width: 20px; }
            :host([horizontal]) { height: 20px; }
        `,
    ];


    protected computeChartShapes(): void {
        this.valueShapes = [];
        this.otherShapes = {
            gapLines: [],
            valuesRectangle: {} as ShapeRectangle,
        };

        const valueMax = Math.max(this.values.reduce((a, b) => a + b, 0), this.max);

        const crossStart = 0;
        let flowStart = this.horizontal ? 0 : this.height;

        this.values.forEach((value, index) => {
            const crossSize = this.horizontal ? this.height : this.width;
            const flowSize = (value / valueMax) * (this.horizontal ? this.width : this.height);

            this.valueShapes.push({
                index: index,
                value: value,
                label: this.labels[index],
                origin: {
                    x: this.horizontal ? flowStart : crossStart,
                    y: this.horizontal ? crossStart : (flowStart - flowSize),
                },
                width: this.horizontal ? flowSize : crossSize,
                height: this.horizontal ? crossSize : flowSize,
            });

            if (index > 0 && value !== 0) {
                this.otherShapes.gapLines.push({
                    start: {
                        x: this.horizontal ? flowStart : crossStart,
                        y: this.horizontal ? crossStart : flowStart,
                    },
                    end: {
                        x: this.horizontal ? flowStart : crossSize,
                        y: this.horizontal ? crossSize : flowStart,
                    },
                });
            }

            flowStart = this.horizontal ? (flowStart + flowSize) : (flowStart - flowSize);
        });

        this.otherShapes.valuesRectangle = {
            origin: { x: 0, y: 0 },
            width: this.width,
            height: this.height,
        };
        if (this.horizontal) {
            this.otherShapes.valuesRectangle.width = this.valueShapes.reduce((a, valueShape) => a + valueShape.width, 0);
        } else {
            this.otherShapes.valuesRectangle.height = this.valueShapes.reduce((a, valueShape) => a + valueShape.height, 0);
            this.otherShapes.valuesRectangle.origin.y = this.height - this.otherShapes.valuesRectangle.height;
        }
    }


    protected chartTemplate(): TemplateResult {
        const radius = Math.min(this.radius, (this.height / 2), (this.width / 2));

        return html`
            <svg class="chart" width="100%" height="100%">
                <defs>
                    <rect id="values-rectangle"
                        x="${this.otherShapes.valuesRectangle.origin.x}" y="${this.otherShapes.valuesRectangle.origin.y}"
                        width="${this.otherShapes.valuesRectangle.width}" height="${this.otherShapes.valuesRectangle.height}"
                        rx="${radius}" ry="${radius}"
                    />
                    <mask id="values-mask">
                        <use xlink:href="#values-rectangle" x="0" y="0" fill="white"/>
                        ${this.otherShapes.gapLines.map((gapLine) => svg`
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
        if (!this.valueShapeActive || !this.tooltipText) return html``;

        const style: StyleInfo = {
            left: (this.valueShapeActive.origin.x + (this.valueShapeActive.width / 2)) + 'px',
            top: (this.valueShapeActive.origin.y - 2) + 'px',
            transform: 'translate(-50%, -100%)',
        };

        return html`
            <div class="tooltip" style="${styleMap(style)}">${this.tooltipText}</div>
        `;
    }


    protected findValueShapeAtPosition(x: number, y: number): ValueShapeRectangle | undefined {
        if (!this.hasEnoughValueShapes()) return;

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


    protected hasEnoughValueShapes(): boolean {
        return (this.valueShapes.length >= 1);
    }
}
