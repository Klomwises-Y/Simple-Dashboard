
export enum WidgetType {
  KPI = 'KPI',
  BAR_CHART = 'BAR_CHART',
  LINE_CHART = 'LINE_CHART',
  AREA_CHART = 'AREA_CHART'
}

export interface KpiData {
  value: string;
  label: string;
  change: string;
  changeType: 'increase' | 'decrease';
}

export interface ChartDataPoint {
  name: string;
  [key: string]: string | number;
}

export interface BaseWidget {
  id: string;
  type: WidgetType;
  title: string;
}

export interface KpiWidget extends BaseWidget {
  type: WidgetType.KPI;
  data: KpiData | null;
}

export interface ChartWidget extends BaseWidget {
  type: WidgetType.BAR_CHART | WidgetType.LINE_CHART | WidgetType.AREA_CHART;
  data: ChartDataPoint[] | null;
}

export type Widget = KpiWidget | ChartWidget;
