import { TemplateResult, css, html, svg } from 'lit';
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
                --point-inner-color: var(--shape-color);
                --point-border-color: var(--shape-color);
                --point-opacity: 0;
                --point-opacity-active: 1;
                --area-color: var(--shape-color);
                --area-opacity: 0;
            }
            .chart .area {
                fill: var(--area-color);
                opacity: var(--area-opacity);
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
        const lineStyle = (): StyleInfo  => ({
            opacity: 'var(--shape-opacity)',
            fill: 'none',
            stroke: 'var(--shape-color)',
        });

        const pointStyle = (index?: number): StyleInfo  => ({
            opacity: `var(${(this.active === index) ? '--point-opacity-active' : '--point-opacity'})`,
            fill: 'var(--point-inner-color)',
            stroke: 'var(--point-border-color)',
            willChange: 'opacity',
        });

        const pointMaskStyle = (index?: number): StyleInfo  => ({
            opacity: `calc(100 * var(${(this.active === index) ? '--point-opacity-active' : '--point-opacity'}))`,
            willChange: 'opacity',
        });

        return html`
            <svg class="chart">
                <defs>
                    <mask id="residual-mask" maskUnits="userSpaceOnUse">
                        <rect x="0" y="0" width="100%" height="100%" fill="white"/>
                        <path d="${this.otherShapes.areaPath}" fill="black"/>
                        <path d="${this.otherShapes.linePath}" stroke-width="${this.weight}" stroke-linecap="round" stroke-linejoin="round" stroke="black" fill="none"/>
                        ${this.valueShapes.map((valueShape) => svg`
                            <circle cx="${valueShape.center.x}" cy="${valueShape.center.y}" r="${valueShape.radius}" fill="black" style="${styleMap(pointMaskStyle(valueShape.index))})"/>
                        `)}
                    </mask>
                    <mask id="area-mask" maskUnits="userSpaceOnUse">
                        <rect x="0" y="0" width="100%" height="100%" fill="white"/>
                        <path d="${this.otherShapes.linePath}" stroke-width="${this.weight}" stroke-linecap="round" stroke-linejoin="round" stroke="black" fill="none"/>
                        ${this.valueShapes.map((valueShape) => svg`
                            <circle cx="${valueShape.center.x}" cy="${valueShape.center.y}" r="${valueShape.radius}" fill="black" style="${styleMap(pointMaskStyle(valueShape.index))})"/>
                        `)}
                    </mask>
                    <mask id="line-mask" maskUnits="userSpaceOnUse">
                        <rect x="0" y="0" width="100%" height="100%" fill="white"/>
                        ${this.valueShapes.map((valueShape) => svg`
                            <circle cx="${valueShape.center.x}" cy="${valueShape.center.y}" r="${valueShape.radius}" fill="black" style="${styleMap(pointMaskStyle(valueShape.index))})"/>
                        `)}
                    </mask>
                </defs>
                <rect class="residual" x="0" y="0" width="100%" height="100%" mask="url(#residual-mask)"/>
                <path class="area" d="${this.otherShapes.areaPath}" mask="url(#area-mask)"/>
                <path class="line" d="${this.otherShapes.linePath}" stroke-width="${this.weight}" stroke-linecap="round" stroke-linejoin="round" mask="url(#line-mask)" style="${styleMap(lineStyle())}"/>
            </svg>
            <svg class="points">
                ${this.valueShapes.map((valueShape) => svg`
                    <circle class="point" cx="${valueShape.center.x}" cy="${valueShape.center.y}" r="${valueShape.radius - (this.weight * 0.4)}" stroke-width="${this.weight * 0.8}" style="${styleMap(pointStyle(valueShape.index))}"/>
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
