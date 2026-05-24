import { LuClock, LuCircleCheck, LuCheckCheck, LuCircleX } from 'react-icons/lu';

const CONFIG = {
  pending:   { cls: 'bg-slate-100 text-slate-600',   Icon: LuClock        },
  confirmed: { cls: 'bg-brand-50  text-brand-700',   Icon: LuCircleCheck  },
  completed: { cls: 'bg-brand-100 text-brand-800',   Icon: LuCheckCheck   },
  cancelled: { cls: 'bg-slate-100 text-slate-400',   Icon: LuCircleX      },
};

export default function StatusBadge({ status }) {
  const { cls, Icon } = CONFIG[status] || { cls: 'bg-slate-100 text-slate-600', Icon: LuClock };
  return (
    <span className={`badge ${cls}`}>
      <Icon className="text-xs" />
      {status}
    </span>
  );
}
