import { css, html, PropertyValues, svg, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { TcBase } from './tc-base.js';
import { ShapeCircle, ShapeLine, ShapePoint, ValueSlice } from './types.js';


@customElement('tc-pie')
export class TcPie extends TcBase {
    @property({type: Number, reflect: true, attribute: 'slice-size'})
    public sliceSize: number | null = null;
    @property({type: Number, reflect: true, attribute: 'slice-gap'})
    public sliceGap = 1;

    protected valueShapes!: ValueSlice[];
    protected valueShapeFocused!: ValueSlice;
    private cutoutCircle!: ShapeCircle;
    private gapLines!: ShapeLine[];
    private areaPath!: string;

    static styles = [
        TcBase.styles,
        css`
            :host {
                --slice-color: #597BFC;
                --slice-opacity: 1;
                --slice-focused-opacity: 0.5;
                --area-color: var(--slice-color);
                border-radius: 100%;
                width: 60px;
                height: 60px;
            }
            .chart .slice {
                fill: var(--slice-color);
                opacity: var(--slice-opacity);
                stroke: none;
            }
            .chart .slice.is-focused {
                opacity: var(--slice-focused-opacity);
            }
        `,
    ];


    protected computeChartProperties(): void {
        this.valueShapes = [];
        this.gapLines = [];
        this.areaPath = '';

        const center: ShapePoint = {
            x: this.width / 2,
            y: this.height / 2,
        }
        const radius = Math.min(center.x, center.y);
        const valueTotal = this.values.reduce((a, b) => a + b, 0);
        const valueMax = (this.max !== null) ? Math.max(valueTotal, this.max) : valueTotal;
        let valuesSum = 0;

        const slicePoint = (value: number, radius: number): ShapePoint => {
            const radians = (value / valueMax) * Math.PI * 2 - Math.PI / 2;
            return {
                x: radius * Math.cos(radians) + center.x,
                y: radius * Math.sin(radians) + center.y,
            };
        };

        const slicePath = (value: number): string => {
            const percentage = (value / valueMax) * 100;
            const pointStart = slicePoint(valuesSum, radius);
            const pointEnd = slicePoint(valuesSum + value, radius);

            let slice = '';
            slice += 'M' + pointStart.x + ',' + pointStart.y + ' ';
            if (percentage === 100) {
                slice += 'A' + [radius, radius, '0', '1', '1', (pointEnd.x - 0.001), pointEnd.y].join(',') + ' ';
            } else {
                slice += 'A' + [radius, radius, '0', (percentage > 50 ? '1' : '0'), '1', pointEnd.x, pointEnd.y].join(',') + ' ';
            }
            slice += 'L' + [center.x, center.y].join(',') + ' ';
            slice += 'Z';

            return slice;
        };

        this.cutoutCircle = {
            center: center,
            radius: radius - Math.min(this.sliceSize ?? Infinity, radius),
        };

        this.values.forEach((value, index) => {
            const slicePointCenter = slicePoint(valuesSum + (value / 2), radius - ((radius - this.cutoutCircle.radius) / 2));
            this.valueShapes.push({
                index: index,
                value: value,
                center: slicePointCenter,
                path: slicePath(value),
            });

            const slicePointStart = slicePoint(valuesSum, radius);
            this.gapLines.push({
                start: slicePointStart,
                end: center,
            });

            valuesSum += value;
        });

        const valueResidual = valueMax - valueTotal;
        if (valueResidual) {
            this.areaPath = slicePath(valueResidual);

            const slicePointStart = slicePoint(valuesSum, radius);
            this.gapLines.push({
                start: slicePointStart,
                end: center,
            });
        }

        // Reset gapLines if there is only one value and it's full
        if (this.values.length === 1 && !valueResidual) {
            this.gapLines = [];
        }
    }


    protected willUpdate(changedProperties: PropertyValues<this>) {
        if (changedProperties.has('sliceGap')) {
            this.validatePropertyAsPositiveNumber('sliceGap');
        }

        if (changedProperties.has('sliceSize') && this.sliceSize !== null) {
            this.validatePropertyAsPositiveNumber('sliceSize');
        }

        const propertiesUsedByChart = ['width', 'height', 'values', 'max', 'sliceGap', 'sliceSize'];
        if ([...changedProperties.keys()].some((property) => propertiesUsedByChart.includes(property as string))) {
            this.computeChartProperties();
        }
    }


    protected findValueShapeAtPosition(x: number, y: number): ValueSlice | null {
        const point = new DOMPoint(x, y);
        const valueShapeFocusedIndex = Array.from(this.renderRoot.querySelectorAll<SVGPathElement>('.chart .slice')).findIndex((path) => {
            return path.isPointInFill(point);
        });

        if (valueShapeFocusedIndex === -1) {
            return null;
        }

        return this.valueShapes[valueShapeFocusedIndex];
    }


    protected templateChart(): TemplateResult | null {
        if (this.valueShapes.length < 1) {
            return null;
        }

        return html`
            <svg class="chart" width="100%" height="100%">
                <mask id="mask">
                    <rect x="0" y="0" width="100%" height="100%" fill="#FFFFFF" stroke="none"/>
                    <circle cx="${this.cutoutCircle.center.x}" cy="${this.cutoutCircle.center.y}" r="${this.cutoutCircle.radius}" fill="#000000"/>
                    ${this.gapLines.map((gapLine) => svg`
                        <line x1="${gapLine.start.x}" y1="${gapLine.start.y}"
                            x2="${gapLine.end.x}" y2="${gapLine.end.y}"
                            stroke-width="${this.sliceGap}" stroke="#000000" stroke-linecap="round"
                        />
                    `)}
                </mask>
                <g mask="url(#mask)">
                    <path class="area" d="${this.areaPath}"/>
                    ${this.valueShapes.map((valueShape, index) => svg`
                        <path class="slice ${(this.valueShapeFocused?.index === index) ? 'is-focused' : ''}"
                            d="${valueShape.path}"
                            style="fill: var(--slice-color-${index + 1}, var(--slice-color))"
                        />
                    `)}
                </g>
            </svg>
        `;
    }


    protected templateTooltip(): TemplateResult | null {
        if (this.valueShapeFocused === null) {
            return null;
        }

        const style = {
            left: this.valueShapeFocused.center.x + 'px',
            top: this.valueShapeFocused.center.y + 'px',
            transform: 'translate(-50%, -50%)',
        };

        return html`
            <div class="tooltip" style="${styleMap(style)}">
                ${this.tooltipTextFormatted(this.valueShapeFocused.value.toLocaleString())}
            </div>
        `;
    }
}
