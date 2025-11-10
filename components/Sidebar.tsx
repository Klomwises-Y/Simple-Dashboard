
import React from 'react';
import { WidgetType } from '../types';
import { KpiIcon, BarChartIcon, LineChartIcon, AreaChartIcon } from './icons';

interface SidebarProps {
  onAddWidget: (type: WidgetType) => void;
}

const AddWidgetButton: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void }> = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center p-3 text-left text-gray-300 rounded-lg hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
  >
    <span className="mr-3 text-indigo-400">{icon}</span>
    {label}
  </button>
);

const Sidebar: React.FC<SidebarProps> = ({ onAddWidget }) => {
  return (
    <aside className="w-64 bg-gray-900 p-4 flex flex-col h-screen sticky top-0">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Gemini Dashboard</h1>
        <p className="text-sm text-gray-400">Your personal data view</p>
      </div>
      <nav className="space-y-2">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">Add Widget</h2>
        <AddWidgetButton 
          icon={<KpiIcon className="w-5 h-5" />} 
          label="KPI Card" 
          onClick={() => onAddWidget(WidgetType.KPI)} 
        />
        <AddWidgetButton 
          icon={<BarChartIcon className="w-5 h-5" />} 
          label="Bar Chart" 
          onClick={() => onAddWidget(WidgetType.BAR_CHART)} 
        />
        <AddWidgetButton 
          icon={<LineChartIcon className="w-5 h-5" />} 
          label="Line Chart" 
          onClick={() => onAddWidget(WidgetType.LINE_CHART)} 
        />
        <AddWidgetButton 
          icon={<AreaChartIcon className="w-5 h-5" />} 
          label="Area Chart" 
          onClick={() => onAddWidget(WidgetType.AREA_CHART)} 
        />
      </nav>
      <div className="mt-auto text-center text-gray-600 text-xs">
          <p>Powered by Gemini</p>
      </div>
    </aside>
  );
};

export default Sidebar;
