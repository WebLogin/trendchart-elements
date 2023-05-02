import { __decorate } from "tslib";
import { css, html, svg } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { TcBase } from './tc-base.js';
let TcColumn = class TcColumn extends TcBase {
    constructor() {
        super(...arguments);
        this.columnGap = 1;
        this.columnRadius = 1;
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
        const columnWidth = (this.width - (this.columnGap * (this.values.length - 1))) / this.values.length;
        const columnPositionY = (value) => {
            return this.height - (valueScale ? ((value - valueMin) / valueScale) * this.height : 1);
        };
        this.values.forEach((value, index) => {
            var _a;
            let xLeft = (columnWidth + this.columnGap) * index;
            let yTop = (value < 0) ? columnPositionY(Math.min(valueMax, 0)) : columnPositionY(value);
            let yBottom = (value < 0) ? columnPositionY(value) : columnPositionY(Math.max(valueMin, 0));
            let height = yBottom - yTop;
            if (height == 0) {
                height = 1;
                if (valueMax > 0 && valueScale) {
                    yTop--;
                }
            }
            this.valueShapes.push({
                index: index,
                value: value,
                label: (_a = this.labels[index]) !== null && _a !== void 0 ? _a : null,
                origin: {
                    x: xLeft,
                    y: yTop,
                },
                width: columnWidth,
                height: height,
            });
        });
    }
    willUpdate(changedProperties) {
        if (changedProperties.has('columnGap')) {
            this.validatePropertyAsPositiveNumber('columnGap');
        }
        if (changedProperties.has('columnRadius')) {
            this.validatePropertyAsPositiveNumber('columnRadius');
        }
        const propertiesUsedByChart = ['width', 'height', 'values', 'labels', 'min', 'max', 'columnGap', 'columnRadius'];
        if ([...changedProperties.keys()].some((property) => propertiesUsedByChart.includes(property))) {
            this.computeChartProperties();
        }
    }
    findValueShapeAtPosition(x, y) {
        var _a;
        return (_a = this.valueShapes.find((valueShape) => {
            const xMin = valueShape.origin.x - (this.columnGap / 2);
            const xMax = valueShape.origin.x + valueShape.width + (this.columnGap / 2);
            return x >= xMin && x <= xMax;
        })) !== null && _a !== void 0 ? _a : null;
    }
    templateChart() {
        if (this.valueShapes.length < 1) {
            return null;
        }
        const columnRadius = Math.min(this.columnRadius, (this.valueShapes[0].width / 2));
        return html `
            <svg class="chart" width="100%" height="100%">
                ${this.valueShapes.map((valueShape, index) => {
            var _a;
            return svg `
                    <rect class="area"
                        x="${valueShape.origin.x}"
                        y="0"
                        width="${valueShape.width}"
                        height="100%"
                        rx="${columnRadius}" ry="${columnRadius}"
                    />
                    <rect class="column ${(((_a = this.valueShapeFocused) === null || _a === void 0 ? void 0 : _a.index) === index) ? 'is-focused' : ''}"
                        x="${valueShape.origin.x}"
                        y="${valueShape.origin.y}"
                        width="${valueShape.width}"
                        height="${valueShape.height}"
                        rx="${columnRadius}" ry="${columnRadius}"
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
        let style = {
            left: (this.valueShapeFocused.origin.x + (this.valueShapeFocused.width / 2)) + 'px',
            top: (this.valueShapeFocused.origin.y - 2) + 'px',
            transform: 'translate(-50%, -100%)',
        };
        if (this.valueShapeFocused.value < 0 || this.onlyNegativeValues()) {
            style.top = (this.valueShapeFocused.origin.y + this.valueShapeFocused.height + 2) + 'px';
            style.transform = 'translate(-50%, 0%)';
        }
        return html `
            <div class="tooltip" style="${styleMap(style)}">
                ${this.tooltipTextFormatted(this.valueShapeFocused)}
            </div>
        `;
    }
};
TcColumn.styles = [
    TcBase.styles,
    css `
            :host {
                --column-color: #597BFC;
                --column-opacity: 1;
                --column-focused-opacity: 0.5;
                --area-color: var(--column-color);
                width: 120px;
                height: 40px;
            }
            .chart > .column {
                fill: var(--column-color);
                opacity: var(--column-opacity);
                stroke: none;
            }
            .chart > .column.is-focused {
                opacity: var(--column-focused-opacity);
            }
        `,
];
__decorate([
    property({ type: Number, reflect: true, attribute: 'column-gap' })
], TcColumn.prototype, "columnGap", void 0);
__decorate([
    property({ type: Number, reflect: true, attribute: 'column-radius' })
], TcColumn.prototype, "columnRadius", void 0);
TcColumn = __decorate([
    customElement('tc-column')
], TcColumn);
export { TcColumn };
