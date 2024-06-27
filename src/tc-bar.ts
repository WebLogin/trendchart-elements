import { TemplateResult, html, svg } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { StyleInfo, styleMap } from 'lit/directives/style-map.js';
import { TcBase } from './tc-base.js';
import { ValueShapeRectangle } from './types.js';


@customElement('tc-bar')
export class TcBar extends TcBase<ValueShapeRectangle> {
    @property({type: Number})
    public min = 0;
    @property({type: Number})
    public gap = 2;
    @property({type: Number})
    public radius = 2;
    @property({type: Boolean, reflect: true})
    public horizontal = false;


    protected computeChartShapes(): void {
        this.valueShapes = [];

        const valueMin = Math.min(...this.values, this.min);
        const valueMax = Math.max(...this.values, this.max);
        const valueScale = valueMax - valueMin;

        const crossSize = ((this.horizontal ? this.height : this.width) - (this.gap * (this.values.length - 1))) / this.values.length;
        const flowPosition = (value: number): number => {
            const size = this.horizontal ? this.width : this.height;
            const position = valueScale ? ((value - valueMin) / valueScale) * size : 1;

            return this.horizontal ? position : (size - position);
        };

        this.values.forEach((value, index) => {
            let crossStart = (crossSize + this.gap) * index;
            let flowStart = (value < 0) ? flowPosition(Math.min(valueMax, 0)) : flowPosition(value);
            let flowEnd = (value < 0) ? flowPosition(value) : flowPosition(Math.max(valueMin, 0));
            if (this.horizontal) {
                [flowStart, flowEnd] = [flowEnd, flowStart];
            }

            let flowSize = flowEnd - flowStart;
            if (flowSize == 0) {
                flowSize = 1;
                if (valueScale && (this.horizontal ? (valueMax < 0) : (valueMax > 0))) {
                    flowStart--;
                }
            }

            this.valueShapes.push({
                index: index,
                value: value,
                label: this.labels[index],
                origin: {
                    x: this.horizontal ? flowStart : crossStart,
                    y: this.horizontal ? crossStart : flowStart,
                },
                width: this.horizontal ? flowSize : crossSize,
                height: this.horizontal ? crossSize : flowSize,
            });
        });
    }


    protected chartTemplate(): TemplateResult {
        const radius = Math.min(this.radius, (this.horizontal ? this.valueShapes[0].height : this.valueShapes[0].width) / 2);

        const barStyle = (index?: number): StyleInfo  => ({
            opacity: `var(${(this.active === index) ? '--opacity-active': '--opacity'})`,
            fill: `var(--color-${(index ?? 0) + 1}, var(--color))`,
            willChange: 'opacity',
        });

        return html`
            <svg class="chart">
                <defs>
                    <mask id="residual-mask" maskUnits="userSpaceOnUse">
                        ${this.valueShapes.map((valueShape) => svg`
                            <rect x="${this.horizontal ? 0 : valueShape.origin.x}" y="${this.horizontal ? valueShape.origin.y : 0}" width="${this.horizontal ? this.width : valueShape.width}" height="${this.horizontal ? valueShape.height : this.height}" rx="${radius}" ry="${radius}" fill="white"/>
                            <rect x="${valueShape.origin.x}" y="${valueShape.origin.y}" width="${valueShape.width}" height="${valueShape.height}" rx="${radius}" ry="${radius}" fill="black"/>
                        `)}
                    </mask>
                </defs>
                <rect class="residual" x="0" y="0" width="100%" height="100%" mask="url(#residual-mask)"/>
                ${this.valueShapes.map((valueShape) => svg`
                    <rect class="bar" x="${valueShape.origin.x}" y="${valueShape.origin.y}" width="${valueShape.width}" height="${valueShape.height}" rx="${radius}" ry="${radius}" style="${styleMap(barStyle(valueShape.index))}"/>
                `)}
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

        if (!this.horizontal && (this.valueShapeActive.value < 0 || this.onlyNegativeValues())) {
            style.top = (this.valueShapeActive.origin.y + this.valueShapeActive.height + 2) + 'px';
            style.transform = 'translate(-50%, 0%)';
        }

        return html`
            <div class="tooltip" style="${styleMap(style)}">${this.tooltipText}</div>
        `;
    }


    protected findValueShapeAtPosition(x: number, y: number): ValueShapeRectangle | undefined {
        if (!this.hasEnoughValueShapes()) return;

        const position = this.horizontal ? y : x;

        return this.valueShapes.find((valueShape: ValueShapeRectangle): boolean => {
            const shapeOrigin = this.horizontal ? valueShape.origin.y : valueShape.origin.x;
            const shapeSize = this.horizontal ? valueShape.height : valueShape.width;
            const positionMin = shapeOrigin - (this.gap / 2);
            const positionMax = shapeOrigin + shapeSize + (this.gap / 2);

            return position >= positionMin && position <= positionMax;
        });
    }


    protected hasEnoughValueShapes(): boolean {
        return (this.valueShapes.length >= 2);
    }
}
