import React, { useEffect, useMemo, useState } from 'react';
import { CalendarDays, Check, CheckCircle2, Clock3, LockKeyhole, Pencil, Plus, RotateCcw, Save, Trash2, X } from 'lucide-react';
import { Header } from '../common/Header';
import { useApp } from '../../context/AppContext';
import type { Task } from '../../types';
import {
  getRoutineBlocksForDate,
  restoreRoutineBlocksForDate,
  ROUTINE_AREAS,
  saveRoutineBlocksForDate,
  type RoutineBlock,
} from '../../utils/routine';
import { getTodayDateString } from '../../utils/date';

const colors: Record<string, { line: string; badge: string }> = {
  'GF ATAKAREJO': { line: '#299BFF', badge: 'text-[#6BAEFF] bg-[#299BFF]/10' },
  'MTR7 Imports': { line: '#B29CFF', badge: 'text-[#B29CFF] bg-[#B29CFF]/10' },
  Pessoal: { line: '#24E4B4', badge: 'text-[#24E4B4] bg-[#24E4B4]/10' },
  Geral: { line: '#91A8C4', badge: 'text-[#91A8C4] bg-[#91A8C4]/10' },
};

const buttonBase = 'rounded-xl px-3 py-2 text-xs font-semibold transition-all active:scale-95';
const inputClass = 'w-full rounded-xl border border-[rgba(120,160,190,0.25)] bg-[#0D171F] text-[#F7F9FC] p-2.5 text-sm focus:outline-none focus:border-[#299BFF]';

