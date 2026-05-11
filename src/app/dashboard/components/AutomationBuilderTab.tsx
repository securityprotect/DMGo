'use client';
import React, { useState } from 'react';
import AutomationForm from './AutomationForm';
import AutomationList from './AutomationList';

interface EditableAutomation {
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
}

export default function AutomationBuilderTab() {
  const [showForm, setShowForm] = useState(false);
  const [editingAutomation, setEditingAutomation] = useState<EditableAutomation | null>(null);

  const handleNew = () => {
    setEditingAutomation(null);
    setShowForm(true);
  };

  const handleEdit = (automation: EditableAutomation) => {
    setEditingAutomation(automation);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingAutomation(null);
  };

  return (
    <div className="grid xl:grid-cols-5 gap-6">
      <div className="xl:col-span-3">
        <AutomationList onNew={handleNew} onEdit={handleEdit} />
      </div>
      <div className="xl:col-span-2">
        <AutomationForm
          open={showForm}
          onClose={handleClose}
          initialData={editingAutomation}
        />
      </div>
    </div>
  );
}
