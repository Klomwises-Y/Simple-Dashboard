
import React, { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Sidebar from './components/Sidebar';
import Widget from './components/Widget';
import { Widget as WidgetConfig, WidgetType, KpiData } from './types';
import { generateChartData } from './services/geminiService';

const initialWidgets: WidgetConfig[] = [
  {
    id: 'initial-kpi-1',
    type: WidgetType.KPI,
    title: 'Key Performance Indicator',
    data: {
        value: '71,897',
        label: "Total Users",
        change: '+11.01%',
        changeType: 'increase',
    }
  },
  {
    id: 'initial-bar-1',
    type: WidgetType.BAR_CHART,
    title: 'Monthly Revenue',
    data: [
        { name: 'Jan', revenue: 4200 },
        { name: 'Feb', revenue: 3800 },
        { name: 'Mar', revenue: 5100 },
        { name: 'Apr', revenue: 4500 },
        { name: 'May', revenue: 6200 },
        { name: 'Jun', revenue: 5800 },
    ],
  },
  {
    id: 'initial-line-1',
    type: WidgetType.LINE_CHART,
    title: 'User Signups',
    data: [
        { name: 'Week 1', signups: 120 },
        { name: 'Week 2', signups: 135 },
        { name: 'Week 3', signups: 128 },
        { name: 'Week 4', signups: 142 },
        { name: 'Week 5', signups: 150 },
        { name: 'Week 6', signups: 145 },
        { name: 'Week 7', signups: 160 },
    ],
  },
  {
    id: 'initial-area-1',
    type: WidgetType.AREA_CHART,
    title: 'Website Traffic',
    data: [
        { name: 'Jan', Organic: 4100, Paid: 2400 },
        { name: 'Feb', Organic: 3200, Paid: 1398 },
        { name: 'Mar', Organic: 2500, Paid: 7800 },
        { name: 'Apr', Organic: 2780, Paid: 3908 },
        { name: 'May', Organic: 1890, Paid: 4800 },
        { name: 'Jun', Organic: 2390, Paid: 3800 },
    ]
  }
];


const App: React.FC = () => {
  const [widgets, setWidgets] = useState<WidgetConfig[]>(initialWidgets);

  const getKpiData = (): KpiData => {
    const value = Math.floor(Math.random() * 5000) + 1000;
    const change = (Math.random() * 20).toFixed(1);
    const changeType = Math.random() > 0.5 ? 'increase' : 'decrease';
    return {
        value: value.toLocaleString(),
        label: "Total Sales",
        change: `${changeType === 'increase' ? '+' : '-'}${change}%`,
        changeType,
    }
  };

  const addWidget = useCallback((type: WidgetType) => {
    const newWidget: WidgetConfig = {
      id: uuidv4(),
      type: type,
      title: 'New Widget',
      data: null,
    };

    switch (type) {
      case WidgetType.KPI:
        newWidget.title = 'Key Performance Indicator';
        (newWidget as any).data = getKpiData();
        break;
      case WidgetType.BAR_CHART:
        newWidget.title = 'Monthly Revenue';
        break;
      case WidgetType.LINE_CHART:
        newWidget.title = 'User Signups';
        break;
      case WidgetType.AREA_CHART:
        newWidget.title = 'Website Traffic';
        break;
    }

    setWidgets(prevWidgets => [...prevWidgets, newWidget]);

    if (type === WidgetType.BAR_CHART || type === WidgetType.LINE_CHART || type === WidgetType.AREA_CHART) {
      generateChartData(type).then(data => {
        // FIX: Add a type guard to ensure we're only updating chart widgets.
        // This resolves a TypeScript error where it couldn't guarantee that 'w'
        // was a ChartWidget when spreading its properties.
        setWidgets(prevWidgets => prevWidgets.map(w => {
            if (w.id === newWidget.id && w.type !== WidgetType.KPI) {
              return { ...w, data };
            }
            return w;
          }
        ));
      });
    }
  }, []);

  const removeWidget = useCallback((id: string) => {
    setWidgets(prevWidgets => prevWidgets.filter(widget => widget.id !== id));
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-950 text-gray-100">
      <Sidebar onAddWidget={addWidget} />
      <main className="flex-1 p-8 overflow-y-auto">
        {widgets.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-400">Your Dashboard is Empty</h2>
              <p className="mt-2 text-gray-500">Add a widget from the sidebar to get started.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {widgets.map(widget => (
              <Widget key={widget.id} widget={widget} onRemove={removeWidget} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
