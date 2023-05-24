import { __decorate } from "tslib";
import { css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { TcBase } from './tc-base.js';
let TcLine = class TcLine extends TcBase {
    constructor() {
        super(...arguments);
        this.shapeSize = 2;
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
        const pointPositionX = (value) => {
            const width = this.width - this.shapeSize;
            let x = value * (width / (this.values.length - 1));
            return x + (this.shapeSize / 2);
        };
        const pointPositionY = (value) => {
            const height = this.height - this.shapeSize;
            let y = height;
            if (valueScale) {
                y -= ((value - valueMin) / valueScale) * height;
            }
            return y + (this.shapeSize / 2);
        };
        this.values.forEach((value, index) => {
            var _a;
            this.valueShapes.push({
                index: index,
                value: value,
                label: (_a = this.labels[index]) !== null && _a !== void 0 ? _a : null,
                center: {
                    x: pointPositionX(index),
                    y: pointPositionY(value),
                },
                radius: Math.floor((this.shapeSize + 6) / 2),
            });
        });
        this.linePath = this.valueShapes
            .map((valueShape, index) => ((index === 0) ? 'M' : 'L') + valueShape.center.x + ',' + valueShape.center.y)
            .join(' ');
        this.areaPath = this.linePath
            .concat('L' + this.valueShapes[this.valueShapes.length - 1].center.x + ',' + pointPositionY(Math.max(valueMin, 0)) + ' ')
            .concat('L' + this.valueShapes[0].center.x + ',' + pointPositionY(Math.max(valueMin, 0)) + ' ')
            .concat('Z');
    }
    willUpdate(changedProperties) {
        if (!this.width || !this.height) {
            return;
        }
        if (changedProperties.has('shapeSize')) {
            this.validatePropertyAsPositiveNumber('shapeSize');
        }
        const propertiesUsedByChart = ['width', 'height', 'values', 'labels', 'min', 'max', 'shapeSize'];
        if ([...changedProperties.keys()].some((property) => propertiesUsedByChart.includes(property))) {
            this.computeChartProperties();
        }
    }
    findValueShapeAtPosition(x, y) {
        return this.valueShapes.reduce((previous, current) => {
            return (Math.abs(current.center.x - x) < Math.abs(previous.center.x - x) ? current : previous);
        });
    }
    templateChart() {
        if (this.valueShapes.length < 2) {
            return null;
        }
        return html `
            <svg class="chart" width="100%" height="100%">
                <mask id="mask">
                    <path d="${this.areaPath}" stroke-width="${this.shapeSize}" stroke="#FFFFFF" fill="#FFFFFF" vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round"/>
                </mask>
                <rect class="area" x="0" y="0" width="100%" height="100%" mask="url(#mask)"/>
                <path class="shape" d="${this.linePath}" stroke-width="${this.shapeSize}" vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;
    }
    templateTooltip() {
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
        return html `
            <div class="point" style="${styleMap(pointStyle)}"></div>
            <div class="tooltip" style="${styleMap(tooltipStyle)}">
                ${this.tooltipTextFormatted(this.valueShapeFocused)}
            </div>
        `;
    }
};
TcLine.styles = [
    TcBase.styles,
    css `
            :host {
                --point-color: var(--shape-color);
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
            .chart > .shape {
                fill: none;
                stroke: var(--shape-color);
                opacity: var(--shape-opacity);
            }
        `,
];
__decorate([
    property({ type: Number, attribute: 'shape-size', reflect: true })
], TcLine.prototype, "shapeSize", void 0);
TcLine = __decorate([
    customElement('tc-line')
], TcLine);
export { TcLine };
