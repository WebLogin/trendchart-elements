# TrendChart Elements

@TODO

[Demo]() of the chart elements.

<p align="center">
    <img src="docs/banner.jpg" alt="Collision logo" width="1000">
</p>


## Installation

TODO

```bash

```

## Usage
All HTML attributes have corresponding properies in camelCase. For example `tooltip-text` attribute can be used as `tooltipText` property.


### Chart Line / Area

| HTML Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `values` | array | - | Values for the chart |
| `tooltip-disabled` | boolean | false | Adding this attribute will disable the tooltip |
| `tooltip-text` | string | %V% | Format the tooltip text `%V%` being the current value |
| `min` | number | null | By default the chart uses the smallest value |
| `max ` | number | null | By default the chart uses the highest value |
| `line-size` | number | 2 | Thickness of the line |

| CSS var | Default | Description |
| --- | --- | --- |
| `--tooltip-font-color` | white | |
| `--tooltip-font-size` | 0.875em | |
| `--tooltip-font-weight` | bold | |
| `--tooltip-radius` | 3px | |
| `--tooltip-padding` | 3px 4px | |
| `--tooltip-background` | black | |
| `--tooltip-shadow` | none | |



## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
