import { __decorate } from "tslib";
import { LitElement, css, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
export class TcBase extends LitElement {
    constructor() {
        super(...arguments);
        this.values = [];
        this.labels = [];
        this.min = null;
        this.max = null;
        this.tooltipDisabled = false;
        this.tooltipText = '@V';
        this.valueShapeFocused = null;
        this.width = 0;
        this.height = 0;
        this.valueShapes = [];
    }
    connectedCallback() {
        super.connectedCallback();
        this.resizeObserver = new ResizeObserver((entries) => {
            entries.forEach((entry) => {
                this.width = entry.contentRect.width;
                this.height = entry.contentRect.height;
            });
        });
        this.resizeObserver.observe(this);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.resizeObserver.unobserve(this);
    }
    firstUpdated() {
        const wrapperElement = this.renderRoot.querySelector('.wrapper');
        if (!this.tooltipDisabled) {
            wrapperElement.addEventListener('mousemove', (event) => {
                this.valueShapeFocused = this.findValueShapeAtPosition(event.offsetX, event.offsetY);
                ;
            });
            wrapperElement.addEventListener('mouseleave', () => {
                this.valueShapeFocused = null;
            });
        }
    }
    render() {
        var _a, _b;
        return html `
            <div class="wrapper">
                ${(_a = this.templateChart()) !== null && _a !== void 0 ? _a : nothing}
                ${(_b = this.templateTooltip()) !== null && _b !== void 0 ? _b : nothing}
            </div>
        `;
    }
    tooltipTextFormatted(valueShape) {
        const label = valueShape.label ? (valueShape.label + ' : ') : '';
        const value = this.tooltipText.replace(/@V/g, valueShape.value.toLocaleString());
        return label + value;
    }
    validatePropertyAsPositiveNumber(propertyName) {
        const property = this[propertyName];
        if (!Number.isFinite(property) || property < 0) {
            throw new Error(`The property ${propertyName} must be a positive number`);
        }
    }
    onlyNegativeValues() {
        return (Math.max(...this.values) === 0);
    }
}
TcBase.styles = css `
        :host {
            --area-opacity: 0;
            --tooltip-font-color: white;
            --tooltip-font-size: 0.875em;
            --tooltip-font-weight: bold;
            --tooltip-radius: 3px;
            --tooltip-padding: 3px 4px;
            --tooltip-background: black;
            --tooltip-shadow: none;
            display: inline-block;
        }
        .wrapper {
            display: block;
            width: 100%;
            height: 100%;
            position: relative;
            z-index: 1;
            box-sizing: border-box;
            border-radius: inherit;
        }
        .wrapper * {
            box-sizing: border-box;
        }
        .chart {
            display: block;
            position: relative;
            z-index: 1;
            overflow: hidden;
            border-radius: inherit
        }
        .chart .area {
            fill: var(--area-color);
            opacity: var(--area-opacity);
            stroke: none;
        }
        .tooltip {
            position: absolute;
            z-index: 10;
            font-size: var(--tooltip-font-size);
            font-weight: var(--tooltip-font-weight);
            line-height: 1;
            text-align: center;
            white-space: nowrap;
            color: var(--tooltip-font-color);
            padding: var(--tooltip-padding);
            pointer-events: none;
            border-radius: var(--tooltip-radius);
            background-color: var(--tooltip-background);
            box-shadow: var(--tooltip-shadow);
        }
    `;
__decorate([
    property({ type: Array, reflect: true })
], TcBase.prototype, "values", void 0);
__decorate([
    property({ type: Array, reflect: true })
], TcBase.prototype, "labels", void 0);
__decorate([
    property({ type: Number, reflect: true })
], TcBase.prototype, "min", void 0);
__decorate([
    property({ type: Number, reflect: true })
], TcBase.prototype, "max", void 0);
__decorate([
    property({ type: Boolean, reflect: true, attribute: 'tooltip-disabled' })
], TcBase.prototype, "tooltipDisabled", void 0);
__decorate([
    property({ type: String, attribute: 'tooltip-text' })
], TcBase.prototype, "tooltipText", void 0);
__decorate([
    state()
], TcBase.prototype, "valueShapeFocused", void 0);
__decorate([
    state()
], TcBase.prototype, "width", void 0);
__decorate([
    state()
], TcBase.prototype, "height", void 0);
