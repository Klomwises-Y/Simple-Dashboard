
import React from 'react';
import { BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Widget as WidgetType, KpiData } from '../types';
import { TrashIcon } from './icons';

interface WidgetProps {
  widget: WidgetType;
  onRemove: (id: string) => void;
}

const ChartTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 text-white p-2 border border-gray-700 rounded-md shadow-lg">
        <p className="font-bold">{label}</p>
        {payload.map((pld: any, index: number) => (
          <p key={index} style={{ color: pld.color }}>
            {`${pld.name}: ${pld.value.toLocaleString()}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const KpiCard: React.FC<{ data: KpiData }> = ({ data }) => {
  const isIncrease = data.changeType === 'increase';
  return (
    <div className="p-6 h-full flex flex-col justify-center">
      <p className="text-sm text-gray-400 mb-1">{data.label}</p>
      <p className="text-4xl font-bold text-white">{data.value}</p>
      <div className="flex items-center mt-2">
        <span className={`text-sm font-semibold ${isIncrease ? 'text-green-400' : 'text-red-400'}`}>
          {data.change}
        </span>
        <span className="text-xs text-gray-500 ml-2">vs last period</span>
      </div>
    </div>
  );
};

const WidgetContent: React.FC<{ widget: WidgetType }> = ({ widget }) => {
  if (widget.data === null) {
    return (
        <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-400"></div>
        </div>
    );
  }

  switch (widget.type) {
    case 'KPI':
      return <KpiCard data={widget.data} />;
    
    case 'BAR_CHART':
        const barDataKey = Object.keys(widget.data[0] || {}).find(key => key !== 'name') || '';
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={widget.data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => typeof value === 'number' ? value.toLocaleString() : value} />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{fontSize: "12px"}}/>
              <Bar dataKey={barDataKey} fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

    case 'LINE_CHART':
        const lineDataKey = Object.keys(widget.data[0] || {}).find(key => key !== 'name') || '';
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={widget.data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => typeof value === 'number' ? value.toLocaleString() : value} />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{fontSize: "12px"}}/>
              <Line type="monotone" dataKey={lineDataKey} stroke="#818cf8" strokeWidth={2} dot={{ r: 4, fill: '#6366f1' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        );

    case 'AREA_CHART':
        const areaDataKeys = Object.keys(widget.data[0] || {}).filter(key => key !== 'name');
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={widget.data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => typeof value === 'number' ? value.toLocaleString() : value} />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{fontSize: "12px"}}/>
              <defs>
                <linearGradient id="colorOrganic" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#818cf8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPaid" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34d399" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                </linearGradient>
              </defs>
              {areaDataKeys[0] && <Area type="monotone" dataKey={areaDataKeys[0]} stroke="#818cf8" fillOpacity={1} fill="url(#colorOrganic)" />}
              {areaDataKeys[1] && <Area type="monotone" dataKey={areaDataKeys[1]} stroke="#34d399" fillOpacity={1} fill="url(#colorPaid)" />}
            </AreaChart>
          </ResponsiveContainer>
        );
        
    default:
      return <div className="text-red-500">Unknown widget type</div>;
  }
};

const Widget: React.FC<WidgetProps> = ({ widget, onRemove }) => {
  return (
    <div className="bg-gray-850 rounded-lg shadow-lg flex flex-col animate-fade-in">
      <header className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h3 className="font-semibold text-white">{widget.title}</h3>
        <button 
          onClick={() => onRemove(widget.id)} 
          className="text-gray-500 hover:text-red-400 transition-colors duration-200"
          aria-label="Remove widget"
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      </header>
      <main className="flex-grow p-2" style={{ minHeight: '250px' }}>
        <WidgetContent widget={widget} />
      </main>
    </div>
  );
};

export default Widget;
