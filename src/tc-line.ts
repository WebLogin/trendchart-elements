import { TemplateResult, css, html, nothing, svg } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { StyleInfo, styleMap } from 'lit/directives/style-map.js';
import { TcBase } from './tc-base.js';
import { ValueShapeCircle } from './types.js';


@customElement('tc-line')
export class TcLine extends TcBase<ValueShapeCircle> {
    @property({type: Number})
    public min = 0;
    @property({type: Number})
    public weight = 2;
    @property({type: Boolean, reflect: true})
    public inside = false;
    @property({type: Number})
    public point?: number;

    private otherShapes!: {
        linePath: string,
        areaPath: string,
    }

    public static styles = [
        TcBase.styles,
        css`
            :host {
                --point-inner-color: var(--color);
                --point-border-color: var(--color);
                --point-opacity: 0;
                --point-opacity-active: 1;
            }
            .chart .shape {
                fill: none;
                stroke: var(--color);
            }
            .points {
                position: absolute;
                z-index: 2;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                overflow: visible;
                transform: translateZ(0);
            }
            .points .point {
                fill: var(--point-inner-color);
                stroke: var(--point-border-color);
                opacity: var(--point-opacity);
                will-change: opacity;
            }
            .points .point.is-active {
                opacity: var(--point-opacity-active);
            }
        `,
    ];


    protected computeChartShapes(): void {
        this.valueShapes = [];
        this.otherShapes = {
            linePath: '',
            areaPath: '',
        };

        const valueMin = Math.min(...this.values, this.min);
        const valueMax = Math.max(...this.values, this.max);
        const valueScale = valueMax - valueMin;

        const pointRadius = this.point ? (this.point / 2) : (this.weight + 6) / 2;
        const pointOffset = this.inside ? pointRadius : (this.weight / 2);

        const pointPositionX = (value: number): number => {
            const width = this.width - (pointOffset * 2);
            let x = value * (width / (this.values.length - 1));

            return x + pointOffset;
        };

        const pointPositionY = (value: number): number => {
            const height = this.height - (pointOffset * 2);
            let y = height;
            if (valueScale) {
                y -= ((value - valueMin) / valueScale) * height;
            }

            return y + pointOffset;
        };

        this.valueShapes = this.values.map((value, index) => ({
            index: index,
            value: value,
            label: this.labels[index],
            center: {
                x: pointPositionX(index),
                y: pointPositionY(value),
            },
            radius: pointRadius,
        }));

        this.otherShapes.linePath = this.valueShapes
            .map((valueShape, index) => ((index === 0) ? 'M' : 'L') + valueShape.center.x + ',' +  valueShape.center.y)
            .join(' ');

        this.otherShapes.areaPath = this.otherShapes.linePath
            .concat('L' + (this.valueShapes[this.valueShapes.length - 1].center.x + pointOffset) + ',' + this.valueShapes[this.valueShapes.length - 1].center.y + ' ')
            .concat('L' + (this.valueShapes[this.valueShapes.length - 1].center.x + pointOffset) + ',' + (pointPositionY(Math.max(valueMin, 0)) + (this.onlyNegativeValues() ? -pointOffset : pointOffset)) + ' ')
            .concat('L' + (this.valueShapes[0].center.x - pointOffset) + ',' + (pointPositionY(Math.max(valueMin, 0)) + (this.onlyNegativeValues() ? -pointOffset : pointOffset)) + ' ')
            .concat('L' + (this.valueShapes[0].center.x - pointOffset) + ',' + this.valueShapes[0].center.y + ' ')
            .concat('Z');
    }


    protected chartTemplate(): TemplateResult {
        return html`
            <svg class="chart">
                <defs>
                    <g id="values-points">
                        ${this.valueShapes.map((valueShape) => svg`
                            <circle
                                cx="${valueShape.center.x}" cy="${valueShape.center.y}" r="${valueShape.radius}"
                                style="opacity: calc(100 * var(${(this.active === valueShape.index) ? '--point-opacity-active' : '--point-opacity'}))"
                            />
                        `)}
                    </g>
                    <mask id="area-mask" maskUnits="userSpaceOnUse">
                        <rect x="0" y="0" width="100%" height="100%" fill="white"/>
                        <path d="${this.otherShapes.linePath}" stroke-width="${this.weight}" stroke-linecap="round" stroke-linejoin="round" stroke="black" fill="none"/>
                        <use xlink:href="#values-points" x="0" y="0" fill="black" stroke="none"/>
                    </mask>
                    <mask id="line-mask" maskUnits="userSpaceOnUse">
                        <rect x="0" y="0" width="100%" height="100%" fill="white"/>
                        <use xlink:href="#values-points" x="0" y="0" fill="black" stroke="none"/>
                    </mask>
                </defs>
                <path class="area" d="${this.otherShapes.areaPath}" mask="url(#area-mask)"/>
                <path class="shape" d="${this.otherShapes.linePath}" stroke-width="${this.weight}" stroke-linecap="round" stroke-linejoin="round" mask="url(#line-mask)"/>
            </svg>
            <svg class="points">
                ${this.valueShapes.map((valueShape) => svg`
                    <circle
                        class="point ${(this.active === valueShape.index) ? 'is-active' : ''}"
                        cx="${valueShape.center.x}" cy="${valueShape.center.y}"
                        r="${valueShape.radius - (this.weight * 0.4)}" stroke-width="${this.weight * 0.8}"
                    />
                `)}
            </svg>
        `;
    }


    protected tooltipTemplate(): TemplateResult {
        if (!this.valueShapeActive || !this.tooltipText) return html``;

        const style: StyleInfo = {
            left: this.valueShapeActive.center.x + 'px',
            top: (this.valueShapeActive.center.y - this.valueShapeActive.radius - 2) + 'px',
            transform: 'translate(-50%, -100%)',
        };

        if ((this.valueShapeActive.value < 0 || this.onlyNegativeValues())) {
            style.top = (this.valueShapeActive.center.y + this.valueShapeActive.radius + 2) + 'px';
            style.transform = 'translate(-50%, 0%)';
        }

        return html`
            <div class="tooltip" style="${styleMap(style)}">${this.tooltipText}</div>
        `;
    }


    protected findValueShapeAtPosition(x: number, y: number): ValueShapeCircle | undefined {
        if (!this.hasEnoughValueShapes()) return;

        return this.valueShapes.reduce((previous, current) => {
            return (Math.abs(current.center.x - x) < Math.abs(previous.center.x - x) ? current : previous);
        });
    }


    protected hasEnoughValueShapes(): boolean {
        return (this.valueShapes.length >= 2);
    }
}
