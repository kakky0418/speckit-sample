import React from 'react';
import { describe, expect, test } from 'bun:test';
import { renderToString } from 'react-dom/server';
import type { Milestone } from '@/lib/types';
import { Milestone as MilestoneComponent } from '@/components/Milestone';

const sampleMilestones: Milestone[] = [
  { age: 40, yearFromNow: 5, assets: 1200000 },
  { age: 50, yearFromNow: 15, assets: 2000000 },
];

describe('Milestone', () => {
  test('マイルストーンがある場合、年齢と資産額が表示されること', () => {
    const html = renderToString(<MilestoneComponent milestones={sampleMilestones} />);

    expect(html).toContain('節目の年齢マイルストーン');
    expect(html).toMatch(/40.*歳/);
    expect(html).toMatch(/50.*歳/);
    expect(html).toContain('120');
    expect(html).toContain('200');
  });

  test('マイルストーンが空の場合は何も表示しないこと', () => {
    const html = renderToString(<MilestoneComponent milestones={[]} />);
    expect(html).toBe('');
  });
});
