import { EmptyState } from '@/components/ui/empty-state';
import { Screen } from '@/components/ui/screen';

export default function DiaryScreen() {
  return (
    <Screen eyebrow="Little moments, lasting memories" title="Travel Diary" description="For the stories behind your favorite places.">
      <EmptyState icon="diary" title="Every journey has a story" description="The best meal. The unexpected detour. The view that made you stop. Keep those moments close." note="Photo memories and journal entries are coming soon." />
    </Screen>
  );
}