export const RoutineScreen: React.FC = () => {
  const { selectedDate, setSelectedDate, tasks, toggleTask, updateTask, setEditingTask, setIsTaskModalOpen } = useApp();
  const [blocks, setBlocks] = useState<RoutineBlock[]>(() => getRoutineBlocksForDate(selectedDate));
  const [editing, setEditing] = useState<RoutineBlock | null>(null);
  const [feedback, setFeedback] = useState('');
  const [customizing, setCustomizing] = useState(false);

  useEffect(() => {
    setBlocks(getRoutineBlocksForDate(selectedDate));
    setEditing(null);
    setFeedback('');
  }, [selectedDate]);

  const dateTasks = useMemo(
    () => tasks.filter(task => task.date === selectedDate || task.recurring),
    [tasks, selectedDate],
  );
  const blockIds = useMemo(() => new Set(blocks.map(block => block.id)), [blocks]);
  const unassigned = dateTasks.filter(task => !task.routineBlockId || !blockIds.has(task.routineBlockId));
  const finished = dateTasks.filter(task => task.completed).length;

  const persist = (next: RoutineBlock[]) => {
    if (!saveRoutineBlocksForDate(selectedDate, next)) {
      setFeedback('Não foi possível salvar a rotina neste navegador.');
      return;
    }
    setBlocks([...next].sort((a, b) => a.start.localeCompare(b.start)));
    setEditing(null);
    setFeedback('Rotina deste dia salva.');
  };

  const beginAdd = () => setEditing({
    id: 'custom-' + Date.now(),
    title: '',
    start: '10:00',
    end: '10:30',
    workspace: 'Geral',
    protected: false,
  });

  const saveEdit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!editing || !editing.title.trim()) return;
    // Only the predefined sleep block is allowed to cross midnight.
    if (editing.start >= editing.end && editing.id !== 'sleep') {
      setFeedback('O término precisa ser depois do início.');
      return;
    }
    const next = [...blocks.filter(block => block.id !== editing.id), { ...editing, title: editing.title.trim() }];
    persist(next);
  };

  const removeBlock = (blockId: string) => {
    if (!window.confirm('Remover este bloco somente deste dia? Tarefas vinculadas ficarão sem bloco.')) return;
    persist(blocks.filter(block => block.id !== blockId));
  };

  const restore = () => {
    if (!window.confirm('Restaurar a rotina-padrão deste dia? Suas tarefas continuarão salvas.')) return;
    if (!restoreRoutineBlocksForDate(selectedDate)) {
      setFeedback('Não foi possível restaurar a rotina.');
      return;
    }
    setBlocks(getRoutineBlocksForDate(selectedDate));
    setFeedback('Rotina-padrão restaurada. Nenhuma tarefa foi apagada.');
    setEditing(null);
  };

  const taskRow = (task: Task, showAssign = false) => (
    <div key={task.id} className="flex items-center gap-2.5 py-2 border-t border-white/[0.05] first:border-t-0">
      <button
        type="button"
        aria-label={task.completed ? 'Desmarcar tarefa' : 'Concluir tarefa'}
        onClick={() => toggleTask(task.id)}
        className={`h-5 w-5 shrink-0 rounded-md border flex items-center justify-center ${
          task.completed ? 'bg-[#24E4B4] border-[#24E4B4] text-[#05090D]' : 'border-[#3F566B] text-transparent'
        }`}
      >
        <Check className="h-3.5 w-3.5" />
      </button>
      <div className="min-w-0 flex-1">
        <button
          type="button"
          onClick={() => { setEditingTask(task); setIsTaskModalOpen(true); }}
          className={`block text-left truncate w-full text-[12.5px] font-medium ${
            task.completed ? 'line-through text-[#72869A]' : 'text-[#F7F9FC]'
          }`}
        >
          {task.title}
        </button>
        {showAssign && <span className="text-[10px] text-[#91A8C4]">{task.workspace || 'Geral'}</span>}
      </div>
      {showAssign ? (
        <select
          aria-label={'Atribuir bloco a ' + task.title}
          className="max-w-[123px] bg-[#12232F] rounded-lg px-1.5 py-1.5 text-[11px] text-[#91A8C4] border border-white/10"
          value=""
          onChange={event => updateTask(task.id, { routineBlockId: event.target.value || undefined })}
        >
          <option value="">Vincular bloco</option>
          {blocks.filter(block => !block.protected).map(block => (
            <option key={block.id} value={block.id}>{block.start} {block.title}</option>
          ))}
        </select>
      ) : (
        <button
          type="button"
          onClick={() => updateTask(task.id, { routineBlockId: undefined })}
          className="text-[10px] text-[#91A8C4] hover:text-[#6BAEFF]"
          title="Mover tarefa para sem bloco"
        >
          Soltar
        </button>
      )}
    </div>
  );

  return (
    <div className="space-y-4 pb-28 relative min-h-screen">
      <Header title="Rotina inteligente" subtitle="Blocos protegidos, tarefas flexíveis." />

      <section className="rounded-[20px] bg-[#0B141B] border border-[rgba(120,160,190,0.14)] p-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-[#F7F9FC] font-semibold text-sm">
            <CalendarDays className="w-4 h-4 text-[#299BFF]" />
            Planejamento do dia
          </div>
          <button type="button" onClick={() => setSelectedDate(getTodayDateString())} className={buttonBase + ' text-[#299BFF] bg-[#299BFF]/10'}>Hoje</button>
        </div>
        <input type="date" aria-label="Data da rotina" value={selectedDate} onChange={event => setSelectedDate(event.target.value || getTodayDateString())} className={inputClass} />
        <div className="flex items-center justify-between text-[12px] text-[#91A8C4]">
          <span>{blocks.length} blocos planejados</span>
          <span>{finished}/{dateTasks.length} tarefas concluídas</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-[#172735] overflow-hidden">
          <div className="h-full rounded-full bg-[#24E4B4] transition-all" style={{ width: dateTasks.length ? (finished / dateTasks.length * 100) + '%' : '0%' }} />
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => setCustomizing(value => !value)} className={buttonBase + ' bg-[#14283B] text-[#6BAEFF]'}>
            <Pencil className="inline w-3.5 h-3.5 mr-1" />{customizing ? 'Concluir ajustes' : 'Personalizar blocos'}
          </button>
          {customizing && <>
            <button type="button" onClick={beginAdd} className={buttonBase + ' bg-[#14283B] text-[#F7F9FC]'}><Plus className="inline w-3.5 h-3.5 mr-1" />Adicionar</button>
            <button type="button" onClick={restore} className={buttonBase + ' bg-[#14283B] text-[#F7F9FC]'}><RotateCcw className="inline w-3.5 h-3.5 mr-1" />Restaurar</button>
          </>}
        </div>
        <p className="text-[11px] text-[#72869A]">A rotina sugerida é editável por dia. O intervalo de almoço, a família e o sono vêm protegidos por padrão.</p>
        {feedback && <p role="status" className="text-xs text-[#F5B83D]">{feedback}</p>}
      </section>

      <section className="space-y-2">
        {blocks.map(block => {
          const style = colors[block.workspace] || colors.Geral;
          const assigned = dateTasks.filter(task => task.routineBlockId === block.id);
          return (
            <article key={block.id} className="rounded-[18px] bg-[#0B141B] border border-[rgba(120,160,190,0.14)] p-3.5 relative overflow-hidden">
              <span className="absolute inset-y-0 left-0 w-[3px]" style={{ background: style.line }} />
              <div className="flex items-start gap-2.5">
                <div className="min-w-[76px] pt-0.5">
                  <span className="text-[#F7F9FC] text-[12px] font-semibold tabular-nums">{block.start}</span>
                  <span className="block text-[#72869A] text-[11px] tabular-nums">{block.end}{block.id === 'sleep' ? ' (+1)' : ''}</span>
                </div>
                <div className="min-w-0 flex-1 space-y-1.5">
                  <p className="text-[#F7F9FC] font-semibold text-[13px] leading-snug">{block.title}</p>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`rounded-md px-2 py-0.5 text-[10px] font-medium ${style.badge}`}>{block.workspace}</span>
                    {block.protected && <span className="inline-flex items-center gap-1 text-[10px] text-[#91A8C4]"><LockKeyhole className="w-3 h-3" />Protegido</span>}
                  </div>
                  {assigned.length > 0 && <div className="pt-1">{assigned.map(task => taskRow(task))}</div>}
                </div>
                {customizing && (
                  <div className="flex gap-1">
                    {block.id !== 'sleep' && <>
                      <button aria-label={'Editar ' + block.title} type="button" onClick={() => setEditing({ ...block })} className="p-1.5 text-[#6BAEFF]"><Pencil className="w-3.5 h-3.5" /></button>
                      <button aria-label={'Remover ' + block.title} type="button" onClick={() => removeBlock(block.id)} className="p-1.5 text-[#FF5B64]"><Trash2 className="w-3.5 h-3.5" /></button>
                    </>}
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </section>

      <section className="rounded-[20px] bg-[#0B141B] border border-[rgba(120,160,190,0.14)] p-4">
        <div className="flex justify-between items-center gap-2 mb-2">
          <div>
            <h3 className="text-[#F7F9FC] font-bold text-sm">Tarefas flexíveis</h3>
            <p className="text-[11px] text-[#91A8C4]">Associe a um bloco quando decidir executá-las.</p>
          </div>
          <button
            type="button"
            aria-label="Nova tarefa"
            onClick={() => { setEditingTask(null); setIsTaskModalOpen(true); }}
            className="bg-[#299BFF] text-white p-2 rounded-xl"
          ><Plus className="w-4 h-4" /></button>
        </div>
        {unassigned.length === 0 ? (
          <p className="text-[#91A8C4] text-xs py-3">Nenhuma tarefa sem bloco neste dia.</p>
        ) : unassigned.map(task => taskRow(task, true))}
      </section>

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm p-4 flex items-center justify-center" role="dialog" aria-modal="true" aria-label="Editar bloco da rotina">
          <form onSubmit={saveEdit} className="w-full max-w-sm rounded-[24px] border border-white/15 bg-[#0B141B] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-bold">Bloco da rotina</h3>
              <button type="button" onClick={() => setEditing(null)} aria-label="Fechar"><X className="w-5 h-5 text-[#91A8C4]" /></button>
            </div>
            <label className="block text-xs text-[#91A8C4]">Nome do bloco
              <input required maxLength={80} value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} className={inputClass + ' mt-1'} />
            </label>
            <div className="grid grid-cols-2 gap-2">
              <label className="block text-xs text-[#91A8C4]">Início
                <input required type="time" value={editing.start} onChange={e => setEditing({ ...editing, start: e.target.value })} className={inputClass + ' mt-1'} />
              </label>
              <label className="block text-xs text-[#91A8C4]">Fim
                <input required type="time" value={editing.end} onChange={e => setEditing({ ...editing, end: e.target.value })} className={inputClass + ' mt-1'} />
              </label>
            </div>
            <label className="block text-xs text-[#91A8C4]">Área
              <select value={editing.workspace} onChange={e => setEditing({ ...editing, workspace: e.target.value as RoutineBlock['workspace'] })} className={inputClass + ' mt-1'}>
                {ROUTINE_AREAS.map(area => <option key={area} value={area}>{area}</option>)}
              </select>
            </label>
            <label className="flex items-center gap-2 text-xs text-[#91A8C4]">
              <input type="checkbox" checked={editing.protected} onChange={e => setEditing({ ...editing, protected: e.target.checked })} />
              Proteger este bloco (sem exigir tarefas)
            </label>
            {feedback && <p className="text-xs text-[#F5B83D]">{feedback}</p>}
            <button type="submit" className="flex items-center justify-center gap-2 w-full bg-[#299BFF] text-white font-semibold rounded-xl py-3 text-sm"><Save className="w-4 h-4" /> Salvar bloco</button>
          </form>
        </div>
      )}
    </div>
  );
};
