import React from 'react';
import {createComponent} from '@lit/react';
import { TcLine } from "../tc-line";
import { TcBar } from "../tc-bar";
import { TcColumn } from "../tc-column";
import { TcPie } from "../tc-pie";

export const TcLineReact = createComponent({
  tagName: 'tc-line',
  elementClass: TcLine,
  react: React
});

export const TcBarReact = createComponent({
  tagName: 'tc-bar',
  elementClass: TcBar,
  react: React
});

export const TcColumnReact = createComponent({
  tagName: 'tc-line',
  elementClass: TcColumn,
  react: React
});

export const TcPieReact = createComponent({
  tagName: 'tc-pie',
  elementClass: TcPie,
  react: React
});

