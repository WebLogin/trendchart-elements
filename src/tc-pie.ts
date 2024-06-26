import { css, html, svg, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { StyleInfo, styleMap } from 'lit/directives/style-map.js';
import { TcBase } from './tc-base.js';
import { ShapeCircle, ShapeLine, ShapePoint, ValueShapeSlice } from './types.js';


@customElement('tc-pie')
export class TcPie extends TcBase<ValueShapeSlice> {
    @property({type: Number})
    public gap = 2;
    @property({type: Number})
    public rotate = 0;
    @property({type: Number})
    public donut?: number;

    private otherShapes!: {
        gapLines: ShapeLine[],
        residualPath: string,
        cutoutCircle: ShapeCircle,
    };

    public static styles = [
        TcBase.styles,
        css`
            :host {
                width: 60px;
                border-radius: 100%;
            }
        `,
    ];


    protected computeChartShapes(): void {
        this.valueShapes = [];
        this.otherShapes = {
            gapLines: [],
            residualPath: '',
            cutoutCircle: {} as ShapeCircle,
        };

        const valueTotal = this.values.reduce((a, b) => a + b, 0);
        const valueMax = Math.max(valueTotal, this.max);
        let valuesSum = 0;

        const pieCenter: ShapePoint = {
            x: this.width / 2,
            y: this.height / 2,
        }
        const pieRadius = Math.min(pieCenter.x, pieCenter.y);

        this.otherShapes.cutoutCircle = {
            center: pieCenter,
            radius: pieRadius - Math.min(this.donut ?? Infinity, pieRadius),
        };

        const slicePoint = (value: number, radius: number): ShapePoint => {
            const radians = (value / valueMax * Math.PI * 2) - (Math.PI / 2) + (this.rotate * Math.PI * 2 / 360);
            return {
                x: radius * Math.cos(radians) + pieCenter.x,
                y: radius * Math.sin(radians) + pieCenter.y,
            };
        };

        const slicePath = (value: number): string => {
            const percentage = (value / valueMax) * 100;
            const pointStart = slicePoint(valuesSum, pieRadius);
            const pointEnd = slicePoint((valuesSum + value) * (percentage === 100 ? 0.99999 : 1), pieRadius);

            let slice = '';
            slice += 'M' + pointStart.x + ',' + pointStart.y + ' ';
            slice += 'A' + [pieRadius, pieRadius, '0', (percentage > 50 ? '1' : '0'), '1', pointEnd.x, pointEnd.y].join(',') + ' ';
            slice += 'L' + [pieCenter.x, pieCenter.y].join(',') + ' ';
            slice += 'Z';

            return slice;
        };

        this.values.forEach((value, index) => {
            const slicePointCenter = slicePoint(valuesSum + (value / 2), pieRadius - ((pieRadius - this.otherShapes.cutoutCircle.radius) / 2));
            this.valueShapes.push({
                index: index,
                value: value,
                label: this.labels[index],
                center: slicePointCenter,
                path: slicePath(value),
            });

            valuesSum += value;

            this.otherShapes.gapLines.push({
                start: slicePoint(valuesSum, pieRadius),
                end: pieCenter,
            });
        });

        const valueResidual = valueMax - valueTotal;

        if (valueResidual) {
            this.otherShapes.residualPath = slicePath(valueResidual);
        }

        if (valueResidual || this.values.length === 1) {
            this.otherShapes.gapLines.pop();
        }
    }


    protected chartTemplate(): TemplateResult {
        return html`
            <svg class="chart">
                <defs>
                    <mask id="mask" maskUnits="userSpaceOnUse">
                        <rect x="0" y="0" width="100%" height="100%" fill="white"/>
                        <circle cx="${this.otherShapes.cutoutCircle.center.x}" cy="${this.otherShapes.cutoutCircle.center.y}" r="${this.otherShapes.cutoutCircle.radius}" fill="black"/>
                        ${this.otherShapes.gapLines.map((gapLine) => svg`
                            <line x1="${gapLine.start.x}" y1="${gapLine.start.y}" x2="${gapLine.end.x}" y2="${gapLine.end.y}" stroke-width="${this.gap}" stroke="black" stroke-linecap="round"/>
                        `)}
                    </mask>
                </defs>
                <g mask="url(#mask)">
                    <path class="residual" d="${this.otherShapes.residualPath}"/>
                    ${this.valueShapes.map((valueShape) => svg`
                        <path class="shape ${(this.active === valueShape.index) ? 'is-active' : ''}" d="${valueShape.path}" style="fill: var(--color-${valueShape.index + 1}, var(--color))"/>
                    `)}
                </g>
            </svg>
        `;
    }


    protected tooltipTemplate(): TemplateResult {
        if (!this.valueShapeActive || !this.tooltipText) return html``;

        const style: StyleInfo = {
            left: this.valueShapeActive.center.x + 'px',
            top: this.valueShapeActive.center.y + 'px',
            transform: 'translate(-50%, -50%)',
        };

        return html`
            <div class="tooltip" style="${styleMap(style)}">${this.tooltipText}</div>
        `;
    }


    protected findValueShapeAtPosition(x: number, y: number): ValueShapeSlice | undefined {
        if (!this.hasEnoughValueShapes()) return;

        if (this.valueShapes.length === 1) {
            return this.valueShapes[0];
        }

        const chart = this.renderRoot.querySelector('.chart') as SVGSVGElement;
        const point = chart.createSVGPoint();
        point.x = x;
        point.y = y;

        const valueShapeActiveIndex = Array.from(chart.querySelectorAll<SVGPathElement>('.shape')).findIndex((path) => {
            return path.isPointInFill(point);
        });

        if (valueShapeActiveIndex < 0) return;

        return this.valueShapes[valueShapeActiveIndex];
    }


    protected hasEnoughValueShapes(): boolean {
        return (this.valueShapes.length >= 1);
    }
}
