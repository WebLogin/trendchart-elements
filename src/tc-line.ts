import { css, html, PropertyValues, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { TcBase } from './tc-base.js';
import { ValueCircle } from './types.js';


@customElement('tc-line')
export class TcLine extends TcBase {
    @property({type: Number, attribute: 'line-size', reflect: true})
    public lineSize = 2;

    protected valueShapes!: ValueCircle[];
    protected valueShapeFocused!: ValueCircle;
    private linePath!: string;
    private areaPath!: string;

    static styles = [
        TcBase.styles,
        css`
            :host {
                --line-color: #597BFC;
                --line-opacity: 1;
                --area-color: var(--line-color);
                --point-color: var(--line-color);
                --point-opacity: 1;
                --point-shadow: none;
                width: 120px;
                height: 40px;
            }
            .point {
                position: absolute;
                z-index: 2;
                pointer-events: none;
                border-radius: 100%;
                background-color: var(--point-color);
                opacity: var(--point-opacity);
                box-shadow: var(--point-shadow);
                transform: translate(-50%, -50%);
            }
            .chart > .line {
                fill: none;
                stroke: var(--line-color);
                opacity: var(--line-opacity);
            }
        `,
    ];


    protected computeChartProperties(): void {
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
            const width = this.width - this.lineSize;
            let x = value * (width / (this.values.length - 1));

            return x + (this.lineSize / 2);
        };

        const pointPositionY = (value: number): number => {
            const height = this.height - this.lineSize;
            let y = height;
            if (valueScale) {
                y -= ((value - valueMin) / valueScale) * height;
            }

            return y + (this.lineSize / 2);
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
                radius: Math.floor((this.lineSize + 6) / 2),
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


    protected willUpdate(changedProperties: PropertyValues<this>) {
        if (changedProperties.has('lineSize')) {
            this.validatePropertyAsPositiveNumber('lineSize');
        }

        const propertiesUsedByChart = ['width', 'height', 'values', 'labels', 'min', 'max', 'lineSize'];
        if ([...changedProperties.keys()].some((property) => propertiesUsedByChart.includes(property as string))) {
            this.computeChartProperties();
        }
    }


    protected findValueShapeAtPosition(x: number, y: number): ValueCircle {
        return this.valueShapes.reduce((previous, current) => {
            return (Math.abs(current.center.x - x) < Math.abs(previous.center.x - x) ? current : previous);
        });
    }


    protected templateChart(): TemplateResult | null {
        if (this.valueShapes.length < 2) {
            return null;
        }

        return html`
            <svg class="chart" width="100%" height="100%">
                <mask id="mask">
                    <path d="${this.areaPath}" stroke-width="${this.lineSize}" stroke="#FFFFFF" fill="#FFFFFF" vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round"/>
                </mask>
                <rect class="area" x="0" y="0" width="100%" height="100%" mask="url(#mask)"/>
                <path class="line" d="${this.linePath}" stroke-width="${this.lineSize}" vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;
    }


    protected templateTooltip(): TemplateResult | null {
        if (this.valueShapeFocused === null) {
            return null;
        }

        const pointStyle = {
            left: this.valueShapeFocused.center.x + 'px',
            top: this.valueShapeFocused.center.y + 'px',
            width: (this.valueShapeFocused.radius * 2) + 'px',
            height: (this.valueShapeFocused.radius * 2) + 'px',
        };

        let tooltipStyle = {
            left: this.valueShapeFocused.center.x + 'px',
            top: (this.valueShapeFocused.center.y - this.valueShapeFocused.radius - 2) + 'px',
            transform: 'translate(-50%, -100%)',
        };
        if (this.valueShapeFocused.value < 0 || this.onlyNegativeValues()) {
            tooltipStyle.top = (this.valueShapeFocused.center.y + this.valueShapeFocused.radius + 2) + 'px';
            tooltipStyle.transform = 'translate(-50%, 0%)';
        }

        return html`
            <div class="point" style="${styleMap(pointStyle)}"></div>
            <div class="tooltip" style="${styleMap(tooltipStyle)}">
                ${this.tooltipTextFormatted(this.valueShapeFocused)}
            </div>
        `;
    }
}
