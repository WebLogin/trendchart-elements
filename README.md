⚠️ Work In Progress not ready to use ⚠️

# TrendChart Elements

Web components to generate simple, light and responsive charts representing trends.

<p align="center">
    <img src="docs/banner.jpg" alt="Logo" width="1000">
</p>

It is often useful to display some simple charts to represent a data visualization trend without the need of a big chart library, TrendChart Elements is made for that. The aim was to be as plug-and-play as possible, like native HTML tags, so all the configuration is made with CSS variables and HTML attributes. It's fully responsive with built-in basic tooltip.

Tested on modern browsers : `Chrome >= 73`, `Firefox >= 63`, `Edge >= 79`, `Safari >= 12`


## Installation

Install the package with NPM :

```
npm install @weblogin/trendchart-elements
```

Import into your project code :

```javascript
// All the charts
import '@weblogin/trendchart-elements';
// Only some charts
import { TcLine } from "@weblogin/trendchart-elements";
```


## Usage

<p align="center">
    <img src="docs/demo.jpg" alt="Demo" width="1019">
</p>

**Check out the [demo page](https://weblogin.github.io/trendchart-elements/demo/)** for various charts, stylings and use cases. Configuration is made with HTML attributes and CSS variables.


### Common configuration

Use CSS to change the `width` and `height` of the chart, because they are responsive you can use percentages.

In some cases you'll need to have a radius around the chart if its container has one, for that just add a `border-radius` CSS rule to the chart.

| HTML&nbsp;Attribute | Default | Description |
| --- | --- | --- |
| `values` | [] | `Required` array of numbers. Values of the chart, for example `values="[12,10,11]"` |
| `labels` | [] | `Optional` array of strings. Labels corresponding to the values. Needs to be the same length as `values` array, for example `labels='["Lorem","Ipsum","Dolor"]'`. Only usefull with tooltips not disabled |
| `min` | null | `Optional` number or null. Minimum `Y axis` value, in most cases you'll need to add it to `0`. By default the chart uses the smallest value |
| `max ` | null | `Optional` number or null. Maximum `Y axis` value, usefull if you need to have multiple charts with the same scale. By default the chart uses the highest value |
| `tooltip-disabled` | false | `Optional` attribute to disable the tooltip. It doesn't need a value, just add the attribute |
| `tooltip-text` | @L&nbsp;@V | `Optional` string. Format of the tooltip text, `@V` being the current value and `@L` the current label if present |

| CSS&nbsp;variables | Default |
| --- | --- |
| `--shape-color` | #597BFC |
| `--shape-opacity` | 1 |
| `--area-color` | var(--shape-color) |
| `--area-opacity` | 0 |
| `--tooltip-font-color` | white |
| `--tooltip-font-size` | 0.875em |
| `--tooltip-font-weight` | bold |
| `--tooltip-radius` | 3px |
| `--tooltip-padding` | 3px 4px |
| `--tooltip-background` | black |
| `--tooltip-shadow` | none |


### Line chart

```html
<tc-line values="[12,10,12,11,7,6,8,10,12]"></tc-line>
```

See also [common configuration](#common-configuration)

| HTML&nbsp;Attribute | Default | Description |
| --- | --- | --- |
| `shape-size` | 2 | `Optional` number. Line size |

| CSS&nbsp;variables | Default |
| --- | --- |
| `--point-color` | var(--shape-color) |
| `--point-opacity` | 1 |
| `--point-shadow` | none |


### Column / Bar chart

```html
<tc-column values="[11,7,6,8,10,12,8,10,12]"></tc-column>
<tc-bar values="[11,7,6,8,10,12,8,10,12]"></tc-bar>
```

See also [common configuration](#common-configuration)

| HTML&nbsp;Attribute | Default | Description |
| --- | --- | --- |
| `shape-radius` | 1 | `Optional` number. Columns / bars radius |
| `shape-gap` | 1 | `Optional` number. Gap between columns / bars |

| CSS&nbsp;variables | Default |
| --- | --- |
| `--shape-focused-opacity` | 0.5 |


### Pie chart

```html
<tc-pie values="[35,68,22,16]"></tc-pie>
```

See also [common configuration](#common-configuration)

| HTML&nbsp;Attribute | Default | Description |
| --- | --- | --- |
| `shape-size` | null | `Optional` number or null. Slice size, `null ` gives a pie and a `number ` create a donut |
| `shape-gap` | 1 | `Optional` number. Gap between slices |

| CSS&nbsp;variables | Default |
| --- | --- |
| `--shape-focused-opacity` | 0.5 |


## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
