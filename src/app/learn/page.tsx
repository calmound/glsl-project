import React from 'react';
import { Metadata } from 'next';
import { LearnPageContent } from '@/app/learn/learn-page-content';
import { buildLearnMetadata } from '@/lib/page-metadata';
import { getTutorials } from '@/lib/tutorials-server';

// English Learn page at /learn (default locale, no redirect)
export async function generateMetadata(): Promise<Metadata> {
  return buildLearnMetadata('en');
}

export default async function LearnPage() {
  const tutorials = await getTutorials('en');
  return <LearnPageContent locale="en" tutorials={tutorials} />;
}
