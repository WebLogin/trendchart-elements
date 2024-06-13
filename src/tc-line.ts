import { TemplateResult, css, html } from 'lit';
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

    private otherShapes!: {
        linePath: string,
        areaPath: string,
    }

    public static styles = [
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


    protected computeChartShapes(): void {
        this.valueShapes = [];
        this.otherShapes = {
            linePath: '',
            areaPath: '',
        };

        const valueMin = Math.min(...this.values, this.min);
        const valueMax = Math.max(...this.values, this.max);
        const valueScale = valueMax - valueMin;

        const pointPositionX = (value: number): number => {
            const width = this.width - this.weight;
            let x = value * (width / (this.values.length - 1));

            return x + (this.weight / 2);
        };

        const pointPositionY = (value: number): number => {
            const height = this.height - this.weight;
            let y = height;
            if (valueScale) {
                y -= ((value - valueMin) / valueScale) * height;
            }

            return y + (this.weight / 2);
        };

        this.valueShapes = this.values.map((value, index) => ({
            index: index,
            value: value,
            label: this.labels[index],
            center: {
                x: pointPositionX(index),
                y: pointPositionY(value),
            },
            radius: Math.floor((this.weight + 6) / 2),
        }));

        this.otherShapes.linePath = this.valueShapes
            .map((valueShape, index) => ((index === 0) ? 'M' : 'L') + valueShape.center.x + ',' +  valueShape.center.y)
            .join(' ');

        this.otherShapes.areaPath = this.otherShapes.linePath
            .concat('L' + this.valueShapes[this.valueShapes.length - 1].center.x + ',' + pointPositionY(Math.max(valueMin, 0)) + ' ')
            .concat('L' + this.valueShapes[0].center.x + ',' + pointPositionY(Math.max(valueMin, 0)) + ' ')
            .concat('Z');
    }


    protected chartTemplate(): TemplateResult {
        const pointStyle: StyleInfo = {
            display: this.valueShapeActive ? 'block' : 'none',
            left: (this.valueShapeActive ? this.valueShapeActive.center.x : 0) + 'px',
            top: (this.valueShapeActive ? this.valueShapeActive.center.y : 0) + 'px',
            width: (this.valueShapeActive ? (this.valueShapeActive.radius * 2) : 0) + 'px',
            height: (this.valueShapeActive ? (this.valueShapeActive.radius * 2) : 0) + 'px',
        };

        return html`
            <svg class="chart">
                <defs>
                    <path id="line-path" d="${this.otherShapes.linePath}" stroke-width="${this.weight}" stroke-linecap="round" stroke-linejoin="round"/>
                    <mask id="area-mask">
                        <path d="${this.otherShapes.areaPath}" stroke-width="${this.weight}" stroke="white" fill="white" stroke-linecap="round" stroke-linejoin="round"/>
                        <use xlink:href="#line-path" stroke="black" fill="none"/>
                    </mask>
                </defs>
                <rect class="area" x="0" y="0" width="100%" height="100%" mask="url(#area-mask)"/>
                <use class="shape" xlink:href="#line-path" stroke="black" fill="none"/>
            </svg>
            <div class="point" style="${styleMap(pointStyle)}"></div>
        `;
    }


    protected tooltipTemplate(): TemplateResult {
        if (!this.valueShapeActive || !this.tooltipText) return html``;

        const style: StyleInfo = {
            left: this.valueShapeActive.center.x + 'px',
            top: (this.valueShapeActive.center.y - this.valueShapeActive.radius - 2) + 'px',
            transform: 'translate(-50%, -100%)',
        };

        if ((this.valueShapeActive.value < 0 || Math.max(...this.values) === 0)) {
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
