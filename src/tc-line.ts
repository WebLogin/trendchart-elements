import { TemplateResult, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { StyleInfo, styleMap } from 'lit/directives/style-map.js';
import { TcBase } from './tc-base.js';
import { ValueShapeCircle } from './types.js';


@customElement('tc-line')
export class TcLine extends TcBase {
    @property({type: Number})
    public min: number | null = null;
    @property({type: Number})
    public depth = 2;

    protected valuesMinCount = 2;
    protected valueShapes!: ValueShapeCircle[];
    protected valueShapeActive!: ValueShapeCircle;
    private linePath!: string;
    private areaPath!: string;

    static styles = [
        TcBase.styles,
        css`
            :host {
                --active-point-color: var(--color);
                --active-point-shadow: none;
            }
            .point {
                position: absolute;
                z-index: 2;
                pointer-events: none;
                border-radius: 100%;
                background-color: var(--active-point-color);
                box-shadow: var(--active-point-shadow);
                transform: translate(-50%, -50%);
            }
            .chart .shape {
                fill: none;
                stroke: var(--color);
            }
        `,
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

        const pointPositionX = (value: number): number => {
            const width = this.width - this.depth;
            let x = value * (width / (this.values.length - 1));

            return x + (this.depth / 2);
        };

        const pointPositionY = (value: number): number => {
            const height = this.height - this.depth;
            let y = height;
            if (valueScale) {
                y -= ((value - valueMin) / valueScale) * height;
            }

            return y + (this.depth / 2);
        };

        this.values.forEach((value, index) => {
            this.valueShapes.push({
                index: index,
                value: value,
                label: this.labels[index] ?? null,
                center: {
                    x: pointPositionX(index),
                    y: pointPositionY(value),
                },
                radius: Math.floor((this.depth + 6) / 2),
            });
        });

        this.linePath = this.valueShapes
            .map((valueShape, index) => ((index === 0) ? 'M' : 'L') + valueShape.center.x + ',' +  valueShape.center.y)
            .join(' ');

        this.areaPath = this.linePath
            .concat('L' + this.valueShapes[this.valueShapes.length - 1].center.x + ',' + pointPositionY(Math.max(valueMin, 0)) + ' ')
            .concat('L' + this.valueShapes[0].center.x + ',' + pointPositionY(Math.max(valueMin, 0)) + ' ')
            .concat('Z');
    }


    protected chartTemplate(): TemplateResult {
        const pointStyle: StyleInfo = { display: 'none' };
        if (this.valueShapeActive) {
            pointStyle.display = 'block';
            pointStyle.left = this.valueShapeActive.center.x + 'px';
            pointStyle.top = this.valueShapeActive.center.y + 'px';
            pointStyle.width = (this.valueShapeActive.radius * 2) + 'px';
            pointStyle.height = (this.valueShapeActive.radius * 2) + 'px';
        }

        return html`
            <svg class="chart">
                <mask id="mask">
                    <path d="${this.areaPath}" stroke-width="${this.depth}" stroke="#FFFFFF" fill="#FFFFFF" vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round"/>
                </mask>
                <rect class="area" x="0" y="0" width="100%" height="100%" mask="url(#mask)"/>
                <path class="shape" d="${this.linePath}" stroke-width="${this.depth}" vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <div class="point" style="${styleMap(pointStyle)}"></div>
        `;
    }


    protected tooltipAnchorPositionFor(valueShape: ValueShapeCircle): StyleInfo {
        const style: StyleInfo = {
            left: valueShape.center.x + 'px',
            top: (valueShape.center.y - valueShape.radius - 2) + 'px',
            transform: 'translate(-50%, -100%)',
        };

        if ((valueShape.value < 0 || Math.max(...this.values) === 0)) {
            style.top = (valueShape.center.y + valueShape.radius + 2) + 'px';
            style.transform = 'translate(-50%, 0%)';
        }

        return style;
    }


    protected findValueShapeAtPosition(x: number, y: number): ValueShapeCircle {
        return this.valueShapes.reduce((previous, current) => {
            return (Math.abs(current.center.x - x) < Math.abs(previous.center.x - x) ? current : previous);
        });
    }
}
