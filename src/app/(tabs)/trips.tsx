import { EmptyState } from '@/components/ui/empty-state';
import { Screen } from '@/components/ui/screen';

export default function TripsScreen() {
  return (
    <Screen eyebrow="Your next chapter" title="My Trips" description="A little planning. A lot to look forward to.">
      <EmptyState icon="trips" title="A new adventure starts here" description="Keep your destinations, dates, and plans together, from the first idea to the journey home." note="Trip planning is coming soon." />
    </Screen>
  );
}
