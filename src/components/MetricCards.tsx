import React from 'react';
import { motion } from 'motion/react';
import {
  GitFork,
  AlertTriangle,
  Truck,
  Smartphone,
  Users,
  ShieldCheck,
  ArrowUpRight,
} from 'lucide-react';
import { MetricItem } from '../types';

interface MetricCardsProps {
  metrics: MetricItem[];
  onCardClick?: (metricId: string) => void;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ metrics, onCardClick }) => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Route':
        return <GitFork className="w-4 h-4 text-blue-600" />;
      case 'AlertTriangle':
        return <AlertTriangle className="w-4 h-4 text-slate-500" />;
      case 'Truck':
        return <Truck className="w-4 h-4 text-indigo-600" />;
      case 'Smartphone':
        return <Smartphone className="w-4 h-4 text-amber-600" />;
      case 'Users':
        return <Users className="w-4 h-4 text-teal-600" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-4 h-4 text-violet-600" />;
      default:
        return <GitFork className="w-4 h-4 text-blue-600" />;
    }
  };

  const getIconBg = (name: string) => {
    switch (name) {
      case 'Route':
        return 'bg-blue-50 border-blue-200/80';
      case 'AlertTriangle':
        return 'bg-slate-100 border-slate-200';
      case 'Truck':
        return 'bg-indigo-50 border-indigo-200/80';
      case 'Smartphone':
        return 'bg-amber-50 border-amber-200/80';
      case 'Users':
        return 'bg-teal-50 border-teal-200/80';
      case 'ShieldCheck':
        return 'bg-violet-50 border-violet-200/80';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
      {metrics.map((metric, index) => {
        const isAmber = metric.highlight || metric.id === 'devices';
        return (
          <motion.div
            key={metric.id}
            id={`metric-card-${metric.id}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.05 }}
            whileHover={{ y: -3, transition: { duration: 0.15 } }}
            onClick={() => onCardClick?.(metric.id)}
            className={`group relative bg-white rounded-2xl p-4 border transition-all cursor-pointer shadow-xs hover:shadow-md ${
              isAmber
                ? 'border-amber-300/80 hover:border-amber-400 bg-gradient-to-b from-white to-amber-50/20'
                : 'border-slate-200/90 hover:border-slate-300'
            }`}
          >
            {/* Top row: Icon + Title */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center border ${getIconBg(
                    metric.iconName
                  )}`}
                >
                  {getIcon(metric.iconName)}
                </div>
                <span className="text-xs font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">
                  {metric.title}
                </span>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 transition-colors" />
            </div>

            {/* Metric Value */}
            <div className="space-y-1">
              <div
                className={`text-2xl sm:text-3xl font-extrabold tracking-tight font-mono-plate ${
                  isAmber ? 'text-amber-600' : 'text-slate-900'
                }`}
              >
                {metric.value}
              </div>

              {/* Subtext */}
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium truncate">
                {metric.subtext}
              </p>
            </div>

            {/* Optional badge */}
            {metric.badge && (
              <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Status
                </span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                    isAmber
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {metric.badge}
                </span>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};
