'use client';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Toggle from '@/components/ui/Toggle';
import { X, Plus, Hash, Info } from 'lucide-react';

interface AutomationFormData {
  name: string;
  account: string;
  reelUrl: string;
  reelId: string;
  reelCaption: string;
  commentReplyTemplate: string;
  replyTemplate: string;
  replyMode: 'comment_and_dm' | 'dm_only';
  cooldownHours: number;
  delaySeconds: number;
  sendDm: boolean;
}

interface AutomationFormProps {
  open: boolean;
  onClose: () => void;
  initialData?: {
    id: string;
    name: string;
    account: string;
    reelUrl: string;
    reelId: string;
    reelCaption: string;
    commentReplyTemplate: string;
    replyTemplate: string;
    replyMode: 'comment_and_dm' | 'dm_only';
    keywords: string[];
    sendDm: boolean;
    delaySeconds: number;
    cooldown: number;
  } | null;
}

interface AccountOption {
  id: string;
  label: string;
}

interface ReelOption {
  id: string;
  caption: string;
  permalink: string;
}

export default function AutomationForm({ open, onClose, initialData = null }: AutomationFormProps) {
  const [accounts, setAccounts] = useState<AccountOption[]>([]);
  const [reels, setReels] = useState<ReelOption[]>([]);
  const [reelsLoading, setReelsLoading] = useState(false);
  const [keywords, setKeywords] = useState<string[]>(['link', 'guide']);
  const [keywordInput, setKeywordInput] = useState('');
  const [sendDm, setSendDm] = useState(true);

  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm<AutomationFormData>({
    defaultValues: {
      cooldownHours: 24,
      delaySeconds: 5,
      replyMode: 'comment_and_dm',
      commentReplyTemplate: '',
      reelId: '',
      reelCaption: '',
      reelUrl: '',
    },
  });

  const selectedAccountId = watch('account');
  const selectedReplyMode = watch('replyMode');

  useEffect(() => {
    const loadAccounts = async () => {
      const res = await fetch('/api/instagram/accounts');
      if (!res.ok) return;
      const data = await res.json();
      setAccounts((data.accounts || []).map((acc: any) => ({ id: acc._id || acc.id, label: `@${acc.username}` })));
    };
    void loadAccounts();
  }, []);

  useEffect(() => {
    if (!initialData) return;
    reset({
      name: initialData.name,
      account: initialData.account,
      reelUrl: initialData.reelUrl,
      reelId: initialData.reelId,
      reelCaption: initialData.reelCaption,
      commentReplyTemplate: initialData.commentReplyTemplate,
      replyTemplate: initialData.replyTemplate,
      replyMode: initialData.replyMode,
      cooldownHours: initialData.cooldown,
      delaySeconds: initialData.delaySeconds,
    });
    setKeywords(initialData.keywords?.length ? initialData.keywords : ['link', 'guide']);
    setSendDm(Boolean(initialData.sendDm));
  }, [initialData, reset]);

  useEffect(() => {
    if (!initialData || !accounts.length) return;
    const match = accounts.find((acc) => acc.label === initialData.account);
    if (match) {
      setValue('account', match.id);
    }
  }, [accounts, initialData, setValue]);

  useEffect(() => {
    const loadReels = async () => {
      if (!selectedAccountId) {
        setReels([]);
        return;
      }
      setReelsLoading(true);
      const res = await fetch(`/api/instagram/reels?accountId=${encodeURIComponent(selectedAccountId)}`);
      if (res.ok) {
        const data = await res.json();
        setReels(data.reels || []);
      }
      setReelsLoading(false);
    };
    void loadReels();
  }, [selectedAccountId]);

  const addKeyword = () => {
    const kw = keywordInput.trim().toLowerCase();
    if (kw && !keywords.includes(kw) && keywords.length < 10) {
      setKeywords((prev) => [...prev, kw]);
      setKeywordInput('');
    }
  };

  const removeKeyword = (kw: string) => setKeywords((prev) => prev.filter((k) => k !== kw));
  const handleKeywordKeyDown = (e: React.KeyboardEvent) => { if (e.key === 'Enter') { e.preventDefault(); addKeyword(); } };

  const onSelectReel = (reelId: string) => {
    const reel = reels.find((r) => r.id === reelId);
    setValue('reelId', reelId);
    setValue('reelCaption', reel?.caption || '');
    setValue('reelUrl', reel?.permalink || '');
  };

  const onSubmit = async (data: AutomationFormData) => {
    if (keywords.length === 0) return toast.error('Add at least one keyword trigger');
    const accountLabel = accounts.find((a) => a.id === data.account)?.label || data.account;
    const url = initialData ? `/api/automations/${initialData.id}` : '/api/automations';
    const method = initialData ? 'PATCH' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, account: accountLabel, keywords, sendDm }),
    });
    if (!res.ok) return toast.error(initialData ? 'Failed to update automation' : 'Failed to create automation');
    toast.success(initialData ? `Automation "${data.name}" updated` : `Automation "${data.name}" created and activated!`);
    reset();
    setKeywords(['link', 'guide']);
    onClose();
  };

  if (!open) return <div className="card p-8 flex flex-col items-center justify-center gap-4 text-center min-h-[320px] border-dashed"><div className="w-14 h-14 rounded-2xl bg-primary-light flex items-center justify-center"><Plus size={24} className="text-primary" /></div><div><p className="text-base font-bold text-foreground mb-1">Build a new automation</p><p className="text-sm text-muted-foreground">Click "New Automation" to set up keyword triggers and DM templates.</p></div></div>;

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border"><h2 className="text-base font-bold text-foreground">{initialData ? 'Edit Automation' : 'New Automation'}</h2><button className="btn-ghost p-1.5" onClick={onClose} aria-label="Close form"><X size={16} /></button></div>
      <form onSubmit={handleSubmit(onSubmit)} className="p-5 flex flex-col gap-5 overflow-y-auto max-h-[calc(100vh-200px)] scrollbar-hide" noValidate>
        <Input label="Automation name" placeholder="e.g. Reel - Free Guide" error={errors.name?.message} {...register('name', { required: 'Give your automation a name' })} />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-foreground">Instagram account</label>
          <select className="input-field" {...register('account', { required: 'Select an account' })}>
            <option value="">Select account...</option>
            {accounts.map((acc) => <option key={acc.id} value={acc.id}>{acc.label}</option>)}
          </select>
          {accounts.length === 0 && <p className="text-xs text-warning font-medium">No Instagram account connected. Use the Connect Instagram banner first.</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-foreground">Select reel by caption</label>
          <select className="input-field" onChange={(e) => onSelectReel(e.target.value)} disabled={!selectedAccountId || reelsLoading}>
            <option value="">{reelsLoading ? 'Loading reels...' : 'Select reel from captions...'}</option>
            {reels.map((r) => <option key={r.id} value={r.id}>{r.caption.slice(0, 80)}</option>)}
          </select>
          <p className="text-xs text-muted-foreground">Pick any reel caption and we auto-fill reel URL.</p>
        </div>

        <Input label="Reel or post URL" placeholder="https://www.instagram.com/reel/..." type="url" error={errors.reelUrl?.message} {...register('reelUrl', { required: 'Reel URL is required', pattern: { value: /instagram\.com\//, message: 'Enter a valid Instagram URL' } })} />
        <input type="hidden" {...register('reelId')} />
        <input type="hidden" {...register('reelCaption')} />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-foreground">Reply mode</label>
          <select className="input-field" {...register('replyMode')}>
            <option value="comment_and_dm">Reply on comment + send DM</option>
            <option value="dm_only">Only 1:1 DM reply</option>
          </select>
        </div>

        {selectedReplyMode === 'comment_and_dm' && (
          <div className="flex flex-col gap-1.5">
            <label htmlFor="comment-reply-template" className="text-sm font-semibold text-foreground">
              Comment reply template
            </label>
            <textarea
              id="comment-reply-template"
              rows={3}
              placeholder="Thanks for your comment! Check your DM."
              className={`input-field resize-none leading-relaxed ${errors.commentReplyTemplate ? 'input-error' : ''}`}
              {...register('commentReplyTemplate', {
                validate: (val) =>
                  selectedReplyMode !== 'comment_and_dm' ||
                  (val && val.trim().length >= 3) ||
                  'Comment reply is required for comment + DM mode',
              })}
            />
            {errors.commentReplyTemplate && (
              <p className="text-xs text-danger font-medium">{errors.commentReplyTemplate.message}</p>
            )}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-foreground">Keyword triggers</label>
          <p className="text-xs text-muted-foreground -mt-1">Auto-reply triggers when comment contains these words. Max 10.</p>
          <div className="flex items-center gap-2"><input type="text" value={keywordInput} onChange={(e) => setKeywordInput(e.target.value)} onKeyDown={handleKeywordKeyDown} placeholder="Type keyword + Enter" className="input-field flex-1 text-sm" maxLength={30} /><button type="button" onClick={addKeyword} className="btn-secondary px-3 py-2.5 shrink-0"><Plus size={16} /></button></div>
          {keywords.length > 0 && <div className="flex items-center gap-2 flex-wrap mt-1">{keywords.map((kw) => <span key={`form-kw-${kw}`} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary-light text-primary text-xs font-semibold rounded-xl"><Hash size={10} />{kw}<button type="button" onClick={() => removeKeyword(kw)} className="hover:text-danger transition-colors ml-0.5"><X size={11} /></button></span>)}</div>}
        </div>

        <div className="flex flex-col gap-1.5"><label htmlFor="reply-template" className="text-sm font-semibold text-foreground">DM reply template</label><textarea id="reply-template" rows={4} placeholder="Hey {{first_name}}! Thanks for commenting - here's the link you asked for..." className={`input-field resize-none leading-relaxed ${errors.replyTemplate ? 'input-error' : ''}`} {...register('replyTemplate', { required: 'Write a DM reply template', minLength: { value: 10, message: 'Template too short' }, maxLength: { value: 1000, message: 'Max 1,000 characters' } })} /></div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5"><label htmlFor="cooldown" className="text-sm font-semibold text-foreground">Cooldown (hours)</label><input id="cooldown" type="number" min={1} max={168} className={`input-field ${errors.cooldownHours ? 'input-error' : ''}`} {...register('cooldownHours', { required: true, min: { value: 1, message: 'Min 1 hour' }, max: { value: 168, message: 'Max 168 hours' } })} /></div>
          <div className="flex flex-col gap-1.5"><label htmlFor="delay" className="text-sm font-semibold text-foreground">Send delay (seconds)</label><input id="delay" type="number" min={0} max={300} className={`input-field ${errors.delaySeconds ? 'input-error' : ''}`} {...register('delaySeconds', { required: true, min: { value: 0, message: 'Min 0 sec' }, max: { value: 300, message: 'Max 300 sec' } })} /></div>
        </div>

        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl border border-border"><div className="flex items-start gap-2.5"><Info size={15} className="text-primary shrink-0 mt-0.5" /><div><p className="text-sm font-semibold text-foreground">Send DM automatically</p><p className="text-xs text-muted-foreground">When off, triggers are logged but DM is not sent</p></div></div><Toggle checked={sendDm} onChange={setSendDm} label="" /></div>

        <div className="flex items-center gap-3 pt-1"><Button type="submit" loading={isSubmitting} loadingLabel="Saving automation" fullWidth>{initialData ? 'Save Changes' : 'Create Automation'}</Button><Button type="button" variant="ghost" onClick={onClose} className="shrink-0">Cancel</Button></div>
      </form>
    </div>
  );
}
