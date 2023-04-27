import { __decorate } from "tslib";
import { css, html, svg } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { TcBase } from './tc-base.js';
let TcBar = class TcBar extends TcBase {
    constructor() {
        super(...arguments);
        this.barGap = 1;
        this.barRadius = 1;
    }
    computeChartProperties() {
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
        const barHeight = (this.height - (this.barGap * (this.values.length - 1))) / this.values.length;
        const barPositionX = (value) => {
            return valueScale ? ((value - valueMin) / valueScale) * this.width : 1;
        };
        this.values.forEach((value, index) => {
            let yTop = (barHeight + this.barGap) * index;
            let xLeft = (value < 0) ? barPositionX(value) : barPositionX(Math.max(valueMin, 0));
            let xRight = (value < 0) ? barPositionX(Math.min(valueMax, 0)) : barPositionX(value);
            let width = xRight - xLeft;
            if (width == 0) {
                width = 1;
                if (valueMax < 0 && valueScale) {
                    xLeft--;
                }
            }
            this.valueShapes.push({
                index: index,
                value: value,
                origin: {
                    x: xLeft,
                    y: yTop,
                },
                width: width,
                height: barHeight,
            });
        });
    }
    willUpdate(changedProperties) {
        if (changedProperties.has('barGap')) {
            this.validatePropertyAsPositiveNumber('barGap');
        }
        if (changedProperties.has('barRadius')) {
            this.validatePropertyAsPositiveNumber('barRadius');
        }
        const propertiesUsedByChart = ['width', 'height', 'values', 'min', 'max', 'barGap', 'barRadius'];
        if ([...changedProperties.keys()].some((property) => propertiesUsedByChart.includes(property))) {
            this.computeChartProperties();
        }
    }
    findValueShapeAtPosition(x, y) {
        var _a;
        return (_a = this.valueShapes.find((valueShape) => {
            const yMin = valueShape.origin.y - (this.barGap / 2);
            const yMax = valueShape.origin.y + valueShape.height + (this.barGap / 2);
            return y >= yMin && y <= yMax;
        })) !== null && _a !== void 0 ? _a : null;
    }
    templateChart() {
        if (this.valueShapes.length < 1) {
            return null;
        }
        const barRadius = Math.min(this.barRadius, (this.valueShapes[0].height / 2));
        return html `
            <svg class="chart" width="100%" height="100%">
                ${this.valueShapes.map((valueShape, index) => {
            var _a;
            return svg `
                    <rect class="area"
                        x="0"
                        y="${valueShape.origin.y}"
                        width="100%"
                        height="${valueShape.height}"
                        rx="${barRadius}" ry="${barRadius}"
                    />
                    <rect class="bar ${(((_a = this.valueShapeFocused) === null || _a === void 0 ? void 0 : _a.index) === index) ? 'is-focused' : ''}"
                        x="${valueShape.origin.x}"
                        y="${valueShape.origin.y}"
                        width="${valueShape.width}"
                        height="${valueShape.height}"
                        rx="${barRadius}" ry="${barRadius}"
                    />
                `;
        })}
            </svg>
        `;
    }
    templateTooltip() {
        if (this.valueShapeFocused === null) {
            return null;
        }
        const style = {
            left: ((this.valueShapeFocused.value < 0) ? this.valueShapeFocused.origin.x : (this.valueShapeFocused.origin.x + this.valueShapeFocused.width)) + 'px',
            top: (this.valueShapeFocused.origin.y - 2) + 'px',
            transform: 'translate(-50%, -100%)',
        };
        return html `
            <div class="tooltip" style="${styleMap(style)}">
                ${this.tooltipTextFormatted(this.valueShapeFocused.value.toLocaleString())}
            </div>
        `;
    }
};
TcBar.styles = [
    TcBase.styles,
    css `
            :host {
                --bar-color: #597BFC;
                --bar-opacity: 1;
                --bar-focused-opacity: 0.5;
                --area-color: var(--bar-color);
                --area-opacity: 0;
                width: 120px;
                height: 60px;
            }
            .chart > .bar {
                fill: var(--bar-color);
                opacity: var(--bar-opacity);
                stroke: none;
            }
            .chart > .bar.is-focused {
                opacity: var(--bar-focused-opacity);
            }
            .chart > .area {
                fill: var(--area-color);
                opacity: var(--area-opacity);
                stroke: none;
            }
        `,
];
__decorate([
    property({ type: Number, reflect: true, attribute: 'bar-gap' })
], TcBar.prototype, "barGap", void 0);
__decorate([
    property({ type: Number, reflect: true, attribute: 'bar-radius' })
], TcBar.prototype, "barRadius", void 0);
TcBar = __decorate([
    customElement('tc-bar')
], TcBar);
export { TcBar };
